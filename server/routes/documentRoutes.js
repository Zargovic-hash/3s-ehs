const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/documentController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Routes communes (Admin et Client)
router.get('/', DocumentController.getDocuments);
router.get('/download/:documentId', DocumentController.downloadDocument);

// Routes Admin uniquement
router.post('/upload', adminOnly, upload.single('file'), DocumentController.uploadDocument);
router.get('/client/:clientId', adminOnly, DocumentController.getClientDocuments);
router.delete('/:documentId', adminOnly, DocumentController.deleteDocument);
router.get('/stats', adminOnly, DocumentController.getDocumentStats);

module.exports = router;
