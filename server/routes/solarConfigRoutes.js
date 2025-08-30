const express = require('express');
const router = express.Router();
const solarConfigController = require('../controllers/solarConfigController');

/**
 * @route   GET /api/solar-config
 * @desc    Get all solar configurations
 * @access  Public
 */
router.get('/', solarConfigController.getAllConfigs);

/**
 * @route   GET /api/solar-config/:configType
 * @desc    Get specific solar configuration by type
 * @access  Public
 */
router.get('/:configType', solarConfigController.getConfigByType);

/**
 * @route   PUT /api/solar-config/:configType
 * @desc    Update solar configuration by type
 * @access  Private (should be protected in production)
 */
router.put('/:configType', solarConfigController.updateConfig);

/**
 * @route   POST /api/solar-config/initialize
 * @desc    Initialize default configurations
 * @access  Private (should be protected in production)
 */
router.post('/initialize', solarConfigController.initializeConfigs);

module.exports = router;