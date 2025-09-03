const express = require('express');
const router = express.Router();
const {
  getCareer,
  updateCareer,
  uploadImage,
  upload
} = require('../controllers/careerController');

// Get career data
router.get('/', getCareer);

// Update career data
router.put('/', updateCareer);

// Upload image
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;