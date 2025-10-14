const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getFaqImages, updateFaqImages } = require('../controllers/faqImagesController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/faq');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Define routes
router.get('/', getFaqImages);
router.put('/', 
  protect, 
  upload.fields([
    { name: 'leftImage', maxCount: 1 },
    { name: 'rightImage', maxCount: 1 },
    { name: 'badgeImage', maxCount: 1 }
  ]), 
  updateFaqImages
);

module.exports = router;