const mongoose = require('mongoose');

const companyIntroSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    required: true,
    default: 'The Cosmic Powertech'
  },
  title: {
    type: String,
    required: true,
    default: 'Leader in the production of High-tech and High-performance solar panels'
  },
  highlightWords: [{
    word: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#cae28e'
    }
  }],
  description: {
    type: String,
    required: true,
    default: 'We are committed to delivering cutting-edge solar solutions that transform how businesses and homes harness energy. Our expertise in high-performance solar technology sets new industry standards for efficiency and reliability.'
  },
  backgroundVideo: {
    type: String,
    default: '/videos/about.mp4'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CompanyIntro', companyIntroSchema);