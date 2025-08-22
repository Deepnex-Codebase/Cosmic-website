const express = require('express');
const router = express.Router();
const multer = require('multer');
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

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed!'
    });
  }
  
  next(error);
});

module.exports = router;