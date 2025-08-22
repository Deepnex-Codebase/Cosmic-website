const axios = require('axios');
const fs = require('fs');
const path = require('path');

class WhatsAppService {
  constructor() {
    console.log('🔄 Initializing WhatsAppService...');
    this.phoneNumberId = process.env.PHONE_NUMBER_ID;
    this.accessToken = process.env.META_ACCESS_TOKEN;
    this.baseUrl = `https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`;
    console.log(`🔄 WhatsApp API URL configured as: ${this.baseUrl}`);
    console.log(`🔄 Using Phone Number ID: ${this.phoneNumberId}`);
    console.log(`🔄 Access Token available: ${this.accessToken ? 'Yes' : 'No'}`);
    this.tokenStatus = {
      isValid: true,
      lastChecked: Date.now()
    };
    console.log('✅ WhatsAppService initialized successfully');
  }

  /**
   * Get the current access token
   * @returns {String} - The current access token
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Update the access token
   * @param {String} newToken - The new access token
   */
  updateAccessToken(newToken) {
    if (!newToken) {
      throw new Error('New token cannot be empty');
    }

    this.accessToken = newToken;
    this.tokenStatus.isValid = true;
    this.tokenStatus.lastChecked = Date.now();

    // Optionally update the .env file with the new token
    this._updateEnvFile('META_ACCESS_TOKEN', newToken);

    console.log('✅ WhatsApp access token updated successfully');
  }

  /**
   * Mark the current token as invalid
   */
  invalidateToken() {
    this.tokenStatus.isValid = false;
    console.log('⚠️ WhatsApp access token marked as invalid');
  }

  /**
   * Check if the token is valid
   * @returns {Boolean} - Whether the token is valid
   */
  isTokenValid() {
    return this.tokenStatus.isValid;
  }

