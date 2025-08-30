const mongoose = require('mongoose');

const panIndiaPresenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Pan India Presence'
  },
  description: {
    type: String,
    required: true,
    default: 'Our growing network spans across India, providing reliable solar solutions to homes and businesses nationwide.'
  },
  mapImage: {
    type: String,
    required: true,
    default: '/mapindea.png'
  },
  stats: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    borderColor: {
      type: String,
      required: true,
      default: '#003e63'
    },
    order: {
      type: Number,
      default: 0
    }
  }],
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

// Indexes
panIndiaPresenceSchema.index({ isActive: 1 });
panIndiaPresenceSchema.index({ 'stats.order': 1 });

module.exports = mongoose.model('PanIndiaPresence', panIndiaPresenceSchema);