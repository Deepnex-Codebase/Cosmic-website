const mongoose = require('mongoose');

const serviceHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  backgroundType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  backgroundImage: {
    type: String,
    required: function() {
      return this.backgroundType === 'image';
    }
  },
  backgroundVideo: {
    type: String,
    required: function() {
      return this.backgroundType === 'video';
    }
  },
  overlayOpacity: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const ServiceHero = mongoose.model('ServiceHero', serviceHeroSchema);

module.exports = ServiceHero;