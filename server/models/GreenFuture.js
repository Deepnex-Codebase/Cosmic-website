const mongoose = require('mongoose');

// Use CMS connection instead of default connection
const connection = mongoose.cmsConnection || mongoose.connection;

const greenFutureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'ENABLING\nA GREEN FUTURE'
  },
  description: {
    type: String,
    required: true,
    default: 'Creating climate for change through thought leadership and raising awareness towards solar industry, aiding in realization of Aatmanirbhar and energy-rich India.'
  },
  backgroundImage: {
    type: String,
    required: true,
    default: '/solar-panels.jpg'
  },
  buttonText: {
    type: String,
    required: true,
    default: 'LEARN MORE'
  },
  buttonLink: {
    type: String,
    required: true,
    default: '/about'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = connection.model('GreenFuture', greenFutureSchema);