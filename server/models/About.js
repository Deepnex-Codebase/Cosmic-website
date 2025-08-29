const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'About' },
    subtitle: { type: String, default: '' },
    videoUrl: { type: String, default: '/aboutvideo.mp4' }
  },
  aboutUs: {
    title: { type: String, default: 'About Us :' },
    content: [{ type: String }]
  },
  whoWeAre: {
    title: { type: String, default: 'Who we are ?' },
    content: { type: String }
  },
  expertise: {
    title: { type: String, default: 'Our Expertise' },
    description: { type: String },
    items: [{
      title: { type: String },
      image: { type: String }
    }]
  },
  visionMissionValues: {
    title: { type: String, default: 'Our Core Principles' },
    description: { type: String, default: 'The foundation of our approach to sustainable energy solutions.' },
    vision: {
      title: { type: String, default: 'Vision' },
      content: [{ type: String }]
    },
    mission: {
      title: { type: String, default: 'Mission' },
      content: [{ type: String }]
    },
    values: {
      title: { type: String, default: 'Values' },
      content: [{ type: String }]
    }
  },
  clientTestimonials: {
    title: { type: String, default: 'What Our Clients Say' },
    subtitle: { type: String, default: 'Client Testimonials' },
    testimonials: [{
      id: { type: Number },
      name: { type: String },
      role: { type: String },
      image: { type: String },
      quote: { type: String },
      rating: { type: Number, min: 1, max: 5, default: 5 }
    }]
  },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Use the CMS connection if available, otherwise use the default connection
const About = mongoose.models.About || 
  (mongoose.cmsConnection ? 
    mongoose.cmsConnection.model('About', AboutSchema) : 
    mongoose.model('About', AboutSchema));

module.exports = About;