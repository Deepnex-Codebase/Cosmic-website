const express = require('express');
const router = express.Router();
const { mixedUpload } = require('../config/multerConfig');
const {
  getHeroSection,
  updateHeroSection,
  resetHeroSection
} = require('../controllers/heroSectionController');

// GET /api/cms/hero-section - Get hero section data
router.get('/', getHeroSection);

// PUT /api/cms/hero-section - Update hero section
router.put('/', mixedUpload.fields([
  { name: 'companyVideo', maxCount: 1 },
  { name: 'backgroundVideo', maxCount: 1 },
  { name: 'companyImage', maxCount: 1 }
]), updateHeroSection);

// POST /api/cms/hero-section/reset - Reset to default
router.post('/reset', resetHeroSection);

module.exports = router;