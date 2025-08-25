const Timeline = require('../models/Timeline');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/timeline';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'timeline-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Get all timeline items
const getAllTimeline = async (req, res) => {
  try {
    const timelineItems = await Timeline.find({ isActive: true })
      .sort({ order: 1 })
      .lean();
    
    res.status(200).json({
      success: true,
      data: timelineItems
    });
  } catch (error) {
    console.error('Error fetching timeline items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching timeline items',
      error: error.message
    });
  }
};

// Get timeline item by ID
const getTimelineById = async (req, res) => {
  try {
    const timelineItem = await Timeline.findById(req.params.id);
    
    if (!timelineItem) {
      return res.status(404).json({
        success: false,
        message: 'Timeline item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: timelineItem
    });
  } catch (error) {
    console.error('Error fetching timeline item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching timeline item',
      error: error.message
    });
  }
};

// Create new timeline item
const createTimeline = async (req, res) => {
  try {
    const { year, title, description, order, isActive } = req.body;
    
    // Handle background image
    let backgroundImage = req.body.backgroundImage || '';
    if (req.file) {
      backgroundImage = `/uploads/timeline/${req.file.filename}`;
    }
    
    const timelineItem = new Timeline({
      year,
      title,
      description,
      backgroundImage,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await timelineItem.save();
    
    res.status(201).json({
      success: true,
      message: 'Timeline item created successfully',
      data: timelineItem
    });
  } catch (error) {
    console.error('Error creating timeline item:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating timeline item',
      error: error.message
    });
  }
};

// Update timeline item
const updateTimeline = async (req, res) => {
  try {
    const { year, title, description, order, isActive } = req.body;
    
    const timelineItem = await Timeline.findById(req.params.id);
    
    if (!timelineItem) {
      return res.status(404).json({
        success: false,
        message: 'Timeline item not found'
      });
    }
    
    // Handle background image update
    let backgroundImage = timelineItem.backgroundImage;
    if (req.file) {
      // Delete old image if it exists
      if (timelineItem.backgroundImage && timelineItem.backgroundImage.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', timelineItem.backgroundImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      backgroundImage = `/uploads/timeline/${req.file.filename}`;
    } else if (req.body.backgroundImage) {
      backgroundImage = req.body.backgroundImage;
    }
    
    // Update fields
    timelineItem.year = year || timelineItem.year;
    timelineItem.title = title || timelineItem.title;
    timelineItem.description = description || timelineItem.description;
    timelineItem.backgroundImage = backgroundImage;
    timelineItem.order = order !== undefined ? order : timelineItem.order;
    timelineItem.isActive = isActive !== undefined ? isActive : timelineItem.isActive;
    
    await timelineItem.save();
    
    res.status(200).json({
      success: true,
      message: 'Timeline item updated successfully',
      data: timelineItem
    });
  } catch (error) {
    console.error('Error updating timeline item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating timeline item',
      error: error.message
    });
  }
};

// Delete timeline item
const deleteTimeline = async (req, res) => {
  try {
    const timelineItem = await Timeline.findById(req.params.id);
    
    if (!timelineItem) {
      return res.status(404).json({
        success: false,
        message: 'Timeline item not found'
      });
    }
    
    // Delete associated image
    if (timelineItem.backgroundImage && timelineItem.backgroundImage.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', timelineItem.backgroundImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Timeline.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Timeline item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting timeline item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting timeline item',
      error: error.message
    });
  }
};

// Get all timeline items for admin (including inactive)
const getAllTimelineAdmin = async (req, res) => {
  try {
    const timelineItems = await Timeline.find()
      .sort({ order: 1 })
      .lean();
    
    res.status(200).json({
      success: true,
      data: timelineItems
    });
  } catch (error) {
    console.error('Error fetching timeline items for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching timeline items',
      error: error.message
    });
  }
};

module.exports = {
  getAllTimeline,
  getTimelineById,
  createTimeline,
  updateTimeline,
  deleteTimeline,
  getAllTimelineAdmin,
  upload
};