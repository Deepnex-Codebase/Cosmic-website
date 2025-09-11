const Brochure = require('../models/Brochure');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/brochures');
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
    cb(null, 'brochure-' + uniqueSuffix + ext);
  }
});

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Set up multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @desc    Get all brochures
// @route   GET /api/brochures
// @access  Public
exports.getBrochures = async (req, res) => {
  try {
    const brochures = await Brochure.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: brochures.length,
      data: brochures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get active brochure
// @route   GET /api/brochures/active
// @access  Public
exports.getActiveBrochure = async (req, res) => {
  try {
    const brochure = await Brochure.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!brochure) {
      return res.status(404).json({
        success: false,
        message: 'No active brochure found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: brochure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single brochure
// @route   GET /api/brochures/:id
// @access  Public
exports.getBrochure = async (req, res) => {
  try {
    const brochure = await Brochure.findById(req.params.id);
    
    if (!brochure) {
      return res.status(404).json({
        success: false,
        message: 'Brochure not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: brochure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new brochure
// @route   POST /api/brochures
// @access  Public
exports.createBrochure = async (req, res) => {
  try {
    // If a file was uploaded, add the file path to the request body
    if (req.file) {
      // Get the relative path for storage in the database
      const relativePath = '/uploads/brochures/' + req.file.filename;
      req.body.fileUrl = relativePath;
    }
    
    // If setting this brochure as active, deactivate all other brochures
    if (req.body.isActive === 'true' || req.body.isActive === true) {
      await Brochure.updateMany({}, { isActive: false });
    }
    
    const brochure = await Brochure.create(req.body);
    
    res.status(201).json({
      success: true,
      data: brochure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update brochure
// @route   PUT /api/brochures/:id
// @access  Public
exports.updateBrochure = async (req, res) => {
  try {
    let brochure = await Brochure.findById(req.params.id);
    
    if (!brochure) {
      return res.status(404).json({
        success: false,
        message: 'Brochure not found'
      });
    }
    
    // If a file was uploaded, add the file path to the request body
    if (req.file) {
      // Delete old file if it exists
      if (brochure.fileUrl) {
        const oldFilePath = path.join(__dirname, '..', brochure.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      // Get the relative path for storage in the database
      const relativePath = '/uploads/brochures/' + req.file.filename;
      req.body.fileUrl = relativePath;
    }
    
    // If setting this brochure as active, deactivate all other brochures
    if (req.body.isActive === 'true' || req.body.isActive === true) {
      await Brochure.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }
    
    brochure = await Brochure.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: brochure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete brochure
// @route   DELETE /api/brochures/:id
// @access  Public
exports.deleteBrochure = async (req, res) => {
  try {
    const brochure = await Brochure.findById(req.params.id);
    
    if (!brochure) {
      return res.status(404).json({
        success: false,
        message: 'Brochure not found'
      });
    }
    
    // Delete file if it exists
    if (brochure.fileUrl) {
      const filePath = path.join(__dirname, '..', brochure.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Brochure.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Export multer upload middleware
exports.uploadBrochure = upload.single('brochureFile');