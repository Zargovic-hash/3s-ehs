const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Route publique
router.post('/', ContactController.createContactLead);

// Routes Admin uniquement
router.get('/', authMiddleware, adminOnly, ContactController.getContactLeads);
router.get('/stats', auth, getContactStats);
router.get('/:leadId', auth, getContactLeadById);
router.put('/:leadId/status', authMiddleware, adminOnly, ContactController.updateContactLeadStatus);
router.delete('/:leadId', authMiddleware, adminOnly, ContactController.deleteContactLead);

module.exports = router;
