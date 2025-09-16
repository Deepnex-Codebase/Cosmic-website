const express = require('express');
const { getWhatsAppConfig, updateWhatsAppConfig } = require('../controllers/whatsappConfigController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(optionalAuth, getWhatsAppConfig)
  .put(protect, updateWhatsAppConfig);

module.exports = router;