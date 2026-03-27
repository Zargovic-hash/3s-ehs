const db = require('../config/database');
const path = require('path');
const fs = require('fs');

class DocumentController {
  // Upload d'un document (Admin seulement)
  static async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          error: 'Aucun fichier fourni' 
        });
      }

      const { titre, description, client_id, categorie } = req.body;

      if (!titre || !client_id) {
        // Supprimer le fichier uploadé si les données sont invalides
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          error: 'Titre et client_id sont requis' 
        });
      }

      // Vérifier que le client existe
      const clientExists = await db.query(
        'SELECT id FROM users WHERE id = $1 AND role = $2',
        [client_id, 'client']
      );

      if (clientExists.rows.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ 
          error: 'Client non trouvé' 
        });
      }

      // Enregistrer les informations du document dans la base de données
      const result = await db.query(
        `INSERT INTO documents 
         (titre, description, url_fichier, nom_fichier, taille_fichier, type_fichier, client_id, uploaded_by, categorie)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          titre,
          description,
          req.file.path,
          req.file.originalname,
          req.file.size,
          req.file.mimetype,
          client_id,
          req.user.id,
          categorie
        ]
      );

      res.status(201).json({
        message: 'Document uploadé avec succès',
        document: result.rows[0]
      });
    } catch (error) {
      console.error('Erreur uploadDocument:', error);
      
      // Supprimer le fichier en cas d'erreur
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Erreur suppression fichier:', unlinkError);
        }
      }
      
      res.status(500).json({ 
        error: 'Erreur lors de l\'upload du document' 
      });
    }
  }

  // Récupérer tous les documents (Admin: tous, Client: les siens)
  static async getDocuments(req, res) {
    try {
      let query;
      let params;

      if (req.user.role === 'admin') {
        // Admin voit tous les documents
        query = `
          SELECT d.*, 
                 u.nom as client_nom, 
                 u.entreprise as client_entreprise,
                 uploader.nom as uploaded_by_nom
          FROM documents d
          LEFT JOIN users u ON d.client_id = u.id
          LEFT JOIN users uploader ON d.uploaded_by = uploader.id
          WHERE d.statut = 'actif'
          ORDER BY d.date_upload DESC
        `;
        params = [];
      } else {
        // Client voit seulement ses documents
        query = `
          SELECT d.*,
                 uploader.nom as uploaded_by_nom
          FROM documents d
          LEFT JOIN users uploader ON d.uploaded_by = uploader.id
          WHERE d.client_id = $1 AND d.statut = 'actif'
          ORDER BY d.date_upload DESC
        `;
        params = [req.user.id];
      }

      const result = await db.query(query, params);

      res.json({
        documents: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error('Erreur getDocuments:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des documents' 
      });
    }
  }

  // Récupérer les documents d'un client spécifique (Admin seulement)
  static async getClientDocuments(req, res) {
    try {
      const { clientId } = req.params;

      const result = await db.query(
        `SELECT d.*, 
                uploader.nom as uploaded_by_nom
         FROM documents d
         LEFT JOIN users uploader ON d.uploaded_by = uploader.id
         WHERE d.client_id = $1 AND d.statut = 'actif'
         ORDER BY d.date_upload DESC`,
        [clientId]
      );

      res.json({
        documents: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error('Erreur getClientDocuments:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des documents' 
      });
    }
  }

  // Télécharger un document
  static async downloadDocument(req, res) {
    try {
      const { documentId } = req.params;

      // Récupérer les informations du document
      let query;
      let params;

      if (req.user.role === 'admin') {
        query = 'SELECT * FROM documents WHERE id = $1 AND statut = $2';
        params = [documentId, 'actif'];
      } else {
        // Le client ne peut télécharger que ses propres documents
        query = 'SELECT * FROM documents WHERE id = $1 AND client_id = $2 AND statut = $3';
        params = [documentId, req.user.id, 'actif'];
      }

      const result = await db.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Document non trouvé ou accès non autorisé' 
        });
      }

      const document = result.rows[0];

      // Vérifier que le fichier existe
      if (!fs.existsSync(document.url_fichier)) {
        return res.status(404).json({ 
          error: 'Fichier introuvable sur le serveur' 
        });
      }

      // Télécharger le fichier
      res.download(document.url_fichier, document.nom_fichier, (err) => {
        if (err) {
          console.error('Erreur téléchargement:', err);
          res.status(500).json({ 
            error: 'Erreur lors du téléchargement' 
          });
        }
      });
    } catch (error) {
      console.error('Erreur downloadDocument:', error);
      res.status(500).json({ 
        error: 'Erreur lors du téléchargement du document' 
      });
    }
  }

  // Supprimer un document (Admin seulement)
  static async deleteDocument(req, res) {
    try {
      const { documentId } = req.params;

      // Récupérer les informations du document
      const result = await db.query(
        'SELECT * FROM documents WHERE id = $1',
        [documentId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Document non trouvé' 
        });
      }

      const document = result.rows[0];

      // Soft delete (marquer comme supprimé)
      await db.query(
        'UPDATE documents SET statut = $1 WHERE id = $2',
        ['supprimé', documentId]
      );

      // Optionnel: supprimer physiquement le fichier
      // if (fs.existsSync(document.url_fichier)) {
      //   fs.unlinkSync(document.url_fichier);
      // }

      res.json({ 
        message: 'Document supprimé avec succès' 
      });
    } catch (error) {
      console.error('Erreur deleteDocument:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la suppression du document' 
      });
    }
  }

  // Récupérer les statistiques de documents (Admin)
  static async getDocumentStats(req, res) {
    try {
      const stats = await db.query(`
        SELECT 
          COUNT(*) as total_documents,
          COUNT(DISTINCT client_id) as total_clients_avec_docs,
          SUM(taille_fichier) as taille_totale,
          COUNT(CASE WHEN date_upload >= NOW() - INTERVAL '30 days' THEN 1 END) as uploads_30_jours
        FROM documents
        WHERE statut = 'actif'
      `);

      const parCategorie = await db.query(`
        SELECT categorie, COUNT(*) as count
        FROM documents
        WHERE statut = 'actif'
        GROUP BY categorie
        ORDER BY count DESC
      `);

      res.json({
        global: stats.rows[0],
        par_categorie: parCategorie.rows
      });
    } catch (error) {
      console.error('Erreur getDocumentStats:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des statistiques' 
      });
    }
  }
}

module.exports = DocumentController;
