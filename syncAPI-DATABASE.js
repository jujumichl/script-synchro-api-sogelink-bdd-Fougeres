require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { Pool } = require('pg');
const fetch = require('node-fetch');
const Joi = require('joi');
const winston = require('winston');

// Configuration du logger avec Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'erreurs_log.json' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// Fonction pour calculer l'impact automatiquement
function calculateImpact(properties) {
  const { datedebut, datefin } = properties;
  if (!datefin) {
    // Si pas de date de fin, chantier en cours, impact élevé
    return 3;
  }
  if (!datedebut) {
    // Si pas de date de début, considérer comme peu impactant
    return 1;
  }
  const start = new Date(datedebut);
  const end = new Date(datefin);
  const durationDays = (end - start) / (1000 * 60 * 60 * 24);
  if (durationDays < 30) {
    return 1; // Peu impactant
  } else if (durationDays <= 90) {
    return 2; // Moyennement impactant
  } else {
    return 3; // Très impactant
  }
}

// Schéma de validation pour les propriétés du chantier
const chantierSchema = Joi.object({
  idchantier: Joi.number().integer().required(),
  descriptionChantier: Joi.string().max(500).allow(null),
  typemodelelibelle: Joi.string().max(100).allow(null),
  adresse: Joi.string().max(500).allow(null),
  codepostal: Joi.string().max(10).allow(null),
  commune: Joi.string().max(100).allow(null),
  datedebut: Joi.string().isoDate().allow(null), // Format ISO string
  datefin: Joi.string().isoDate().allow(null),
  description: Joi.string().max(1000).allow(null),
  geometry: Joi.object().required()
}).unknown(true); // Permettre les champs supplémentaires comme srctype

// Configuration du pool de connexions PostgreSQL avec SSL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'chantiers_fougeres',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // Ajuster selon vos besoins
  max: 10, // Limite du pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Fonction principale pour récupérer les données de l'API Sogelink et insérer dans PostgreSQL
async function fetchDataAndInsert() {
  let client;
  try {
    // Obtenir une connexion du pool
    client = await pool.connect();
    logger.info('Connexion réussie à PostgreSQL');

    // URL de requête à l'API Sogelink
    const apiUrl = 'https://apps.sogelink.fr/maplink/public/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=chantier:chantierCollectivite&outputFormat=application/json';

    // Connexion à l'API Sogelink avec l'authentification
    const username = process.env.API_USERNAME;
    const password = process.env.API_PASSWORD;
    if (!username || !password) {
      throw new Error('Variables d\'environnement API_USERNAME et API_PASSWORD requises.');
    }
    const headers = {
      'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
    };

    // Récupérer les données de l'API Sogelink avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout
    const response = await fetch(apiUrl, { headers, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des données de l'API Sogelink: ${response.statusText}`);
    }
    const data = await response.json();
    logger.info('Données récupérées de l\'API');

    // Pour chaque chantier, valider et insérer les données
    const validFeatures = [];
    for (const feature of data.features) {
      const { properties, geometry } = feature;
      const chantierData = { ...properties, geometry };

      // Validation des données
      const { error } = chantierSchema.validate(chantierData);
      if (error) {
        logger.warn(`Données invalides pour le chantier ${properties.idchantier}: ${error.details[0].message}`);
        continue; // Passer au suivant
      }

      validFeatures.push(feature); // Ajouter à la liste des valides

      // Mapping des propriétés pour l'insertion
      const id_chantier = properties.idchantier;
      const nom_chantier = properties.descriptionChantier || properties.description;
      const type_dossier = properties.typemodelelibelle;
      let adresse = `${properties.adresse || ''} ${properties.codepostal || ''} ${properties.commune || ''}`.trim();
      if (!adresse) {
        // Si pas d'adresse, utiliser les coordonnées comme fallback (ex. : "Coordonnées: lon, lat")
        const coords = geometry.coordinates[0][0][0]; // Premier point du MultiPolygon
        adresse = `Coordonnées: ${coords[0]}, ${coords[1]}`;
      }
      const date_debut = properties.datedebut;
      const date_fin = properties.datefin;
      const impact = calculateImpact(properties); // Calcul automatique de l'impact

      const query = `
        INSERT INTO chantiers (id_chantier, nom_chantier, type_dossier, adresse, date_debut, date_fin, impact, geom)
        VALUES ($1, $2, $3, $4, $5, $6, $7, ST_GeomFromGeoJSON($8)) 
        ON CONFLICT (id_chantier)
        DO UPDATE SET
          nom_chantier = EXCLUDED.nom_chantier,
          type_dossier = EXCLUDED.type_dossier,
          adresse = EXCLUDED.adresse,
          date_debut = EXCLUDED.date_debut,
          date_fin = EXCLUDED.date_fin,
          impact = EXCLUDED.impact,
          geom = EXCLUDED.geom;
        `;

      try {
        // Exécuter la requête d'insertion
        await client.query(query, [
          id_chantier, 
          nom_chantier, 
          type_dossier, 
          adresse, 
          date_debut, 
          date_fin, 
          impact, 
          JSON.stringify(geometry),
        ]);
        logger.info(`Données insérées avec succès pour le chantier ${id_chantier}`);
      } catch (insertError) {
        logger.error(`Erreur lors de l'insertion des données du chantier ${id_chantier}: ${insertError.message}`);
      }
    }

  } catch (error) {
    logger.error(`Erreur générale: ${error.message}`);
  } finally {
    if (client) {
      client.release(); // Libérer la connexion
    }
    logger.info('Connexion à PostgreSQL fermée');
  }
}

// Appel de la fonction principale
fetchDataAndInsert().catch(err => {
  logger.error(`Erreur dans le processus principal: ${err.message}`);
}).finally(() => {
  pool.end(); // Fermer le pool à la fin
});
