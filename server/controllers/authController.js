const { validationResult } = require('express-validator');
const AuthService = require('../services/authService');

class AuthController {
  // Inscription (utilisé par l'admin pour créer des comptes clients)
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nom, email, password, entreprise, telephone } = req.body;
      const result = await AuthService.register({ nom, email, password, entreprise, telephone });
      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: result.user
      });
    } catch (error) {
      console.error('Erreur registration:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la création de l\'utilisateur' 
      });
    }
  }

  // Connexion
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email et mot de passe requis' 
        });
      }

      const result = await AuthService.login({ email, password });
      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }

      res.json({
        message: 'Connexion réussie',
        token: result.token,
        user: result.user
      });
    } catch (error) {
      console.error('Erreur login:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la connexion' 
      });
    }
  }

  // Récupérer le profil de l'utilisateur connecté
  static async getProfile(req, res) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      if (!user) {
        return res.status(404).json({ 
          error: 'Utilisateur non trouvé' 
        });
      }

      res.json(user);
    } catch (error) {
      console.error('Erreur getProfile:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération du profil' 
      });
    }
  }

  // Mettre à jour le profil
  static async updateProfile(req, res) {
    try {
      const { nom, entreprise, telephone } = req.body;
      
      const user = await AuthService.updateProfile(req.user.id, { nom, entreprise, telephone });

      res.json({
        message: 'Profil mis à jour',
        user
      });
    } catch (error) {
      console.error('Erreur updateProfile:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la mise à jour du profil' 
      });
    }
  }

  // Changer le mot de passe
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          error: 'Mot de passe actuel et nouveau requis' 
        });
      }

      const result = await AuthService.changePassword(req.user.id, { currentPassword, newPassword });
      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }

      res.json({ 
        message: 'Mot de passe modifié avec succès' 
      });
    } catch (error) {
      console.error('Erreur changePassword:', error);
      res.status(500).json({ 
        error: 'Erreur lors du changement de mot de passe' 
      });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }

      return res.json({
        message: 'Si cet email existe, un lien de reinitialisation a ete envoye.'
      });
    } catch (error) {
      console.error('Erreur forgotPassword:', error);
      return res.status(500).json({
        error: 'Erreur lors de la demande de reinitialisation du mot de passe'
      });
    }
  }

  static async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, newPassword } = req.body;
      const result = await AuthService.resetPassword(token, newPassword);
      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }

      return res.json({ message: 'Mot de passe reinitialise avec succes' });
    } catch (error) {
      console.error('Erreur resetPassword:', error);
      return res.status(500).json({
        error: 'Erreur lors de la reinitialisation du mot de passe'
      });
    }
  }
}

module.exports = AuthController;
