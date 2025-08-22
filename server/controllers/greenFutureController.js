const GreenFuture = require('../models/GreenFuture');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads/green-future');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'green-future-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Get Green Future data
const getGreenFuture = async (req, res) => {
  try {
    let greenFuture = await GreenFuture.findOne({ isActive: true });
    
    // If no data exists, create default data
    if (!greenFuture) {
      greenFuture = new GreenFuture({
        title: 'ENABLING\nA GREEN FUTURE',
        description: 'Creating climate for change through thought leadership and raising awareness towards solar industry, aiding in realization of Aatmanirbhar and energy-rich India.',
        backgroundImage: '/solar-panels.jpg',
        buttonText: 'LEARN MORE',
        buttonLink: '/about',
        isActive: true
      });
      await greenFuture.save();
    }
    
    res.json({
      success: true,
      data: greenFuture
    });
  } catch (error) {
    console.error('Error fetching green future data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching green future data',
      error: error.message
    });
  }
};

// Update Green Future data
const updateGreenFuture = async (req, res) => {
  try {
    const { title, description, buttonText, buttonLink, isActive } = req.body;
    
    let greenFuture = await GreenFuture.findOne();
    
    // Handle background image upload
    let backgroundImage = greenFuture?.backgroundImage || '/solar-panels.jpg';
    if (req.file) {
      // Set the correct path for uploaded image files
      backgroundImage = `/uploads/green-future/${req.file.filename}`;
    }
    
    if (!greenFuture) {
      greenFuture = new GreenFuture({
        title,
        description,
        backgroundImage,
        buttonText,
        buttonLink,
        isActive: isActive !== undefined ? isActive : true
      });
    } else {
      greenFuture.title = title;
      greenFuture.description = description;
      greenFuture.backgroundImage = backgroundImage;
      greenFuture.buttonText = buttonText;
      greenFuture.buttonLink = buttonLink;
      greenFuture.isActive = isActive !== undefined ? isActive : greenFuture.isActive;
    }
    
    await greenFuture.save();
    
    res.json({
      success: true,
      message: 'Green Future data updated successfully',
      data: greenFuture
    });
  } catch (error) {
    console.error('Error updating green future data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating green future data',
      error: error.message
    });
  }
};

// Reset Green Future data to default
const resetGreenFuture = async (req, res) => {
  try {
    await GreenFuture.deleteMany({});
    
    const defaultGreenFuture = new GreenFuture({
      title: 'ENABLING\nA GREEN FUTURE',
      description: 'Creating climate for change through thought leadership and raising awareness towards solar industry, aiding in realization of Aatmanirbhar and energy-rich India.',
      backgroundImage: '/solar-panels.jpg',
      buttonText: 'LEARN MORE',
      buttonLink: '/about',
      isActive: true
    });
    
    await defaultGreenFuture.save();
    
    res.json({
      success: true,
      message: 'Green Future data reset to default successfully',
      data: defaultGreenFuture
    });
  } catch (error) {
    console.error('Error resetting green future data:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting green future data',
      error: error.message
    });
  }
};

module.exports = {
  getGreenFuture,
  updateGreenFuture,
  resetGreenFuture,
  upload
};