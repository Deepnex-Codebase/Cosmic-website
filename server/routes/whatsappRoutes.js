const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');

console.log('🔄 Initializing WhatsApp webhook routes');

/**
 * @route   GET /webhook/whatsapp
 * @desc    Verify webhook for WhatsApp Cloud API
 * @access  Public
 */
router.get('/', (req, res) => {
  console.log('📥 Received WhatsApp webhook verification request');
  whatsappController.verifyWebhook(req, res);
});

/**
 * @route   POST /webhook/whatsapp
 * @desc    Handle incoming WhatsApp messages
 * @access  Public
 */
router.post('/', (req, res) => {
  console.log('📥 Received WhatsApp message webhook');
  whatsappController.handleMessage(req, res);
});

/**
 * @route   POST /webhook/whatsapp/send-template
 * @desc    Send a template message to a single WhatsApp user
 * @access  Public
 */
router.post('/send-template', (req, res) => {
  console.log('📥 Received request to send WhatsApp template message');
  whatsappController.sendTemplateMessage(req, res);
});

/**
 * @route   POST /webhook/whatsapp/send-broadcast
 * @desc    Send a template message to multiple WhatsApp users
 * @access  Public
 */
router.post('/send-broadcast', (req, res) => {
  console.log('📥 Received request to send WhatsApp template broadcast');
  whatsappController.sendTemplateBroadcast(req, res);
});

console.log('✅ WhatsApp webhook routes registered');

module.exports = router;