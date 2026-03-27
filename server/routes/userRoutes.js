const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification et des privilèges admin
router.use(authMiddleware, adminOnly);

router.get('/', UserController.getAllUsers);
router.get('/stats', UserController.getUserStats);
router.get('/:userId', UserController.getUserById);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);
router.post('/:userId/reset-password', UserController.resetUserPassword);

module.exports = router;
