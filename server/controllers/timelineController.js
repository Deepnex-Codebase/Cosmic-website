const Timeline = require('../models/Timeline');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for media uploads (images and videos)
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
    const fileType = file.mimetype.startsWith('video/') ? 'video' : 'image';
    cb(null, `timeline-${fileType}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Allow both image and video files
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|avi|mov|wmv|flv|webm|mkv/;
    
    const extname = path.extname(file.originalname).toLowerCase();
    
    if (file.mimetype.startsWith('image/') && allowedImageTypes.test(extname)) {
      return cb(null, true);
    } else if (file.mimetype.startsWith('video/') && allowedVideoTypes.test(extname)) {
      return cb(null, true);
    } else {
      cb(new Error('Only image or video files are allowed'));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
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
    const { year, title, description, order, isActive, mediaType } = req.body;
    
    // Create timeline item object
    const timelineItem = new Timeline({
      year,
      title,
      description,
      mediaType: mediaType || 'image',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    // Handle media file (image or video)
    if (req.file) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
      const filePath = `${baseUrl}/uploads/timeline/${req.file.filename}`;
      
      if (mediaType === 'video' || req.file.mimetype.startsWith('video/')) {
        timelineItem.backgroundVideo = filePath;
        timelineItem.mediaType = 'video';
      } else {
        timelineItem.backgroundImage = filePath;
        timelineItem.mediaType = 'image';
      }
    } else {
      // Handle URLs provided in request body
      if (mediaType === 'video') {
        timelineItem.backgroundVideo = req.body.backgroundVideo || '';
      } else {
        timelineItem.backgroundImage = req.body.backgroundImage || '';
      }
    }
    
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
    const { year, title, description, order, isActive, mediaType } = req.body;
    
    const timelineItem = await Timeline.findById(req.params.id);
    
    if (!timelineItem) {
      return res.status(404).json({
        success: false,
        message: 'Timeline item not found'
      });
    }
    
    // Handle media file update (image or video)
    if (req.file) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
      const filePath = `${baseUrl}/uploads/timeline/${req.file.filename}`;
      
      if (mediaType === 'video' || req.file.mimetype.startsWith('video/')) {
        timelineItem.backgroundVideo = filePath;
        timelineItem.mediaType = 'video';
        // Clear image if switching from image to video
        if (timelineItem.mediaType === 'image') {
          timelineItem.backgroundImage = '';
        }
      } else {
        timelineItem.backgroundImage = filePath;
        timelineItem.mediaType = 'image';
        // Clear video if switching from video to image
        if (timelineItem.mediaType === 'video') {
          timelineItem.backgroundVideo = '';
        }
      }
    } else {
      // Handle URLs provided in request body
      if (mediaType === 'video') {
        if (req.body.backgroundVideo) {
          timelineItem.backgroundVideo = req.body.backgroundVideo;
        }
        timelineItem.mediaType = 'video';
        // Clear image if switching from image to video
        if (timelineItem.mediaType === 'image') {
          timelineItem.backgroundImage = '';
        }
      } else if (mediaType === 'image') {
        if (req.body.backgroundImage) {
          timelineItem.backgroundImage = req.body.backgroundImage;
        }
        timelineItem.mediaType = 'image';
        // Clear video if switching from video to image
        if (timelineItem.mediaType === 'video') {
          timelineItem.backgroundVideo = '';
        }
      }
    }
    
    // Update other fields
    timelineItem.year = year || timelineItem.year;
    timelineItem.title = title || timelineItem.title;
    timelineItem.description = description || timelineItem.description;
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
    
    // Keep the image file on the server
    // No need to delete the image file as we want to keep all uploaded files
    
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