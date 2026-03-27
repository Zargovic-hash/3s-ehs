const bcrypt = require('bcrypt');
const db = require('../config/database');

async function initializeDatabase() {
  try {
    console.log('🔧 Initialisation de la base de données...');

    // Créer un utilisateur admin par défaut
    const adminPassword = 'Admin123!'; // À changer en production
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Vérifier si un admin existe déjà
    const existingAdmin = await db.query(
      "SELECT id FROM users WHERE email = 'admin@bureau-etudes.dz'"
    );

    if (existingAdmin.rows.length === 0) {
      await db.query(
        `INSERT INTO users (nom, email, password, role, entreprise)
         VALUES ($1, $2, $3, $4, $5)`,
        ['Administrateur', 'admin@bureau-etudes.dz', hashedPassword, 'admin', 'Bureau d\'Études Environnemental']
      );
      console.log('✅ Utilisateur admin créé:');
      console.log('   Email: admin@bureau-etudes.dz');
      console.log('   Mot de passe: Admin123!');
      console.log('   ⚠️  CHANGEZ CE MOT DE PASSE EN PRODUCTION !');
    } else {
      console.log('ℹ️  Un utilisateur admin existe déjà');
    }

    // Insérer des articles de démonstration
    const articlesExist = await db.query('SELECT COUNT(*) as count FROM articles');
    
    if (parseInt(articlesExist.rows[0].count) === 0) {
      await db.query(`
        INSERT INTO articles (titre, contenu, resume, categorie, tags, publie, date_publication) VALUES
        (
          'Loi n° 03-10 relative à la protection de l''environnement',
          'La loi n° 03-10 du 19 juillet 2003 constitue le cadre juridique de base de la protection de l''environnement en Algérie. Cette loi définit les principes fondamentaux et les règles de gestion de l''environnement en vue d''un développement durable.

Les principes clés incluent:
- Le principe de précaution
- Le principe de prévention
- Le principe pollueur-payeur
- Le principe de participation

Cette loi établit également les mécanismes d''évaluation environnementale, notamment l''étude d''impact environnemental (EIE) obligatoire pour tout projet susceptible d''avoir un impact sur l''environnement.',
          'Texte fondateur de la législation environnementale algérienne',
          'Décrets',
          ARRAY['Loi 03-10', 'Cadre légal', 'Protection environnement'],
          true,
          NOW()
        ),
        (
          'Décret exécutif n° 07-145 - Études d''impact environnemental',
          'Le décret exécutif n° 07-145 du 19 mai 2007 détermine le champ d''application, le contenu et les modalités d''approbation des études et des notices d''impact sur l''environnement.

Ce décret précise:
- Les projets soumis à EIE
- Le contenu de l''étude d''impact
- La procédure d''approbation
- Les modalités de consultation du public

L''EIE est obligatoire pour les installations classées, les projets d''infrastructure, les projets industriels, et tout projet susceptible d''avoir un impact significatif sur l''environnement.',
          'Réglementation des études d''impact environnemental (EIE)',
          'Décrets',
          ARRAY['EIE', 'Décret 07-145', 'Procédures'],
          true,
          NOW()
        ),
        (
          'Nomenclature des ICPE - Décret 06-198',
          'Le décret exécutif n° 06-198 du 31 mai 2006 définit la réglementation applicable aux installations classées pour la protection de l''environnement (ICPE).

Les ICPE sont classées en trois catégories:
- Soumises à autorisation
- Soumises à déclaration
- Non classées

La nomenclature couvre divers secteurs: chimie, agroalimentaire, métallurgie, déchets, énergies, etc.',
          'Classification des installations classées en Algérie',
          'Normes Rejets',
          ARRAY['ICPE', 'Décret 06-198', 'Installations classées'],
          true,
          NOW()
        )
      `);
      console.log('✅ Articles de démonstration insérés');
    } else {
      console.log('ℹ️  Des articles existent déjà');
    }

    console.log('✅ Initialisation terminée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initializeDatabase();
