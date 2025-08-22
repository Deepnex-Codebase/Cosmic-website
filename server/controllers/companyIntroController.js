const CompanyIntro = require('../models/CompanyIntro');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/company-intro');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Get active Company Intro data
exports.getActiveCompanyIntro = async (req, res) => {
  try {
    const companyIntroData = await CompanyIntro.findOne({ isActive: true })
      .select('-__v');
    
    if (!companyIntroData) {
      return res.status(404).json({
        success: false,
        message: 'Company Intro data not found'
      });
    }

    // Process data to include full video URLs
    const processedData = companyIntroData.toObject();
    if (processedData.backgroundVideo && processedData.backgroundVideo.startsWith('/uploads/')) {
      processedData.fullVideoUrl = `${req.protocol}://${req.get('host')}${processedData.backgroundVideo}`;
    }

    res.status(200).json({
      success: true,
      data: processedData
    });
  } catch (error) {
    console.error('Error fetching Company Intro data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Company Intro data',
      error: error.message
    });
  }
};

// Get all Company Intro data (Admin)
exports.getAllCompanyIntro = async (req, res) => {
  try {
    const companyIntroData = await CompanyIntro.find()
      .select('-__v')
      .sort({ order: 1, createdAt: -1 });

    // Process data to include full video URLs
    const processedData = companyIntroData.map(item => {
      const itemObj = item.toObject();
      if (itemObj.backgroundVideo && itemObj.backgroundVideo.startsWith('/uploads/')) {
        itemObj.fullVideoUrl = `${req.protocol}://${req.get('host')}${itemObj.backgroundVideo}`;
      }
      return itemObj;
    });

    res.status(200).json({
      success: true,
      data: processedData
    });
  } catch (error) {
    console.error('Error fetching Company Intro data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Company Intro data',
      error: error.message
    });
  }
};

// Get Company Intro by ID
exports.getCompanyIntroById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyIntroData = await CompanyIntro.findById(id).select('-__v');

    if (!companyIntroData) {
      return res.status(404).json({
        success: false,
        message: 'Company Intro not found'
      });
    }

    // Process data to include full video URLs
    const processedData = companyIntroData.toObject();
    if (processedData.backgroundVideo && processedData.backgroundVideo.startsWith('/uploads/')) {
      processedData.fullVideoUrl = `${req.protocol}://${req.get('host')}${processedData.backgroundVideo}`;
    }

    res.status(200).json({
      success: true,
      data: processedData
    });
  } catch (error) {
    console.error('Error fetching Company Intro:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Company Intro',
      error: error.message
    });
  }
};

// Create or Update Company Intro
exports.createOrUpdateCompanyIntro = async (req, res) => {
  try {
    const { id } = req.params;
    const { subtitle, title, highlightWords, description, isActive, order } = req.body;

    // Parse highlightWords if it's a string
    let parsedHighlightWords = [];
    if (highlightWords) {
      try {
        parsedHighlightWords = typeof highlightWords === 'string' 
          ? JSON.parse(highlightWords) 
          : highlightWords;
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid highlightWords format'
        });
      }
    }

    const updateData = {
      subtitle,
      title,
      highlightWords: parsedHighlightWords,
      description,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 1
    };

    // Handle video upload
    if (req.file) {
      updateData.backgroundVideo = `/uploads/company-intro/${req.file.filename}`;
    }

    let companyIntroData;
    
    if (id && id !== 'undefined') {
      // Update existing
      companyIntroData = await CompanyIntro.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!companyIntroData) {
        return res.status(404).json({
          success: false,
          message: 'Company Intro not found'
        });
      }
    } else {
      // Create new
      companyIntroData = new CompanyIntro(updateData);
      await companyIntroData.save();
    }

    // Process data to include full video URLs
    const processedData = companyIntroData.toObject();
    if (processedData.backgroundVideo && processedData.backgroundVideo.startsWith('/uploads/')) {
      processedData.fullVideoUrl = `${req.protocol}://${req.get('host')}${processedData.backgroundVideo}`;
    }

    res.status(id && id !== 'undefined' ? 200 : 201).json({
      success: true,
      message: id && id !== 'undefined' ? 'Company Intro updated successfully' : 'Company Intro created successfully',
      data: processedData
    });
  } catch (error) {
    console.error('Error saving Company Intro:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save Company Intro',
      error: error.message
    });
  }
};

// Delete Company Intro
exports.deleteCompanyIntro = async (req, res) => {
  try {
    const { id } = req.params;
    const companyIntroData = await CompanyIntro.findById(id);

    if (!companyIntroData) {
      return res.status(404).json({
        success: false,
        message: 'Company Intro not found'
      });
    }

    // Delete associated video file
    if (companyIntroData.backgroundVideo && companyIntroData.backgroundVideo.startsWith('/uploads/')) {
      const videoPath = path.join(__dirname, '..', companyIntroData.backgroundVideo);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    await CompanyIntro.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Company Intro deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting Company Intro:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete Company Intro',
      error: error.message
    });
  }
};

// Toggle Company Intro status
exports.toggleCompanyIntroStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const companyIntroData = await CompanyIntro.findById(id);

    if (!companyIntroData) {
      return res.status(404).json({
        success: false,
        message: 'Company Intro not found'
      });
    }

    companyIntroData.isActive = !companyIntroData.isActive;
    await companyIntroData.save();

    res.status(200).json({
      success: true,
      message: `Company Intro ${companyIntroData.isActive ? 'activated' : 'deactivated'} successfully`,
      data: companyIntroData
    });
  } catch (error) {
    console.error('Error toggling Company Intro status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle Company Intro status',
      error: error.message
    });
  }
};

// Upload video middleware
exports.uploadVideo = upload.single('backgroundVideo');

// Initialize default Company Intro data
exports.initializeDefaultCompanyIntro = async () => {
  try {
    const existingData = await CompanyIntro.findOne();
    
    if (!existingData) {
      const defaultData = new CompanyIntro({
        subtitle: 'The Cosmic Powertech',
        title: 'Leader in the production of High-tech and High-performance solar panels',
        highlightWords: [
          { word: 'High-tech', color: '#cae28e' },
          { word: 'High-performance', color: '#cae28e' }
        ],
        description: 'We are committed to delivering cutting-edge solar solutions that transform how businesses and homes harness energy. Our expertise in high-performance solar technology sets new industry standards for efficiency and reliability.',
        backgroundVideo: '/videos/about.mp4',
        isActive: true,
        order: 1
      });
      
      await defaultData.save();
      console.log('Default Company Intro data initialized');
    }
  } catch (error) {
    console.error('Error initializing default Company Intro data:', error);
  }
};