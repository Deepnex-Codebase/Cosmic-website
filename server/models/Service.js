const mongoose = require('mongoose');

/**
 * Service Schema
 * Defines the structure for service documents in MongoDB
 */
const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  longDescription: {
    type: String,
    maxlength: [5000, 'Long description cannot be more than 5000 characters']
  },
  features: [{
    type: String,
    trim: true,
    maxlength: [200, 'Feature cannot be more than 200 characters']
  }],
  icon: {
    type: String, // Icon name or class
    trim: true,
    default: ''
  },
  image: {
    type: String, // URL to image
    validate: {
      validator: function(v) {
        // Skip validation if empty
        if (!v) return true;
        return /^(https?:\/\/|\/).*/.test(v);
      },
      message: props => `${props.value} is not a valid URL format!`
    },
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: {
      values: ['core', 'specialized', 'process'],
      message: '{VALUE} is not a valid category'
    },
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
    },
    validate: {
      validator: function(v) {
        return this.category !== 'process' || (v && v > 0);
      },
      message: 'Step number is required for process services and must be positive'
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
      type: String,
      trim: true,
      maxlength: [70, 'SEO title cannot be more than 70 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [160, 'SEO description cannot be more than 160 characters']
    },
    keywords: {
      type: String,
      trim: true,
      maxlength: [200, 'SEO keywords cannot be more than 200 characters']
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

// Indexes for better query performance
ServiceSchema.index({ category: 1, order: 1 });
ServiceSchema.index({ isActive: 1 });
ServiceSchema.index({ featured: 1 });
ServiceSchema.index({ title: 'text', description: 'text' }); // Text index for search

// Pre-save middleware to update the updatedAt field
ServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for service URL
ServiceSchema.virtual('url').get(function() {
  return `/services/${this._id}`;
});

// Use CMS connection if available, otherwise use default connection
const Service = mongoose.models.Service || 
  (mongoose.cmsConnection ? 
    mongoose.cmsConnection.model('Service', ServiceSchema) : 
    mongoose.model('Service', ServiceSchema));

module.exports = Service;