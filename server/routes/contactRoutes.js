const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
// On garde authMiddleware ici
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Route publique
router.post('/', ContactController.createContactLead);

// Routes Admin uniquement
router.get('/', authMiddleware, adminOnly, ContactController.getContactLeads);

// CORRECTION : Utilisation de authMiddleware et ajout du préfixe ContactController
router.get('/stats', authMiddleware, adminOnly, ContactController.getContactStats);
router.get('/:leadId', authMiddleware, adminOnly, ContactController.getContactLeadById);

router.put('/:leadId/status', authMiddleware, adminOnly, ContactController.updateContactLeadStatus);
router.delete('/:leadId', authMiddleware, adminOnly, ContactController.deleteContactLead);

module.exports = router;