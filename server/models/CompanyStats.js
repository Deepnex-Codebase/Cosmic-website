const mongoose = require('mongoose');

const companyStatsSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true,
    enum: ['FaUsers', 'FaProjectDiagram', 'FaSolarPanel', 'FaBolt', 'FaAward', 'FaGlobe', 'FaLeaf', 'FaIndustry']
  },
  color: {
    type: String,
    required: true,
    default: '#9fc22f'
  },
  suffix: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  animationDelay: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add index for ordering
companyStatsSchema.index({ order: 1 });

module.exports = mongoose.model('CompanyStats', companyStatsSchema);