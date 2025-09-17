const mongoose = require('mongoose');

const OfferCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an offer card title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Please provide an offer card subtitle'],
    trim: true,
    maxlength: [200, 'Subtitle cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an offer card description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Please provide a discount percentage'],
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100']
  },
  discountCode: {
    type: String,
    required: [true, 'Please provide a discount code'],
    trim: true,
    maxlength: [20, 'Discount code cannot be more than 20 characters']
  },
  validUntil: {
    type: Date,
    required: [true, 'Please provide a valid until date']
  },
  buttonText: {
    type: String,
    default: 'Get Offer',
    trim: true,
    maxlength: [50, 'Button text cannot be more than 50 characters']
  },
  buttonLink: {
    type: String,
    required: [true, 'Please provide a button link'],
    trim: true
  },
  backgroundColor: {
    type: String,
    default: '#cae28e',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
  },
  textColor: {
    type: String,
    default: '#000000',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
  },
  buttonColor: {
    type: String,
    default: '#4CAF50',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
  },
  image: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  showOnBrochures: {
    type: Boolean,
    default: true
  },
  termsAndConditions: {
    type: String,
    required: [true, 'Please provide terms and conditions'],
    trim: true,
    maxlength: [1000, 'Terms and conditions cannot be more than 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
OfferCardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
OfferCardSchema.index({ isActive: 1, showOnBrochures: 1, displayOrder: 1 });

module.exports = mongoose.model('OfferCard', OfferCardSchema);