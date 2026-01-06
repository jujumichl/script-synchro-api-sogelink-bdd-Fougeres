### 1. **GeoServer**



**GeoServer** est un serveur de données géospatiales open-source qui permet de partager, de traiter et de servir des données géospatiales via des protocoles standardisés comme **WMS** (Web Map Service), **WFS** (Web Feature Service), **WCS** (Web Coverage Service), et **WPS** (Web Processing Service).



#### Rôle de **GeoServer** :



* **Publier les données géospatiales** : GeoServer permet de publier des données géospatiales stockées dans une base de données PostgreSQL/PostGIS, un fichier shapefile, ou d'autres formats géospatiaux.

* **Exposer les données via des services web** : Il expose les données sous forme de services **WMS** (pour des cartes raster), **WFS** (pour des objets géométriques vectoriels), ou **WCS**. Les utilisateurs ou applications peuvent alors interroger ces services pour obtenir des informations géospatiales ou des images de carte.



#### Exemple de fonctionnement avec PostgreSQL/PostGIS :



* GeoServer peut être configuré pour se connecter à une base de données **PostgreSQL avec PostGIS** pour exposer les données géospatiales en tant que services **WFS** ou **WMS**. Si tu as des informations sur les chantiers (par exemple, localisation, description, dates), tu peux stocker ces données dans ta base PostGIS, puis les publier via GeoServer.



### 2. **MapStore**



**MapStore** est une plateforme SIG open-source qui permet de créer des applications de cartographie interactive. Elle permet de visualiser, interagir et analyser des données géospatiales dans une interface web.



#### Rôle de **MapStore** :



* **Visualisation des données géospatiales** : MapStore permet de visualiser les données géospatiales exposées par GeoServer, telles que des cartes de réseaux ou des informations sur les chantiers, directement dans une interface web.

* **Intégration de services web (WMS/WFS)** : MapStore peut se connecter à des services WMS ou WFS pour récupérer et afficher des données géospatiales. Par exemple, tu peux configurer MapStore pour consommer les services **WFS** fournis par GeoServer, et afficher les chantiers et leurs détails sur une carte interactive.

* **Interaction avec la carte** : Les utilisateurs peuvent interagir avec la carte (zoomer, cliquer sur des éléments), et MapStore peut afficher des **pop-ups** ou des **infobulles** avec des informations détaillées provenant de la base de données.



### 3. **Sogelink**



**Sogelink** est une plateforme utilisée principalement pour la gestion des réseaux d'infrastructures (eau, électricité, assainissement, etc.). Elle permet de centraliser, de gérer et d'analyser les informations relatives à ces infrastructures.



#### Rôle de **Sogelink** :



* **Gestion des données d'infrastructure** : Sogelink est utilisé pour gérer les réseaux d’infrastructures et peut offrir des fonctionnalités telles que la planification de l'entretien des réseaux, la gestion des chantiers et des interventions, et la documentation des travaux réalisés.

* **API Sogelink** : L'API de Sogelink permet de récupérer, envoyer ou mettre à jour des données d'infrastructure, telles que des informations sur les chantiers et les réseaux.



#### Comment Sogelink se connecte aux autres outils :



* **Sogelink et PostgreSQL** : Les informations sur les chantiers, les interventions ou les réseaux peuvent être stockées dans une base de données PostgreSQL/PostGIS. L'API Sogelink peut interagir avec cette base pour récupérer ou envoyer des informations.

* **Sogelink et GeoServer** : Les données d'infrastructure et les chantiers peuvent être exposées via un service **WFS** ou **WMS** par **GeoServer**, et ainsi être intégrées dans MapStore.



### 4. **PostgreSQL/PostGIS**



**PostgreSQL** est un système de gestion de base de données relationnelle, et **PostGIS** est une extension qui permet de gérer des données géospatiales dans PostgreSQL. C'est une solution puissante pour stocker, interroger et analyser des données géographiques.



#### Rôle de **PostgreSQL/PostGIS** :



