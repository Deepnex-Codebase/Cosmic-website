const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

// Get about page data
router.get('/', aboutController.getAboutPage);

// Update about page data
router.put('/', aboutController.updateAboutPage);

// Upload expertise image
router.post('/expertise/upload', aboutController.uploadExpertiseImage);

// Add expertise item
router.post('/expertise/item', aboutController.addExpertiseItem);

// Remove expertise item
router.delete('/expertise/item/:itemId', aboutController.removeExpertiseItem);

module.exports = router;