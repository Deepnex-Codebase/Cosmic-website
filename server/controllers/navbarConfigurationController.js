const NavbarConfiguration = require('../models/NavbarConfiguration');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration for logo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/navbar');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

// Get navbar configuration
const getNavbarConfiguration = async (req, res) => {
  try {
    let config = await NavbarConfiguration.findOne({ isActive: true });
    
    if (!config) {
      // Create default configuration if none exists
      config = new NavbarConfiguration({
        logo: {
          url: '/logo.png',
          alt: 'Logo',
          height: 'h-8 sm:h-10'
        },
        navigationItems: [
          { label: 'Home', href: '/', order: 1 },
          { 
            label: 'About', 
            href: '/about', 
            order: 2,
            submenu: [
              { label: "Director's Desk", href: '/director-desk', order: 1 },
              { label: 'Company Culture', href: '/company-culture', order: 2 },
              { label: 'Team Celebration', href: '/team-celebration', order: 3 }
            ]
          },
          { label: 'Products', href: '/products', order: 3 },
          { label: 'Services', href: '/services', order: 4 },
          { label: 'Projects', href: '/projects', order: 5 },
          { label: 'Calculator', href: '/calculator', order: 6 },
          { 
            label: 'Media', 
            href: '/blog', 
            order: 7,
            submenu: [
              { label: 'Awards and Achievements', href: '/achievements-awards', order: 1 }
            ]
          },
          { label: 'Contact', href: '/contact', order: 8 }
        ],
        ctaButton: {
          text: 'Enquire Now',
          href: '/contact',
          isVisible: true
        },
        mobileMenu: {
          socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com', isActive: true },
            { platform: 'twitter', url: 'https://twitter.com', isActive: true },
            { platform: 'linkedin', url: 'https://linkedin.com', isActive: true },
            { platform: 'instagram', url: 'https://instagram.com', isActive: true }
          ]
        }
      });
      await config.save();
    }
    
    res.json(config);
  } catch (error) {
    console.error('Error fetching navbar configuration:', error);
    res.status(500).json({ message: 'Error fetching navbar configuration', error: error.message });
  }
};

// Update navbar configuration
const updateNavbarConfiguration = async (req, res) => {
  try {
    const updates = req.body;
    
    let config = await NavbarConfiguration.findOne({ isActive: true });
    
    if (!config) {
      config = new NavbarConfiguration(updates);
    } else {
      Object.assign(config, updates);
    }
    
    await config.save();
    res.json({ message: 'Navbar configuration updated successfully', config });
  } catch (error) {
    console.error('Error updating navbar configuration:', error);
    res.status(500).json({ message: 'Error updating navbar configuration', error: error.message });
  }
};

// Upload logo
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const logoUrl = `/uploads/navbar/${req.file.filename}`;
    
    // Update navbar configuration with new logo
    let config = await NavbarConfiguration.findOne({ isActive: true });
    
    if (!config) {
      config = new NavbarConfiguration();
    }
    
    // Delete old logo file if it exists and is not the default
    if (config.logo && config.logo.url && config.logo.url !== '/logo.png' && config.logo.url.startsWith('/uploads/')) {
      const oldLogoPath = path.join(__dirname, '../', config.logo.url);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }
    
    config.logo.url = logoUrl;
    config.logo.alt = req.body.alt || 'Logo';
    
    await config.save();
    
    res.json({ 
      message: 'Logo uploaded successfully', 
      logoUrl: logoUrl,
      config: config
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ message: 'Error uploading logo', error: error.message });
  }
};

// Add navigation item
const addNavigationItem = async (req, res) => {
  try {
    const { label, href, target, submenu, order } = req.body;
    
    let config = await NavbarConfiguration.findOne({ isActive: true });
    
    if (!config) {
      config = new NavbarConfiguration();
    }
    
    const newItem = {
      label,
      href,
      target: target || '_self',
      order: order || config.navigationItems.length + 1,
      submenu: submenu || []
    };
    
    config.navigationItems.push(newItem);
    await config.save();
    
    res.json({ message: 'Navigation item added successfully', config });
  } catch (error) {
    console.error('Error adding navigation item:', error);
    res.status(500).json({ message: 'Error adding navigation item', error: error.message });
  }
};

