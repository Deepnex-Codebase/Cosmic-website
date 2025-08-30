const mongoose = require('mongoose');

const footerLinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  isExternal: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
});

const footerSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  links: [footerLinkSchema],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'whatsapp']
  },
  url: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const contactInfoSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const newsletterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Subscribe to Our Newsletter'
  },
  description: {
    type: String,
    required: true,
    default: 'Stay updated with the latest news, product launches, and exclusive offers.'
  },
  placeholder: {
    type: String,
    default: 'Enter your email'
  },
  buttonText: {
    type: String,
    default: 'Subscribe'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const footerConfigurationSchema = new mongoose.Schema({
  companyInfo: {
    name: {
      type: String,
      required: true,
      default: 'Cosmic Powertech Solutions'
    },
    logo: {
      type: String,
      default: 'logo.png'
    },
    description: {
      type: String,
      required: true,
      default: 'Empowering homes and businesses with sustainable solar solutions. Join us in creating a greener future with clean, renewable energy.'
    },
    copyrightText: {
      type: String,
      default: 'All rights reserved.'
    }
  },
  contactInfo: contactInfoSchema,
  footerSections: [footerSectionSchema],
  socialLinks: [socialLinkSchema],
  newsletter: newsletterSchema,
  backgroundImage: {
    type: String,
    default: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/zolar-footer-bg-layer-1.png'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only one active configuration exists
footerConfigurationSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

// Static method to get active configuration
footerConfigurationSchema.statics.getActiveConfiguration = function() {
  return this.findOne({ isActive: true });
};

module.exports = mongoose.model('FooterConfiguration', footerConfigurationSchema);