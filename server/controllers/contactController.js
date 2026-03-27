const db = require('../config/database');

class ContactController {
  // Créer une demande de contact (public)
  static async createContactLead(req, res) {
    try {
      const { nom, entreprise, email, telephone, message, sujet } = req.body;

      if (!nom || !email || !message) {
        return res.status(400).json({ 
          error: 'Nom, email et message sont requis' 
        });
      }

      // Validation basique de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: 'Email invalide' 
        });
      }

      const result = await db.query(
        `INSERT INTO contact_leads 
         (nom, entreprise, email, telephone, message, sujet)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, nom, email, created_at`,
        [nom, entreprise, email, telephone, message, sujet]
      );

      res.status(201).json({
        message: 'Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.',
        lead: result.rows[0]
      });
    } catch (error) {
      console.error('Erreur createContactLead:', error);
      res.status(500).json({ 
        error: 'Erreur lors de l\'envoi de votre demande' 
      });
    }
  }

  // Récupérer toutes les demandes de contact (Admin seulement)
  static async getContactLeads(req, res) {
    try {
      const { statut } = req.query;

      let query = `
        SELECT * FROM contact_leads
        WHERE 1=1
      `;
      
      const params = [];

      if (statut) {
        query += ` AND statut = $1`;
        params.push(statut);
      }

      query += ` ORDER BY created_at DESC`;

      const result = await db.query(query, params);

      res.json({
        leads: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error('Erreur getContactLeads:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des demandes' 
      });
    }
  }

  // Récupérer une demande de contact par ID (Admin seulement)
  static async getContactLeadById(req, res) {
    try {
      const { leadId } = req.params;

      const result = await db.query(
        'SELECT * FROM contact_leads WHERE id = $1',
        [leadId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Demande non trouvée' 
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erreur getContactLeadById:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération de la demande' 
      });
    }
  }

  // Mettre à jour le statut d'une demande (Admin seulement)
  static async updateContactLeadStatus(req, res) {
    try {
      const { leadId } = req.params;
      const { statut } = req.body;

      const validStatuts = ['nouveau', 'en_cours', 'traité', 'archivé'];
      if (!validStatuts.includes(statut)) {
        return res.status(400).json({ 
          error: 'Statut invalide' 
        });
      }

      const result = await db.query(
        `UPDATE contact_leads 
         SET statut = $1
         WHERE id = $2
         RETURNING *`,
        [statut, leadId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Demande non trouvée' 
        });
      }

      res.json({
        message: 'Statut mis à jour avec succès',
        lead: result.rows[0]
      });
    } catch (error) {
      console.error('Erreur updateContactLeadStatus:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la mise à jour du statut' 
      });
    }
  }

  // Supprimer une demande de contact (Admin seulement)
  static async deleteContactLead(req, res) {
    try {
      const { leadId } = req.params;

      const result = await db.query(
        'DELETE FROM contact_leads WHERE id = $1 RETURNING id',
        [leadId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Demande non trouvée' 
        });
      }

      res.json({ 
        message: 'Demande supprimée avec succès' 
      });
    } catch (error) {
      console.error('Erreur deleteContactLead:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la suppression de la demande' 
      });
    }
  }

  // Statistiques des demandes de contact (Admin seulement)
  static async getContactStats(req, res) {
    try {
      const stats = await db.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN statut = 'nouveau' THEN 1 END) as nouveaux,
          COUNT(CASE WHEN statut = 'en_cours' THEN 1 END) as en_cours,
          COUNT(CASE WHEN statut = 'traité' THEN 1 END) as traites,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as dernier_mois
        FROM contact_leads
      `);

      res.json(stats.rows[0]);
    } catch (error) {
      console.error('Erreur getContactStats:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des statistiques' 
      });
    }
  }
}

module.exports = ContactController;
