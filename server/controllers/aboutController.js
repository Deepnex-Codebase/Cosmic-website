const About = require('../models/About');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Configure multer storage for expertise images
const expertiseStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/about');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'expertise-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer storage for video uploads
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/about');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Image upload configuration
const imageUpload = multer({ 
  storage: expertiseStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Video upload configuration
const videoUpload = multer({ 
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /mp4|avi|mov|wmv|flv|webm|mkv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only video files are allowed!'));
  }
});

// Get about page data
exports.getAboutPage = async (req, res) => {
  try {
    let aboutData = await About.findOne();
    
    // If no data exists, create default data
    if (!aboutData) {
      aboutData = await About.create({});
    }
    
    res.status(200).json(aboutData);
  } catch (error) {
    console.error('Error fetching about page data:', error);
    res.status(500).json({ message: 'Failed to fetch about page data', error: error.message });
  }
};

// Update about page data
exports.updateAboutPage = async (req, res) => {
  try {
    const { hero, aboutUs, whoWeAre, expertise, visionMissionValues, clientTestimonials } = req.body;
    
    let aboutData = await About.findOne();
    
    // If no data exists, create new
    if (!aboutData) {
      aboutData = new About({});
    }
    
    // Update fields if provided
    if (hero) aboutData.hero = hero;
    if (aboutUs) aboutData.aboutUs = aboutUs;
    if (whoWeAre) aboutData.whoWeAre = whoWeAre;
    if (visionMissionValues) aboutData.visionMissionValues = visionMissionValues;
    if (expertise) {
      // Ensure expertise items array exists
      if (!expertise.items) {
        expertise.items = aboutData.expertise && aboutData.expertise.items ? aboutData.expertise.items : [];
      }
      // Make sure items is an array
      if (!Array.isArray(expertise.items)) {
        expertise.items = [];
      }
      aboutData.expertise = expertise;
    } else if (aboutData.expertise) {
      // Make sure expertise.items exists even if expertise is not provided
      if (!aboutData.expertise.items) {
        aboutData.expertise.items = [];
      }
      // Make sure items is an array
      if (!Array.isArray(aboutData.expertise.items)) {
        aboutData.expertise.items = [];
      }
    } else {
      // Initialize expertise if it doesn't exist
      aboutData.expertise = {
        title: 'Our Expertise',
        description: 'We are hands down our expertise in product distributorship.',
        items: []
      };
    }
    
    if (clientTestimonials) aboutData.clientTestimonials = clientTestimonials;

    
    aboutData.updatedAt = Date.now();
    
    await aboutData.save();
    
    res.status(200).json({ message: 'About page updated successfully', data: aboutData });
  } catch (error) {
    console.error('Error updating about page:', error);
    res.status(500).json({ message: 'Failed to update about page', error: error.message });
  }
};

// Upload expertise image
exports.uploadExpertiseImage = async (req, res) => {
  try {
    const uploadMiddleware = imageUpload.single('image');
    
    uploadMiddleware(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Create the image URL
      const imageUrl = `/uploads/about/${req.file.filename}`;
      
      res.status(200).json({ 
        message: 'Image uploaded successfully', 
        imageUrl: imageUrl 
      });
    });
  } catch (error) {
    console.error('Error uploading expertise image:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
};

// Upload hero video
exports.uploadHeroVideo = async (req, res) => {
  try {
    const uploadMiddleware = videoUpload.single('video');
    
    uploadMiddleware(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No video file uploaded' });
      }
      
      // Create the video URL
      const videoUrl = `/uploads/about/${req.file.filename}`;
      
      // Update the hero section in the database with the new video URL
      let aboutData = await About.findOne();
      
      if (!aboutData) {
        aboutData = new About({});
      }
      
      if (!aboutData.hero) {
        aboutData.hero = {};
      }
      
      aboutData.hero.videoUrl = videoUrl;
      aboutData.updatedAt = Date.now();
      
      await aboutData.save();
      
      res.status(200).json({ 
        message: 'Video uploaded successfully', 
        videoUrl: videoUrl 
      });
    });
  } catch (error) {
    console.error('Error uploading hero video:', error);
    res.status(500).json({ message: 'Failed to upload video', error: error.message });
  }
};

// Add expertise item
exports.addExpertiseItem = async (req, res) => {
  try {
    const { title, image } = req.body;
    
    if (!title || !image) {
      return res.status(400).json({ message: 'Title and image are required' });
    }
    
    let aboutData = await About.findOne();
    
    // If no data exists, create new
    if (!aboutData) {
      aboutData = new About({
        expertise: {
          title: 'Our Expertise',
          description: 'We are hands down our expertise in product distributorship.',
          items: []
        }
      });
    }
    
    // Initialize expertise if it doesn't exist
    if (!aboutData.expertise) {
      aboutData.expertise = {
        title: 'Our Expertise',
        description: 'We are hands down our expertise in product distributorship.',
        items: []
      };
    }
    
    // Initialize items array if it doesn't exist
    if (!aboutData.expertise.items) {
      aboutData.expertise.items = [];
    }
    
    // Make sure items is an array
    if (!Array.isArray(aboutData.expertise.items)) {
      aboutData.expertise.items = [];
    }
    
    // Create a new item with a unique ID
    const newItem = { 
      _id: new mongoose.Types.ObjectId(), 
      title, 
      image 
    };
    
    // Add new expertise item
    aboutData.expertise.items.push(newItem);
    aboutData.updatedAt = Date.now();
    
    await aboutData.save();
    
    res.status(200).json({ 
      message: 'Expertise item added successfully', 
      data: aboutData.expertise 
    });
  } catch (error) {
    console.error('Error adding expertise item:', error);
    res.status(500).json({ message: 'Failed to add expertise item', error: error.message });
  }
};

// Remove expertise item
exports.removeExpertiseItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }
    
    // Convert string ID to ObjectId if needed
    const objectId = mongoose.Types.ObjectId.isValid(itemId) ? new mongoose.Types.ObjectId(itemId) : itemId;
    
    let aboutData = await About.findOne();
    
    if (!aboutData || !aboutData.expertise) {
      return res.status(404).json({ message: 'Expertise items not found' });
    }
    
    // Initialize items array if it doesn't exist
    if (!aboutData.expertise.items) {
      aboutData.expertise.items = [];
      return res.status(404).json({ message: 'Expertise items not found' });
    }
    
    // Make sure items is an array
    if (!Array.isArray(aboutData.expertise.items)) {
      aboutData.expertise.items = [];
      return res.status(404).json({ message: 'Expertise items not found' });
    }
    
    // Find the index of the item to remove
    const itemIndex = aboutData.expertise.items.findIndex(item => 
      (item._id && item._id.toString() === itemId) || 
      (item._id && item._id.equals && item._id.equals(objectId))
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Expertise item not found' });
    }
    
    // Remove the item
    aboutData.expertise.items.splice(itemIndex, 1);
    aboutData.updatedAt = Date.now();
    
    await aboutData.save();
    
    res.status(200).json({ 
      message: 'Expertise item removed successfully', 
      data: aboutData.expertise 
    });
  } catch (error) {
    console.error('Error removing expertise item:', error);
    res.status(500).json({ message: 'Failed to remove expertise item', error: error.message });
  }
};