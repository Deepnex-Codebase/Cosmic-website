const mongoose = require('mongoose');

const projectHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  buttonText: {
    type: String,
    default: 'Explore Now',
    trim: true
  },
  buttonLink: {
    type: String,
    default: '#projects',
    trim: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
    required: true
  },
  media: {
    type: String,
    required: true
  },
  isActive: {
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
});

// Update the updatedAt field before saving
projectHeroSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ProjectHero = mongoose.model('ProjectHero', projectHeroSchema);

module.exports = ProjectHero;