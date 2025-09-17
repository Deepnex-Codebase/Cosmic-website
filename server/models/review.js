const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service reference is required']
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better performance
reviewSchema.index({ product: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Update service rating when review is saved
reviewSchema.post('save', async function() {
  if (this.isApproved) {
    await this.constructor.updateServiceRating(this.product);
  }
});

// Update service rating when review is removed
reviewSchema.post('remove', async function() {
  await this.constructor.updateServiceRating(this.product);
});

// Static method to update service rating
reviewSchema.statics.updateServiceRating = async function(serviceId) {
  const Service = mongoose.model('Service');
  
  const stats = await this.aggregate([
    {
      $match: {
        product: serviceId,
        isApproved: true
      }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Service.findByIdAndUpdate(serviceId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
      rating: Math.round(stats[0].averageRating * 10) / 10
    });
  } else {
    await Service.findByIdAndUpdate(serviceId, {
      averageRating: 0,
      reviewCount: 0,
      rating: 0
    });
  }
};

module.exports = mongoose.model('Review', reviewSchema);