const mongoose = require('mongoose');

// Navigation Item Schema
const navigationItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  href: {
    type: String,
    required: true,
    trim: true
  },
  target: {
    type: String,
    default: '_self',
    enum: ['_self', '_blank']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  submenu: [{
    label: {
      type: String,
      required: true,
      trim: true
    },
    href: {
      type: String,
      required: true,
      trim: true
    },
    target: {
      type: String,
      default: '_self',
      enum: ['_self', '_blank']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  }]
});

// Main Navbar Configuration Schema
const navbarConfigurationSchema = new mongoose.Schema({
  // Top Bar Configuration
  topBar: {
    isVisible: {
      type: Boolean,
      default: true
    },
    contactInfo: {
      phone: {
        text: {
          type: String,
          default: '+91 9999999999'
        },
        isVisible: {
          type: Boolean,
          default: true
        }
      },
      email: {
        text: {
          type: String,
          default: 'info@cosmicpowertech.com'
        },
        isVisible: {
          type: Boolean,
          default: true
        }
      }
    },
    backgroundColor: {
      type: String,
      default: 'bg-accent-500'
    },
    textColor: {
      type: String,
      default: 'text-white'
    }
  },
  // Logo Configuration
  logo: {
    url: {
      type: String,
      default: '/logo.png'
    },
    alt: {
      type: String,
      default: 'Logo'
    },
    height: {
      type: String,
      default: 'h-8 sm:h-10'
    }
  },
  
  // Navigation Items
  navigationItems: [navigationItemSchema],
  
  // CTA Button Configuration
  ctaButton: {
    text: {
      type: String,
      default: 'Enquire Now'
    },
    href: {
      type: String,
      default: '/contact'
    },
    isVisible: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: 'bg-accent-500'
    },
    textColor: {
      type: String,
      default: 'text-white'
    }
  },
  
  // Mobile Menu Configuration
  mobileMenu: {
    socialLinks: [{
      platform: {
        type: String,
        required: true,
        enum: ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'whatsapp', 'telegram', 'pinterest', 'tiktok', 'snapchat', 'reddit', 'discord', 'github', 'behance', 'dribbble']
      },
      url: {
        type: String,
        required: true
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  },
  
  // Styling Configuration
  styling: {
    backgroundColor: {
      type: String,
      default: 'bg-primary-800'
    },
    textColor: {
      type: String,
      default: 'text-white'
    },
    activeColor: {
      type: String,
      default: 'text-accent-500'
    },
    hoverColor: {
      type: String,
      default: 'text-accent-500'
    }
  },
  
  // General Settings
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  createdBy: {
    type: String,
    default: 'admin'
  },
  
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to update lastModified
navbarConfigurationSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Sort navigation items by order
navbarConfigurationSchema.pre('find', function() {
  this.populate({
    path: 'navigationItems',
    options: { sort: { order: 1 } }
  });
});

navbarConfigurationSchema.pre('findOne', function() {
  this.populate({
    path: 'navigationItems',
    options: { sort: { order: 1 } }
  });
});

const NavbarConfiguration = mongoose.model('NavbarConfiguration', navbarConfigurationSchema);

module.exports = NavbarConfiguration;