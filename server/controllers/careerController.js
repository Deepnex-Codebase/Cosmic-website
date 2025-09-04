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
    
    // Use lean() to get a plain JavaScript object instead of a Mongoose document
    // This ensures we get fresh data from the database
    let career = await Career.findOne().lean();
    
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
      // Complete replacement approach for better reliability
      // This ensures arrays and nested objects are properly updated
      
      // Hero section
      if (updatedData.hero) {
        career.hero = {
          ...career.hero,
          ...updatedData.hero
        };
      }
      
      // Culture section
      if (updatedData.culture) {
        // For arrays, always use complete replacement to avoid partial updates
        if (updatedData.culture.values !== undefined) {
          career.culture.values = [...updatedData.culture.values];
        }
        
        career.culture.title = updatedData.culture.title !== undefined ? 
          updatedData.culture.title : career.culture.title;
        career.culture.subtitle = updatedData.culture.subtitle !== undefined ? 
          updatedData.culture.subtitle : career.culture.subtitle;
      }
      
      // Benefits section
      if (updatedData.benefits) {
        // For arrays, always use complete replacement
        if (updatedData.benefits.categories !== undefined) {
          career.benefits.categories = [...updatedData.benefits.categories];
        }
        
        career.benefits.title = updatedData.benefits.title !== undefined ? 
          updatedData.benefits.title : career.benefits.title;
        career.benefits.subtitle = updatedData.benefits.subtitle !== undefined ? 
          updatedData.benefits.subtitle : career.benefits.subtitle;
      }
      
      // Open Positions section
      if (updatedData.openPositions) {
        // For arrays, always use complete replacement
        if (updatedData.openPositions.departments !== undefined) {
          career.openPositions.departments = [...updatedData.openPositions.departments];
        }
        
        if (updatedData.openPositions.jobs !== undefined) {
          career.openPositions.jobs = [...updatedData.openPositions.jobs];
        }
        
        career.openPositions.title = updatedData.openPositions.title !== undefined ? 
          updatedData.openPositions.title : career.openPositions.title;
        career.openPositions.subtitle = updatedData.openPositions.subtitle !== undefined ? 
          updatedData.openPositions.subtitle : career.openPositions.subtitle;
      }
      
      // CTA section
      if (updatedData.cta) {
        career.cta = {
          ...career.cta,
          ...updatedData.cta
        };
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
    
    // Check if the upload is for CTA section
    const section = req.body.section;
    if (section === 'cta') {
      return res.status(400).json({ message: 'CTA image upload has been disabled' });
    }
    
    // Create the image URL with BASE_URL
    const imageUrl = `${process.env.BASE_URL}/${req.file.path.replace(/\\/g, '/')}`;    
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

// Get all culture values
const getCultureValues = async (req, res) => {
  try {
    const career = await Career.findOne();
    
    if (!career || !career.culture || !career.culture.values) {
      return res.status(404).json({ message: 'Culture values not found' });
    }
    
    res.status(200).json({
      success: true,
      data: career.culture.values
    });
  } catch (error) {
    console.error('Error fetching culture values:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching culture values', 
      error: error.message 
    });
  }
};

