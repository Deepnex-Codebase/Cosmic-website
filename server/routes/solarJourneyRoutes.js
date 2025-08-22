const express = require('express');
const router = express.Router();
const solarJourneyController = require('../controllers/solarJourneyController');

// Get all milestones
router.get('/', solarJourneyController.getAllMilestones);

// Get all milestones for admin
router.get('/admin/all', solarJourneyController.getAllMilestonesAdmin);

// Get active milestones
router.get('/active', solarJourneyController.getActiveMilestones);

// Get single milestone
router.get('/:id', solarJourneyController.getMilestone);

// Create new milestone
router.post('/', solarJourneyController.createMilestone);

// Update milestone
router.put('/:id', solarJourneyController.updateMilestone);

// Delete milestone
router.delete('/:id', solarJourneyController.deleteMilestone);

// Reorder milestone
router.put('/reorder/:id', solarJourneyController.reorderMilestone);

module.exports = router;