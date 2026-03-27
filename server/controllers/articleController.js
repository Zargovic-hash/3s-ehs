const db = require('../config/database');

class ArticleController {
  // Créer un article (Admin seulement)
  static async createArticle(req, res) {
    try {
      const { titre, contenu, resume, categorie, tags, image_url, publie } = req.body;

      if (!titre || !contenu || !categorie) {
        return res.status(400).json({ 
          error: 'Titre, contenu et catégorie sont requis' 
        });
      }

      const result = await db.query(
        `INSERT INTO articles 
         (titre, contenu, resume, categorie, tags, image_url, publie, auteur_id, date_publication)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          titre,
          contenu,
          resume,
          categorie,
          tags || [],
          image_url,
          publie || false,
          req.user.id,
          publie ? new Date() : null
        ]
      );

      res.status(201).json({
        message: 'Article créé avec succès',
        article: result.rows[0]
      });
    } catch (error) {
      console.error('Erreur createArticle:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création de l\'article' 
      });
    }
  }

  // Récupérer tous les articles (publics pour tous, tous pour admin)
  static async getArticles(req, res) {
    try {
      const { categorie, tag, search } = req.query;
      
      let query = `
        SELECT a.*, 
               u.nom as auteur_nom
        FROM articles a
        LEFT JOIN users u ON a.auteur_id = u.id
        WHERE 1=1
      `;
      
      const params = [];
      let paramIndex = 1;

      // Filtrer par publication si non-admin
      if (req.user?.role !== 'admin') {
        query += ` AND a.publie = true`;
      }

      // Filtrer par catégorie
      if (categorie) {
        query += ` AND a.categorie = $${paramIndex}`;
        params.push(categorie);
        paramIndex++;
      }

      // Filtrer par tag
      if (tag) {
        query += ` AND $${paramIndex} = ANY(a.tags)`;
        params.push(tag);
        paramIndex++;
      }

      // Recherche textuelle
      if (search) {
        query += ` AND (a.titre ILIKE $${paramIndex} OR a.contenu ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      query += ` ORDER BY a.date_publication DESC NULLS LAST, a.created_at DESC`;

      const result = await db.query(query, params);

      res.json({
        articles: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error('Erreur getArticles:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des articles' 
      });
    }
  }

  // Récupérer un article par ID
  static async getArticleById(req, res) {
    try {
      const { articleId } = req.params;

      let query = `
        SELECT a.*, 
               u.nom as auteur_nom,
               u.email as auteur_email
        FROM articles a
        LEFT JOIN users u ON a.auteur_id = u.id
        WHERE a.id = $1
      `;
      
      const params = [articleId];

      // Si non-admin, vérifier que l'article est publié
      if (req.user?.role !== 'admin') {
        query += ` AND a.publie = true`;
      }

      const result = await db.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Article non trouvé' 
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erreur getArticleById:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération de l\'article' 
      });
    }
  }

  // Mettre à jour un article (Admin seulement)
  static async updateArticle(req, res) {
    try {
      const { articleId } = req.params;
      const { titre, contenu, resume, categorie, tags, image_url, publie } = req.body;

      // Vérifier que l'article existe
      const existingArticle = await db.query(
        'SELECT * FROM articles WHERE id = $1',
        [articleId]
      );

      if (existingArticle.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Article non trouvé' 
        });
      }

      const currentArticle = existingArticle.rows[0];
      const wasUnpublished = !currentArticle.publie;

      const result = await db.query(
        `UPDATE articles 
         SET titre = COALESCE($1, titre),
             contenu = COALESCE($2, contenu),
             resume = COALESCE($3, resume),
             categorie = COALESCE($4, categorie),
             tags = COALESCE($5, tags),
             image_url = COALESCE($6, image_url),
             publie = COALESCE($7, publie),
             date_publication = CASE 
               WHEN $7 = true AND $8 = false THEN NOW()
               ELSE date_publication
             END
         WHERE id = $9
         RETURNING *`,
        [titre, contenu, resume, categorie, tags, image_url, publie, wasUnpublished, articleId]
      );

      res.json({
        message: 'Article mis à jour avec succès',
        article: result.rows[0]
      });
    } catch (error) {
      console.error('Erreur updateArticle:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la mise à jour de l\'article' 
      });
    }
  }

  // Supprimer un article (Admin seulement)
  static async deleteArticle(req, res) {
    try {
      const { articleId } = req.params;

      const result = await db.query(
        'DELETE FROM articles WHERE id = $1 RETURNING id',
        [articleId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Article non trouvé' 
        });
      }

      res.json({ 
        message: 'Article supprimé avec succès' 
      });
    } catch (error) {
      console.error('Erreur deleteArticle:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la suppression de l\'article' 
      });
    }
  }

  // Récupérer les catégories disponibles
  static async getCategories(req, res) {
    try {
      const result = await db.query(`
        SELECT DISTINCT categorie, COUNT(*) as count
        FROM articles
        WHERE publie = true
        GROUP BY categorie
        ORDER BY count DESC
      `);

      res.json({
        categories: result.rows
      });
    } catch (error) {
      console.error('Erreur getCategories:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des catégories' 
      });
    }
  }

  // Récupérer tous les tags
  static async getTags(req, res) {
    try {
      const result = await db.query(`
        SELECT DISTINCT unnest(tags) as tag, COUNT(*) as count
        FROM articles
        WHERE publie = true AND tags IS NOT NULL
        GROUP BY tag
        ORDER BY count DESC
        LIMIT 50
      `);

      res.json({
        tags: result.rows
      });
    } catch (error) {
      console.error('Erreur getTags:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des tags' 
      });
    }
  }
}

module.exports = ArticleController;
