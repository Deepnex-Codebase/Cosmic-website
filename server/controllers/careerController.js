const Career = require('../models/Career');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/careers';
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

// Get career data
const getCareer = async (req, res) => {
  try {
    // Set cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    
    let career = await Career.findOne();
    
    if (!career) {
      // Create default career data if none exists
      career = new Career({
        hero: {
          title: 'Join Our Team',
          subtitle: 'Build a sustainable future with Cosmic Power Tech',
          backgroundImage: '/solar-panels.jpg',
          buttonText: 'View Open Positions',
          buttonLink: '#open-positions'
        },
        culture: {
          title: 'Our Culture',
          subtitle: "We're building a team of passionate individuals committed to making clean energy accessible to all",
          values: [
            {
              icon: 'FaBolt',
              title: 'Innovation',
              description: 'We encourage creative thinking and new ideas to solve energy challenges, pushing the boundaries of what\'s possible in solar technology.'
            },
            {
              icon: 'FaUsers',
              title: 'Collaboration',
              description: 'We work together across teams to achieve our common goals, leveraging diverse perspectives to create comprehensive energy solutions.'
            },
            {
              icon: 'FaCheckCircle',
              title: 'Impact',
              description: 'Every team member contributes to our mission of sustainable energy, making a real difference in India\'s transition to clean power.'
            }
          ]
        },
        benefits: {
          title: 'Benefits & Perks',
          subtitle: 'We value our team members and offer competitive benefits to support your professional and personal growth',
          categories: [
            {
              title: 'Health & Wellness',
              icon: 'FaCheckCircle',
              items: [
                'Comprehensive health insurance',
                'Life insurance coverage',
                'Annual health checkups',
                'Mental wellness programs'
              ]
            },
            {
              title: 'Learning & Growth',
              icon: 'FaGraduationCap',
              items: [
                'Professional development budget',
                'Training programs',
                'Conference attendance',
                'Certification support'
              ]
            },
            {
              title: 'Work-Life Balance',
              icon: 'FaUsers',
              items: [
                'Flexible working hours',
                'Work from home options',
                'Paid time off',
                'Parental leave'
              ]
            },
            {
              title: 'Additional Perks',
              icon: 'FaBriefcase',
              items: [
                'Performance bonuses',
                'Stock options',
                'Team events',
                'Festival celebrations'
              ]
            }
          ]
        },
        openPositions: {
          title: 'Open Positions',
          subtitle: "Join our team and help us revolutionize India's energy landscape",
          departments: [
            { id: 'all', name: 'All Departments' },
            { id: 'engineering', name: 'Engineering' },
            { id: 'sales', name: 'Sales & Marketing' },
            { id: 'operations', name: 'Operations' },
            { id: 'support', name: 'Customer Support' }
          ],
          jobs: [
            {
              title: 'Solar Design Engineer',
              department: 'engineering',
              location: 'Mumbai',
              type: 'Full-time',
              experience: '3-5 years',
              description: 'Design and optimize solar PV systems for residential and commercial projects.',
              requirements: [
                'B.Tech in Electrical/Mechanical Engineering',
                'Experience with solar design software',
                'Knowledge of Indian solar regulations',
                'Strong analytical skills'
              ]
            },
            {
              title: 'Sales Manager',
              department: 'sales',
              location: 'Delhi',
              type: 'Full-time',
              experience: '5-7 years',
              description: 'Lead sales team and develop strategies to increase market penetration.',
              requirements: [
                'MBA in Sales/Marketing',
                'Proven track record in B2B sales',
                'Experience in renewable energy sector',
                'Team management skills'
              ]
            },
            {
              title: 'Project Manager',
              department: 'operations',
              location: 'Bangalore',
              type: 'Full-time',
              experience: '4-6 years',
              description: 'Manage solar installation projects from inception to completion.',
              requirements: [
                'PMP Certification preferred',
                'Experience in solar project management',
                'Strong coordination skills',
                'Knowledge of project management tools'
              ]
            },
            {
              title: 'Technical Support Specialist',
              department: 'support',
              location: 'Hybrid',
              type: 'Full-time',
              experience: '2-4 years',
              description: 'Provide technical support for solar monitoring systems and equipment.',
              requirements: [
                'Technical degree in relevant field',
                'Experience in customer support',
                'Knowledge of solar technology',
                'Good communication skills'
              ]
            }
          ]
        },
        cta: {
          title: "Don't see the right position?",
          description: "Send us your resume and we'll keep you in mind for future opportunities at Cosmic Power Tech",
          buttonText: 'Send Your Resume',
          buttonLink: 'mailto:careers@cosmicpowertech.com',
          backgroundImage: '/solar-panels.jpg'
        }
      });
      
      await career.save();
    }
    
    res.status(200).json(career);
  } catch (error) {
    console.error('Error fetching career data:', error);
    res.status(500).json({ message: 'Error fetching career data', error: error.message });
  }
};

// Update career data
const updateCareer = async (req, res) => {
  try {
    // Set cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    
    const updatedData = req.body;
    let career = await Career.findOne();
    
    if (!career) {
      career = new Career(updatedData);
    } else {
      // Deep merge for nested objects
      if (updatedData.hero) {
        career.hero = updatedData.hero;
      }
      
      if (updatedData.culture) {
        // Handle culture section with special care for values array
        if (updatedData.culture.values) {
          career.culture.values = updatedData.culture.values;
        }
        career.culture.title = updatedData.culture.title || career.culture.title;
        career.culture.subtitle = updatedData.culture.subtitle || career.culture.subtitle;
      }
      
      if (updatedData.benefits) {
        // Handle benefits section with special care for categories array
        if (updatedData.benefits.categories) {
          career.benefits.categories = updatedData.benefits.categories;
        }
        career.benefits.title = updatedData.benefits.title || career.benefits.title;
        career.benefits.subtitle = updatedData.benefits.subtitle || career.benefits.subtitle;
      }
      
      if (updatedData.openPositions) {
        // Handle openPositions section with special care for departments and jobs arrays
        if (updatedData.openPositions.departments) {
          career.openPositions.departments = updatedData.openPositions.departments;
        }
        if (updatedData.openPositions.jobs) {
          career.openPositions.jobs = updatedData.openPositions.jobs;
        }
        career.openPositions.title = updatedData.openPositions.title || career.openPositions.title;
        career.openPositions.subtitle = updatedData.openPositions.subtitle || career.openPositions.subtitle;
      }
      
      if (updatedData.cta) {
        career.cta = updatedData.cta;
      }
    }
    
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(200).json(career);
  } catch (error) {
    console.error('Error updating career data:', error);
    res.status(500).json({ message: 'Error updating career data', error: error.message });
  }
};

// Upload image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

module.exports = {
  getCareer,
  updateCareer,
  uploadImage,
  upload
};