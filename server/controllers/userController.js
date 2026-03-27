const db = require('../config/database');
const bcrypt = require('bcrypt');

class UserController {
  // Récupérer tous les utilisateurs (Admin seulement)
  static async getAllUsers(req, res) {
    try {
      const { role } = req.query;

      let query = `
        SELECT id, nom, email, role, entreprise, telephone, created_at
        FROM users
        WHERE 1=1
      `;
      
      const params = [];

      if (role) {
        query += ` AND role = $1`;
        params.push(role);
      }

      query += ` ORDER BY created_at DESC`;

      const result = await db.query(query, params);

      res.json({
        users: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error('Erreur getAllUsers:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des utilisateurs' 
      });
    }
  }

  // Récupérer un utilisateur par ID (Admin seulement)
  static async getUserById(req, res) {
    try {
      const { userId } = req.params;

      const result = await db.query(
        `SELECT id, nom, email, role, entreprise, telephone, created_at
         FROM users
         WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Utilisateur non trouvé' 
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erreur getUserById:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération de l\'utilisateur' 
      });
    }
  }

  // Mettre à jour un utilisateur (Admin seulement)
  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { nom, email, role, entreprise, telephone } = req.body;

      // Vérifier que l'utilisateur existe
      const existingUser = await db.query(
        'SELECT id FROM users WHERE id = $1',
        [userId]
      );

      if (existingUser.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Utilisateur non trouvé' 
        });
      }

      // Si l'email est modifié, vérifier qu'il n'est pas déjà utilisé
      if (email) {
        const emailCheck = await db.query(
          'SELECT id FROM users WHERE email = $1 AND id != $2',
          [email, userId]
        );

        if (emailCheck.rows.length > 0) {
          return res.status(400).json({ 
            error: 'Cet email est déjà utilisé' 
          });
        }
      }

      const result = await db.query(
        `UPDATE users 
         SET nom = COALESCE($1, nom),
             email = COALESCE($2, email),
             role = COALESCE($3, role),
             entreprise = COALESCE($4, entreprise),
             telephone = COALESCE($5, telephone)
         WHERE id = $6
         RETURNING id, nom, email, role, entreprise, telephone`,
        [nom, email, role, entreprise, telephone, userId]
      );

      res.json({
        message: 'Utilisateur mis à jour avec succès',
        user: result.rows[0]
      });
    } catch (error) {
      console.error('Erreur updateUser:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la mise à jour de l\'utilisateur' 
      });
    }
  }

  // Supprimer un utilisateur (Admin seulement)
  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      // Empêcher la suppression de son propre compte
      if (userId === req.user.id) {
        return res.status(400).json({ 
          error: 'Vous ne pouvez pas supprimer votre propre compte' 
        });
      }

      const result = await db.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Utilisateur non trouvé' 
        });
      }

      res.json({ 
        message: 'Utilisateur supprimé avec succès' 
      });
    } catch (error) {
      console.error('Erreur deleteUser:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la suppression de l\'utilisateur' 
      });
    }
  }

  // Réinitialiser le mot de passe d'un utilisateur (Admin seulement)
  static async resetUserPassword(req, res) {
    try {
      const { userId } = req.params;
      const newPassword = req.body.newPassword || req.body.password;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ 
          error: 'Le mot de passe doit contenir au moins 6 caractères' 
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const result = await db.query(
        'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
        [hashedPassword, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Utilisateur non trouvé' 
        });
      }

      res.json({ 
        message: 'Mot de passe réinitialisé avec succès' 
      });
    } catch (error) {
      console.error('Erreur resetUserPassword:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la réinitialisation du mot de passe' 
      });
    }
  }

  // Statistiques des utilisateurs (Admin seulement)
  static async getUserStats(req, res) {
    try {
      const stats = await db.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as total_admins,
          COUNT(CASE WHEN role = 'client' THEN 1 END) as total_clients,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as nouveaux_30_jours
        FROM users
      `);

      res.json(stats.rows[0]);
    } catch (error) {
      console.error('Erreur getUserStats:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des statistiques' 
      });
    }
  }
}

module.exports = UserController;
