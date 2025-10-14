const FaqImages = require('../models/FaqImages');
const fs = require('fs');
const path = require('path');

// Get FAQ images
exports.getFaqImages = async (req, res) => {
  try {
    const faqImages = await FaqImages.findOne();
    res.status(200).json(faqImages || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update FAQ images
exports.updateFaqImages = async (req, res) => {
  try {
    console.log('Files received:', req.files);
    
    // Find existing FAQ images or create new one
    let faqImages = await FaqImages.findOne();
    if (!faqImages) {
      faqImages = new FaqImages({
        leftImage: '',
        rightImage: '',
        badgeImage: ''
      });
    }
    
    // Update left image if provided
    if (req.files && req.files.leftImage) {
      // Delete old image if it exists
      if (faqImages.leftImage) {
        const oldPath = path.join(__dirname, '..', faqImages.leftImage);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.error('Error deleting old left image:', err);
          }
        }
      }
      faqImages.leftImage = `/uploads/faq/${req.files.leftImage[0].filename}`;
    }
    
    // Update right image if provided
    if (req.files && req.files.rightImage) {
      // Delete old image if it exists
      if (faqImages.rightImage) {
        const oldPath = path.join(__dirname, '..', faqImages.rightImage);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.error('Error deleting old right image:', err);
          }
        }
      }
      faqImages.rightImage = `/uploads/faq/${req.files.rightImage[0].filename}`;
    }
    
    // Update badge image if provided
    if (req.files && req.files.badgeImage) {
      // Delete old image if it exists
      if (faqImages.badgeImage) {
        const oldPath = path.join(__dirname, '..', faqImages.badgeImage);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.error('Error deleting old badge image:', err);
          }
        }
      }
      faqImages.badgeImage = `/uploads/faq/${req.files.badgeImage[0].filename}`;
    }
    
    await faqImages.save();
    res.status(200).json(faqImages);
  } catch (error) {
    console.error('Error in updateFaqImages:', error);
    res.status(500).json({ message: error.message });
  }
};