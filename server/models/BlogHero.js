const mongoose = require('mongoose');

const BlogHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Our Blog'
  },
  backgroundImage: {
    type: String,
    required: true,
    default: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/zolar-breadcrumb-bg.jpg'
  },
  backgroundVideo: {
    type: String,
    required: false
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  overlayOpacity: {
    type: Number,
    required: true,
    default: 0.5,
    min: 0,
    max: 1
  },
  height: {
    type: String,
    required: true,
    default: '300px'
  },
  textColor: {
    type: String,
    required: true,
    default: '#FFFFFF'
  },
  accentColor: {
    type: String,
    required: true,
    default: '#cae28e'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BlogHero', BlogHeroSchema);