// Get culture value by ID
const getCultureValueById = async (req, res) => {
  try {
    const { valueId } = req.params;
    const career = await Career.findOne();
    
    if (!career || !career.culture || !career.culture.values) {
      return res.status(404).json({ message: 'Culture values not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let cultureValue;
    
    try {
      // Try to convert valueId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(valueId);
      cultureValue = career.culture.values.find(value => 
        value._id && value._id.equals(objectId)
      );
    } catch (err) {
      // If valueId is not a valid ObjectId, try string comparison as fallback
      cultureValue = career.culture.values.find(value => 
        value._id && value._id.toString() === valueId
      );
    }
    
    if (!cultureValue) {
      return res.status(404).json({ message: 'Culture value not found' });
    }
    
    res.status(200).json({
      success: true,
      data: cultureValue
    });
  } catch (error) {
    console.error('Error fetching culture value:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching culture value', 
      error: error.message 
    });
  }
};

// Add new culture value
const addCultureValue = async (req, res) => {
  try {
    const newValue = req.body;
    const career = await Career.findOne();
    
    if (!career) {
      return res.status(404).json({ message: 'Career data not found' });
    }
    
    if (!career.culture) {
      career.culture = {
        title: 'Our Culture',
        subtitle: "We're building a team of passionate individuals committed to making clean energy accessible to all",
        values: []
      };
    }
    
    career.culture.values.push(newValue);
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(201).json({
      success: true,
      message: 'Culture value added successfully',
      data: career.culture.values[career.culture.values.length - 1]
    });
  } catch (error) {
    console.error('Error adding culture value:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error adding culture value', 
      error: error.message 
    });
  }
};

// Update culture value
const updateCultureValue = async (req, res) => {
  try {
    const { valueId } = req.params;
    const updatedValue = req.body;
    const career = await Career.findOne();
    
    if (!career || !career.culture || !career.culture.values) {
      return res.status(404).json({ message: 'Culture values not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let valueIndex = -1;
    
    try {
      // Try to convert valueId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(valueId);
      valueIndex = career.culture.values.findIndex(value => 
        value._id && value._id.equals(objectId)
      );
    } catch (err) {
      // If valueId is not a valid ObjectId, try string comparison as fallback
      valueIndex = career.culture.values.findIndex(value => 
        value._id && value._id.toString() === valueId
      );
    }
    
    if (valueIndex === -1) {
      return res.status(404).json({ message: 'Culture value not found' });
    }
    
    career.culture.values[valueIndex] = {
      ...career.culture.values[valueIndex].toObject(),
      ...updatedValue
    };
    
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(200).json({
      success: true,
      message: 'Culture value updated successfully',
      data: career.culture.values[valueIndex]
    });
  } catch (error) {
    console.error('Error updating culture value:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating culture value', 
      error: error.message 
    });
  }
};

// Delete culture value
const deleteCultureValue = async (req, res) => {
  try {
    const { valueId } = req.params;
    const career = await Career.findOne();
    
    if (!career || !career.culture || !career.culture.values) {
      return res.status(404).json({ message: 'Culture values not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let valueIndex = -1;
    
    try {
      // Try to convert valueId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(valueId);
      valueIndex = career.culture.values.findIndex(value => 
        value._id && value._id.equals(objectId)
      );
    } catch (err) {
      // If valueId is not a valid ObjectId, try string comparison as fallback
      valueIndex = career.culture.values.findIndex(value => 
        value._id && value._id.toString() === valueId
      );}
    
    if (valueIndex === -1) {
      return res.status(404).json({ message: 'Culture value not found' });
    }
    
    career.culture.values.splice(valueIndex, 1);
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(200).json({
      success: true,
      message: 'Culture value deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting culture value:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting culture value', 
      error: error.message 
    });
  }
};

// Get all benefit categories
const getBenefitCategories = async (req, res) => {
  try {
    const career = await Career.findOne();
    
    if (!career || !career.benefits || !career.benefits.categories) {
      return res.status(404).json({ message: 'Benefit categories not found' });
    }
    
    res.status(200).json({
      success: true,
      data: career.benefits.categories
    });
  } catch (error) {
    console.error('Error fetching benefit categories:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching benefit categories', 
      error: error.message 
    });
  }
};

// Get benefit category by ID
const getBenefitCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const career = await Career.findOne();
    
    if (!career || !career.benefits || !career.benefits.categories) {
      return res.status(404).json({ message: 'Benefit categories not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let benefitCategory;
    
    try {
      // Try to convert categoryId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(categoryId);
      benefitCategory = career.benefits.categories.find(category => 
        category._id && category._id.equals(objectId)
      );
    } catch (err) {
      // If categoryId is not a valid ObjectId, try string comparison as fallback
      benefitCategory = career.benefits.categories.find(category => 
        category._id && category._id.toString() === categoryId
      );
    }
    
    if (!benefitCategory) {
      return res.status(404).json({ message: 'Benefit category not found' });
    }
    
    res.status(200).json({
      success: true,
      data: benefitCategory
    });
  } catch (error) {
    console.error('Error fetching benefit category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching benefit category', 
      error: error.message 
    });
  }
};

// Add new benefit category
const addBenefitCategory = async (req, res) => {
  try {
    const newCategory = req.body;
    const career = await Career.findOne();
    
    if (!career) {
      return res.status(404).json({ message: 'Career data not found' });
    }
    
    if (!career.benefits) {
      career.benefits = {
        title: 'Benefits & Perks',
        subtitle: 'We value our team members and offer competitive benefits to support your professional and personal growth',
        categories: []
      };
    }
    
    career.benefits.categories.push(newCategory);
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(201).json({
      success: true,
      message: 'Benefit category added successfully',
      data: career.benefits.categories[career.benefits.categories.length - 1]
    });
  } catch (error) {
    console.error('Error adding benefit category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error adding benefit category', 
      error: error.message 
    });
  }
};

// Update benefit category
const updateBenefitCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updatedCategory = req.body;
    const career = await Career.findOne();
    
    if (!career || !career.benefits || !career.benefits.categories) {
      return res.status(404).json({ message: 'Benefit categories not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let categoryIndex = -1;
    
    try {
      // Try to convert categoryId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(categoryId);
      categoryIndex = career.benefits.categories.findIndex(category => 
        category._id && category._id.equals(objectId)
      );
    } catch (err) {
      // If categoryId is not a valid ObjectId, try string comparison as fallback
      categoryIndex = career.benefits.categories.findIndex(category => 
        category._id && category._id.toString() === categoryId
      );
    }
    
    if (categoryIndex === -1) {
      return res.status(404).json({ message: 'Benefit category not found' });
    }
    
    career.benefits.categories[categoryIndex] = {
      ...career.benefits.categories[categoryIndex].toObject(),
      ...updatedCategory
    };
    
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(200).json({
      success: true,
      message: 'Benefit category updated successfully',
      data: career.benefits.categories[categoryIndex]
    });
  } catch (error) {
    console.error('Error updating benefit category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating benefit category', 
      error: error.message 
    });
  }
};

// Delete benefit category
const deleteBenefitCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const career = await Career.findOne();
    
    if (!career || !career.benefits || !career.benefits.categories) {
      return res.status(404).json({ message: 'Benefit categories not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let categoryIndex = -1;
    
    try {
      // Try to convert categoryId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(categoryId);
      categoryIndex = career.benefits.categories.findIndex(category => 
        category._id && category._id.equals(objectId)
      );
    } catch (err) {
      // If categoryId is not a valid ObjectId, try string comparison as fallback
      categoryIndex = career.benefits.categories.findIndex(category => 
        category._id && category._id.toString() === categoryId
      );
    }
    
    if (categoryIndex === -1) {
      return res.status(404).json({ message: 'Benefit category not found' });
    }
    
    career.benefits.categories.splice(categoryIndex, 1);
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(200).json({
      success: true,
      message: 'Benefit category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting benefit category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting benefit category', 
      error: error.message 
    });
  }
};

// Get all job positions
const getJobPositions = async (req, res) => {
  try {
    const career = await Career.findOne();
    
    if (!career || !career.openPositions || !career.openPositions.jobs) {
      return res.status(404).json({ message: 'Job positions not found' });
    }
    
    res.status(200).json({
      success: true,
      data: career.openPositions.jobs
    });
  } catch (error) {
    console.error('Error fetching job positions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching job positions', 
      error: error.message 
    });
  }
};

// Get job position by ID
const getJobPositionById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const career = await Career.findOne();
    
    if (!career || !career.openPositions || !career.openPositions.jobs) {
      return res.status(404).json({ message: 'Job positions not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let jobPosition;
    
    try {
      // Try to convert jobId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(jobId);
      jobPosition = career.openPositions.jobs.find(job => 
        job._id && job._id.equals(objectId)
      );
    } catch (err) {
      // If jobId is not a valid ObjectId, try string comparison as fallback
      jobPosition = career.openPositions.jobs.find(job => 
        job._id && job._id.toString() === jobId
      );
    }
    
    if (!jobPosition) {
      return res.status(404).json({ message: 'Job position not found' });
    }
    
    res.status(200).json({
      success: true,
      data: jobPosition
    });
  } catch (error) {
    console.error('Error fetching job position:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching job position', 
      error: error.message 
    });
  }
};

// Add new job position
const addJobPosition = async (req, res) => {
  try {
    const newJob = req.body;
    const career = await Career.findOne();
    
    if (!career) {
      return res.status(404).json({ message: 'Career data not found' });
    }
    
    if (!career.openPositions) {
      career.openPositions = {
        title: 'Open Positions',
        subtitle: "Join our team and help us revolutionize India's energy landscape",
        departments: [{ id: 'all', name: 'All Departments' }],
        jobs: []
      };
    }
    
    if (!career.openPositions.jobs) {
      career.openPositions.jobs = [];
    }
    
    career.openPositions.jobs.push(newJob);
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(201).json({
      success: true,
      message: 'Job position added successfully',
      data: career.openPositions.jobs[career.openPositions.jobs.length - 1]
    });
  } catch (error) {
    console.error('Error adding job position:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error adding job position', 
      error: error.message 
    });
  }
};

// Update job position
const updateJobPosition = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updatedJob = req.body;
    const career = await Career.findOne();
    
    if (!career || !career.openPositions || !career.openPositions.jobs) {
      return res.status(404).json({ message: 'Job positions not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let jobIndex = -1;
    
    try {
      // Try to convert jobId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(jobId);
      jobIndex = career.openPositions.jobs.findIndex(job => 
        job._id && job._id.equals(objectId)
      );
    } catch (err) {
      // If jobId is not a valid ObjectId, try string comparison as fallback
      jobIndex = career.openPositions.jobs.findIndex(job => 
        job._id && job._id.toString() === jobId
      );
    }
    
    if (jobIndex === -1) {
      return res.status(404).json({ message: 'Job position not found' });
    }
    
    career.openPositions.jobs[jobIndex] = {
      ...career.openPositions.jobs[jobIndex].toObject(),
      ...updatedJob
    };
    
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(200).json({
      success: true,
      message: 'Job position updated successfully',
      data: career.openPositions.jobs[jobIndex]
    });
  } catch (error) {
    console.error('Error updating job position:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating job position', 
      error: error.message 
    });
  }
};

// Delete job position
const deleteJobPosition = async (req, res) => {
  try {
    const { jobId } = req.params;
    const career = await Career.findOne();
    
    if (!career || !career.openPositions || !career.openPositions.jobs) {
      return res.status(404).json({ message: 'Job positions not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let jobIndex = -1;
    
    try {
      // Try to convert jobId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(jobId);
      jobIndex = career.openPositions.jobs.findIndex(job => 
        job._id && job._id.equals(objectId)
      );
    } catch (err) {
      // If jobId is not a valid ObjectId, try string comparison as fallback
      jobIndex = career.openPositions.jobs.findIndex(job => 
        job._id && job._id.toString() === jobId
      );
    }
    
    if (jobIndex === -1) {
      return res.status(404).json({ message: 'Job position not found' });
    }
    
    career.openPositions.jobs.splice(jobIndex, 1);
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(200).json({
      success: true,
      message: 'Job position deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job position:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting job position', 
      error: error.message 
    });
  }
};

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const career = await Career.findOne();
    
    if (!career || !career.openPositions || !career.openPositions.departments) {
      return res.status(404).json({ message: 'Departments not found' });
    }
    
    res.status(200).json({
      success: true,
      data: career.openPositions.departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching departments', 
      error: error.message 
    });
  }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const career = await Career.findOne();
    
    if (!career || !career.openPositions || !career.openPositions.departments) {
      return res.status(404).json({ message: 'Departments not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let department;
    
    try {
      // Try to convert departmentId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(departmentId);
      department = career.openPositions.departments.find(dept => 
        dept._id && dept._id.equals(objectId)
      );
    } catch (err) {
      // If departmentId is not a valid ObjectId, try string comparison as fallback
      department = career.openPositions.departments.find(dept => 
        dept._id && dept._id.toString() === departmentId
      );
    }
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching department', 
      error: error.message 
    });
  }
};

// Add new department
const addDepartment = async (req, res) => {
  try {
    const newDepartment = req.body;
    const career = await Career.findOne();
    
    if (!career) {
      return res.status(404).json({ message: 'Career data not found' });
    }
    
    if (!career.openPositions) {
      career.openPositions = {
        title: 'Open Positions',
        subtitle: "Join our team and help us revolutionize India's energy landscape",
        departments: [],
        jobs: []
      };
    }
    
    if (!career.openPositions.departments) {
      career.openPositions.departments = [];
    }
    
    career.openPositions.departments.push(newDepartment);
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(201).json({
      success: true,
      message: 'Department added successfully',
      data: career.openPositions.departments[career.openPositions.departments.length - 1]
    });
  } catch (error) {
    console.error('Error adding department:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error adding department', 
      error: error.message 
    });
  }
};

// Update department
const updateDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const updatedDepartment = req.body;
    const career = await Career.findOne();
    
    if (!career || !career.openPositions || !career.openPositions.departments) {
      return res.status(404).json({ message: 'Departments not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let departmentIndex = -1;
    
    try {
      // Try to convert departmentId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(departmentId);
      departmentIndex = career.openPositions.departments.findIndex(dept => 
        dept._id && dept._id.equals(objectId)
      );
    } catch (err) {
      // If departmentId is not a valid ObjectId, try string comparison as fallback
      departmentIndex = career.openPositions.departments.findIndex(dept => 
        dept._id && dept._id.toString() === departmentId
      );
    }
    
    if (departmentIndex === -1) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    career.openPositions.departments[departmentIndex] = {
      ...career.openPositions.departments[departmentIndex].toObject(),
      ...updatedDepartment
    };
    
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: career.openPositions.departments[departmentIndex]
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating department', 
      error: error.message 
    });
  }
};

// Delete department
const deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const career = await Career.findOne();
    
    if (!career || !career.openPositions || !career.openPositions.departments) {
      return res.status(404).json({ message: 'Departments not found' });
    }
    
    // Use mongoose's ObjectId for proper comparison
    const mongoose = require('mongoose');
    let departmentIndex = -1;
    
    try {
      // Try to convert departmentId to ObjectId for comparison
      const objectId = new mongoose.Types.ObjectId(departmentId);
      departmentIndex = career.openPositions.departments.findIndex(dept => 
        dept._id && dept._id.equals(objectId)
      );
    } catch (err) {
      // If departmentId is not a valid ObjectId, try string comparison as fallback
      departmentIndex = career.openPositions.departments.findIndex(dept => 
        dept._id && dept._id.toString() === departmentId
      );
    }
    
    if (departmentIndex === -1) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    career.openPositions.departments.splice(departmentIndex, 1);
    career.updatedAt = Date.now();
    await career.save();
    
    res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting department', 
      error: error.message 
    });
  }
};

module.exports = {
  getCareer,
  updateCareer,
  uploadImage,
  upload,
  getCultureValues,
  getCultureValueById,
  addCultureValue,
  updateCultureValue,
  deleteCultureValue,
  getBenefitCategories,
  getBenefitCategoryById,
  addBenefitCategory,
  updateBenefitCategory,
  deleteBenefitCategory,
  getJobPositions,
  getJobPositionById,
  addJobPosition,
  updateJobPosition,
  deleteJobPosition,
  getDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment
};