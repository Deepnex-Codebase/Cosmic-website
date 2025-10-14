const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  getTeamCelebration, 
  updateTeamCelebration, 
  uploadTeamCelebrationImage,
  uploadTeamCelebrationVideo
} = require('../controllers/teamCelebrationController');

// Create upload directories if they don't exist
const imageUploadDir = path.join(__dirname, '../uploads/team-celebration');
const videoUploadDir = path.join(__dirname, '../uploads/team-celebration-video');

if (!fs.existsSync(imageUploadDir)) {
  fs.mkdirSync(imageUploadDir, { recursive: true });
}

if (!fs.existsSync(videoUploadDir)) {
  fs.mkdirSync(videoUploadDir, { recursive: true });
}

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

// Configure multer for video uploads
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, videoUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'video-' + uniqueSuffix + ext);
  }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  console.log('Uploading file with mimetype:', file.mimetype);
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP files are allowed.'), false);
  }
};

// File filter for videos
const videoFileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, WebM, OGG, and QuickTime video files are allowed.'), false);
  }
};

const imageUpload = multer({ 
  storage: imageStorage,
  limits: { fileSize: 40 * 1024 * 1024 }, // 40MB limit
  fileFilter: imageFileFilter
});

const videoUpload = multer({ 
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: videoFileFilter
});

// Routes
router.get('/', getTeamCelebration);
router.put('/', updateTeamCelebration);
router.post('/upload-image', imageUpload.single('image'), uploadTeamCelebrationImage);
router.post('/upload-video', videoUpload.single('video'), uploadTeamCelebrationVideo);

module.exports = router;