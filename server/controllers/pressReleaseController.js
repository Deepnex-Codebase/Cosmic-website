const PressRelease = require('../models/PressRelease');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for press release image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/press-releases');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pr-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @desc    Get all press releases
// @route   GET /api/press-releases
// @access  Public
exports.getAllPressReleases = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'published',
      search,
      sortBy = 'publishDate',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const pressReleases = await PressRelease.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select('-content'); // Exclude content for list view

    // Get total count for pagination
    const total = await PressRelease.countDocuments(query);

    res.status(200).json({
      success: true,
      count: pressReleases.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: pressReleases
    });
  } catch (error) {
    console.error('Error fetching press releases:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching press releases',
      error: error.message
    });
  }
};

// @desc    Get single press release
// @route   GET /api/press-releases/:id
// @access  Public
exports.getPressRelease = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    const pressRelease = await PressRelease.findOne({
      $or: [
        { _id: id },
        { slug: id }
      ]
    });

    if (!pressRelease) {
      return res.status(404).json({
        success: false,
        message: 'Press release not found'
      });
    }

    // Increment views
    pressRelease.views += 1;
    await pressRelease.save();

    res.status(200).json({
      success: true,
      data: pressRelease
    });
  } catch (error) {
    console.error('Error fetching press release:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching press release',
      error: error.message
    });
  }
};

// @desc    Create new press release
// @route   POST /api/press-releases
// @access  Private/Admin
exports.createPressRelease = async (req, res) => {
  try {
    const pressReleaseData = { ...req.body };

    // Handle file upload
    if (req.file) {
      pressReleaseData.featuredImage = `/uploads/press-releases/${req.file.filename}`;
    }

    // Parse tags if they're sent as string
    if (typeof pressReleaseData.tags === 'string') {
      pressReleaseData.tags = pressReleaseData.tags.split(',').map(tag => tag.trim());
    }

    // Parse author if it's sent as string
    if (typeof pressReleaseData.author === 'string') {
      try {
        pressReleaseData.author = JSON.parse(pressReleaseData.author);
      } catch (e) {
        // If parsing fails, use default
        pressReleaseData.author = {
          name: 'SS Tech Media Team',
          email: 'press@sstech.com'
        };
      }
    }

    const pressRelease = await PressRelease.create(pressReleaseData);

    res.status(201).json({
      success: true,
      message: 'Press release created successfully',
      data: pressRelease
    });
  } catch (error) {
    console.error('Error creating press release:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating press release',
      error: error.message
    });
  }
};

// @desc    Update press release
// @route   PUT /api/press-releases/:id
// @access  Private/Admin
exports.updatePressRelease = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle file upload
    if (req.file) {
      updateData.featuredImage = `/uploads/press-releases/${req.file.filename}`;
    }

    // Parse tags if they're sent as string
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }

    // Parse author if it's sent as string
    if (typeof updateData.author === 'string') {
      try {
        updateData.author = JSON.parse(updateData.author);
      } catch (e) {
        // Keep existing author if parsing fails
        delete updateData.author;
      }
    }

    const pressRelease = await PressRelease.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!pressRelease) {
      return res.status(404).json({
        success: false,
        message: 'Press release not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Press release updated successfully',
      data: pressRelease
    });
  } catch (error) {
    console.error('Error updating press release:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating press release',
      error: error.message
    });
  }
};

// @desc    Delete press release
// @route   DELETE /api/press-releases/:id
// @access  Private/Admin
exports.deletePressRelease = async (req, res) => {
  try {
    const { id } = req.params;

    const pressRelease = await PressRelease.findById(id);

    if (!pressRelease) {
      return res.status(404).json({
        success: false,
        message: 'Press release not found'
      });
    }

    // Delete associated image file
    if (pressRelease.featuredImage && pressRelease.featuredImage.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', pressRelease.featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await PressRelease.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Press release deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting press release:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting press release',
      error: error.message
    });
  }
};

// @desc    Get press release statistics
// @route   GET /api/press-releases/stats
// @access  Private/Admin
exports.getPressReleaseStats = async (req, res) => {
  try {
    const totalPressReleases = await PressRelease.countDocuments();
    const publishedPressReleases = await PressRelease.countDocuments({ status: 'published' });
    const draftPressReleases = await PressRelease.countDocuments({ status: 'draft' });
    const archivedPressReleases = await PressRelease.countDocuments({ status: 'archived' });
    
    // Get total views (handle case where views field might not exist)
    const viewsResult = await PressRelease.aggregate([
      { $group: { _id: null, totalViews: { $sum: { $ifNull: ['$views', 0] } } } }
    ]);
    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

    // Get recent press releases
    const recentPressReleases = await PressRelease.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt views');

    res.status(200).json({
      success: true,
      data: {
        totalPressReleases,
        publishedPressReleases,
        draftPressReleases,
        archivedPressReleases,
        totalViews,
        recentPressReleases
      }
    });
  } catch (error) {
    console.error('Error fetching press release stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching press release statistics',
      error: error.message
    });
  }
};

// Export multer upload middleware
exports.uploadImage = upload.single('featuredImage');