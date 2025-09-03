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
    required: false
  },
  customSvgIcon: {
    type: String, // Custom SVG string
    required: false
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

// Add validation to ensure only one of icon or customSvgIcon is provided
companyStatsSchema.pre('validate', function(next) {
  if (this.icon && this.customSvgIcon) {
    this.invalidate('icon', 'Only one of icon or customSvgIcon should be provided');
  }
  next();
});

module.exports = mongoose.model('CompanyStats', companyStatsSchema);