// Update navigation item
const updateNavigationItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;
    
    let config = await NavbarConfiguration.findOne({ isActive: true });
    
    if (!config) {
      return res.status(404).json({ message: 'Navbar configuration not found' });
    }
    
    const itemIndex = config.navigationItems.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Navigation item not found' });
    }
    
    Object.assign(config.navigationItems[itemIndex], updates);
    await config.save();
    
    res.json({ message: 'Navigation item updated successfully', config });
  } catch (error) {
    console.error('Error updating navigation item:', error);
    res.status(500).json({ message: 'Error updating navigation item', error: error.message });
  }
};

// Delete navigation item
const deleteNavigationItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    let config = await NavbarConfiguration.findOne({ isActive: true });
    
    if (!config) {
      return res.status(404).json({ message: 'Navbar configuration not found' });
    }
    
    config.navigationItems = config.navigationItems.filter(item => item._id.toString() !== itemId);
    await config.save();
    
    res.json({ message: 'Navigation item deleted successfully', config });
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    res.status(500).json({ message: 'Error deleting navigation item', error: error.message });
  }
};

// Add submenu item
const addSubmenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { label, href, target, order } = req.body;
    
    let config = await NavbarConfiguration.findOne({ isActive: true });
    
    if (!config) {
      return res.status(404).json({ message: 'Navbar configuration not found' });
    }
    
    const itemIndex = config.navigationItems.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Navigation item not found' });
    }
    
    const newSubmenuItem = {
      label,
      href,
      target: target || '_self',
      order: order || config.navigationItems[itemIndex].submenu.length + 1
    };
    
    config.navigationItems[itemIndex].submenu.push(newSubmenuItem);
    await config.save();
    
    res.json({ message: 'Submenu item added successfully', config });
  } catch (error) {
    console.error('Error adding submenu item:', error);
    res.status(500).json({ message: 'Error adding submenu item', error: error.message });
  }
};

// Update submenu item
const updateSubmenuItem = async (req, res) => {
  try {
    const { itemId, submenuId } = req.params;
    const updates = req.body;
    
    let config = await NavbarConfiguration.findOne({ isActive: true });
    
    if (!config) {
      return res.status(404).json({ message: 'Navbar configuration not found' });
    }
    
    const itemIndex = config.navigationItems.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Navigation item not found' });
    }
    
    const submenuIndex = config.navigationItems[itemIndex].submenu.findIndex(sub => sub._id.toString() === submenuId);
    
    if (submenuIndex === -1) {
      return res.status(404).json({ message: 'Submenu item not found' });
    }
    
    Object.assign(config.navigationItems[itemIndex].submenu[submenuIndex], updates);
    await config.save();
    
    res.json({ message: 'Submenu item updated successfully', config });
  } catch (error) {
    console.error('Error updating submenu item:', error);
    res.status(500).json({ message: 'Error updating submenu item', error: error.message });
  }
};

// Delete submenu item
const deleteSubmenuItem = async (req, res) => {
  try {
    const { itemId, submenuId } = req.params;
    
    let config = await NavbarConfiguration.findOne({ isActive: true });
    
    if (!config) {
      return res.status(404).json({ message: 'Navbar configuration not found' });
    }
    
    const itemIndex = config.navigationItems.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Navigation item not found' });
    }
    
    config.navigationItems[itemIndex].submenu = config.navigationItems[itemIndex].submenu.filter(
      sub => sub._id.toString() !== submenuId
    );
    await config.save();
    
    res.json({ message: 'Submenu item deleted successfully', config });
  } catch (error) {
    console.error('Error deleting submenu item:', error);
    res.status(500).json({ message: 'Error deleting submenu item', error: error.message });
  }
};

module.exports = {
  upload,
  getNavbarConfiguration,
  updateNavbarConfiguration,
  uploadLogo,
  addNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  addSubmenuItem,
  updateSubmenuItem,
  deleteSubmenuItem
};