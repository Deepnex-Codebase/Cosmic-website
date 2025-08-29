const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

/**
 * @route   GET /api/config/company
 * @desc    Get company profile data
 * @access  Public
 */
router.get('/company', configController.getCompanyData);

/**
 * @route   GET /api/config/section/:section
 * @desc    Get specific section of company profile data
 * @access  Public
 */
router.get('/section/:section', configController.getSection);

/**
 * @route   GET /api/config/offerings/:customerType
 * @desc    Get offerings for a specific customer type
 * @access  Public
 */
router.get('/offerings/:customerType', configController.getOfferings);

/**
 * @route   GET /api/config/subsidy/:customerType
 * @desc    Get subsidy information for a specific customer type
 * @access  Public
 */
router.get('/subsidy/:customerType', configController.getSubsidyInfo);

/**
 * @route   GET /api/config/roi-calculator
 * @desc    Get ROI calculator data
 * @access  Public
 */
router.get('/roi-calculator', configController.getROICalculatorData);

/**
 * @route   PUT /api/config/section/:section
 * @desc    Update specific section of company profile data
 * @access  Private (should be protected in production)
 */
router.put('/section/:section', configController.updateSection);

module.exports = router;