# 🏛️ Architecture de la Plateforme

## Vue d'Ensemble

La plateforme est construite selon une architecture **Client-Server** avec séparation claire des responsabilités.

```
┌─────────────────────────────────────────────────────────┐
│                    NAVIGATEUR CLIENT                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │           React Application (Port 3000)           │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────┐  │  │
│  │  │   Pages     │  │  Components  │  │ Services│  │  │
│  │  │ - Home      │  │  - Header    │  │ - API   │  │  │
│  │  │ - Blog      │  │  - Footer    │  │ - Auth  │  │  │
│  │  │ - Login     │  │  - Protected │  │         │  │  │
│  │  │ - Dashboard │  │    Route     │  │         │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│              EXPRESS SERVER (Port 5000)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   API Routes                       │  │
│  │  /api/auth  /api/documents  /api/articles         │  │
│  │  /api/users  /api/contact                         │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Middleware                        │  │
│  │  - JWT Authentication                             │  │
│  │  - File Upload (Multer)                           │  │
│  │  - Role Verification                              │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                 Controllers                        │  │
│  │  AuthController  DocumentController               │  │
│  │  ArticleController  ContactController             │  │
│  │  UserController                                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕ SQL
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL DATABASE                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Tables:                                          │  │
│  │  - users (auth, profiles)                         │  │
│  │  - documents (files metadata)                     │  │
│  │  - articles (blog posts)                          │  │
│  │  - contact_leads (inquiries)                      │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 🗄️ Modèle de Données

### Table: users
```sql
id          : UUID (PK)
nom         : VARCHAR(255)
email       : VARCHAR(255) UNIQUE
password    : VARCHAR(255) -- Bcrypt hashed
role        : VARCHAR(50)  -- 'admin' | 'client'
entreprise  : VARCHAR(255)
telephone   : VARCHAR(20)
created_at  : TIMESTAMP
updated_at  : TIMESTAMP
```

### Table: documents
```sql
id              : UUID (PK)
titre           : VARCHAR(500)
description     : TEXT
url_fichier     : VARCHAR(1000) -- Path to file
nom_fichier     : VARCHAR(500)  -- Original filename
taille_fichier  : INTEGER
type_fichier    : VARCHAR(100)
date_upload     : TIMESTAMP
client_id       : UUID (FK → users.id)
uploaded_by     : UUID (FK → users.id)
categorie       : VARCHAR(100)
statut          : VARCHAR(50)   -- 'actif' | 'supprimé'
```

### Table: articles
```sql
id              : UUID (PK)
titre           : VARCHAR(500)
contenu         : TEXT
resume          : TEXT
categorie       : VARCHAR(100) -- 'Décrets' | 'News' | 'Guides' etc.
tags            : TEXT[]       -- Array de tags
auteur_id       : UUID (FK → users.id)
image_url       : VARCHAR(1000)
publie          : BOOLEAN
date_publication: TIMESTAMP
created_at      : TIMESTAMP
updated_at      : TIMESTAMP
```

### Table: contact_leads
```sql
id          : UUID (PK)
nom         : VARCHAR(255)
entreprise  : VARCHAR(255)
email       : VARCHAR(255)
telephone   : VARCHAR(20)
message     : TEXT
sujet       : VARCHAR(255)
statut      : VARCHAR(50)  -- 'nouveau' | 'en_cours' | 'traité'
created_at  : TIMESTAMP
updated_at  : TIMESTAMP
```

## 🔐 Flux d'Authentification

```
1. Client Login Request
   POST /api/auth/login { email, password }
   
2. Server Validation
   - Vérifier email dans DB
   - Comparer hash bcrypt
   
3. JWT Generation
   - Créer token avec payload: { id, email, role, nom }
   - Expiration: 7 jours
   
4. Client Storage
   - Sauvegarder token dans localStorage
   - Sauvegarder user info
   
5. Protected Requests
   - Header: Authorization: Bearer <token>
   - Middleware vérifie et décode le token
   - Attache req.user pour les controllers
```

## 📤 Flux d'Upload de Document

```
┌──────────┐
│  Admin   │
│Dashboard │
└─────┬────┘
      │ 1. Sélectionne fichier + infos
      ↓
┌─────────────────┐
│ FormData Upload │
│ (Multipart)     │
└────────┬────────┘
         │ 2. POST /api/documents/upload
         ↓
┌────────────────┐
│ Multer         │ 3. Traite le fichier
│ Middleware     │    - Vérifie type
└────────┬───────┘    - Sauvegarde localement
         │            - Génère nom unique
         ↓
┌──────────────────┐
│ Document         │ 4. Enregistre métadonnées
│ Controller       │    dans PostgreSQL
└────────┬─────────┘
         │ 5. Retourne confirmation
         ↓
