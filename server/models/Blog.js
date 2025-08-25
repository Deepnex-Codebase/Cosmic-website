const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    trim: true,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required']
  },
  category: {
    type: String,
    enum: ['news', 'technology', 'sustainability', 'solar', 'renewable', 'general'],
    default: 'general'
  },
  author: {
    name: {
      type: String,
      default: 'Cosmic Solar Team'
    },
    email: {
      type: String,
      default: 'info@cosmicsolar.com'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot be more than 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Virtual for formatted date
blogSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for reading time (assuming 200 words per minute)
blogSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  if (!this.content || typeof this.content !== 'string') return 0;
  const wordCount = this.content.split(' ').filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
});

// Index for better search performance
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ slug: 1 });

module.exports = mongoose.model('Blog', blogSchema);