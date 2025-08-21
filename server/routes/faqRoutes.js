const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

/**
 * @route   GET /api/faqs
 * @desc    Get all FAQs
 * @access  Public
 */
router.get('/', faqController.getAllFaqs);

/**
 * @route   GET /api/faqs/:id
 * @desc    Get FAQ by ID
 * @access  Public
 */
router.get('/:id', faqController.getFaqById);

/**
 * @route   POST /api/faqs
 * @desc    Create new FAQ
 * @access  Private
 */
router.post('/', faqController.createFaq);

/**
 * @route   PUT /api/faqs/:id
 * @desc    Update FAQ
 * @access  Private
 */
router.put('/:id', faqController.updateFaq);

/**
 * @route   DELETE /api/faqs/:id
 * @desc    Delete FAQ
 * @access  Private
 */
router.delete('/:id', faqController.deleteFaq);

/**
 * @route   PUT /api/faqs/order
 * @desc    Update FAQ order
 * @access  Private
 */
router.put('/order/update', faqController.updateFaqOrder);

/**
 * @route   POST /api/faqs/import
 * @desc    Import FAQs from config file
 * @access  Private
 */
router.post('/import/config', faqController.importFaqsFromConfig);

module.exports = router;