# Pour modifier le projet carto
Aller sur la machine en distance, **IP : 10.0.0.72**

Pour modifier les templates qui s'affichent quand on clique sur une zone de travail il faut aller dans les couches, puis dans réglage de la couche (clé a molette).
aller dans le menu tout a droite, puis dans Template vous verrez un aperçus du modèle.

BDD disponible sur le serveur OPENWEB-23 (10.0.0.72):
- FOUGERES
    - aep_canalisation
- SIG_WEB
- SIG_WEB_Comptages_Routiers
- SIG_WEB_Espaces_verts
- SIG_WEB_Grand_Public
- SIG_WEB_Reseaux_Eaux
- postgis_31_sample
- postgres
- template0 
- template1 




**POSTGRES :**

Nom du logiciel qui permet de traité les données : `SQL Shell`

Pour se connecter sur SQL Shell :  
![image de la connexion au SQL Shell](images/SQLShell.png)  
*Ajouter le mot de passe*

*Pour changer de BDD :*  
\c <nom_de_la_bdd>

*Pour lister les bases de données :*  
\l

*Pour lister les tables d'une BDD:*  
\dt

*Pour afficher le nom des colonnes d'une table :*  
\d

*Pour quitter SQL Shell :*  
\q

# Explication de la structure du fichier mapstore
Le dossier mapstore est une application web déployée dans Tomcat, probablement MapStore (SIG web). Voici la structure principale :

**Fichiers HTML racine :**  
 pages d’entrée, templates, et pages embarquées (ex : `index.html`, `embedded.html`, `dashboard-embedded.html`).
Fichiers de base de données : `geostore.h2.db`, `geostore.lock.db` (base H2 pour stockage local).  
**Dossiers principaux :**
- `api/` : tests et API de l’application.
- `components/` : composants UI (cartes, catalogues, contrôles, etc.).
- `configs/` : fichiers de configuration JSON pour l’application et ses plugins.
- docs : documentation, CSS, JS, polices.
- `META-INF/` : métadonnées du déploiement (MANIFEST, maven).
- `observables/` : gestion des observables (réponses de test).
- `plugins/` : plugins MapStore (ex : StreetView, toolbar).
- `printing/` : ressources pour l’impression (images, config YAML).
- `product/` : assets spécifiques au produit.
- `test-resources/ `: ressources de test (images, données, widgets).
- `themes/` : thèmes graphiques (dark, default).
- `translations/` : traductions en plusieurs langues (JSON).
- `utils/ `: utilitaires (ex : polices).
- `WEB-INF/` : configuration Java/Tomcat (servlets, classes, libs).
