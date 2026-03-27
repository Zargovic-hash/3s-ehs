-- Script d'initialisation de la base de données
-- Bureau d'Études Environnemental - Algérie

-- Création de la base de données
CREATE DATABASE environmental_db;

\c environmental_db;

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'client')),
    entreprise VARCHAR(255),
    telephone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre VARCHAR(500) NOT NULL,
    description TEXT,
    url_fichier VARCHAR(1000) NOT NULL,
    nom_fichier VARCHAR(500) NOT NULL,
    taille_fichier INTEGER,
    type_fichier VARCHAR(100),
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id),
    categorie VARCHAR(100),
    statut VARCHAR(50) DEFAULT 'actif',
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES users(id),
    CONSTRAINT fk_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Table Articles (Blog/Veille Réglementaire)
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre VARCHAR(500) NOT NULL,
    contenu TEXT NOT NULL,
    resume TEXT,
    categorie VARCHAR(100) NOT NULL CHECK (categorie IN ('Décrets', 'News', 'Guides', 'Normes Rejets', 'Déchets', 'ICPE')),
    tags TEXT[],
    auteur_id UUID REFERENCES users(id),
    image_url VARCHAR(1000),
    publie BOOLEAN DEFAULT false,
    date_publication TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auteur FOREIGN KEY (auteur_id) REFERENCES users(id)
);

-- Table Contact Leads
CREATE TABLE contact_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    entreprise VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    message TEXT NOT NULL,
    sujet VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_cours', 'traité', 'archivé')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimisation des performances
CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_documents_date ON documents(date_upload DESC);
CREATE INDEX idx_articles_categorie ON articles(categorie);
CREATE INDEX idx_articles_publication ON articles(date_publication DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Trigger pour mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_updated_at BEFORE UPDATE ON contact_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion d'un utilisateur admin par défaut
-- Mot de passe: Admin123! (à changer en production)
INSERT INTO users (nom, email, password, role, entreprise) 
VALUES (
    'Administrateur',
    'admin@bureau-etudes.dz',
    '$2b$10$YourHashedPasswordHere',
    'admin',
    'Bureau d''Études Environnemental'
);

-- Données de démonstration pour articles
INSERT INTO articles (titre, contenu, resume, categorie, tags, publie, date_publication) VALUES
(
    'Loi n° 03-10 relative à la protection de l''environnement',
    'La loi n° 03-10 du 19 juillet 2003 constitue le cadre juridique de base de la protection de l''environnement en Algérie. Elle définit les principes fondamentaux et les règles de gestion de l''environnement en vue d''un développement durable...',
    'Texte fondateur de la législation environnementale algérienne',
    'Décrets',
    ARRAY['Loi 03-10', 'Cadre légal', 'Protection environnement'],
    true,
    CURRENT_TIMESTAMP
),
(
    'Décret exécutif n° 07-145 - Études d''impact environnemental',
    'Le décret exécutif n° 07-145 du 19 mai 2007 détermine le champ d''application, le contenu et les modalités d''approbation des études et des notices d''impact sur l''environnement...',
    'Réglementation des études d''impact environnemental (EIE)',
    'Décrets',
    ARRAY['EIE', 'Décret 07-145', 'Procédures'],
    true,
    CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'Utilisateurs du système (admins et clients)';
COMMENT ON TABLE documents IS 'Documents partagés avec les clients (rapports, audits)';
COMMENT ON TABLE articles IS 'Articles de veille réglementaire et actualités';
COMMENT ON TABLE contact_leads IS 'Demandes de contact depuis le site';
