const express = require('express');
const router = express.Router();
const cookieConsentController = require('../controllers/cookieConsentController');
const { protect, admin, optionalAuth, optionalAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', cookieConsentController.createOrUpdateConsent);
router.post('/track-activity', cookieConsentController.trackUserActivity);

// Admin routes with optional authentication
// These routes will work without token but will show full data only for admins
router.get('/', optionalAuth, optionalAdmin, cookieConsentController.getAllConsents);
router.get('/stats', optionalAuth, optionalAdmin, cookieConsentController.getConsentStats);
router.get('/:id', optionalAuth, optionalAdmin, cookieConsentController.getConsentById);

// Admin routes (strictly protected)
router.delete('/:id', protect, admin, cookieConsentController.deleteConsent);

module.exports = router;