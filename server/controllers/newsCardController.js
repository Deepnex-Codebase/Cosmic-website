const NewsCard = require('../models/NewsCard');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads/news-cards');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fieldPrefix = file.fieldname === 'logo' ? 'logo' : 'news';
    cb(null, fieldPrefix + '-' + uniqueSuffix + path.extname(file.originalname));
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

// Configure upload for multiple fields
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]);

// Get all active news cards
const getNewsCards = async (req, res) => {
  try {
    let newsCards = await NewsCard.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    
    // If no data exists, create default data
    if (newsCards.length === 0) {
      const defaultNewsCards = [
        {
          title: 'Solar Energy Breakthrough',
          image: '/newsimage.png',
          logo: '/logo.png',
          date: 'June 15, 2023',
          excerpt: 'New solar panel technology increases efficiency by 25%, making renewable energy more accessible.',
          content: 'Researchers have developed a groundbreaking new solar panel technology that increases efficiency by 25% while reducing manufacturing costs. This innovation uses a novel material composition that captures a broader spectrum of light, even in low-light conditions. The development is expected to accelerate the adoption of solar energy across residential and commercial sectors, making renewable energy more accessible and affordable. Industry experts predict this could be a game-changer for regions with less consistent sunlight.',
          order: 1,
          isActive: true
        },
        {
          title: 'Government Solar Subsidies',
          image: '/newsimage.jpeg',
          logo: '/logo.png',
          date: 'May 28, 2023',
          excerpt: 'New government initiative offers substantial subsidies for residential solar installations.',
          content: 'The Indian government has announced a comprehensive new subsidy program aimed at boosting residential solar adoption. The initiative will cover up to 40% of installation costs for households that switch to solar power. This program is part of the country\'s broader commitment to increasing renewable energy capacity and achieving energy independence. Officials stated that the subsidies will be available starting next month, with a streamlined application process designed to minimize bureaucratic hurdles. The program aims to add 5GW of residential solar capacity within the next three years.',
          order: 2,
          isActive: true
        },
        {
          title: 'Corporate Solar Rises',
          image: '/solar-panels.jpg',
          logo: '/logo.png',
          date: 'April 10, 2023',
          excerpt: 'Major corporations pledge to power operations with 100% renewable energy by 2025.',
          content: 'Several major Indian corporations have announced ambitious plans to transition to 100% renewable energy by 2025. The coalition, which includes leaders from manufacturing, technology, and service sectors, will collectively invest over ₹15,000 crores in solar infrastructure. This corporate initiative is expected to create thousands of green jobs while significantly reducing carbon emissions. The companies will implement a combination of rooftop solar installations, solar parks, and power purchase agreements with renewable energy providers to achieve their targets.',
          order: 3,
          isActive: true
        },
        {
          title: 'Solar Storage Solutions',
          image: '/quality.jpg',
          logo: '/logo.png',
          date: 'March 5, 2023',
          excerpt: 'New battery technology extends solar energy storage capacity, solving intermittency challenges.',
          content: 'A breakthrough in battery technology promises to solve one of solar energy\'s biggest challenges: storage. The new lithium-silicon batteries offer twice the energy density of conventional lithium-ion batteries at a projected 30% lower cost when mass-produced. This development allows solar energy systems to store excess power more efficiently for use during nighttime or cloudy periods. Early tests show the batteries maintain 90% of their capacity even after 5,000 charge cycles, representing a significant improvement in longevity and reliability for solar storage solutions.',
          order: 4,
          isActive: true
        }
      ];
      
      newsCards = await NewsCard.insertMany(defaultNewsCards);
    }
    
    res.json({
      success: true,
      data: newsCards
    });
  } catch (error) {
    console.error('Error fetching news cards:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news cards',
      error: error.message
    });
  }
};

// Get all news cards (including inactive)
const getAllNewsCards = async (req, res) => {
  try {
    const newsCards = await NewsCard.find().sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      data: newsCards
    });
  } catch (error) {
    console.error('Error fetching all news cards:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all news cards',
      error: error.message
    });
  }
};

// Create new news card
const createNewsCard = async (req, res) => {
  try {
    const { title, date, excerpt, content, order, isActive } = req.body;
    
    // Handle file uploads
    let image = '/newsimage.png'; // default image
    let logo = '/logo.png'; // default logo
    
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        // Set the correct path for uploaded image files
        image = `/uploads/news-cards/${req.files.image[0].filename}`;
      }
      if (req.files.logo && req.files.logo[0]) {
        // Set the correct path for uploaded logo files
        logo = `/uploads/news-cards/${req.files.logo[0].filename}`;
      }
    }
    
    const newsCard = new NewsCard({
      title,
      image,
      logo,
      date,
      excerpt,
      content,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await newsCard.save();
    
    res.status(201).json({
      success: true,
      message: 'News card created successfully',
      data: newsCard
    });
  } catch (error) {
    console.error('Error creating news card:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating news card',
      error: error.message
    });
  }
};

