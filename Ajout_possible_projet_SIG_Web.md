# Ajout possible projet SIG Web

## Fonctionnalité possible à ajouter
- niveau de perturbation avec des changement de couleurs lisible en légende ou une fois cliquer dessus (ex: rouge = impact fort, orange = impact moyen et vert = impact faible), un impact fort peut être l'arret de la circulation dans cette zone, un impact moyen peut être une alternation de circulation et un impact faible peut être des travaux de nuit.

- possibilité d'impression (avec légende, ce qui implique de changer au moins la couleur en fonction du niveau de perturbation)

- possibilité d'avoir un menu sur le côter droit ou gauche dépliant qui te donne la liste de tous les travaux en cours/programmé ([voir ici](https://logeo.lorient.bzh/portal/apps/dashboards/aead16715534418c883a7d5d2c90306))

```html 
<div style="width:350px; border-left:1px solid #ccc;">
A check 
</div>
```
- [ ] possibilité de télécharger l'arrêté en pdf (attention a bien renommer l'arrêter)

- filtre sur la liste des travaux en cours/programmé (ex: sur une date ou une période, sur un niveau de perturbation...)

## Fonctionnalité présente
- n° de chantier
- n° de construction
- type de dossier
- l'adresse 
- dates (debut-fin)
- description (Raison des travaux)
- le déclarant



# Documentation du fonctionnement du projet
## Structure du projet 

```
API Sogelink (source officielle des travaux)
        ↓
PostgreSQL + PostGIS (cache métier)
        ↓
GeoServer (WMS / WFS)
        ↓
MapStore (carte + panneaux + filtres)
```

## API Sogelink (source officielle des travaux)
__Rôle__ : 

- Contient tous les travaux à jour

- Données saisies par :

  - concessionnaires

  - entreprises

  - services techniques

- Fait autorité juridiquement

__Pourquoi ne pas l’utiliser directement sur la carte ?__

- Trop lent pour de l’affichage carto  
- Pas conçu pour du WMS/WFS  
- Pas de styles cartographiques  
- Dépendance au réseau / SLA externe  

## PostgreSQL + PostGIS (cache métier)
__Rôle__ : 

- Stocker localement une copie des travaux

- Servir de base SIG de référence pour la ville

- Garantir performances + fiabilité

Pour garder les données a jours dans la base de données on fera tourner une script javascript 2 fois par jours (00h et 12h).

## GeoServer (moteur cartographique)

__Rôle__ : 
- Transformer les données PostGIS en services SIG standards
- Faire le lien entre la base et les clients carto


| Service | Utilité                  |
| ------- | ------------------------ |
| WMS     | Affichage cartographique |
| WFS     | Requêtes attributaires   |
| (WCS)   | si besoin raster         |


__Styles cartographiques__ :  

Dans GeoServer tu définis :
- Couleurs par statut

- Symboles par type de travaux
- Règles conditionnelles

## MapStore (Interface utilisateur)
__Rôle__ : 

- Afficher la carte
- Permettre l’exploration des travaux
- Offrir une interface lisible aux agents / citoyens


# Début du projet 
## API Sogelink
Identifiant : api@litteralis-fougeres.fr  
Mot de passe : l10j,jdavDaub
### Étude de l'API Sogelink
Il n'y a aucune documentation officiel de l'API Sogelink, il faut contacter le support afin d'obtenir des inforamation sur l'API, voici le mail du support : support@sogelink.nl  
Liens de l'API sans requête : https://apps.sogelink.fr/maplink/public/wfs

Liens de l'API Sogelink avec toutes les informations concernant les chantiers de fougeres : https://apps.sogelink.fr/maplink/public/wfs?service=WFS&version=2.0.0&request=GetCapabilities

### Script de synchronisation avec l'API
Le script de synchronisation avec l'API sera effectuer 2 fois par jours, une fois a 00h et une fois a 12h.
Il effectueras tout d'abord une requêtes get a l'api et récupèreras un résultat en json, il feras ensuite une comparaison avec ce qui est déjà présent dans la base de données afin de comparer les données et de voir s'il y a des ajouts ou des modifications, si c'est le cas il mettras a jour la base de données.

Le script est disponible ici : [syncAPI-DATABASE.js](./syncAPI-DATABASE.js)