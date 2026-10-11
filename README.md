# Gabon Mode

Premiere version de l'application web Gabon Mode pour la boutique du PK12 a Libreville.

## Fonctionnalites incluses

- Vitrine premium mobile-first avec logo GM, position PK12 et contact boutique.
- Catalogue interactif avec filtres par categorie, taille, disponibilite et prix.
- Fiche produit avec action principale de reservation.
- Panier de reservation, facture pro-forma imprimable en PDF et code de reservation.
- Message WhatsApp pre-rempli pour le gerant.
- Espace administration de demonstration pour ajout de produit, suivi des reservations et validation par code.
- Squelette back-end PHP/MySQL avec routes produits, reservations et scan.

## Lancer le front-end

```bash
npm install
npm run dev
```

Dans cet environnement, l'installation npm a ete bloquee par les permissions du cache local. Le code React est pret, mais les dependances doivent etre installees dans un terminal normal ou avec un cache npm accessible.

## Back-end PHP

1. Copier `backend/.env.example` vers `backend/.env`.
2. Modifier `ADMIN_TOKEN` et les acces MySQL.
3. Importer `backend/database/schema.sql` dans MySQL.
4. Servir `backend/api/index.php` avec Apache, Nginx ou le serveur PHP integre.

Exemple local :

```bash
php -S localhost:8080 -t backend/api
```

## Prochaines integrations

- Remplacer les images temporaires par la seance photo reelle des articles.
- Brancher le front-end sur les routes PHP au lieu des donnees de demonstration.
- Ajouter une bibliotheque QR code scannable et un scanner camera HTML5 en production.
- Securiser l'administration avec authentification complete avant mise en ligne.