  /**
   * Send a message to a WhatsApp user
   * @param {String} to - The recipient's phone number
   * @param {String} message - The message to send
   * @returns {Promise} - The API response
   */
  async sendMessage(to, message) {
    try {
      console.log(`🔄 Preparing WhatsApp API request to ${to}`);
      console.log(`📝 Message content: ${message}`);
      console.log(`🔍 DEBUG: Current phoneNumberId: ${this.phoneNumberId}`);
      console.log(`🔍 DEBUG: Current accessToken length: ${this.accessToken ? this.accessToken.length : 'undefined'}`);
      
      // Ensure the phone number is in the correct format (international format without '+' prefix)
      let formattedNumber = to;
      if (to.startsWith('+')) {
        formattedNumber = to.substring(1);
        console.log(`ℹ️ Removed '+' prefix from phone number: ${formattedNumber}`);
      }
      
      // Check if the number is in the correct format (should be numbers only)
      if (!/^\d+$/.test(formattedNumber)) {
        console.error(`❌ Invalid phone number format: ${formattedNumber}. Must contain only digits.`);
        throw new Error(`Invalid phone number format: ${formattedNumber}. Must contain only digits.`);
      }
      
      // Regenerate the URL to ensure it's using the latest phoneNumberId
      const url = `https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`;
      console.log(`🌐 WhatsApp API URL: ${url}`);
      
      const payload = {
        messaging_product: "whatsapp",
        to: formattedNumber,
        type: "text",
        text: { body: message },
      };
      
      console.log(`📦 Request payload: ${JSON.stringify(payload)}`);
      
      const headers = {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      };
      console.log(`🔍 DEBUG: Authorization header starts with: Bearer ${this.accessToken.substring(0, 10)}...`);
      
      console.log('📤 Sending request to WhatsApp API...');
      try {
        console.log(`🔍 DEBUG: Making axios.post call to URL: ${url}`);
        console.log(`🔍 DEBUG: With headers: ${JSON.stringify(headers)}`);
        console.log(`🔍 DEBUG: With payload: ${JSON.stringify(payload)}`);
        
        const response = await axios.post(url, payload, { headers });
        
        console.log(`✅ WhatsApp API response status: ${response.status}`);
        console.log(`✅ WhatsApp API response data: ${JSON.stringify(response.data)}`);
        console.log(`✅ WhatsApp message sent successfully to ${formattedNumber}`);
        
        return response.data;
      } catch (apiError) {
        // Check if the error is due to an expired token
        if (apiError.response && apiError.response.status === 401) {
          console.error('❌ Authentication error: Meta access token has expired');
          console.error('⚠️ Please generate a new access token from the Meta Developer Portal');
          console.error('📝 Instructions: Go to https://developers.facebook.com/apps/ > Your App > WhatsApp > API Setup > Permanent token');
          
          // Mark the token as invalid
          this.invalidateToken();
          
          // Update the .env file with a comment about the expired token
          await this.updateEnvFileWithTokenComment();
          
          throw new Error('Meta access token has expired. Please update the META_ACCESS_TOKEN in your .env file.');
        }
        
        // For other API errors
        throw apiError;
      }
    } catch (error) {
      console.error('❌ Error sending WhatsApp message:');
      if (error.response) {
        console.error(`❌ Status: ${error.response.status}`);
        console.error(`❌ Response data: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error(`❌ Error message: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Update the .env file with a new value
   * @param {String} key - The key to update
   * @param {String} value - The new value
   * @private
   */
  _updateEnvFile(key, value) {
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      
      if (!fs.existsSync(envPath)) {
        console.error(`❌ .env file not found at ${envPath}`);
        return;
      }
      
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Replace the existing key-value pair or add a new one
      const regex = new RegExp(`^${key}=.*$`, 'm');
      
      if (regex.test(envContent)) {
        // Replace existing value
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        // Add new key-value pair
        envContent += `\n${key}=${value}`;
      }
      
      fs.writeFileSync(envPath, envContent, 'utf8');
      console.log(`✅ Updated ${key} in .env file`);
    } catch (error) {
      console.error(`❌ Error updating .env file: ${error.message}`);
    }
  }
  
  /**
   * Update the .env file with a comment about the expired token
   * @returns {Promise<void>}
   */
  async updateEnvFileWithTokenComment() {
    try {
      console.log('🔄 Updating .env file with token expiry comment...');
      const envPath = path.resolve(process.cwd(), '.env');
      
      if (!fs.existsSync(envPath)) {
        console.error(`❌ .env file not found at ${envPath}`);
        return;
      }
      
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Check if the comment already exists
      const commentRegex = /# META_ACCESS_TOKEN has expired/;
      if (commentRegex.test(envContent)) {
        console.log('ℹ️ Token expiry comment already exists in .env file');
        return;
      }
      
      // Add the comment before the META_ACCESS_TOKEN line
      const tokenRegex = /(META_ACCESS_TOKEN=.*)/;
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 3); // Tokens typically expire after 3 months
      
      const comment = `# META_ACCESS_TOKEN has expired on ${expiryDate.toLocaleDateString()}. Please generate a new token from Meta Developer Portal.\n# Visit: https://developers.facebook.com/apps/ > Your App > WhatsApp > API Setup > Permanent token`;
      
      if (tokenRegex.test(envContent)) {
        envContent = envContent.replace(tokenRegex, `${comment}\n$1`);
        fs.writeFileSync(envPath, envContent, 'utf8');
        console.log('✅ Added token expiry comment to .env file');
      } else {
        console.error('❌ META_ACCESS_TOKEN line not found in .env file');
      }
    } catch (error) {
      console.error(`❌ Error updating .env file with token comment: ${error.message}`);
    }
  }

  /**
   * Send a template message to a WhatsApp user
   * @param {String} to - The recipient's phone number
   * @param {String} templateName - The name of the template to send
   * @param {String} languageCode - The language code for the template (default: 'en')
   * @param {Array} components - Optional components for template variables
   * @returns {Promise} - The API response
   */
  async sendTemplateMessage(to, templateName, languageCode = 'en', components = []) {
    try {
      console.log(`🔄 Preparing WhatsApp template message to ${to}`);
      console.log(`📝 Template: ${templateName}, Language: ${languageCode}`);
      
      // Ensure the phone number is in the correct format (international format without '+' prefix)
      let formattedNumber = to;
      if (to.startsWith('+')) {
        formattedNumber = to.substring(1);
        console.log(`ℹ️ Removed '+' prefix from phone number: ${formattedNumber}`);
      }
      
      // Check if the number is in the correct format (should be numbers only)
      if (!/^\d+$/.test(formattedNumber)) {
        console.error(`❌ Invalid phone number format: ${formattedNumber}. Must contain only digits.`);
        throw new Error(`Invalid phone number format: ${formattedNumber}. Must contain only digits.`);
      }
      
      // Regenerate the URL to ensure it's using the latest phoneNumberId
      const url = `https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`;
      console.log(`🌐 WhatsApp API URL: ${url}`);
      
      const payload = {
        messaging_product: "whatsapp",
        to: formattedNumber,
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode }
        }
      };

      // Add components if provided
      if (components && components.length > 0) {
        payload.template.components = components;
      }
      
      console.log(`📦 Request payload: ${JSON.stringify(payload)}`);
      
      const headers = {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      };
      
      console.log('📤 Sending template message to WhatsApp API...');
      try {
        const response = await axios.post(url, payload, { headers });
        
        console.log(`✅ WhatsApp API response status: ${response.status}`);
        console.log(`✅ WhatsApp API response data: ${JSON.stringify(response.data)}`);
        console.log(`✅ WhatsApp template message sent successfully to ${formattedNumber}`);
        
        return response.data;
      } catch (apiError) {
        // Check if the error is due to an expired token
        if (apiError.response && apiError.response.status === 401) {
          console.error('❌ Authentication error: Meta access token has expired');
          this.invalidateToken();
          throw new Error('Meta access token has expired. Please update the META_ACCESS_TOKEN in your .env file.');
        }
        
        // For template-specific errors
        if (apiError.response && apiError.response.data && apiError.response.data.error) {
          console.error(`❌ Template error: ${apiError.response.data.error.message}`);
          throw new Error(`Template error: ${apiError.response.data.error.message}`);
        }
        
        // For other API errors
        throw apiError;
      }
    } catch (error) {
      console.error('❌ Error sending WhatsApp template message:');
      if (error.response) {
        console.error(`❌ Status: ${error.response.status}`);
        console.error(`❌ Response data: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error(`❌ Error message: ${error.message}`);
      }
      throw error;
    }
  }
}

module.exports = new WhatsAppService();