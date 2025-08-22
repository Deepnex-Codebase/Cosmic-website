const mongoose = require('mongoose');

const CompanyCultureSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Company Culture' },
    subtitle: { type: String, default: 'Building a Sustainable Future Together' },
    backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80' }
  },
  brandVision: {
    title: { type: String, default: 'Brand Vision & Strategy' },
    subtitle: { type: String, default: 'Our commitment to excellence drives everything we do' },
    description: { type: String, default: 'We are dedicated to creating innovative renewable energy solutions that not only meet today\'s needs but also pave the way for a sustainable future. Our comprehensive approach combines cutting-edge technology with environmental responsibility.' },
    coreValues: [{
      icon: { type: String, default: 'FaLeaf' },
      title: { type: String },
      description: { type: String }
    }],
    buttonText: { type: String, default: 'Join Our Mission' },
    buttonLink: { type: String, default: '/contact' }
  },
  principlesThatGuideUs: {
    title: { type: String, default: 'The Principles That Guide Us' },
    subtitle: { type: String, default: 'Our Core Values' },
    principles: [{
      icon: { type: String, default: 'FaLeaf' },
      title: { type: String },
      description: { type: String }
    }]
  },
  workEnvironment: {
    title: { type: String, default: 'Our Work Environment' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80' },
    content: [{ type: String }]
  },
  sustainabilityManagement: {
    title: { type: String, default: 'SUSTAINABILITY MANAGEMENT' },
    cards: [{
      title: { type: String },
      image: { type: String },
      description: { type: String }
    }]
  },
  sustainabilityCommitment: {
    title: { type: String, default: 'Our Commitment to Sustainability' },
    subtitle: { type: String, default: 'Beyond our products, we\'re committed to sustainable operations in every aspect of our business.' },
    commitments: [{
      title: { type: String },
      description: { type: String }
    }]
  },
  joinTeam: {
    title: { type: String, default: 'Join Our Team' },
    description: { type: String, default: 'We\'re always looking for talented individuals who share our passion for renewable energy and sustainability. Explore our current openings and become part of our mission to create a greener future.' },
    buttonText: { type: String, default: 'View Career Opportunities' },
    buttonLink: { type: String, default: '/careers' }
  },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Use the CMS connection if available, otherwise use the default connection
const CompanyCulture = mongoose.models.CompanyCulture || 
  (mongoose.cmsConnection ? 
    mongoose.cmsConnection.model('CompanyCulture', CompanyCultureSchema) : 
    mongoose.model('CompanyCulture', CompanyCultureSchema));

module.exports = CompanyCulture;