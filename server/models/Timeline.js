const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  backgroundImage: {
    type: String,
    required: function() {
      return this.mediaType === 'image';
    },
    trim: true
  },
  backgroundVideo: {
    type: String,
    required: function() {
      return this.mediaType === 'video';
    },
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
  }
}, {
  timestamps: true
});

// Index for sorting by order
timelineSchema.index({ order: 1 });

module.exports = mongoose.model('Timeline', timelineSchema);