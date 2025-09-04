const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/category/:category', serviceController.getServicesByCategory);
router.get('/featured', serviceController.getFeaturedServices);
router.get('/page-sections', serviceController.getPageSections);

// Admin routes (protected)
// These routes don't have authentication middleware for now
// In a production environment, you would add authentication middleware here
router.get('/admin/stats', serviceController.getServiceStats);
router.post('/', serviceController.uploadServiceImage, serviceController.createService);

// Specific routes must come before parameterized routes
router.put('/page-sections', serviceController.updatePageSections);
router.patch('/order', serviceController.updateServiceOrder);

// Parameterized routes should come last
router.get('/:id', serviceController.getServiceById);
router.put('/:id', serviceController.uploadServiceImage, serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;