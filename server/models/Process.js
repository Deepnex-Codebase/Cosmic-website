const mongoose = require('mongoose');

// Use CMS connection instead of default connection
const connection = mongoose.cmsConnection || mongoose.connection;

const processSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Process title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Process description is required'],
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Process icon is required'],
    trim: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['delivery', 'installation', 'maintenance', 'consultation'],
    default: 'delivery'
  }
}, {
  timestamps: true
});

// Index for better query performance
processSchema.index({ order: 1, isActive: 1 });
processSchema.index({ category: 1, isActive: 1 });

module.exports = connection.model('Process', processSchema);