const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  num: {
    type: String,
    required: true
  },
  railTitle: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  title: [{
    type: String,
    required: true
  }],
  body: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  img: {
    type: String,
    required: function() {
      return this.mediaType === 'image' || this.mediaType === undefined;
    }
  },
  videoSource: {
    type: String,
    required: false
  },
  icon: {
    type: String, // Icon identifier for predefined icons
    required: false
  },
  customSvgIcon: {
    type: String, // Custom SVG string
    required: false
  },
  imageFile: {
    type: String, // Path to uploaded image file
    required: false
  },
  order: {
    type: Number,
    default: 0
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

// Index for ordering
heroSchema.index({ order: 1 });
heroSchema.index({ isActive: 1 });

const connection = mongoose.cmsConnection || mongoose.connection;
module.exports = connection.model('Hero', heroSchema);