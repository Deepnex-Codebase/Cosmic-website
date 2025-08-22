const CompanyCulture = require('../models/CompanyCulture');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getFullUrl } = require('../utils/urlHelper');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/company-culture';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Get company culture data
const getCompanyCulture = async (req, res) => {
  try {
    let companyCulture = await CompanyCulture.findOne();
    
    if (!companyCulture) {
      // Create default company culture data if none exists
      companyCulture = new CompanyCulture({
        hero: {
          title: 'Company Culture',
          subtitle: 'Building a Sustainable Future Together',
          backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80'
        },
        brandVision: {
          title: 'Brand Vision & Strategy',
          subtitle: 'Our commitment to excellence drives everything we do',
          description: 'We are dedicated to creating innovative renewable energy solutions that not only meet today\'s needs but also pave the way for a sustainable future.',
          coreValues: [
            {
              icon: 'FaLeaf',
              title: 'Sustainability',
              description: 'We are committed to environmental stewardship and promoting sustainable practices in everything we do.'
            },
            {
              icon: 'FaSolarPanel',
              title: 'Innovation',
              description: 'We continuously seek new technologies and approaches to improve our solar solutions and services.'
            },
            {
              icon: 'FaHandshake',
              title: 'Integrity',
              description: 'We operate with honesty, transparency, and ethical standards in all our business relationships.'
            },
            {
              icon: 'FaLightbulb',
              title: 'Excellence',
              description: 'We strive for the highest quality in our products, services, and customer interactions.'
            }
          ],
          buttonText: 'Join Our Mission',
          buttonLink: '/contact'
        },
        principlesThatGuideUs: {
          title: 'The Principles That Guide Us',
          subtitle: 'Our Core Values',
          principles: [
            {
              icon: 'FaLeaf',
              title: 'Sustainability',
              description: 'We are committed to environmental stewardship and promoting sustainable practices in everything we do.'
            },
            {
              icon: 'FaSolarPanel',
              title: 'Innovation',
              description: 'We continuously seek new technologies and approaches to improve our solar solutions and services.'
            },
            {
              icon: 'FaHandshake',
              title: 'Integrity',
              description: 'We operate with honesty, transparency, and ethical standards in all our business relationships.'
            },
            {
              icon: 'FaLightbulb',
              title: 'Excellence',
              description: 'We strive for the highest quality in our products, services, and customer interactions.'
            }
          ]
        },
        workEnvironment: {
          title: 'Our Work Environment',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
          content: [
            'We foster a collaborative and innovative work environment where every team member is valued and empowered to contribute to our mission.',
            'Our open-door policy encourages communication and idea sharing across all levels of the organization.',
            'We believe in work-life balance and provide flexible working arrangements to support our team\'s well-being.'
          ]
        },
        sustainabilityManagement: {
          title: 'SUSTAINABILITY MANAGEMENT',
          cards: [
            {
              title: 'Environmental',
              image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80',
              description: 'We implement comprehensive environmental management systems to minimize our ecological footprint and promote sustainable practices.'
            },
            {
              title: 'Society',
              image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=400&q=80',
              description: 'Our commitment to social responsibility drives us to create positive impacts in the communities where we operate.'
            },
            {
              title: 'Governance',
              image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
              description: 'We maintain the highest standards of corporate governance, ensuring transparency, accountability, and ethical business practices.'
            }
          ]
        },
        sustainabilityCommitment: {
          title: 'Our Commitment to Sustainability',
          subtitle: 'Beyond our products, we\'re committed to sustainable operations in every aspect of our business.',
          commitments: [
            {
              title: 'Carbon-Neutral Operations',
              description: 'We\'re working towards achieving carbon neutrality in all our operations by 2030.'
            },
            {
              title: 'Waste Reduction',
              description: 'Implementing circular economy principles to minimize waste and maximize resource efficiency.'
            },
            {
              title: 'Community Initiatives',
              description: 'Supporting local communities through education and renewable energy access programs.'
            }
          ]
        },
        joinTeam: {
          title: 'Join Our Team',
          description: 'We\'re always looking for talented individuals who share our passion for renewable energy and sustainability. Explore our current openings and become part of our mission to create a greener future.',
          buttonText: 'View Career Opportunities',
          buttonLink: '/careers'
        }
      });
      
      await companyCulture.save();
    }
    
    res.json({
      success: true,
      data: companyCulture
    });
  } catch (error) {
    console.error('Error fetching company culture:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company culture data',
      error: error.message
    });
  }
};

// Update company culture data
const updateCompanyCulture = async (req, res) => {
  try {
    const updateData = req.body;
    updateData.updatedAt = new Date();
    
    let companyCulture = await CompanyCulture.findOne();
    
    if (!companyCulture) {
      companyCulture = new CompanyCulture(updateData);
    } else {
      Object.assign(companyCulture, updateData);
    }
    
    await companyCulture.save();
    
    res.json({
      success: true,
      message: 'Company culture updated successfully',
      data: companyCulture
    });
  } catch (error) {
    console.error('Error updating company culture:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating company culture data',
      error: error.message
    });
  }
};

// Upload image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const imageUrl = `/uploads/company-culture/${req.file.filename}`;
    const fullUrl = getFullUrl(imageUrl);
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      fullUrl: fullUrl
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
};

module.exports = {
  getCompanyCulture,
  updateCompanyCulture,
  uploadImage,
  upload
};