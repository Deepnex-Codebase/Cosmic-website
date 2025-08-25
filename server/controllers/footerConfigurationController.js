const FooterConfiguration = require('../models/FooterConfiguration');

// Get active footer configuration
const getFooterConfiguration = async (req, res) => {
  try {
    let footerConfig = await FooterConfiguration.getActiveConfiguration();
    
    // If no configuration exists, create a default one
    if (!footerConfig) {
      footerConfig = new FooterConfiguration({
        companyInfo: {
          name: 'Cosmic Powertech Solutions',
          logo: 'logo.png',
          description: 'Empowering homes and businesses with sustainable solar solutions. Join us in creating a greener future with clean, renewable energy.',
          copyrightText: 'All rights reserved.'
        },
        contactInfo: {
          address: '123 Solar Street, Green City, 12345',
          phone: '+1 (555) 123-4567',
          email: 'info@cosmicsolar.com'
        },
        footerSections: [
          {
            title: 'Products',
            order: 1,
            links: [
              { name: 'Solar Panels', path: '/products#panels', order: 1 },
              { name: 'Inverters & Batteries', path: '/products#inverters', order: 2 },
              { name: 'Accessories', path: '/products#accessories', order: 3 }
            ]
          },
          {
            title: 'Solutions',
            order: 2,
            links: [
              { name: 'Residential', path: '/solutions#residential', order: 1 },
              { name: 'Commercial', path: '/solutions#commercial', order: 2 },
              { name: 'Solar Calculator', path: '/calculator', order: 3 }
            ]
          },
          {
            title: 'Company',
            order: 3,
            links: [
              { name: 'About Us', path: '/about', order: 1 },
              { name: 'Customer Stories', path: '/customer-stories', order: 2 },
              { name: 'Partner With Us', path: '/partner', order: 3 },
              { name: 'Contact Us', path: '/contact', order: 4 }
            ]
          },
          {
            title: 'Resources',
            order: 4,
            links: [
              { name: 'Blog', path: '/resources#blog', order: 1 },
              { name: 'Photo Gallery', path: '/resources#gallery', order: 2 },
              { name: 'Newsletter', path: '/resources#newsletter', order: 3 }
            ]
          }
        ],
        socialLinks: [
          { platform: 'facebook', url: '#', order: 1 },
          { platform: 'twitter', url: '#', order: 2 },
          { platform: 'linkedin', url: '#', order: 3 },
          { platform: 'instagram', url: '#', order: 4 }
        ],
        newsletter: {
          title: 'Subscribe to Our Newsletter',
          description: 'Stay updated with the latest news, product launches, and exclusive offers from Cosmic Solar.',
          placeholder: 'Enter your email',
          buttonText: 'Subscribe'
        }
      });
      await footerConfig.save();
    }
    
    res.json(footerConfig);
  } catch (error) {
    console.error('Error fetching footer configuration:', error);
    res.status(500).json({ message: 'Error fetching footer configuration', error: error.message });
  }
};

// Update footer configuration
const updateFooterConfiguration = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const footerConfig = await FooterConfiguration.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!footerConfig) {
      return res.status(404).json({ message: 'Footer configuration not found' });
    }
    
    res.json(footerConfig);
  } catch (error) {
    console.error('Error updating footer configuration:', error);
    res.status(500).json({ message: 'Error updating footer configuration', error: error.message });
  }
};

// Add footer section
const addFooterSection = async (req, res) => {
  try {
    const { id } = req.params;
    const sectionData = req.body;
    
    const footerConfig = await FooterConfiguration.findById(id);
    if (!footerConfig) {
      return res.status(404).json({ message: 'Footer configuration not found' });
    }
    
    footerConfig.footerSections.push(sectionData);
    await footerConfig.save();
    
    res.json(footerConfig);
  } catch (error) {
    console.error('Error adding footer section:', error);
    res.status(500).json({ message: 'Error adding footer section', error: error.message });
  }
};

// Update footer section
const updateFooterSection = async (req, res) => {
  try {
    const { id, sectionId } = req.params;
    const sectionData = req.body;
    
    const footerConfig = await FooterConfiguration.findById(id);
    if (!footerConfig) {
      return res.status(404).json({ message: 'Footer configuration not found' });
    }
    
    const section = footerConfig.footerSections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Footer section not found' });
    }
    
    Object.assign(section, sectionData);
    await footerConfig.save();
    
    res.json(footerConfig);
  } catch (error) {
    console.error('Error updating footer section:', error);
    res.status(500).json({ message: 'Error updating footer section', error: error.message });
  }
};

