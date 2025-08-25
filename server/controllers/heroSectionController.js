const HeroSection = require('../models/HeroSection');
const fs = require('fs');
const path = require('path');

// Get hero section data
const getHeroSection = async (req, res) => {
  try {
    let heroSection = await HeroSection.findOne({ isActive: true });
    
    // If no hero section exists, create default one
    if (!heroSection) {
      heroSection = new HeroSection({});
      await heroSection.save();
    }
    
    res.json(heroSection);
  } catch (error) {
    console.error('Error fetching hero section:', error);
    res.status(500).json({ message: 'Error fetching hero section', error: error.message });
  }
};

// Update hero section
const updateHeroSection = async (req, res) => {
  try {
    const {
      title,
      description,
      backgroundVideo,
      companyVideo,
      sectionTitle,
      sectionSubtitle,
      ctaText,
      ctaLink
    } = req.body;

    let heroSection = await HeroSection.findOne({ isActive: true });
    
    if (!heroSection) {
      heroSection = new HeroSection({});
    }

    // Update fields
    if (title !== undefined) heroSection.title = title;
    if (description !== undefined) heroSection.description = description;
    if (backgroundVideo !== undefined) heroSection.backgroundVideo = backgroundVideo;
    if (companyVideo !== undefined) heroSection.companyVideo = companyVideo;
    if (sectionTitle !== undefined) heroSection.sectionTitle = sectionTitle;
    if (sectionSubtitle !== undefined) heroSection.sectionSubtitle = sectionSubtitle;
    if (ctaText !== undefined) heroSection.ctaText = ctaText;
    if (ctaLink !== undefined) heroSection.ctaLink = ctaLink;

    // Handle file uploads if present
    if (req.files) {
      // Handle company video upload
      if (req.files.companyVideo && req.files.companyVideo[0]) {
        // Delete old file if it exists and is not a default video
        if (heroSection.companyVideo && !heroSection.companyVideo.startsWith('/') && fs.existsSync(path.join(__dirname, '../', heroSection.companyVideo))) {
          fs.unlinkSync(path.join(__dirname, '../', heroSection.companyVideo));
        }
        
        // Update with new file path
        heroSection.companyVideo = `/uploads/videos/${req.files.companyVideo[0].filename}`;
      }
      
      // Handle background video upload
      if (req.files.backgroundVideo && req.files.backgroundVideo[0]) {
        // Delete old file if it exists and is not a default video
        if (heroSection.backgroundVideo && !heroSection.backgroundVideo.startsWith('/') && fs.existsSync(path.join(__dirname, '../', heroSection.backgroundVideo))) {
          fs.unlinkSync(path.join(__dirname, '../', heroSection.backgroundVideo));
        }
        
        // Update with new file path
        heroSection.backgroundVideo = `/uploads/videos/${req.files.backgroundVideo[0].filename}`;
      }
    }

    await heroSection.save();
    
    res.json({ message: 'Hero section updated successfully', heroSection });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({ message: 'Error updating hero section', error: error.message });
  }
};

// Reset to default
const resetHeroSection = async (req, res) => {
  try {
    await HeroSection.deleteMany({});
    const defaultHeroSection = new HeroSection({});
    await defaultHeroSection.save();
    
    res.json({ message: 'Hero section reset to default', heroSection: defaultHeroSection });
  } catch (error) {
    console.error('Error resetting hero section:', error);
    res.status(500).json({ message: 'Error resetting hero section', error: error.message });
  }
};

module.exports = {
  getHeroSection,
  updateHeroSection,
  resetHeroSection
};