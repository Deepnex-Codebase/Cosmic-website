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
      companyImage,
      mediaType,
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
    if (companyImage !== undefined) heroSection.companyImage = companyImage;
    if (mediaType !== undefined) heroSection.mediaType = mediaType;
    if (sectionTitle !== undefined) heroSection.sectionTitle = sectionTitle;
    if (sectionSubtitle !== undefined) heroSection.sectionSubtitle = sectionSubtitle;
    if (ctaText !== undefined) heroSection.ctaText = ctaText;
    if (ctaLink !== undefined) heroSection.ctaLink = ctaLink;

    // Handle file uploads if present
    if (req.files) {
      console.log('Files received:', req.files);
      
      // Handle company video upload
      if (req.files.companyVideo && req.files.companyVideo[0]) {
        console.log('Company video file received:', req.files.companyVideo[0]);
        // Don't delete old file to ensure persistence
        // Just update with new file path
        const videoPath = `/uploads/videos/${req.files.companyVideo[0].filename}`;
        heroSection.companyVideo = videoPath;
        heroSection.mediaType = 'video';
        console.log('Updated company video path:', videoPath);
      }
      
      // Handle company image upload
      if (req.files.companyImage && req.files.companyImage[0]) {
        console.log('Company image file received:', req.files.companyImage[0]);
        // Don't delete old file to ensure persistence
        // Just update with new file path
        const imagePath = `/uploads/images/${req.files.companyImage[0].filename}`;
        heroSection.companyImage = imagePath;
        heroSection.mediaType = 'image';
        console.log('Updated company image path:', imagePath);
      }
      
      // Handle background video upload
      if (req.files.backgroundVideo && req.files.backgroundVideo[0]) {
        console.log('Background video file received:', req.files.backgroundVideo[0]);
        // Don't delete old file to ensure persistence
        // Just update with new file path
        const videoPath = `/uploads/videos/${req.files.backgroundVideo[0].filename}`;
        heroSection.backgroundVideo = videoPath;
        console.log('Updated background video path:', videoPath);
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