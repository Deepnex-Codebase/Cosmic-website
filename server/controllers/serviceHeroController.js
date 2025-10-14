const ServiceHero = require('../models/ServiceHero');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/service-hero');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'service-hero-' + uniqueSuffix + ext);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file is image or video
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'), false);
  }
};

// Create multer upload instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Export multer upload for route use
exports.upload = upload;

// Get all service heroes
exports.getAllServiceHeroes = async (req, res) => {
  try {
    const heroes = await ServiceHero.find().sort({ createdAt: -1 });
    res.status(200).json(heroes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active service hero
exports.getActiveServiceHero = async (req, res) => {
  try {
    const hero = await ServiceHero.findOne({ active: true });
    if (!hero) {
      return res.status(404).json({ message: 'No active service hero found' });
    }
    res.status(200).json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new service hero
exports.createServiceHero = async (req, res) => {
  try {
    const { title, backgroundType, overlayOpacity } = req.body;
    
    // Create new hero object
    const newHero = new ServiceHero({
      title,
      backgroundType,
      overlayOpacity: overlayOpacity || 50
    });
    
    // Handle file upload based on background type
    const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
    if (backgroundType === 'image' && req.files && req.files.backgroundImage) {
      newHero.backgroundImage = `${baseUrl}/uploads/service-hero/${req.files.backgroundImage[0].filename}`;
    } else if (backgroundType === 'video' && req.files && req.files.backgroundVideo) {
      newHero.backgroundVideo = `${baseUrl}/uploads/service-hero/${req.files.backgroundVideo[0].filename}`;
    } else {
      return res.status(400).json({ message: 'Background file is required' });
    }
    
    // If this is the first hero or set as active, deactivate all others
    if (!await ServiceHero.countDocuments() || req.body.active === 'true') {
      await ServiceHero.updateMany({}, { active: false });
      newHero.active = true;
    }
    
    // Save the new hero
    const savedHero = await newHero.save();
    res.status(201).json(savedHero);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update service hero
exports.updateServiceHero = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, backgroundType, overlayOpacity, active } = req.body;
    
    // Find the hero to update
    const hero = await ServiceHero.findById(id);
    if (!hero) {
      return res.status(404).json({ message: 'Service hero not found' });
    }
    
    // Update fields
    if (title) hero.title = title;
    if (overlayOpacity) hero.overlayOpacity = overlayOpacity;
    
    // Handle background type change
    if (backgroundType && backgroundType !== hero.backgroundType) {
      hero.backgroundType = backgroundType;
      
      // Reset the appropriate field based on new type
      if (backgroundType === 'image') {
        hero.backgroundVideo = undefined;
      } else {
        hero.backgroundImage = undefined;
      }
    }
    
    // Handle file upload based on background type
    const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
    if (backgroundType === 'image' && req.files && req.files.backgroundImage) {
      // Delete old file if exists
      if (hero.backgroundImage) {
        const oldPath = path.join(__dirname, '..', hero.backgroundImage.replace(baseUrl, ''));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      hero.backgroundImage = `${baseUrl}/uploads/service-hero/${req.files.backgroundImage[0].filename}`;
    } else if (backgroundType === 'video' && req.files && req.files.backgroundVideo) {
      // Delete old file if exists
      if (hero.backgroundVideo) {
        const oldPath = path.join(__dirname, '..', hero.backgroundVideo.replace(baseUrl, ''));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      hero.backgroundVideo = `${baseUrl}/uploads/service-hero/${req.files.backgroundVideo[0].filename}`;
    }
    
    // Handle active status
    if (active === 'true' && !hero.active) {
      await ServiceHero.updateMany({}, { active: false });
      hero.active = true;
    }
    
    // Save the updated hero
    const updatedHero = await hero.save();
    res.status(200).json(updatedHero);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete service hero
exports.deleteServiceHero = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the hero to delete
    const hero = await ServiceHero.findById(id);
    if (!hero) {
      return res.status(404).json({ message: 'Service hero not found' });
    }
    
    // Delete associated files
    if (hero.backgroundImage) {
      const imagePath = path.join(__dirname, '..', hero.backgroundImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    if (hero.backgroundVideo) {
      const videoPath = path.join(__dirname, '..', hero.backgroundVideo);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }
    
    // Delete the hero
    await hero.remove();
    
    // If this was the active hero, set another one as active
    if (hero.active) {
      const nextHero = await ServiceHero.findOne().sort({ createdAt: -1 });
      if (nextHero) {
        nextHero.active = true;
        await nextHero.save();
      }
    }
    
    res.status(200).json({ message: 'Service hero deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set a hero as active
exports.setActiveHero = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Deactivate all heroes
    await ServiceHero.updateMany({}, { active: false });
    
    // Activate the selected hero
    const hero = await ServiceHero.findByIdAndUpdate(
      id, 
      { active: true },
      { new: true }
    );
    
    if (!hero) {
      return res.status(404).json({ message: 'Service hero not found' });
    }
    
    res.status(200).json(hero);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Export multer upload for route use
exports.upload = upload;