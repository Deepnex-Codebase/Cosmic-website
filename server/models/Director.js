const mongoose = require('mongoose');

// Use CMS connection instead of default connection
const connection = mongoose.cmsConnection || mongoose.connection;

const directorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Director image is required']
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  vision: {
    type: String,
    required: [true, 'Vision is required']
  },
  socialLinks: [
    {
      platform: {
        type: String,
        required: true,
        enum: ['LinkedIn', 'Twitter', 'Email', 'Facebook', 'Instagram']
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
  order: {
    type: Number,
    default: 0
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
}, {
  timestamps: true
});

module.exports = connection.model('Director', directorSchema);