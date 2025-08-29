const express = require('express');
const router = express.Router();
const {
  getCompanyCulture,
  updateCompanyCulture,
  uploadImage,
  upload
} = require('../controllers/companyCultureController');

// Get company culture data
router.get('/', getCompanyCulture);

// Update company culture data
router.put('/', updateCompanyCulture);

// Upload image
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;