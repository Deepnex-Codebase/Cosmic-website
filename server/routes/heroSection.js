const express = require('express');
const router = express.Router();
const {
  getHeroSection,
  updateHeroSection,
  resetHeroSection
} = require('../controllers/heroSectionController');

// GET /api/cms/hero-section - Get hero section data
router.get('/', getHeroSection);

// PUT /api/cms/hero-section - Update hero section
router.put('/', updateHeroSection);

// POST /api/cms/hero-section/reset - Reset to default
router.post('/reset', resetHeroSection);

module.exports = router;