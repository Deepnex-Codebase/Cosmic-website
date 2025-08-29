const chatService = require('../services/chatService');
const whatsappService = require('../services/whatsappService');
const axios = require('axios');

/**
 * Verify webhook for WhatsApp Cloud API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.verifyWebhook = (req, res) => {
  try {
    // Parse params from the webhook verification request
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log(`🔍 Webhook verification request received:`);
    console.log(`🔍 Mode: ${mode}`);
    console.log(`🔍 Token: ${token}`);
    console.log(`🔍 Challenge: ${challenge}`);
    console.log(`🔍 Expected token: ${process.env.VERIFY_TOKEN}`);

    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        // Respond with 200 OK and challenge token
        console.log('✅ WEBHOOK_VERIFIED - Responding with challenge');
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        console.log('❌ WEBHOOK_VERIFICATION_FAILED - Token mismatch');
        res.sendStatus(403);
      }
    } else {
      // Responds with '400 Bad Request' if verify tokens do not match
      console.log('❌ WEBHOOK_VERIFICATION_FAILED - Missing mode or token');
      res.sendStatus(400);
    }
  } catch (error) {
    console.error('❌ Error in verifyWebhook controller:', error);
    res.sendStatus(500);
  }
};

/**
 * Handle incoming WhatsApp messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.handleMessage = async (req, res) => {
  try {
    // Return a 200 OK response immediately to acknowledge receipt
    res.status(200).send('OK');
    
    // Log the entire request body for debugging
    console.log('📩 WhatsApp webhook payload:', JSON.stringify(req.body, null, 2));
    
    // Check if this is a status update or other non-message event
    if (req.body.object !== 'whatsapp_business_account') {
      console.log('⚠️ Not a WhatsApp business account webhook');
      return;
    }
    
    // Extract the value object which contains the messages
    const value = req.body.entry?.[0]?.changes?.[0]?.value;
    if (!value) {
      console.log('⚠️ No value object found in webhook payload');
      return;
    }
    
    // Check if this is a status update
    if (value.statuses) {
      console.log('ℹ️ Received status update, ignoring');
      return;
    }
    
    // Extract the message
    const message = value.messages?.[0];
    if (!message) {
      console.log('⚠️ No message found in webhook payload');
      return;
    }

    const from = message.from;
    let text = null;
    
    // Handle different message types
    if (message.type === 'text' && message.text) {
      text = message.text.body;
    } else if (message.type === 'interactive' && message.interactive?.button_reply) {
      text = message.interactive.button_reply.title;
    } else if (message.type === 'interactive' && message.interactive?.list_reply) {
      text = message.interactive.list_reply.title;
    } else {
      console.log(`⚠️ Unsupported message type: ${message.type} from ${from}`);
      await sendWhatsAppMessage(from, "I can only process text messages at the moment. Please send a text message.");
      return;
    }
    
    if (!text) {
      console.log(`⚠️ No text content in message from ${from}`);
      return;
    }
    
    console.log(`📱 Received WhatsApp message from ${from}: ${text}`);
    
    // Generate a conversation ID based on the sender's phone number
    const conversationId = `whatsapp_${from}`;
    
    // Process the message using the chat service
    console.log(`🔄 Processing message with conversation ID: ${conversationId}`);
    const response = await chatService.processMessage(text, conversationId);
    console.log(`✅ Got response from chatService: ${response.message}`);
    
    // Send the response back to the user via WhatsApp
    console.log(`📤 Sending response to ${from}`);
    await sendWhatsAppMessage(from, response.message);
    console.log(`📬 Response sent successfully to ${from}`);
  } catch (error) {
    console.error('❌ Error in handleMessage controller:', error);
  }
};

/**
 * Send a message to a WhatsApp user
 * @param {String} to - The recipient's phone number
 * @param {String} message - The message to send
 * @returns {Promise} - The API response
 */
/**
 * Send a message to a WhatsApp user
 * @param {String} to - The recipient's phone number
 * @param {String} message - The message to send
 * @returns {Promise} - The API response
 */
async function sendWhatsAppMessage(to, message) {
  try {
    // Use the WhatsApp service to send the message
    return await whatsappService.sendMessage(to, message);
  } catch (error) {
    console.error('❌ Error in sendWhatsAppMessage controller function:', error.message);
    throw error;
  }
}

/**
 * Send a template message to a WhatsApp user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.sendTemplateMessage = async (req, res) => {
  try {
    const { to, template_name, language_code = 'en', components = [] } = req.body;
    
    // Validate required fields
    if (!to || !template_name) {
      return res.status(400).json({
        success: false,
        message: 'Phone number (to) and template_name are required fields'
      });
    }
    
    console.log(`📤 Sending template message to ${to}`);
    console.log(`📝 Template: ${template_name}, Language: ${language_code}`);
    
    // Send the template message
    const response = await whatsappService.sendTemplateMessage(to, template_name, language_code, components);
    
    return res.status(200).json({
      success: true,
      message: 'Template message sent successfully',
      data: response
    });
  } catch (error) {
    console.error('❌ Error in sendTemplateMessage controller:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error sending template message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server Error'
    });
  }
};

/**
 * Send a template message to multiple WhatsApp users (broadcast)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.sendTemplateBroadcast = async (req, res) => {
  try {
    const { numbers, template_name, language_code = 'en', components = [] } = req.body;
    
    // Validate required fields
    if (!numbers || !Array.isArray(numbers) || numbers.length === 0 || !template_name) {
      return res.status(400).json({
        success: false,
        message: 'Numbers array and template_name are required fields'
      });
    }
    
    console.log(`📤 Sending template broadcast to ${numbers.length} recipients`);
    console.log(`📝 Template: ${template_name}, Language: ${language_code}`);
    
    // Send the template message to each number
    const results = [];
    const errors = [];
    
    for (const number of numbers) {
      try {
        const response = await whatsappService.sendTemplateMessage(
          number.phone || number, 
          template_name, 
          language_code, 
          components
        );
        
        results.push({
          to: number.phone || number,
          name: number.name || 'Unknown',
          status: 'sent',
          response: response
        });
      } catch (error) {
        console.error(`❌ Error sending template to ${number.phone || number}:`, error.message);
        
        errors.push({
          to: number.phone || number,
          name: number.name || 'Unknown',
          status: 'failed',
          error: error.message
        });
      }
    }
    
    return res.status(200).json({
      success: true,
      message: `Template broadcast completed. Sent: ${results.length}, Failed: ${errors.length}`,
      data: {
        sent: results,
        failed: errors,
        total: numbers.length
      }
    });
  } catch (error) {
    console.error('❌ Error in sendTemplateBroadcast controller:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error sending template broadcast',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server Error'
    });
  }
};