const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Solar Panels', 'Inverters', 'Batteries', 'Accessories']
  },
  images: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    required: [true, 'Main product image is required']
  },
  hoverImage: {
    type: String
  },
  newPrice: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  oldPrice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  specifications: {
    brand: String,
    model: String,
    warranty: String,
    efficiency: String,
    dimensions: String,
    weight: String,
    cellType: String,
    powerOutput: String,
    operatingTemperature: String,
    type: String,
    capacity: String,
    mpptChannels: String,
    chemistry: String,
    cycles: String,
    depthOfDischarge: String,
    material: String,
    compatibility: String,
    maxWindLoad: String,
    current: String,
    voltage: String,
    maxPVInput: String
  },
  features: [{
    type: String
  }],
  status: [{
    type: String,
    enum: ['Sale', 'New', 'Featured', 'Sold']
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });

// Virtual for formatted price
productSchema.virtual('formattedNewPrice').get(function() {
  return this.newPrice ? `₹${this.newPrice.toLocaleString()}` : '₹0';
});

productSchema.virtual('formattedOldPrice').get(function() {
  return this.oldPrice ? `₹${this.oldPrice.toLocaleString()}` : null;
});

// Calculate discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.oldPrice && this.newPrice && this.oldPrice > this.newPrice) {
    return Math.round(((this.oldPrice - this.newPrice) / this.oldPrice) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);