* **Stocker les données géospatiales** : Les données géospatiales relatives aux chantiers, aux réseaux ou à d'autres éléments peuvent être stockées dans une base de données PostgreSQL avec l'extension PostGIS. Ces données peuvent inclure des informations sur la position géographique (points, lignes, polygones) ainsi que des attributs (par exemple, description, dates, statut des travaux).

* **Interroger les données géospatiales** : PostGIS permet d'effectuer des requêtes géospatiales complexes, comme la recherche de chantiers à proximité, l'analyse des réseaux, ou la gestion des données topologiques.



### Comment ces outils travaillent ensemble :



1. **Stockage des données géospatiales dans PostgreSQL/PostGIS** :



    * Toutes les données sur les chantiers, les réseaux, et d'autres informations géospatiales sont stockées dans une base de données PostgreSQL avec **PostGIS**. Cela permet de gérer facilement les informations géographiques et non géographiques, et de faire des requêtes géospatiales complexes.



2. **Publication des données avec GeoServer** :



     * **GeoServer** est utilisé pour publier les données géospatiales contenues dans la base PostgreSQL/PostGIS via des services standardisés comme **WMS** (pour les cartes raster) ou **WFS** (pour les objets géospatiaux vectoriels). Cela permet de rendre ces données accessibles à d'autres applications (comme MapStore) via des appels HTTP.



3. **Visualisation des données dans MapStore** :



      * **MapStore** consomme les services **WMS** ou **WFS** exposés par **GeoServer**. Par exemple, MapStore peut afficher sur une carte les données des chantiers récupérées via **WFS**, et permettre aux utilisateurs d'interagir avec la carte (zoomer, clics, filtrage, etc.).

      * Les **pop-ups** ou **infobulles** dans MapStore peuvent afficher des informations supplémentaires sur les chantiers, telles que la description, les dates de début et de fin, et d'autres attributs stockés dans la base PostgreSQL.



4. **Sogelink pour la gestion des réseaux et des chantiers** :



      * **Sogelink** permet de gérer des réseaux d'infrastructure et des chantiers. Il peut interagir avec la base PostgreSQL pour mettre à jour les informations sur les chantiers, par exemple en enregistrant de nouvelles interventions ou en modifiant le statut d'un chantier.

      * L'API Sogelink peut être utilisée pour envoyer ou récupérer des données de la base PostgreSQL, qui peuvent ensuite être publiées par **GeoServer** via des services WFS.



### Exemple de flux de travail :



1. **Sogelink** enregistre un nouveau chantier dans la base PostgreSQL/PostGIS avec des informations géographiques (coordonnées du chantier, dates, etc.).

2. **GeoServer** expose ce chantier via un service WFS.

3. **MapStore** consomme ce service WFS et affiche le chantier sur une carte interactive. L'utilisateur peut cliquer sur un chantier pour voir des informations supplémentaires dans un **popup** (par exemple, description, dates, etc.).

4. Si des modifications doivent être apportées (par exemple, modifier l'état du chantier), elles peuvent être effectuées dans **Sogelink**, qui mettra à jour la base PostgreSQL, et ces modifications seront ensuite visibles dans MapStore via GeoServer.



### Récapitulatif des rôles :



* **GeoServer** : Publie les données géospatiales stockées dans PostgreSQL/PostGIS via des services WMS/WFS.

* **MapStore** : Affiche les données géospatiales en consommant les services WMS/WFS de GeoServer et permet l'interaction avec la carte.

* **Sogelink** : Gère les données liées aux réseaux d'infrastructure et aux chantiers, et peut interagir avec PostgreSQL pour mettre à jour ou récupérer des données.

* **PostgreSQL/PostGIS** : Stocke les données géospatiales et non géospatiales et permet de réaliser des analyses géospatiales.



Ce flux de travail permet de centraliser, gérer et afficher des données géospatiales dans une application web interactive tout en permettant des mises à jour et des analyses efficaces.