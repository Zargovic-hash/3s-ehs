const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/articleController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Routes publiques
router.get('/', ArticleController.getArticles);
router.get('/categories', ArticleController.getCategories);
router.get('/tags', ArticleController.getTags);
router.get('/:articleId', ArticleController.getArticleById);

// Routes Admin uniquement
router.post('/', authMiddleware, adminOnly, ArticleController.createArticle);
router.put('/:articleId', authMiddleware, adminOnly, ArticleController.updateArticle);
router.delete('/:articleId', authMiddleware, adminOnly, ArticleController.deleteArticle);

module.exports = router;
