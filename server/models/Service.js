const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String
  },
  features: [{
    type: String,
    required: true
  }],
  icon: {
    type: String, // Icon name or class
    required: true
  },
  image: {
    type: String, // Image URL or path
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['core', 'specialized', 'process'],
    default: 'core'
  },
  color: {
    type: String,
    default: 'from-accent-400 to-accent-600'
  },
  bgColor: {
    type: String,
    default: 'bg-accent-50'
  },
  hoverColor: {
    type: String,
    default: 'group-hover:text-accent-500'
  },
  order: {
    type: Number,
    default: 0
  },
  stepNumber: {
    type: Number, // For process steps
    required: function() {
      return this.category === 'process';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  seo: {
    title: {
      type: String
    },
    description: {
      type: String
    },
    keywords: {
      type: String
    }
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

// Index for better query performance
ServiceSchema.index({ category: 1, order: 1 });
ServiceSchema.index({ isActive: 1 });
ServiceSchema.index({ featured: 1 });

// Pre-save middleware to update the updatedAt field
ServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Use CMS connection if available, otherwise use default connection
const Service = mongoose.models.Service || 
  (mongoose.cmsConnection ? 
    mongoose.cmsConnection.model('Service', ServiceSchema) : 
    mongoose.model('Service', ServiceSchema));

module.exports = Service;