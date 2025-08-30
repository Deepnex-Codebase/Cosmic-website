const mongoose = require('mongoose');

// Use CMS connection instead of default connection
const connection = mongoose.cmsConnection || mongoose.connection;

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  bio: {
    type: String,
    required: [true, 'Bio is required']
  },
  image: {
    type: String,
    required: [true, 'Team member image is required']
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

module.exports = connection.model('TeamMember', teamMemberSchema);