# Sync API to Database

Ce script synchronise les données de l'API Sogelink vers une base de données PostgreSQL de manière sécurisée.

## Installation

1. Cloner le projet.
2. Copier `.env.example` vers `.env` et remplir les valeurs réelles.
3. Exécuter `npm install`.

## Configuration

- Créer un fichier `.env` basé sur `.env.example`.
- Assurer que PostgreSQL est configuré avec SSL si nécessaire (ajouter `DB_SSL=true` dans .env).

## Sécurité

- Les secrets sont stockés dans des variables d'environnement.
- Validation des données avec Joi.
- Logging sécurisé avec Winston (JSON format).
- Connexion DB avec pool et SSL optionnel.
- Timeout sur les appels API.

## Utilisation

`npm start`

## Audit de Sécurité

Le code a été audité et corrigé pour :
- Éviter l'exposition des secrets.
- Valider les entrées.
- Sécuriser les logs.
- Utiliser des dépendances à jour.
- Protéger contre les abus API.

Pour plus de détails, voir les commentaires dans le code.