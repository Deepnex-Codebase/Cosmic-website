const mongoose = require('mongoose');

const pressReleaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Press release title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  excerpt: {
    type: String,
    required: [true, 'Press release excerpt is required'],
    trim: true,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Press release content is required']
  },
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required']
  },
  publishDate: {
    type: Date,
    required: [true, 'Publish date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  },
  author: {
    name: {
      type: String,
      default: 'SS Tech Media Team'
    },
    email: {
      type: String,
      default: 'press@sstech.com'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title before saving
pressReleaseSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

// Virtual for formatted date
pressReleaseSchema.virtual('formattedDate').get(function() {
  if (!this.publishDate) {
    return 'Not published';
  }
  return this.publishDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Index for better performance
pressReleaseSchema.index({ status: 1, publishDate: -1 });
pressReleaseSchema.index({ slug: 1 });
pressReleaseSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('PressRelease', pressReleaseSchema);