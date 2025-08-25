const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getActivePanIndiaPresence,
  getAllPanIndiaPresence,
  getPanIndiaPresenceById,
  createOrUpdatePanIndiaPresence,
  deletePanIndiaPresence,
  togglePanIndiaPresenceStatus,
  uploadMapImage,
  initializeDefaultPanIndiaPresence
} = require('../controllers/panIndiaPresenceController');

// Initialize default Pan India Presence data on server start
initializeDefaultPanIndiaPresence();

// Public routes
router.get('/active', getActivePanIndiaPresence);

// Admin routes
router.get('/', getAllPanIndiaPresence);
router.get('/:id', getPanIndiaPresenceById);
router.post('/', uploadMapImage, createOrUpdatePanIndiaPresence);
router.put('/:id', uploadMapImage, createOrUpdatePanIndiaPresence);
router.delete('/:id', deletePanIndiaPresence);
router.patch('/:id/toggle-status', togglePanIndiaPresenceStatus);

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