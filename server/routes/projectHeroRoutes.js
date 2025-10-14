const express = require('express');
const router = express.Router();
const projectHeroController = require('../controllers/projectHeroController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');

// Set up storage for project hero media files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/projects');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'project-hero-' + uniqueSuffix + ext);
  }
});

// File filter to accept only images and videos
const fileFilter = (req, file, cb) => {
  // Accept images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Public routes
router.get('/', projectHeroController.getAllProjectHeroes);
router.get('/active', projectHeroController.getActiveProjectHero);
router.get('/:id', projectHeroController.getProjectHeroById);

// Protected routes (admin only)
// Handle POST request for creating a new project hero
router.post('/', protect, (req, res, next) => {
  upload.single('media')(req, res, function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    projectHeroController.createProjectHero(req, res);
  });
});

// Handle PUT request for updating a project hero
router.put('/:id', protect, (req, res, next) => {
  upload.single('media')(req, res, function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    projectHeroController.updateProjectHero(req, res);
  });
});

// Handle DELETE request for deleting a project hero
router.delete('/:id', protect, (req, res) => {
  projectHeroController.deleteProjectHero(req, res);
});

// Handle PATCH request for activating a project hero
router.patch('/:id/activate', protect, (req, res) => {
  projectHeroController.setActiveProjectHero(req, res);
});

module.exports = router;