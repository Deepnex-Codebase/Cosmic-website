const PanIndiaPresence = require('../models/PanIndiaPresence');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/pan-india');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'map-' + uniqueSuffix + path.extname(file.originalname));
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

// Get active Pan India Presence data
exports.getActivePanIndiaPresence = async (req, res) => {
  try {
    const panIndiaData = await PanIndiaPresence.findOne({ isActive: true })
      .select('-__v');
    
    if (!panIndiaData) {
      return res.status(404).json({
        success: false,
        message: 'Pan India Presence data not found'
      });
    }

    // Process data to include full image URLs
    const processedData = panIndiaData.toObject();
    if (processedData.mapImage && processedData.mapImage.startsWith('/uploads/')) {
      processedData.fullUrl = `${req.protocol}://${req.get('host')}${processedData.mapImage}`;
    }

    res.status(200).json({
      success: true,
      data: processedData
    });
  } catch (error) {
    console.error('Error fetching Pan India Presence data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Pan India Presence data',
      error: error.message
    });
  }
};

// Get all Pan India Presence data (for admin)
exports.getAllPanIndiaPresence = async (req, res) => {
  try {
    const panIndiaData = await PanIndiaPresence.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    // Process data to include full image URLs
    const processedData = panIndiaData.map(data => {
      const dataObj = data.toObject();
      if (dataObj.mapImage && dataObj.mapImage.startsWith('/uploads/')) {
        dataObj.fullUrl = `${req.protocol}://${req.get('host')}${dataObj.mapImage}`;
      }
      return dataObj;
    });

    res.status(200).json({
      success: true,
      data: processedData
    });
  } catch (error) {
    console.error('Error fetching all Pan India Presence data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Pan India Presence data',
      error: error.message
    });
  }
};

// Get Pan India Presence by ID
exports.getPanIndiaPresenceById = async (req, res) => {
  try {
    const { id } = req.params;
    const panIndiaData = await PanIndiaPresence.findById(id).select('-__v');
    
    if (!panIndiaData) {
      return res.status(404).json({
        success: false,
        message: 'Pan India Presence data not found'
      });
    }

    // Process data to include full image URLs
    const processedData = panIndiaData.toObject();
    if (processedData.mapImage && processedData.mapImage.startsWith('/uploads/')) {
      processedData.fullUrl = `${req.protocol}://${req.get('host')}${processedData.mapImage}`;
    }

    res.status(200).json({
      success: true,
      data: processedData
    });
  } catch (error) {
    console.error('Error fetching Pan India Presence data by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Pan India Presence data',
      error: error.message
    });
  }
};

// Create or Update Pan India Presence
exports.createOrUpdatePanIndiaPresence = async (req, res) => {
  try {
    const { title, description, stats } = req.body;
    let mapImage = req.body.mapImage;

    // Handle file upload
    if (req.file) {
      mapImage = `/uploads/pan-india/${req.file.filename}`;
    }

    // Parse stats if it's a string
    let parsedStats = stats;
    if (typeof stats === 'string') {
      try {
        parsedStats = JSON.parse(stats);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid stats format'
        });
      }
    }

    // Check if Pan India Presence data already exists
    let panIndiaData = await PanIndiaPresence.findOne();
    
    if (panIndiaData) {
      // Update existing data
      panIndiaData.title = title || panIndiaData.title;
      panIndiaData.description = description || panIndiaData.description;
      panIndiaData.mapImage = mapImage || panIndiaData.mapImage;
      panIndiaData.stats = parsedStats || panIndiaData.stats;
      panIndiaData.updatedAt = new Date();
      
      await panIndiaData.save();
    } else {
      // Create new data
      panIndiaData = new PanIndiaPresence({
        title: title || 'Pan India Presence',
        description: description || 'Our growing network spans across India, providing reliable solar solutions to homes and businesses nationwide.',
        mapImage: mapImage || '/mapindea.png',
        stats: parsedStats || [
          {
            title: '25+ States',
            description: 'Serving customers across more than 25 states with dedicated local support teams.',
            borderColor: '#003e63',
            order: 1
          },
          {
            title: '100+ Cities',
            description: 'Operating in over 100 cities with installation and maintenance capabilities.',
            borderColor: '#9fc22f',
            order: 2
          },
          {
            title: '1000+ Projects',
            description: 'Successfully completed over 1000 solar installations of various scales nationwide.',
            borderColor: '#003e63',
            order: 3
          }
        ]
      });
      
      await panIndiaData.save();
    }

    res.status(200).json({
      success: true,
      message: panIndiaData.isNew ? 'Pan India Presence data created successfully' : 'Pan India Presence data updated successfully',
      data: panIndiaData
    });
  } catch (error) {
    console.error('Error creating/updating Pan India Presence data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save Pan India Presence data',
      error: error.message
    });
  }
};

// Delete Pan India Presence
exports.deletePanIndiaPresence = async (req, res) => {
  try {
    const { id } = req.params;
    const panIndiaData = await PanIndiaPresence.findById(id);
    
    if (!panIndiaData) {
      return res.status(404).json({
        success: false,
        message: 'Pan India Presence data not found'
      });
    }

    // Delete associated image file
    if (panIndiaData.mapImage && panIndiaData.mapImage.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', panIndiaData.mapImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await PanIndiaPresence.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Pan India Presence data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting Pan India Presence data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete Pan India Presence data',
      error: error.message
    });
  }
};

// Toggle Pan India Presence status
exports.togglePanIndiaPresenceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const panIndiaData = await PanIndiaPresence.findById(id);
    
    if (!panIndiaData) {
      return res.status(404).json({
        success: false,
        message: 'Pan India Presence data not found'
      });
    }

    panIndiaData.isActive = !panIndiaData.isActive;
    panIndiaData.updatedAt = new Date();
    await panIndiaData.save();

    res.status(200).json({
      success: true,
      message: `Pan India Presence ${panIndiaData.isActive ? 'activated' : 'deactivated'} successfully`,
      data: panIndiaData
    });
  } catch (error) {
    console.error('Error toggling Pan India Presence status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle Pan India Presence status',
      error: error.message
    });
  }
};

// Upload middleware
exports.uploadMapImage = upload.single('mapImage');

// Initialize default Pan India Presence data
exports.initializeDefaultPanIndiaPresence = async () => {
  try {
    const existingData = await PanIndiaPresence.findOne();
    
    if (!existingData) {
      const defaultData = new PanIndiaPresence({
        title: 'Pan India Presence',
        description: 'Our growing network spans across India, providing reliable solar solutions to homes and businesses nationwide.',
        mapImage: '/mapindea.png',
        stats: [
          {
            title: '25+ States',
            description: 'Serving customers across more than 25 states with dedicated local support teams.',
            borderColor: '#003e63',
            order: 1
          },
          {
            title: '100+ Cities',
            description: 'Operating in over 100 cities with installation and maintenance capabilities.',
            borderColor: '#9fc22f',
            order: 2
          },
          {
            title: '1000+ Projects',
            description: 'Successfully completed over 1000 solar installations of various scales nationwide.',
            borderColor: '#003e63',
            order: 3
          }
        ],
        isActive: true
      });
      
      await defaultData.save();
      console.log('Default Pan India Presence data initialized');
    }
  } catch (error) {
    console.error('Error initializing default Pan India Presence data:', error);
  }
};