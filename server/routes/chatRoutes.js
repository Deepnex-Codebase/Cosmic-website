const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

/**
 * @route   POST /api/chat/message
 * @desc    Process a chat message and return a response
 * @access  Public
 */
router.post('/message', chatController.processMessage);

/**
 * @route   POST /api/chat/roi
 * @desc    Calculate ROI based on user inputs
 * @access  Public
 */
router.post('/roi', chatController.calculateROI);

/**
 * @route   GET /api/chat/history/:conversationId
 * @desc    Get conversation history for a specific conversation ID
 * @access  Public
 */
router.get('/history/:conversationId', chatController.getConversationHistory);

/**
 * @route   DELETE /api/chat/history/:conversationId
 * @desc    Clear conversation history for a specific conversation ID
 * @access  Public
 */
router.delete('/history/:conversationId', chatController.clearConversation);

module.exports = router;