const WhatsAppConfig = require('../models/WhatsAppConfig');

// Get WhatsApp configuration
exports.getWhatsAppConfig = async (req, res) => {
  try {
    let config = await WhatsAppConfig.findOne();
    
    // If no config exists, create default one
    if (!config) {
      config = await WhatsAppConfig.create({
        phoneNumber: '8488835645',
        defaultMessage: 'Hello, I would like to inquire about your services.',
        isEnabled: true,
        countryCode: '91'
      });
    }
    
    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update WhatsApp configuration
exports.updateWhatsAppConfig = async (req, res) => {
  try {
    const { phoneNumber, defaultMessage, isEnabled, countryCode } = req.body;
    
    let config = await WhatsAppConfig.findOne();
    
    if (!config) {
      config = await WhatsAppConfig.create({
        phoneNumber,
        defaultMessage,
        isEnabled,
        countryCode
      });
    } else {
      config.phoneNumber = phoneNumber || config.phoneNumber;
      config.defaultMessage = defaultMessage || config.defaultMessage;
      config.isEnabled = isEnabled !== undefined ? isEnabled : config.isEnabled;
      config.countryCode = countryCode || config.countryCode;
      
      await config.save();
    }
    
    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};