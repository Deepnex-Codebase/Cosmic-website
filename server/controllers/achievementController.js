const Achievement = require('../models/Achievement');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/achievements';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'achievement-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get achievement page data (similar to about page)
exports.getAchievementPage = async (req, res) => {
  try {
    let achievementData = await Achievement.findOne({ status: 'published' });
    
    // If no data exists, create default data
    if (!achievementData) {
      achievementData = new Achievement({
        hero: {
          title: 'Achievements & Awards',
          subtitle: '',
          backgroundImage: '/quality1.jpg'
        },
        awardWinningSolutions: {
          title: 'Our Award-Winning Solar Solutions',
          description: 'We take pride in our accomplishments and the recognition we\'ve received for our dedication to excellence in the solar energy industry.',
          achievements: [
            {
              title: "Excellence in Solar Innovation",
              year: "2024",
              organization: "Renewable Energy Association",
              description: "Recognized for pioneering advancements in solar panel efficiency and design.",
              image: "/quality-assurance.jpg",
              order: 1
            },
            {
              title: "Green Business of the Year",
              year: "2023",
              organization: "Chamber of Commerce",
              description: "Awarded for outstanding commitment to sustainable business practices and environmental stewardship.",
              image: "/installation.jpg",
              order: 2
            },
            {
              title: "Best Customer Service",
              year: "2023",
              organization: "Consumer Choice Awards",
              description: "Recognized for exceptional customer service and satisfaction in the renewable energy sector.",
              image: "/site-assessment.jpg",
              order: 3
            },
            {
              title: "Top Solar Installer",
              year: "2022",
              organization: "Solar Energy Industries Association",
              description: "Ranked among the top solar installation companies nationwide for quality and volume of installations.",
              image: "/solar-panels.jpg",
              order: 4
            },
            {
              title: "Innovation in Renewable Energy",
              year: "2021",
              organization: "Tech & Energy Summit",
              description: "Honored for innovative approaches to integrating solar technology with smart home systems.",
              image: "/quality.jpg",
              order: 5
            }
          ]
        },
        certifications: {
          title: 'Our Certifications',
          description: 'We maintain the highest standards of quality and safety through these industry-recognized certifications.',
          certificates: [
            {
              name: "ISO 9001:2015",
              description: "Quality Management System",
              icon: "shield",
              order: 1
            },
            {
              name: "ISO 14001:2015",
              description: "Environmental Management System",
              icon: "shield",
              order: 2
            },
            {
              name: "OHSAS 18001",
              description: "Occupational Health and Safety",
              icon: "shield",
              order: 3
            },
            {
              name: "Solar Energy Certification",
              description: "Industry Standard Compliance",
              icon: "shield",
              order: 4
            }
          ]
        },
        industryRecognition: {
          title: 'Industry Recognition',
          description: 'Our commitment to excellence has been recognized by leading organizations in the renewable energy sector.',
          partners: [
            {
              name: "Bharat Petroleum",
              logo: "/bharatpetrlium1.jpg",
              order: 1
            },
            {
              name: "KIA",
              logo: "/kia.png",
              order: 2
            },
            {
              name: "Company Logo",
              logo: "/logo.png",
              order: 3
            },
            {
              name: "Mahavir",
              logo: "/mahavir.webp",
              order: 4
            },
            {
              name: "Partner Logo",
              logo: "/logo.png",
              order: 5
            }
          ]
        },
        callToAction: {
          title: 'Join Our Award-Winning Team',
          description: 'Experience the difference of working with an industry leader in solar energy solutions.',
          primaryButtonText: 'Contact Us Today',
          primaryButtonLink: '/contact',
          secondaryButtonText: 'Explore Our Services',
          secondaryButtonLink: '/services'
        },
        status: 'published'
      });
      
      await achievementData.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Achievement page updated successfully',
      data: achievementData
    });
  } catch (error) {
    console.error('Error fetching achievement page:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement page',
      error: error.message
    });
  }
};

// Update achievement page data
exports.updateAchievementPage = async (req, res) => {
  try {
    let achievementData = await Achievement.findOne({ status: 'published' });
    
    if (!achievementData) {
      achievementData = new Achievement(req.body);
    } else {
      Object.assign(achievementData, req.body);
    }
    
    await achievementData.save();
    
    res.status(200).json({
      success: true,
      data: achievementData
    });
  } catch (error) {
    console.error('Error updating achievement page:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating achievement page',
      error: error.message
    });
  }
};

// Add new achievement to awardWinningSolutions
exports.addAchievement = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const achievementData = await Achievement.findOne({ status: 'published' });
    
    if (!achievementData) {
      return res.status(404).json({
        success: false,
        message: 'Achievement page not found'
      });
    }
    
    const newAchievement = {
      title: req.body.title,
      year: req.body.year,
      organization: req.body.organization,
      description: req.body.description,
      image: req.file ? `/uploads/achievements/${req.file.filename}` : req.body.image,
      order: req.body.order || achievementData.awardWinningSolutions.achievements.length + 1
    };
    
    console.log('New achievement object:', newAchievement);
    
    achievementData.awardWinningSolutions.achievements.push(newAchievement);
    await achievementData.save();
    
    res.status(201).json({
      success: true,
      message: 'Achievement added successfully',
      data: newAchievement
    });
  } catch (error) {
    console.error('Error adding achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding achievement',
      error: error.message
    });
  }
};

