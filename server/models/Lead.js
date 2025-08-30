const mongoose = require('mongoose');

// Use CMS connection instead of default connection
const connection = mongoose.cmsConnection || mongoose.connection;

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  intent: {
    type: String,
    enum: ['site_survey', 'subsidy_application', 'expert_call', 'general_inquiry'],
    default: 'general_inquiry'
  },
  userType: {
    type: String,
    enum: ['homeowner', 'business_owner', 'society_manager', 'other'],
    default: 'other'
  },
  electricityBill: {
    type: Number,
    min: 0
  },
  rooftopAvailable: {
    type: Boolean
  },
  estimatedSystemSize: {
    type: Number,
    min: 0
  },
  estimatedSavings: {
    type: Number,
    min: 0
  },
  estimatedSubsidy: {
    type: Number,
    min: 0
  },
  conversationId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = connection.model('Lead', leadSchema);