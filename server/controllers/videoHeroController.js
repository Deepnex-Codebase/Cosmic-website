const VideoHero = require('../models/VideoHero');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage for video files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/videos');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-hero-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
  fileFilter: function (req, file, cb) {
    const filetypes = /mp4|avi|mov|wmv|flv|webm/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only video files are allowed!'));
  }
});

// Get video hero data
exports.getVideoHero = async (req, res) => {
  try {
    console.log('Fetching video hero data...');
    let videoHeroData = await VideoHero.findOne({ isActive: true });
    
    console.log('Found video hero data:', videoHeroData);
    
    // If no data exists, create default data
    if (!videoHeroData) {
      console.log('No video hero data found, creating default...');
      videoHeroData = await VideoHero.create({});
      console.log('Created default video hero data:', videoHeroData);
    }
    
    res.status(200).json({
      success: true,
      data: videoHeroData
    });
  } catch (error) {
    console.error('Error fetching video hero data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching video hero data',
      error: error.message
    });
  }
};

// Update video hero data
exports.updateVideoHero = async (req, res) => {
  try {
    console.log('Updating video hero data with:', req.body);
    
    let videoHeroData = await VideoHero.findOne({ isActive: true });
    
    if (!videoHeroData) {
      // Create new if doesn't exist
      videoHeroData = await VideoHero.create(req.body);
    } else {
      // Update existing
      Object.assign(videoHeroData, req.body);
      videoHeroData.updatedAt = new Date();
      await videoHeroData.save();
    }
    
    console.log('Updated video hero data:', videoHeroData);
    
    res.status(200).json({
      success: true,
      message: 'Video hero data updated successfully',
      data: videoHeroData
    });
  } catch (error) {
    console.error('Error updating video hero data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating video hero data',
      error: error.message
    });
  }
};

// Upload video file
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded'
      });
    }
    
    const videoPath = `/uploads/videos/${req.file.filename}`;
    
    // Update the video source in the database
    let videoHeroData = await VideoHero.findOne({ isActive: true });
    
    if (!videoHeroData) {
      videoHeroData = await VideoHero.create({ videoSource: videoPath });
    } else {
      videoHeroData.videoSource = videoPath;
      videoHeroData.updatedAt = new Date();
      await videoHeroData.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        videoPath: videoPath,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading video',
      error: error.message
    });
  }
};

// Initialize default video hero data
exports.initializeDefaultVideoHero = async () => {
  try {
    const existingData = await VideoHero.findOne();
    
    if (!existingData) {
      const defaultVideoHero = {
        videoSource: '/videos/zolar.mp4',
        heights: {
          mobile: '300px',
          tablet: '400px',
          desktop: '500px'
        },
        buttonSettings: {
          backgroundColor: '#cae28e',
          mobileSize: {
            width: '64px',
            height: '64px'
          },
          desktopSize: {
            width: '80px',
            height: '80px'
          },
          boxShadow: {
            mobile: '0 0 20px 5px rgba(202, 226, 142, 0.3)',
            desktop: '0 0 30px 10px rgba(202, 226, 142, 0.4)'
          }
        },
        videoSettings: {
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true
        },
        interactionSettings: {
          hideButtonDelay: 2000,
          animationSpeed: 0.25
        },
        isActive: true
      };
      
      await VideoHero.create(defaultVideoHero);
      console.log('Default video hero data initialized');
    }
  } catch (error) {
    console.error('Error initializing default video hero data:', error);
  }
};

// Export multer upload middleware
exports.upload = upload;