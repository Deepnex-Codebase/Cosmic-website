const express = require('express');
const router = express.Router();
const {
  getCompanyCulture,
  updateCompanyCulture,
  uploadMedia,
  upload
} = require('../controllers/companyCultureController');

// Get company culture data
router.get('/', getCompanyCulture);

// Update company culture data
router.put('/', updateCompanyCulture);

// Upload media (image or video)
router.post('/upload', upload.single('media'), uploadMedia);

module.exports = router;