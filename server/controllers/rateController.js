const Rate = require('../models/Rate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/rates');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'rate-' + uniqueSuffix + ext);
  }
});

// File filter to allow PDFs and images
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || 
      file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed'), false);
  }
};

// Set up multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @desc    Get all rates
// @route   GET /api/rates
// @access  Public
exports.getRates = async (req, res) => {
  try {
    const rates = await Rate.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: rates.length,
      data: rates
    });
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get rates by category
// @route   GET /api/rates/category/:category
// @access  Public
exports.getRatesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const rates = await Rate.find({ 
      category: category, 
      isActive: true 
    }).sort({ displayOrder: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: rates.length,
      data: rates
    });
  } catch (error) {
    console.error('Error fetching rates by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single rate
// @route   GET /api/rates/:id
// @access  Public
exports.getRate = async (req, res) => {
  try {
    const rate = await Rate.findById(req.params.id);

    if (!rate) {
      return res.status(404).json({
        success: false,
        message: 'Rate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rate
    });
  } catch (error) {
    console.error('Error fetching rate:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new rate
// @route   POST /api/rates
// @access  Private
exports.createRate = async (req, res) => {
  try {
    const rateData = { ...req.body };
    
    // Handle file upload if present
    if (req.file) {
      rateData.fileUrl = `/uploads/rates/${req.file.filename}`;
      rateData.fileName = req.file.originalname;
    }
    
    // Parse features if it's a string
    if (typeof rateData.features === 'string') {
      try {
        rateData.features = JSON.parse(rateData.features);
      } catch (e) {
        rateData.features = rateData.features.split(',').map(f => f.trim());
      }
    }

    const rate = await Rate.create(rateData);

    res.status(201).json({
      success: true,
      data: rate
    });
  } catch (error) {
    console.error('Error creating rate:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update rate
// @route   PUT /api/rates/:id
// @access  Private
exports.updateRate = async (req, res) => {
  try {
    let rate = await Rate.findById(req.params.id);

    if (!rate) {
      return res.status(404).json({
        success: false,
        message: 'Rate not found'
      });
    }

    const updateData = { ...req.body };
    
    // Handle file upload if present
    if (req.file) {
      // Delete old file if exists
      if (rate.fileUrl) {
        const oldFilePath = path.join(__dirname, '..', rate.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      updateData.fileUrl = `/uploads/rates/${req.file.filename}`;
      updateData.fileName = req.file.originalname;
    }
    
    // Parse features if it's a string
    if (typeof updateData.features === 'string') {
      try {
        updateData.features = JSON.parse(updateData.features);
      } catch (e) {
        updateData.features = updateData.features.split(',').map(f => f.trim());
      }
    }

    rate = await Rate.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: rate
    });
  } catch (error) {
    console.error('Error updating rate:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete rate
// @route   DELETE /api/rates/:id
// @access  Private
exports.deleteRate = async (req, res) => {
  try {
    const rate = await Rate.findById(req.params.id);

    if (!rate) {
      return res.status(404).json({
        success: false,
        message: 'Rate not found'
      });
    }

    // Delete associated file if exists
    if (rate.fileUrl) {
      const filePath = path.join(__dirname, '..', rate.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Rate.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Rate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting rate:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Export upload middleware
exports.uploadRate = upload.single('rateFile');