// Update news card
const updateNewsCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, excerpt, content, order, isActive } = req.body;
    
    const existingCard = await NewsCard.findById(id);
    if (!existingCard) {
      return res.status(404).json({
        success: false,
        message: 'News card not found'
      });
    }
    
    // Handle file uploads
    let image = existingCard.image;
    let logo = existingCard.logo;
    
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        // Set the correct path for uploaded image files
        image = `/uploads/news-cards/${req.files.image[0].filename}`;
      }
      if (req.files.logo && req.files.logo[0]) {
        // Set the correct path for uploaded logo files
        logo = `/uploads/news-cards/${req.files.logo[0].filename}`;
      }
    }
    
    const newsCard = await NewsCard.findByIdAndUpdate(
      id,
      {
        title,
        image,
        logo,
        date,
        excerpt,
        content,
        order,
        isActive
      },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'News card updated successfully',
      data: newsCard
    });
  } catch (error) {
    console.error('Error updating news card:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating news card',
      error: error.message
    });
  }
};

// Delete news card
const deleteNewsCard = async (req, res) => {
  try {
    const { id } = req.params;
    
    const newsCard = await NewsCard.findByIdAndDelete(id);
    
    if (!newsCard) {
      return res.status(404).json({
        success: false,
        message: 'News card not found'
      });
    }
    
    res.json({
      success: true,
      message: 'News card deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news card:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting news card',
      error: error.message
    });
  }
};

// Reset news cards to default
const resetNewsCards = async (req, res) => {
  try {
    await NewsCard.deleteMany({});
    
    const defaultNewsCards = [
      {
        title: 'Solar Energy Breakthrough',
        image: '/newsimage.png',
        logo: '/logo.png',
        date: 'June 15, 2023',
        excerpt: 'New solar panel technology increases efficiency by 25%, making renewable energy more accessible.',
        content: 'Researchers have developed a groundbreaking new solar panel technology that increases efficiency by 25% while reducing manufacturing costs. This innovation uses a novel material composition that captures a broader spectrum of light, even in low-light conditions. The development is expected to accelerate the adoption of solar energy across residential and commercial sectors, making renewable energy more accessible and affordable. Industry experts predict this could be a game-changer for regions with less consistent sunlight.',
        order: 1,
        isActive: true
      },
      {
        title: 'Government Solar Subsidies',
        image: '/newsimage.jpeg',
        logo: '/logo.png',
        date: 'May 28, 2023',
        excerpt: 'New government initiative offers substantial subsidies for residential solar installations.',
        content: 'The Indian government has announced a comprehensive new subsidy program aimed at boosting residential solar adoption. The initiative will cover up to 40% of installation costs for households that switch to solar power. This program is part of the country\'s broader commitment to increasing renewable energy capacity and achieving energy independence. Officials stated that the subsidies will be available starting next month, with a streamlined application process designed to minimize bureaucratic hurdles. The program aims to add 5GW of residential solar capacity within the next three years.',
        order: 2,
        isActive: true
      },
      {
        title: 'Corporate Solar Rises',
        image: '/solar-panels.jpg',
        logo: '/logo.png',
        date: 'April 10, 2023',
        excerpt: 'Major corporations pledge to power operations with 100% renewable energy by 2025.',
        content: 'Several major Indian corporations have announced ambitious plans to transition to 100% renewable energy by 2025. The coalition, which includes leaders from manufacturing, technology, and service sectors, will collectively invest over ₹15,000 crores in solar infrastructure. This corporate initiative is expected to create thousands of green jobs while significantly reducing carbon emissions. The companies will implement a combination of rooftop solar installations, solar parks, and power purchase agreements with renewable energy providers to achieve their targets.',
        order: 3,
        isActive: true
      },
      {
        title: 'Solar Storage Solutions',
        image: '/quality.jpg',
        logo: '/logo.png',
        date: 'March 5, 2023',
        excerpt: 'New battery technology extends solar energy storage capacity, solving intermittency challenges.',
        content: 'A breakthrough in battery technology promises to solve one of solar energy\'s biggest challenges: storage. The new lithium-silicon batteries offer twice the energy density of conventional lithium-ion batteries at a projected 30% lower cost when mass-produced. This development allows solar energy systems to store excess power more efficiently for use during nighttime or cloudy periods. Early tests show the batteries maintain 90% of their capacity even after 5,000 charge cycles, representing a significant improvement in longevity and reliability for solar storage solutions.',
        order: 4,
        isActive: true
      }
    ];
    
    const newsCards = await NewsCard.insertMany(defaultNewsCards);
    
    res.json({
      success: true,
      message: 'News cards reset to default successfully',
      data: newsCards
    });
  } catch (error) {
    console.error('Error resetting news cards:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting news cards',
      error: error.message
    });
  }
};

module.exports = {
  getNewsCards,
  getAllNewsCards,
  createNewsCard,
  updateNewsCard,
  deleteNewsCard,
  resetNewsCards,
  uploadFields
};