# 🚀 Guide de Démarrage Rapide

## Installation en 5 Minutes

### Étape 1: Installer PostgreSQL (si non installé)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Télécharger depuis: https://www.postgresql.org/download/windows/

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### Étape 2: Créer la Base de Données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans psql, exécuter:
CREATE DATABASE environmental_db;
\q
```

### Étape 3: Importer le Schéma

```bash
cd environmental-platform
sudo -u postgres psql environmental_db < server/database/schema.sql
```

### Étape 4: Configurer le Backend

```bash
cd server

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Éditer .env (remplacer DB_PASSWORD par votre mot de passe PostgreSQL)
nano .env
```

**Configuration minimale .env:**
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=environmental_db
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_ICI
JWT_SECRET=changez_moi_en_production_123456789
```

### Étape 5: Initialiser les Données

```bash
# Toujours dans le dossier server/
npm run init-db
```

Vous devriez voir:
```
✅ Utilisateur admin créé
✅ Articles de démonstration insérés
✅ Initialisation terminée avec succès !
```

### Étape 6: Démarrer le Backend

```bash
npm start
```

Vous devriez voir:
```
═══════════════════════════════════════════════
🌿 Bureau d'Études Environnemental - API Server
═══════════════════════════════════════════════
🚀 Serveur démarré sur le port 5000
```

### Étape 7: Installer et Démarrer le Frontend

**Ouvrir un nouveau terminal:**

```bash
cd environmental-platform/client

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Vous devriez voir:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Étape 8: Tester l'Application

1. **Ouvrir votre navigateur:** http://localhost:3000

2. **Se connecter:**
   - Cliquer sur "Connexion" dans le header
   - Email: `admin@bureau-etudes.dz`
   - Mot de passe: `Admin123!`

3. **Explorer:**
   - Page d'accueil avec les services
   - Veille réglementaire (blog)
   - Dashboard admin

## 🔧 Résolution de Problèmes

### Erreur: "Cannot connect to database"

**Solution:**
```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql

# Si non démarré:
sudo systemctl start postgresql
```

### Erreur: "Port 5000 already in use"

**Solution:**
```bash
# Changer le port dans server/.env
PORT=5001
```

### Erreur: "Module not found"

**Solution:**
```bash
# Réinstaller les dépendances
cd server
rm -rf node_modules
npm install

# Pareil pour le client
cd ../client
rm -rf node_modules
npm install
```

### Frontend ne charge pas l'API

**Solution:**
Vérifier que le backend tourne sur http://localhost:5000
Le proxy Vite est configuré automatiquement.

## 📝 Créer un Compte Client

En tant qu'admin, vous pouvez créer des comptes clients:

1. Aller dans le Dashboard Admin
2. Utiliser le endpoint `/api/auth/register` ou créer un formulaire dans l'interface admin

**Avec curl:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "nom": "Test Client",
    "email": "client@test.dz",
    "password": "Password123!",
    "role": "client",
    "entreprise": "Entreprise Test"
  }'
```

## 🎯 Prochaines Étapes

1. **Changer le mot de passe admin**
2. **Créer des comptes clients**
3. **Uploader des documents de test**
4. **Publier des articles de veille réglementaire**
5. **Personnaliser le design et le contenu**

## 📞 Support

En cas de problème, vérifier:
- Les logs du backend (dans le terminal du serveur)
- Les logs du frontend (console du navigateur F12)
- La connexion à PostgreSQL

---

**Bon développement! 🚀**
