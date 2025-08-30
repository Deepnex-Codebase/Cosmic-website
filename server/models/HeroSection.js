const mongoose = require('mongoose');

const heroSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'At Cosmic Powertech'
  },
  description: {
    type: String,
    required: true,
    default: 'At Cosmic Powertech, we don\'t just install solar — we empower the future. Driven by a mission to accelerate the world\'s transition to clean energy, we specialize in delivering smart, sustainable, and cost-efficient solar solutions across residential, commercial, and industrial sectors. Our expertise blends cutting-edge technology with proven performance, making us a trusted partner in the journey toward a zero-carbon tomorrow. From rooftop systems to large-scale projects, every solution we offer is designed to maximize savings, reduce emissions, and support long-term sustainability.sustainable future.'
  },
  backgroundVideo: {
    type: String,
    default: '/videos/solar-installation.mp4'
  },
  companyVideo: {
    type: String,
    default: '/enn.mp4'
  },
  sectionTitle: {
    type: String,
    default: 'About Cosmic Powertech'
  },
  sectionSubtitle: {
    type: String,
    default: 'Happy Clients'
  },
  ctaText: {
    type: String,
    default: 'Learn More About Us'
  },
  ctaLink: {
    type: String,
    default: '/about'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HeroSection', heroSectionSchema);