┌──────────┐
│ Client   │ 6. Document visible dans
│Dashboard │    l'espace client
└──────────┘
```

## 🎨 Stack Frontend

### Structure des Composants

```
src/
├── components/
│   ├── Header.jsx          # Navigation principale
│   ├── Footer.jsx          # Footer avec liens
│   └── ProtectedRoute.jsx  # HOC pour routes protégées
│
├── pages/
│   ├── Home.jsx            # Page d'accueil
│   ├── Blog.jsx            # Veille réglementaire
│   ├── Login.jsx           # Authentification
│   ├── ClientDashboard.jsx # Espace client
│   └── AdminDashboard.jsx  # Gestion admin
│
├── contexts/
│   └── AuthContext.jsx     # État global auth
│
├── services/
│   └── api.js              # Axios + services API
│
└── App.jsx                 # Router principal
```

### Gestion de l'État

**AuthContext (Context API):**
- `user`: Objet utilisateur connecté
- `login(email, password)`: Fonction de connexion
- `logout()`: Fonction de déconnexion
- `isAuthenticated()`: Vérification connexion
- `isAdmin()`: Vérification rôle admin

**Services API (Axios):**
- Intercepteur pour JWT automatique
- Intercepteur pour gestion erreurs 401
- Services organisés par domaine:
  - `authService`: Login, register, profile
  - `documentService`: Upload, download, list
  - `articleService`: CRUD articles
  - `contactService`: Contact forms
  - `userService`: User management

## 🛡️ Sécurité

### Mesures Implémentées

1. **Authentication:**
   - JWT avec expiration
   - Bcrypt avec 10 salt rounds
   - Password minimum 6 caractères

2. **Authorization:**
   - Middleware de vérification rôle
   - Routes protégées côté client et serveur
   - Vérification ownership (client accède seulement ses docs)

3. **Upload Sécurisé:**
   - Whitelist de types de fichiers
   - Limite de taille (10MB)
   - Noms de fichiers générés (évite injections)
   - Stockage hors webroot

4. **Database:**
   - Prepared statements (protection SQL injection)
   - Foreign keys avec cascade
   - Indexes pour performance

5. **Frontend:**
   - Validation des inputs
   - Sanitization des données affichées
   - HTTPS recommandé en production

## 🚀 Déploiement Production

### Checklist

- [ ] Changer `JWT_SECRET` en production
- [ ] Changer mot de passe admin par défaut
- [ ] Configurer HTTPS avec SSL/TLS
- [ ] Activer compression (gzip)
- [ ] Configurer CORS strictement
- [ ] Mettre en place rate limiting
- [ ] Configurer backups PostgreSQL
- [ ] Logger les erreurs (Winston, Sentry)
- [ ] Utiliser PM2 pour process management
- [ ] Variables d'environnement sécurisées
- [ ] Build optimisé React (npm run build)
- [ ] CDN pour assets statiques

### Variables d'Environnement Production

```env
NODE_ENV=production
PORT=5000

# Database - utiliser connexion sécurisée
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=environmental_prod
DB_USER=env_user
DB_PASSWORD=SECURE_PASSWORD_HERE
DB_SSL=true

# JWT - générer secret fort
JWT_SECRET=LONG_RANDOM_SECRET_MINIMUM_32_CHARS
JWT_EXPIRES_IN=24h

# Upload - chemin absolu
UPLOAD_DIR=/var/www/uploads
MAX_FILE_SIZE=10485760

# CORS
ALLOWED_ORIGINS=https://votre-domaine.dz
```

## 📊 Performance

### Optimisations Implémentées

1. **Database:**
   - Indexes sur colonnes fréquemment querées
   - Connection pooling (pg pool)
   - Triggers pour updated_at automatique

2. **API:**
   - Pagination recommandée pour grandes listes
   - Compression gzip
   - Caching headers

3. **Frontend:**
   - Lazy loading des routes (React.lazy)
   - Code splitting automatique (Vite)
   - Optimisation images recommandée
   - Tailwind CSS purging en production

## 🧪 Tests Recommandés

```javascript
// Backend
- Unit tests: Controllers, Services
- Integration tests: Routes API
- E2E tests: Flux complets

// Frontend
- Component tests: React Testing Library
- Integration tests: User flows
- E2E tests: Cypress
```

## 📈 Évolutions Futures

- [ ] Upload en drag & drop avec zone de dépôt
- [ ] Prévisualisation PDF dans le navigateur
- [ ] Notifications email (Nodemailer)
- [ ] Export Excel des statistiques
- [ ] Versioning de documents
- [ ] Commentaires sur articles
- [ ] Recherche full-text (PostgreSQL FTS)
- [ ] Dashboard analytique (charts)
- [ ] API documentation (Swagger)
- [ ] Tests automatisés (Jest, Cypress)

---

**Documentation maintenue par l'équipe technique** 📚
