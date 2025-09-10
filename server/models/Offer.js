const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an offer title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Please provide an offer subtitle'],
    trim: true,
    maxlength: [200, 'Subtitle cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an offer description'],
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
  expiryDays: {
    type: Number,
    required: [true, 'Please provide expiry days'],
    min: [1, 'Expiry days must be at least 1']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  backgroundColor: {
    type: String,
    default: '#cae28e' // Default background color
  },
  buttonColor: {
    type: String,
    default: '#4CAF50' // Default button color
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

// Update the updatedAt field before saving
OfferSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Offer', OfferSchema);