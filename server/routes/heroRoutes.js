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
  uploadHeroVideo,
  initializeDefaultHeroes
} = require('../controllers/heroController');

// Initialize default heroes on server start
initializeDefaultHeroes();

// Public routes
router.get('/active', getActiveHeroes);

// Admin routes
router.get('/', getAllHeroes);
router.get('/:id', getHeroById);

// Use a single upload middleware that can handle both image and video
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
        message: 'File too large. Maximum size is 100MB.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field. Make sure you are using the correct field name for upload.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image or video files are allowed!'
    });
  }
  
  console.error('Multer error:', error);
  next(error);
});

module.exports = router;