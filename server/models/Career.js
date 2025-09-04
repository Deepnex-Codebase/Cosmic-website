const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Join Our Team' },
    subtitle: { type: String, default: 'Build a sustainable future with Cosmic Power Tech' },
    backgroundImage: { type: String, default: '/solar-panels.jpg' },
    buttonText: { type: String, default: 'View Open Positions' },
    buttonLink: { type: String, default: '#open-positions' }
  },
  culture: {
    title: { type: String, default: 'Our Culture' },
    subtitle: { type: String, default: "We're building a team of passionate individuals committed to making clean energy accessible to all" },
    values: [{
      icon: { type: String, default: 'FaBolt' }, // Icon name from react-icons
      customSvgIcon: { type: String }, // Custom SVG string if needed
      title: { type: String },
      description: { type: String }
    }]
  },
  benefits: {
    title: { type: String, default: 'Benefits & Perks' },
    subtitle: { type: String, default: 'We value our team members and offer competitive benefits to support your professional and personal growth' },
    categories: [{
      title: { type: String },
      icon: { type: String, default: 'FaCheckCircle' }, // Icon name from react-icons
      items: [{ type: String }]
    }]
  },
  openPositions: {
    title: { type: String, default: 'Open Positions' },
    subtitle: { type: String, default: "Join our team and help us revolutionize India's energy landscape" },
    departments: [{
      id: { type: String },
      name: { type: String }
    }],
    jobs: [{
      title: { type: String },
      department: { type: String },
      location: { type: String },
      type: { type: String },
      experience: { type: String },
      description: { type: String },
      requirements: [{ type: String }]
    }]
  },
  cta: {
    title: { type: String, default: "Don't see the right position?" },
    description: { type: String, default: "Send us your resume and we'll keep you in mind for future opportunities at Cosmic Power Tech" },
    buttonText: { type: String, default: 'Send Your Resume' },
    buttonLink: { type: String, default: 'mailto:careers@cosmicpowertech.com' }
    // backgroundImage field removed
  },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Use the CMS connection if available, otherwise use the default connection
const Career = mongoose.models.Career || 
  (mongoose.cmsConnection ? 
    mongoose.cmsConnection.model('Career', CareerSchema) : 
    mongoose.model('Career', CareerSchema));

module.exports = Career;