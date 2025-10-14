const BlogHero = require('../models/BlogHero');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for blog hero media files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/blog-hero');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `blog-hero-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Configure multer
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|wmv|flv|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

// Get blog hero configuration
const getBlogHero = async (req, res) => {
  try {
    let blogHero = await BlogHero.findOne();
    
    if (!blogHero) {
      // Create default if not exists
      blogHero = await BlogHero.create({});
    }
    
    res.status(200).json(blogHero);
  } catch (error) {
    console.error('Error fetching blog hero:', error);
    res.status(500).json({ message: 'Error fetching blog hero configuration' });
  }
};

// Update blog hero configuration with file upload handling
const updateBlogHero = (req, res) => {
  // Handle file uploads
  const uploadFields = [
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'backgroundVideo', maxCount: 1 }
  ];
  
  upload.fields(uploadFields)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    try {
      const { title, overlayOpacity, height, textColor, accentColor, mediaType } = req.body;
      
      let blogHero = await BlogHero.findOne();
      
      if (!blogHero) {
        blogHero = new BlogHero({});
      }
      
      // Update text fields
      if (title) blogHero.title = title;
      if (overlayOpacity !== undefined) blogHero.overlayOpacity = overlayOpacity;
      if (height) blogHero.height = height;
      if (textColor) blogHero.textColor = textColor;
      if (accentColor) blogHero.accentColor = accentColor;
      if (mediaType) blogHero.mediaType = mediaType;
      
      // Handle image upload if present
      if (req.files && req.files.backgroundImage && req.files.backgroundImage[0]) {
        // Delete old image if it exists and is not the default
        if (blogHero.backgroundImage && !blogHero.backgroundImage.includes('zolar.wpengine.com')) {
          try {
            const oldImagePath = path.join(__dirname, '..', blogHero.backgroundImage.replace(/^\//, ''));
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue with the update even if old image deletion fails
          }
        }
        
        // Set new image path without 'api' prefix
        blogHero.backgroundImage = `/uploads/blog-hero/${req.files.backgroundImage[0].filename}`;
      }
      
      // Handle video upload if present
      if (req.files && req.files.backgroundVideo && req.files.backgroundVideo[0]) {
        // Delete old video if it exists
        if (blogHero.backgroundVideo) {
          try {
            const oldVideoPath = path.join(__dirname, '..', blogHero.backgroundVideo.replace(/^\//, ''));
            if (fs.existsSync(oldVideoPath)) {
              fs.unlinkSync(oldVideoPath);
            }
          } catch (error) {
            console.error('Error deleting old video:', error);
            // Continue with the update even if old video deletion fails
          }
        }
        
        // Set new video path without 'api' prefix
        blogHero.backgroundVideo = `/uploads/blog-hero/${req.files.backgroundVideo[0].filename}`;
      }
      
      blogHero.updatedAt = Date.now();
      await blogHero.save();
      
      res.status(200).json(blogHero);
    } catch (error) {
      console.error('Error updating blog hero:', error);
      res.status(500).json({ message: 'Error updating blog hero configuration' });
    }
  });
};

module.exports = {
  upload,
  getBlogHero,
  updateBlogHero
};