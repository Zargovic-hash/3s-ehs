const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Routes publiques
router.post('/register',
  [
    body('nom').trim().notEmpty().withMessage('Le nom est requis'),
    body('email').trim().isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
    body('entreprise').optional().trim().isLength({ max: 255 }).withMessage('Entreprise invalide'),
    body('telephone').optional().trim().isLength({ max: 20 }).withMessage('Téléphone invalide')
  ],
  AuthController.register
);

router.post('/login', [
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
], AuthController.login);
router.post('/forgot-password', [
  body('email').trim().isEmail().withMessage('Email invalide')
], AuthController.forgotPassword);
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token requis'),
  body('newPassword').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
], AuthController.resetPassword);

// Routes protégées
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/profile', authMiddleware, AuthController.updateProfile);
router.put('/change-password', authMiddleware, AuthController.changePassword);

module.exports = router;
