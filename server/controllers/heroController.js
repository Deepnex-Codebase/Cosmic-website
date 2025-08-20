const Hero = require('../models/Hero');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/heroes');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'hero-' + uniqueSuffix + path.extname(file.originalname));
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
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all active hero slides
exports.getActiveHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find({ isActive: true })
      .sort({ order: 1 })
      .select('-__v');
    
    // Process heroes to include full image URLs
    const processedHeroes = heroes.map(hero => {
      const heroObj = hero.toObject();
      if (heroObj.img && heroObj.img.startsWith('/uploads/')) {
        heroObj.fullUrl = `${req.protocol}://${req.get('host')}${heroObj.img}`;
      }
      return heroObj;
    });
    
    res.status(200).json({
      success: true,
      data: processedHeroes
    });
  } catch (error) {
    console.error('Error fetching active heroes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hero slides',
      error: error.message
    });
  }
};

// Get all heroes (for admin)
exports.getAllHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find()
      .sort({ order: 1 })
      .select('-__v');
    
    // Process heroes to include full image URLs
    const processedHeroes = heroes.map(hero => {
      const heroObj = hero.toObject();
      if (heroObj.img && heroObj.img.startsWith('/uploads/')) {
        heroObj.fullUrl = `${req.protocol}://${req.get('host')}${heroObj.img}`;
      }
      return heroObj;
    });
    
    res.status(200).json({
      success: true,
      data: processedHeroes
    });
  } catch (error) {
    console.error('Error fetching all heroes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hero slides',
      error: error.message
    });
  }
};

// Get single hero by ID
exports.getHeroById = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await Hero.findById(id).select('-__v');
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }
    
    const heroObj = hero.toObject();
    if (heroObj.img && heroObj.img.startsWith('/uploads/')) {
      heroObj.fullUrl = `${req.protocol}://${req.get('host')}${heroObj.img}`;
    }
    
    res.status(200).json({
      success: true,
      data: heroObj
    });
  } catch (error) {
    console.error('Error fetching hero by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hero slide',
      error: error.message
    });
  }
};

// Create new hero slide
exports.createHero = async (req, res) => {
  try {
    const heroData = { ...req.body };
    
    // Handle title array
    if (typeof heroData.title === 'string') {
      try {
        heroData.title = JSON.parse(heroData.title);
      } catch (e) {
        heroData.title = heroData.title.split('\n').filter(line => line.trim());
      }
    }
    
    // Handle image upload
    if (req.file) {
      heroData.img = `/uploads/heroes/${req.file.filename}`;
    }
    
    // Set order if not provided
    if (!heroData.order) {
      const lastHero = await Hero.findOne().sort({ order: -1 });
      heroData.order = lastHero ? lastHero.order + 1 : 1;
    }
    
    const hero = await Hero.create(heroData);
    
    res.status(201).json({
      success: true,
      message: 'Hero slide created successfully',
      data: hero
    });
  } catch (error) {
    console.error('Error creating hero:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating hero slide',
      error: error.message
    });
  }
};

// Update hero slide
exports.updateHero = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Handle title array
    if (typeof updateData.title === 'string') {
      try {
        updateData.title = JSON.parse(updateData.title);
      } catch (e) {
        updateData.title = updateData.title.split('\n').filter(line => line.trim());
      }
    }
    
    // Handle image upload
    if (req.file) {
      updateData.img = `/uploads/heroes/${req.file.filename}`;
      
      // Delete old image if it exists
      const existingHero = await Hero.findById(id);
      if (existingHero && existingHero.img && existingHero.img.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', existingHero.img);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    updateData.updatedAt = new Date();
    
    const hero = await Hero.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Hero slide updated successfully',
      data: hero
    });
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hero slide',
      error: error.message
    });
  }
};

// Delete hero slide
exports.deleteHero = async (req, res) => {
  try {
    const { id } = req.params;
    
    const hero = await Hero.findById(id);
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }
    
    // Delete associated image file
    if (hero.img && hero.img.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', hero.img);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Hero.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Hero slide deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting hero slide',
      error: error.message
    });
  }
};

// Toggle hero active status
exports.toggleHeroStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const hero = await Hero.findById(id);
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }
    
    hero.isActive = !hero.isActive;
    hero.updatedAt = new Date();
    await hero.save();
    
    res.status(200).json({
      success: true,
      message: `Hero slide ${hero.isActive ? 'activated' : 'deactivated'} successfully`,
      data: hero
    });
  } catch (error) {
    console.error('Error toggling hero status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hero slide status',
      error: error.message
    });
  }
};

