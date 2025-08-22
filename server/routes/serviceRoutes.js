const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Get all services with pagination and filtering
router.get('/', serviceController.getAllServices);

// Get service statistics
router.get('/stats', serviceController.getServiceStats);

// Get featured services
router.get('/featured', serviceController.getFeaturedServices);

// Get services by category
router.get('/category/:category', serviceController.getServicesByCategory);

// Get single service by ID
router.get('/:id', serviceController.getServiceById);

// Create new service (with image upload)
router.post('/', serviceController.uploadServiceImage, serviceController.createService);

// Update service (with image upload)
router.put('/:id', serviceController.uploadServiceImage, serviceController.updateService);

// Delete service
router.delete('/:id', serviceController.deleteService);

// Bulk update service order
router.patch('/order', serviceController.updateServiceOrder);

module.exports = router;