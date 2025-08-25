const mongoose = require('mongoose');

// Use CMS connection instead of default connection
const connection = mongoose.cmsConnection || mongoose.connection;

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Residential', 'Commercial', 'Industrial', 'Utility Scale']
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: String,
    required: true
  },
  completionDate: {
    type: Date,
    required: true
  },
  featuredImage: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  client: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    default: 'Completed'
  },
  features: [{
    type: String
  }],
  specifications: {
    panelType: String,
    inverterType: String,
    mountingSystem: String,
    energyOutput: String,
    co2Reduction: String
  },
  testimonial: {
    clientName: String,
    clientDesignation: String,
    feedback: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seoTitle: String,
  seoDescription: String,
  slug: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
projectSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Index for better search performance
projectSchema.index({ title: 'text', description: 'text', location: 'text' });
projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ isActive: 1 });
projectSchema.index({ isFeatured: 1 });
projectSchema.index({ slug: 1 });

module.exports = connection.model('Project', projectSchema);