// Update hero order
exports.updateHeroOrder = async (req, res) => {
  try {
    const { heroes } = req.body; // Array of { id, order }
    
    const updatePromises = heroes.map(hero => 
      Hero.findByIdAndUpdate(hero.id, { 
        order: hero.order,
        updatedAt: new Date()
      })
    );
    
    await Promise.all(updatePromises);
    
    res.status(200).json({
      success: true,
      message: 'Hero slide order updated successfully'
    });
  } catch (error) {
    console.error('Error updating hero order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hero slide order',
      error: error.message
    });
  }
};

// Upload middleware
exports.uploadHeroImage = upload.single('img');

// Initialize default hero slides
exports.initializeDefaultHeroes = async () => {
  try {
    const count = await Hero.countDocuments();
    if (count === 0) {
      const defaultHeroes = [
        {
          key: 'smart',
          num: '01',
          railTitle: 'What Is Cosmic\nPowertech',
          subtitle: 'Eco-Friendly Energy',
          title: ['Powering A Greener', 'Future With Solar'],
          body: 'Elit himenaeos risus blandit; sociosqu nulla suspendisse. Dignissim urna dapibus mollis efficitur pharetra varius congue.',
          img: '/solar-panels.jpg',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><g><path d="M34,62.1h-6.9c-0.4,0-0.7-0.3-0.7-0.7v-6.9c0-0.4,0.3-0.7,0.7-0.7H34c0.4,0,0.7,0.3,0.7,0.7v6.9   C34.7,61.8,34.4,62.1,34,62.1z M27.9,60.7h5.4v-5.4h-5.4V60.7z"></path></g></svg>',
          order: 1,
          isActive: true
        },
        {
          key: 'advanced',
          num: '02',
          railTitle: 'Projects\nOverviews',
          subtitle: 'Intelligent Solution',
          title: ['Next-Gen Solar', 'For Your Home!'],
          body: 'Ante orci diam semper cursus magna sem scelerisque. Amet ligula maximus nam ad class vulputate felis enim.',
          img: '/installation.jpg',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><g><path d="M73.2,96c-0.7,0-1.3-0.6-1.3-1.3V83.8c0-0.4,0.1-0.7,0.4-0.9l16.4-16.4c0.1-0.1,2.3-2.5,2.3-7.3V31.9   c0-0.7-0.2-4.1-4.1-4.1c-3.9,0-4.1,3.5-4.1,4.1v19.8c0,0.7-0.6,1.3-1.3,1.3c-0.7,0-1.3-0.6-1.3-1.3V31.9c0-2.3,1.4-6.8,6.8-6.8   c5.4,0,6.8,4.4,6.8,6.8v27.3c0,5.9-3,9-3.1,9.1l-16,16v10.4C74.5,95.4,73.9,96,73.2,96z"></path></g></svg>',
          order: 2,
          isActive: true
        },
        {
          key: 'unlimited',
          num: '03',
          railTitle: 'Customise\nSolutions',
          subtitle: 'Cleaner Future',
          title: ['Powering A Greener', 'Future With Solar'],
          body: 'Hendrerit volutpat sectetur metus volutpat memmasse.',
          img: '/quality.jpg',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><g><path d="M81.4,62.3c-0.3,0-0.6-0.1-0.9-0.4c-0.5-0.5-0.5-1.3,0-1.8l6.6-6.6L76,55c-0.5,0.1-1-0.2-1.2-0.6c-0.3-0.4-0.2-1,0.1-1.4   L82.6,42h-4.9c-0.7,0-1.3-0.6-1.3-1.3s0.6-1.3,1.3-1.3h7.4c0.5,0,0.9,0.3,1.1,0.7c0.2,0.4,0.2,0.9-0.1,1.3l-7.5,10.6l11.9-1.5   c0.6-0.1,1.1,0.2,1.3,0.7c0.2,0.5,0.1,1.1-0.2,1.5L82.3,62C82,62.2,81.7,62.3,81.4,62.3z"></path></g></svg>',
          order: 3,
          isActive: true
        }
      ];
      
      await Hero.insertMany(defaultHeroes);
      console.log('Default hero slides initialized');
    }
  } catch (error) {
    console.error('Error initializing default heroes:', error);
  }
};