// Delete footer section
const deleteFooterSection = async (req, res) => {
  try {
    const { id, sectionId } = req.params;
    
    const footerConfig = await FooterConfiguration.findById(id);
    if (!footerConfig) {
      return res.status(404).json({ message: 'Footer configuration not found' });
    }
    
    footerConfig.footerSections.pull(sectionId);
    await footerConfig.save();
    
    res.json(footerConfig);
  } catch (error) {
    console.error('Error deleting footer section:', error);
    res.status(500).json({ message: 'Error deleting footer section', error: error.message });
  }
};

// Add link to footer section
const addLinkToSection = async (req, res) => {
  try {
    const { id, sectionId } = req.params;
    const linkData = req.body;
    
    const footerConfig = await FooterConfiguration.findById(id);
    if (!footerConfig) {
      return res.status(404).json({ message: 'Footer configuration not found' });
    }
    
    const section = footerConfig.footerSections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Footer section not found' });
    }
    
    section.links.push(linkData);
    await footerConfig.save();
    
    res.json(footerConfig);
  } catch (error) {
    console.error('Error adding link to section:', error);
    res.status(500).json({ message: 'Error adding link to section', error: error.message });
  }
};

// Update link in footer section
const updateLinkInSection = async (req, res) => {
  try {
    const { id, sectionId, linkId } = req.params;
    const linkData = req.body;
    
    const footerConfig = await FooterConfiguration.findById(id);
    if (!footerConfig) {
      return res.status(404).json({ message: 'Footer configuration not found' });
    }
    
    const section = footerConfig.footerSections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Footer section not found' });
    }
    
    const link = section.links.id(linkId);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    Object.assign(link, linkData);
    await footerConfig.save();
    
    res.json(footerConfig);
  } catch (error) {
    console.error('Error updating link in section:', error);
    res.status(500).json({ message: 'Error updating link in section', error: error.message });
  }
};

// Delete link from footer section
const deleteLinkFromSection = async (req, res) => {
  try {
    const { id, sectionId, linkId } = req.params;
    
    const footerConfig = await FooterConfiguration.findById(id);
    if (!footerConfig) {
      return res.status(404).json({ message: 'Footer configuration not found' });
    }
    
    const section = footerConfig.footerSections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Footer section not found' });
    }
    
    section.links.pull(linkId);
    await footerConfig.save();
    
    res.json(footerConfig);
  } catch (error) {
    console.error('Error deleting link from section:', error);
    res.status(500).json({ message: 'Error deleting link from section', error: error.message });
  }
};

// Add social link
const addSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const socialData = req.body;
    
    const footerConfig = await FooterConfiguration.findById(id);
    if (!footerConfig) {
      return res.status(404).json({ message: 'Footer configuration not found' });
    }
    
    footerConfig.socialLinks.push(socialData);
    await footerConfig.save();
    
    res.json(footerConfig);
  } catch (error) {
    console.error('Error adding social link:', error);
    res.status(500).json({ message: 'Error adding social link', error: error.message });
  }
};

// Update social link
const updateSocialLink = async (req, res) => {
  try {
    const { id, socialId } = req.params;
    const socialData = req.body;
    
    const footerConfig = await FooterConfiguration.findById(id);
    if (!footerConfig) {
      return res.status(404).json({ message: 'Footer configuration not found' });
    }
    
    const socialLink = footerConfig.socialLinks.id(socialId);
    if (!socialLink) {
      return res.status(404).json({ message: 'Social link not found' });
    }
    
    Object.assign(socialLink, socialData);
    await footerConfig.save();
    
    res.json(footerConfig);
  } catch (error) {
    console.error('Error updating social link:', error);
    res.status(500).json({ message: 'Error updating social link', error: error.message });
  }
};

// Delete social link
const deleteSocialLink = async (req, res) => {
  try {
    const { id, socialId } = req.params;
    
    const footerConfig = await FooterConfiguration.findById(id);
    if (!footerConfig) {
      return res.status(404).json({ message: 'Footer configuration not found' });
    }
    
    footerConfig.socialLinks.pull(socialId);
    await footerConfig.save();
    
    res.json(footerConfig);
  } catch (error) {
    console.error('Error deleting social link:', error);
    res.status(500).json({ message: 'Error deleting social link', error: error.message });
  }
};

module.exports = {
  getFooterConfiguration,
  updateFooterConfiguration,
  addFooterSection,
  updateFooterSection,
  deleteFooterSection,
  addLinkToSection,
  updateLinkInSection,
  deleteLinkFromSection,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink
};