const express = require('express');
const router = express.Router();
const processController = require('../controllers/processController');

// Get all processes with filtering
router.get('/', processController.getAllProcesses);

// Get delivery processes (specific endpoint for frontend)
router.get('/delivery', processController.getDeliveryProcesses);

// Get single process by ID
router.get('/:id', processController.getProcessById);

// Create new process
router.post('/', processController.createProcess);

// Update process
router.put('/:id', processController.updateProcess);

// Delete process
router.delete('/:id', processController.deleteProcess);

// Update process order
router.patch('/order', processController.updateProcessOrder);

module.exports = router;