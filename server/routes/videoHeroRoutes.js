const express = require('express');
const router = express.Router();
const videoHeroController = require('../controllers/videoHeroController');

// Get video hero data
router.get('/', videoHeroController.getVideoHero);

// Update video hero data
router.put('/', videoHeroController.updateVideoHero);

// Upload video file
router.post('/upload', videoHeroController.upload.single('video'), videoHeroController.uploadVideo);

module.exports = router;