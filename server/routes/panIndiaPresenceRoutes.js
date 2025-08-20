const express = require('express');
const router = express.Router();
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

module.exports = router;