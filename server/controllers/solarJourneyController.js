const SolarJourney = require('../models/SolarJourney');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/solar-journey');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'journey-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter
}).single('image');

// Get all solar journey milestones
exports.getAllMilestones = async (req, res) => {
  try {
    const milestones = await SolarJourney.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all solar journey milestones for admin
exports.getAllMilestonesAdmin = async (req, res) => {
  try {
    const milestones = await SolarJourney.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get only active milestones
exports.getActiveMilestones = async (req, res) => {
  try {
    const milestones = await SolarJourney.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single milestone
exports.getMilestone = async (req, res) => {
  try {
    const milestone = await SolarJourney.findById(req.params.id);
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new milestone
exports.createMilestone = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        error: `Multer error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    
    try {
      const { title, description, icon, year, order, isActive } = req.body;
      
      // Create milestone object
      const milestoneData = {
        title,
        description,
        icon: icon || 'calculator',
        year,
        order: order || 0,
        isActive: isActive === 'true'
      };
      
      // Add image path if file was uploaded
      if (req.file) {
        milestoneData.image = `/uploads/solar-journey/${req.file.filename}`;
      }
      
      // Create milestone
      const milestone = await SolarJourney.create(milestoneData);
      
      res.status(201).json({
        success: true,
        data: milestone
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
};

// Update milestone
exports.updateMilestone = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        error: `Multer error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    
    try {
      // Find milestone
      let milestone = await SolarJourney.findById(req.params.id);
      
      if (!milestone) {
        return res.status(404).json({
          success: false,
          error: 'Milestone not found'
        });
      }
      
      // Update fields
      const { title, description, icon, year, order, isActive } = req.body;
      
      if (title) milestone.title = title;
      if (description) milestone.description = description;
      if (icon) milestone.icon = icon;
      if (year) milestone.year = year;
      if (order !== undefined) milestone.order = order;
      if (isActive !== undefined) milestone.isActive = isActive === 'true';
      
      // Update image if new file was uploaded
      if (req.file) {
        // Delete old image if it exists
        if (milestone.image) {
          const oldImagePath = path.join(__dirname, '..', milestone.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        milestone.image = `/uploads/solar-journey/${req.file.filename}`;
      }
      
      // Save updated milestone
      await milestone.save();
      
      res.status(200).json({
        success: true,
        data: milestone
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
};

// Delete milestone
exports.deleteMilestone = async (req, res) => {
  try {
    const milestone = await SolarJourney.findById(req.params.id);
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }
    
    // Delete image file if it exists
    if (milestone.image) {
      const imagePath = path.join(__dirname, '..', milestone.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete milestone from database
    await SolarJourney.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Reorder milestone
exports.reorderMilestone = async (req, res) => {
  try {
    const { direction } = req.body;
    const milestone = await SolarJourney.findById(req.params.id);
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }
    
    // Find adjacent milestone based on direction
    let adjacentMilestone;
    if (direction === 'up') {
      adjacentMilestone = await SolarJourney.findOne({ order: { $lt: milestone.order } }).sort({ order: -1 });
    } else if (direction === 'down') {
      adjacentMilestone = await SolarJourney.findOne({ order: { $gt: milestone.order } }).sort({ order: 1 });
    }
    
    if (!adjacentMilestone) {
      return res.status(400).json({
        success: false,
        error: `Cannot move ${direction} any further`
      });
    }
    
    // Swap orders
    const tempOrder = milestone.order;
    milestone.order = adjacentMilestone.order;
    adjacentMilestone.order = tempOrder;
    
    // Save both milestones
    await milestone.save();
    await adjacentMilestone.save();
    
    res.status(200).json({
      success: true,
      data: { milestone, adjacentMilestone }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};