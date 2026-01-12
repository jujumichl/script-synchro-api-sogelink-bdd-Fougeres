CREATE TABLE chantiers (
    id serial primary key,
    description varchar(255),
    type_dossier varchar(100),
    adresse varchar(500),
    date_debut date,
    date_fin date,
    impact smallint check (impact >=1 and impact <=3),
    geom geometry(multipolygon, 4326),
    emetteursociete varchar(255)
);
