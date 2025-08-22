const express = require('express');
const router = express.Router();
const {
  getAllPressReleases,
  getPressRelease,
  createPressRelease,
  updatePressRelease,
  deletePressRelease,
  getPressReleaseStats,
  uploadImage
} = require('../controllers/pressReleaseController');

// Public routes
router.get('/', getAllPressReleases);
router.get('/stats', getPressReleaseStats);
router.get('/:id', getPressRelease);

// Admin routes (you can add authentication middleware here later)
router.post('/', uploadImage, createPressRelease);
router.put('/:id', uploadImage, updatePressRelease);
router.delete('/:id', deletePressRelease);

module.exports = router;