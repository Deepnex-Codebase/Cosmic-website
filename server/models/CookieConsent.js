const mongoose = require('mongoose');

// Use CMS connection instead of default connection
const connection = mongoose.cmsConnection || mongoose.connection;

// Define the schema for user activity tracking
const userActivitySchema = new mongoose.Schema({
  pagesVisited: [{
    page: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0
    }
  }],
  totalSessionDuration: {
    type: Number, // Total duration in seconds
    default: 0
  },
  lastVisitedPage: {
    type: String,
    trim: true
  }
});

// Define the main cookie consent schema
const cookieConsentSchema = new mongoose.Schema({
  consentChoice: {
    type: String,
    enum: ['accepted', 'declined', 'customized'],
    required: [true, 'Consent choice is required']
  },
  cookieSettings: {
    essential: {
      type: Boolean,
      default: true // Essential cookies are always enabled
    },
    analytics: {
      type: Boolean,
      default: false
    },
    marketing: {
      type: Boolean,
      default: false
    },
    preferences: {
      type: Boolean,
      default: false
    }
  },
  ipAddress: {
    type: String,
    required: [true, 'IP address is required'],
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  userActivity: userActivitySchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

// Add index for efficient querying by IP address
cookieConsentSchema.index({ ipAddress: 1 });

// Add index for efficient querying by creation date
cookieConsentSchema.index({ createdAt: 1 });

module.exports = connection.model('CookieConsent', cookieConsentSchema);