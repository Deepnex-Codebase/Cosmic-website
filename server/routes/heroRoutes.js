const express = require('express');
const router = express.Router();
const {
  getActiveHeroes,
  getAllHeroes,
  getHeroById,
  createHero,
  updateHero,
  deleteHero,
  toggleHeroStatus,
  updateHeroOrder,
  uploadHeroImage,
  initializeDefaultHeroes
} = require('../controllers/heroController');

// Initialize default heroes on server start
initializeDefaultHeroes();

// Public routes
router.get('/active', getActiveHeroes);

// Admin routes
router.get('/', getAllHeroes);
router.get('/:id', getHeroById);
router.post('/', uploadHeroImage, createHero);
router.put('/:id', uploadHeroImage, updateHero);
router.delete('/:id', deleteHero);
router.patch('/:id/toggle-status', toggleHeroStatus);
router.patch('/update-order', updateHeroOrder);

module.exports = router;