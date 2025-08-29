const mongoose = require('mongoose');

const videoHeroSchema = new mongoose.Schema({
  videoSource: {
    type: String,
    required: true,
    default: '/videos/zolar.mp4'
  },
  heights: {
    mobile: {
      type: String,
      default: '300px'
    },
    tablet: {
      type: String,
      default: '400px'
    },
    desktop: {
      type: String,
      default: '500px'
    }
  },
  buttonSettings: {
    backgroundColor: {
      type: String,
      default: '#cae28e'
    },
    mobileSize: {
      width: {
        type: String,
        default: '64px'
      },
      height: {
        type: String,
        default: '64px'
      }
    },
    desktopSize: {
      width: {
        type: String,
        default: '80px'
      },
      height: {
        type: String,
        default: '80px'
      }
    },
    boxShadow: {
      mobile: {
        type: String,
        default: '0 0 20px 5px rgba(202, 226, 142, 0.3)'
      },
      desktop: {
        type: String,
        default: '0 0 30px 10px rgba(202, 226, 142, 0.4)'
      }
    }
  },
  videoSettings: {
    autoPlay: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: true
    },
    muted: {
      type: Boolean,
      default: true
    },
    playsInline: {
      type: Boolean,
      default: true
    }
  },
  interactionSettings: {
    hideButtonDelay: {
      type: Number,
      default: 2000 // milliseconds
    },
    animationSpeed: {
      type: Number,
      default: 0.25
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for active status
videoHeroSchema.index({ isActive: 1 });

module.exports = mongoose.model('VideoHero', videoHeroSchema);