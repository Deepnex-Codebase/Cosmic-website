const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/navbarConfigurationController');

// Get navbar configuration
router.get('/', getNavbarConfiguration);

// Update navbar configuration
router.put('/', updateNavbarConfiguration);

// Upload logo
router.post('/logo', upload.single('logo'), uploadLogo);

// Navigation items routes
router.post('/navigation-items', addNavigationItem);
router.put('/navigation-items/:itemId', updateNavigationItem);
router.delete('/navigation-items/:itemId', deleteNavigationItem);

// Submenu items routes
router.post('/navigation-items/:itemId/submenu', addSubmenuItem);
router.put('/navigation-items/:itemId/submenu/:submenuId', updateSubmenuItem);
router.delete('/navigation-items/:itemId/submenu/:submenuId', deleteSubmenuItem);

module.exports = router;