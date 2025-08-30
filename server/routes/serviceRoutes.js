const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// All routes (public access)
router.get('/', serviceController.getAllServices);
router.get('/category/:category', serviceController.getServicesByCategory);
router.get('/featured', serviceController.getFeaturedServices);
router.get('/:id', serviceController.getServiceById);
router.get('/admin/stats', serviceController.getServiceStats);
router.post('/', serviceController.uploadServiceImage, serviceController.createService);
router.put('/:id', serviceController.uploadServiceImage, serviceController.updateService);
router.delete('/:id', serviceController.deleteService);
router.patch('/order', serviceController.updateServiceOrder);

module.exports = router;