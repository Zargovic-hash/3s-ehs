# Bureau d'Études Environnemental - Plateforme Web

## 📋 Description

Plateforme web complète pour un bureau d'études environnemental en Algérie. Le système comprend:

- **Site vitrine** avec présentation de l'expertise réglementaire algérienne (Loi 03-10)
- **Blog de veille réglementaire** pour publier décrets, normes et actualités
- **Espace client sécurisé** avec gestion de documents
- **Dashboard administrateur** pour upload et gestion des rapports

## 🏗️ Architecture Technique

### Backend
- **Framework**: Node.js avec Express
- **Base de données**: PostgreSQL
- **Authentification**: JWT (JSON Web Tokens)
- **Sécurité**: Bcrypt pour le hachage des mots de passe
- **Upload**: Multer pour la gestion des fichiers

### Frontend
- **Framework**: React 18+
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icônes**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 📦 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <repository-url>
cd environmental-platform
```

### 2. Configuration de la base de données

#### Créer la base de données PostgreSQL
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Exécuter le script SQL
\i server/database/schema.sql
```

### 3. Configuration du Backend

```bash
cd server

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Éditer .env avec vos configurations
nano .env
```

**Configuration .env exemple:**
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=environmental_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi
JWT_EXPIRES_IN=7d

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

#### Initialiser les données de démonstration
```bash
npm run init-db
```

### 4. Configuration du Frontend

```bash
cd ../client

# Installer les dépendances
npm install
```

## 🚀 Démarrage

### Démarrer le Backend
```bash
cd server
npm start
# ou en mode développement
npm run dev
```
Le serveur démarre sur http://localhost:5000

### Démarrer le Frontend
```bash
cd client
npm run dev
```
L'application démarre sur http://localhost:3000

## 👤 Accès par défaut

Après l'initialisation de la base de données:

**Compte Administrateur:**
- Email: `admin@bureau-etudes.dz`
- Mot de passe: `Admin123!`

⚠️ **IMPORTANT**: Changez ce mot de passe en production!

## 📁 Structure du Projet

```
environmental-platform/
├── server/                      # Backend Node.js
│   ├── config/                  # Configuration DB
│   ├── controllers/             # Contrôleurs
│   ├── middleware/              # Middleware (auth, upload)
│   ├── routes/                  # Routes API
│   ├── database/                # Scripts SQL
│   ├── scripts/                 # Scripts utilitaires
│   └── server.js                # Point d'entrée
│
├── client/                      # Frontend React
│   ├── public/                  # Assets publics
│   ├── src/
│   │   ├── components/          # Composants réutilisables
│   │   ├── contexts/            # Context API (Auth)
│   │   ├── pages/               # Pages de l'application
│   │   ├── services/            # Services API
│   │   ├── App.jsx              # Composant principal
│   │   └── main.jsx             # Point d'entrée
│   └── index.html
│
└── README.md
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription (Admin)
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mise à jour profil
- `PUT /api/auth/change-password` - Changement de mot de passe

### Documents
- `GET /api/documents` - Liste des documents
- `POST /api/documents/upload` - Upload document (Admin)
- `GET /api/documents/download/:id` - Télécharger un document
- `DELETE /api/documents/:id` - Supprimer un document (Admin)
- `GET /api/documents/stats` - Statistiques (Admin)

### Articles (Veille Réglementaire)
- `GET /api/articles` - Liste des articles
- `GET /api/articles/:id` - Détails d'un article
- `POST /api/articles` - Créer un article (Admin)
- `PUT /api/articles/:id` - Modifier un article (Admin)
- `DELETE /api/articles/:id` - Supprimer un article (Admin)
- `GET /api/articles/categories` - Liste des catégories
- `GET /api/articles/tags` - Liste des tags

### Contact
- `POST /api/contact` - Envoyer un message (Public)
- `GET /api/contact` - Liste des demandes (Admin)
- `PUT /api/contact/:id/status` - Changer le statut (Admin)

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs (Admin)
- `GET /api/users/:id` - Détails utilisateur (Admin)
- `PUT /api/users/:id` - Modifier utilisateur (Admin)
- `DELETE /api/users/:id` - Supprimer utilisateur (Admin)

## 🔐 Sécurité

- Authentification JWT avec expiration
- Mots de passe hashés avec bcrypt (10 rounds)
- Middleware de vérification des rôles (admin/client)
- Validation des inputs
- Protection CORS
- Upload de fichiers sécurisé avec filtrage des types

## 📝 Fonctionnalités

### Site Public
- ✅ Page d'accueil avec expertise réglementaire algérienne
- ✅ Référence à la Loi 03-10 et décrets associés
- ✅ Présentation des services (EIE, Audit ICPE, PANDRU)
- ✅ Formulaire de contact
- ✅ Blog de veille réglementaire avec filtres

### Espace Client
- ✅ Connexion sécurisée
- ✅ Consultation des documents
- ✅ Téléchargement de rapports PDF/DWG
- ✅ Historique des audits

### Dashboard Admin
- ✅ Upload de documents avec drag & drop
- ✅ Gestion des clients
- ✅ Attribution de documents aux clients
- ✅ Gestion du blog (création/édition d'articles)
- ✅ Consultation des demandes de contact
- ✅ Statistiques

## 🎨 Design

- Design "Corporate-Green" avec palette emerald (Tailwind)
- Interface responsive (mobile-first)
- Composants réutilisables
- Transitions fluides
- Icônes Lucide React

## 📚 Conformité Réglementaire

Le projet met en avant:
- **Loi n° 03-10** relative à la protection de l'environnement
- **Décret exécutif n° 07-145** sur les EIE
- **Décret n° 06-198** sur les ICPE
- Nomenclature des installations classées
- Normes de rejets et déchets

## 🛠️ Scripts Disponibles

### Backend
```bash
npm start          # Démarrer le serveur
npm run dev        # Mode développement avec nodemon
npm run init-db    # Initialiser la base de données
```

### Frontend
```bash
npm run dev        # Serveur de développement
npm run build      # Build de production
npm run preview    # Prévisualiser le build
```

## 📄 License

Propriétaire - Bureau d'Études Environnemental

## 👥 Contact

Pour toute question technique, contactez l'équipe de développement.

---

**Développé avec ❤️ pour la protection de l'environnement en Algérie** 🇩🇿
