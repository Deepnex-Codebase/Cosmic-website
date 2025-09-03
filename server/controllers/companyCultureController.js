const CompanyCulture = require('../models/CompanyCulture');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    fileSize: 40 * 1024 * 1024 // 40MB limit
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
              customSvgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
              title: 'Sustainability',
              description: 'We are committed to environmental stewardship and promoting sustainable practices in everything we do.'
            },
            {
              icon: 'FaSolarPanel',
              customSvgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8zM11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm11-4.19V1.5H9v4.81C7.21 7.35 6 9.28 6 11.5c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.22-1.21-4.15-3-5.19zm5 4.19v2h3v-2h-3zm-2.76 7.66l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4z"/></svg>',
              title: 'Innovation',
              description: 'We continuously seek new technologies and approaches to improve our solar solutions and services.'
            },
            {
              icon: 'FaHandshake',
              customSvgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 5c-1.54 0-3.04.99-3.56 2.36h-1.87C10.54 5.99 9.04 5 7.5 5 5.5 5 4 6.5 4 8.5c0 2.89 3.14 5.74 7.9 10.05l.1.1.1-.1C16.86 14.24 20 11.39 20 8.5c0-2-1.5-3.5-3.5-3.5z"/></svg>',
              title: 'Integrity',
              description: 'We operate with honesty, transparency, and ethical standards in all our business relationships.'
            },
            {
              icon: 'FaLightbulb',
              customSvgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>',
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
    
    const imageUrl = `${process.env.BASE_URL}/uploads/company-culture/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl
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