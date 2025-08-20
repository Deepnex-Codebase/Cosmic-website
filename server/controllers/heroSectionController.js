const HeroSection = require('../models/HeroSection');

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