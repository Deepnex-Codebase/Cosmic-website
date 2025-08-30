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
  img: {
    type: String,
    required: true
  },
  icon: {
    type: String, // SVG string or icon identifier
    required: true
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