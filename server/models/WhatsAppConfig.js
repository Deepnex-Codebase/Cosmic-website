const mongoose = require('mongoose');

const whatsAppConfigSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  defaultMessage: {
    type: String,
    default: 'Hello, I would like to inquire about your services.'
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  countryCode: {
    type: String,
    default: '91'
  }
}, { timestamps: true });

const WhatsAppConfig = mongoose.model('WhatsAppConfig', whatsAppConfigSchema);

module.exports = WhatsAppConfig;