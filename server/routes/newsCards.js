const express = require('express');
const router = express.Router();
const {
  getNewsCards,
  getAllNewsCards,
  createNewsCard,
  updateNewsCard,
  deleteNewsCard,
  resetNewsCards,
  uploadFields
} = require('../controllers/newsCardController');

// GET /api/cms/news-cards - Get active news cards
router.get('/', getNewsCards);

// GET /api/cms/news-cards/all - Get all news cards (including inactive)
router.get('/all', getAllNewsCards);

// POST /api/cms/news-cards - Create new news card
router.post('/', uploadFields, createNewsCard);

// PUT /api/cms/news-cards/:id - Update news card
router.put('/:id', uploadFields, updateNewsCard);

// DELETE /api/cms/news-cards/:id - Delete news card
router.delete('/:id', deleteNewsCard);

// POST /api/cms/news-cards/reset - Reset news cards to default
router.post('/reset', resetNewsCards);

module.exports = router;