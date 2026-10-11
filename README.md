# Gabon Mode — Boutique PK12 Libreville

Plateforme web de la boutique **Gabon Mode** (PK12, Libreville) : vitrine catalogue, réservation en ligne avec facture et QR code, paiement mobile, panel administrateur complet et API PHP/MySQL.

Démo en ligne : https://gabon-mode.vercel.app

## Stack

- **Frontend** : React 19 + Vite + React Router (`src/`)
- **Backend** : PHP 8 (vanilla, PDO) + MySQL (`backend/`)
- **Auth API** : JWT (HS256, 24 h)
- **Admin panel** : HTML/JS standalone + Chart.js (`backend/admin/index.html`)
- **QR factures** : API Google Charts (aucune dépendance PHP)
- **Paiement** : Airtel Money Push USSD (simulé, en attente du compte Airtel Business)

## Structure

```
gabon-mode/
├── src/                    # App React (pages, composants, contexte, CSS mobile-first)
├── public/images/          # Logo GM + visuels
├── backend/
│   ├── api/                # Router index.php + endpoints (auth, products, orders, payments, stats, notify, invoice)
│   ├── config/             # database.php, cors.php, auth.php (JWT)
│   ├── admin/index.html    # Panel admin complet (stats, CRUD, commandes, livraisons)
│   ├── database/schema.sql # Schéma MySQL + données de démo
│   └── vendor/             # Générateur QR (sans dépendance)
├── .env.example            # Variables frontend
└── backend/.env.example    # Variables backend
```

## Lancer le frontend

```bash
npm install
npm run dev
```

Copier `.env.example` vers `.env` puis renseigner :

```
VITE_API_URL=http://localhost/gabon-mode   # vide = mode localStorage sans backend
VITE_ADMIN_USERNAME=gerant
VITE_ADMIN_PASSWORD=GM-PK12
```

Build production : `npm run build` (dossier `dist/`, déployé sur Vercel).

## Lancer le backend (XAMPP local)

1. Copier `backend/` vers `C:\xampp\htdocs\gabon-mode`.
2. Démarrer Apache (port 80) + MySQL (port 3306).
3. Créer la base `gabon_mode` et importer `backend/database/schema.sql` (8 produits, 5 catégories, compte admin).
4. Copier `backend/.env.example` vers `backend/.env` et renseigner `ADMIN_TOKEN` + accès MySQL.
5. API : `http://localhost/gabon-mode/api/products` — Admin : `http://localhost/gabon-mode/admin/index.html`.

## Accès admin

| Espace | URL | Identifiants |
|---|---|---|
| Espace gestionnaire (React) | `/admin` (bouton en footer) | `gerant` / `GM-PK12` (via `.env`) |
| Panel admin complet (PHP) | `/gabon-mode/admin/index.html` | `admin` / `admin123` |

Le panel PHP inclut : dashboard (CA jour/mois, top produits, commandes récentes), CRUD produits avec recherche, commandes (filtre statut, changement statut, lien WhatsApp), rapports (graphique ventes mensuelles), suivi livraisons.

## Endpoints API

Publics : `POST /api/auth/login`, `GET /api/categories`, `GET /api/products` (filtres : featured, category, id), `POST /api/orders/create`, `GET /api/orders/track`, `POST /api/payments/airtel/init`, `POST /api/payments/airtel/callback`, `GET /api/invoice/generate`.

Protégés (header `Authorization: Bearer <JWT>`) : `GET /api/admin/products`, `POST /api/admin/products/create|update|delete`, `GET /api/admin/orders`, `POST /api/admin/orders/update`, `GET /api/admin/stats/dashboard`, `GET /api/admin/stats/sales`, `POST /api/admin/deliveries/update`, `POST /api/admin/notify/whatsapp`.

## Fonctionnalités (budget 850 000 FCFA)

- [x] Catalogue + filtres + recherche + fiche produit + panier
- [x] Réservation en ligne (nom + téléphone + WhatsApp, sans compte client)
- [x] Facture pro-forma PDF imprimable avec QR code unique
- [x] Suivi commande (En préparation / Prête pour retrait / En livraison)
- [x] Panel admin : CRUD stocks, dashboard, rapports financiers, stats
- [x] Notifications WhatsApp (message auto par statut)
- [x] Mobile-first (téléphone → tablette 641px → desktop 1025px)
- [x] Airtel Money côté API (simulation Push USSD + callback)
- [ ] Bouton "Payer par Airtel Money" côté frontend (à brancher)
- [ ] Stats avancées affichées dans le panel (top produits, clients uniques — endpoints prêts)
- [ ] Nom de domaine + SSL + hébergement production (1re année incluse)
- [ ] Formation équipe sur place au PK12

## Notes

- Sans `VITE_API_URL`, le frontend fonctionne en mode autonome (localStorage).
- Les identifiants ci-dessus sont ceux de démo : les changer avant la mise en production.
- `npm run dev` puis `Ctrl+F5` (hard refresh) après chaque modification pour éviter le cache Vite.
