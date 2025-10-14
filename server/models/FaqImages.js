const mongoose = require('mongoose');

const faqImagesSchema = new mongoose.Schema({
  leftImage: {
    type: String,
    required: false,
    default: ''
  },
  rightImage: {
    type: String,
    required: false,
    default: ''
  },
  badgeImage: {
    type: String,
    required: false,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('FaqImages', faqImagesSchema);