const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

/**
 * @route   POST /api/lead
 * @desc    Create a new lead
 * @access  Public
 */
router.post('/', leadController.createLead);

/**
 * @route   POST /api/lead/submit
 * @desc    Submit a lead (alias for create lead - as mentioned in PRD)
 * @access  Public
 */
router.post('/submit', leadController.createLead);

/**
 * @route   GET /api/lead
 * @desc    Get all leads
 * @access  Private
 */
router.get('/', leadController.getLeads);

/**
 * @route   GET /api/lead/stats
 * @desc    Get lead statistics
 * @access  Private
 */
router.get('/stats', leadController.getLeadStats);

/**
 * @route   GET /api/lead/:id
 * @desc    Get a lead by ID
 * @access  Private
 */
router.get('/:id', leadController.getLeadById);

/**
 * @route   PUT /api/lead/:id
 * @desc    Update a lead by ID
 * @access  Private
 */
router.put('/:id', leadController.updateLead);

/**
 * @route   DELETE /api/lead/:id
 * @desc    Delete a lead by ID
 * @access  Private
 */
router.delete('/:id', leadController.deleteLead);

module.exports = router;