// Update specific achievement
exports.updateAchievement = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const achievementData = await Achievement.findOne({ status: 'published' });
    
    if (!achievementData) {
      return res.status(404).json({
        success: false,
        message: 'Achievement page not found'
      });
    }
    
    const achievement = achievementData.awardWinningSolutions.achievements.id(achievementId);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    // Update achievement fields
    achievement.title = req.body.title || achievement.title;
    achievement.year = req.body.year || achievement.year;
    achievement.organization = req.body.organization || achievement.organization;
    achievement.description = req.body.description || achievement.description;
    achievement.order = req.body.order || achievement.order;
    
    if (req.file) {
      achievement.image = `/uploads/achievements/${req.file.filename}`;
    } else if (req.body.image) {
      achievement.image = req.body.image;
    }
    
    await achievementData.save();
    
    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating achievement',
      error: error.message
    });
  }
};

// Delete achievement
exports.deleteAchievement = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const achievementData = await Achievement.findOne({ status: 'published' });
    
    if (!achievementData) {
      return res.status(404).json({
        success: false,
        message: 'Achievement page not found'
      });
    }
    
    // Find the achievement to ensure it exists
    const achievement = achievementData.awardWinningSolutions.achievements.id(achievementId);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    // Remove the achievement using pull method
    achievementData.awardWinningSolutions.achievements.pull(achievementId);
    await achievementData.save();
    
    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting achievement',
      error: error.message
    });
  }
};

// Add certificate
exports.addCertificate = async (req, res) => {
  try {
    const achievementData = await Achievement.findOne({ status: 'published' });
    
    if (!achievementData) {
      return res.status(404).json({
        success: false,
        message: 'Achievement page not found'
      });
    }
    
    const newCertificate = {
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon || 'shield',
      order: req.body.order || achievementData.certifications.certificates.length + 1
    };
    
    achievementData.certifications.certificates.push(newCertificate);
    await achievementData.save();
    
    res.status(201).json({
      success: true,
      message: 'Certificate added successfully',
      data: newCertificate
    });
  } catch (error) {
    console.error('Error adding certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding certificate',
      error: error.message
    });
  }
};

// Update certificate
exports.updateCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const achievementData = await Achievement.findOne({ status: 'published' });
    
    if (!achievementData) {
      return res.status(404).json({
        success: false,
        message: 'Achievement page not found'
      });
    }
    
    const certificate = achievementData.certifications.certificates.id(certificateId);
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    
    // Update certificate fields
    certificate.name = req.body.name || certificate.name;
    certificate.description = req.body.description || certificate.description;
    certificate.icon = req.body.icon || certificate.icon;
    certificate.order = req.body.order || certificate.order;
    
    await achievementData.save();
    
    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: certificate
    });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating certificate',
      error: error.message
    });
  }
};

// Delete certificate
exports.deleteCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const achievementData = await Achievement.findOne({ status: 'published' });
    
    if (!achievementData) {
      return res.status(404).json({
        success: false,
        message: 'Achievement page not found'
      });
    }
    
    // Find the certificate to ensure it exists
    const certificate = achievementData.certifications.certificates.id(certificateId);
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    
    // Remove the certificate using pull method
    achievementData.certifications.certificates.pull(certificateId);
    await achievementData.save();
    
    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting certificate',
      error: error.message
    });
  }
};

// Add partner
exports.addPartner = async (req, res) => {
  try {
    const achievementData = await Achievement.findOne({ status: 'published' });
    
    if (!achievementData) {
      return res.status(404).json({
        success: false,
        message: 'Achievement page not found'
      });
    }
    
    const newPartner = {
      name: req.body.name,
      logo: req.file ? `/uploads/achievements/${req.file.filename}` : req.body.logo,
      order: req.body.order || achievementData.industryRecognition.partners.length + 1
    };
    
    achievementData.industryRecognition.partners.push(newPartner);
    await achievementData.save();
    
    res.status(201).json({
      success: true,
      message: 'Partner added successfully',
      data: newPartner
    });
  } catch (error) {
    console.error('Error adding partner:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding partner',
      error: error.message
    });
  }
};

// Delete partner
exports.deletePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const achievementData = await Achievement.findOne({ status: 'published' });
    
    if (!achievementData) {
      return res.status(404).json({
        success: false,
        message: 'Achievement page not found'
      });
    }
    
    // Find the partner to ensure it exists
    const partner = achievementData.industryRecognition.partners.id(partnerId);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    // Remove the partner using pull method
    achievementData.industryRecognition.partners.pull(partnerId);
    await achievementData.save();
    
    res.status(200).json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting partner',
      error: error.message
    });
  }
};

// Get achievement statistics
exports.getAchievementStats = async (req, res) => {
  try {
    const achievementData = await Achievement.findOne({ status: 'published' });
    
    if (!achievementData) {
      return res.status(200).json({
        success: true,
        data: {
          totalAchievements: 0,
          totalCertifications: 0,
          totalPartners: 0,
          lastUpdated: null
        }
      });
    }
    
    const stats = {
      totalAchievements: achievementData.awardWinningSolutions.achievements.length,
      totalCertifications: achievementData.certifications.certificates.length,
      totalPartners: achievementData.industryRecognition.partners.length,
      lastUpdated: achievementData.updatedAt
    };
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching achievement stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement stats',
      error: error.message
    });
  }
};

// Export multer upload middleware
exports.upload = upload;