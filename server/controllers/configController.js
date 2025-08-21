const configService = require('../services/configService');
const fs = require('fs');
const path = require('path');

/**
 * Get company profile data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCompanyData = async (req, res) => {
  try {
    const companyData = configService.getCompanyData();
    
    return res.status(200).json({
      success: true,
      data: companyData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching company data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get specific section of company profile data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSection = async (req, res) => {
  try {
    const { section } = req.params;
    
    if (!section) {
      return res.status(400).json({
        success: false,
        message: 'Section parameter is required'
      });
    }
    
    // Special handling for FAQ section to use MongoDB
    if (section === 'faq') {
      try {
        // Import the Faq model
        const Faq = require('../models/Faq');
        
        // Get FAQs from MongoDB
        const faqs = await Faq.find({ isActive: true }).sort({ order: 1 });
        
        // If no FAQs found in MongoDB, fallback to config file
        if (faqs.length === 0) {
          const fallbackFaqs = configService.getSection(section);
          return res.status(200).json({
            success: true,
            data: fallbackFaqs
          });
        }
        
        // Return FAQs from MongoDB
        return res.status(200).json({
          success: true,
          data: faqs.map(faq => ({
            question: faq.question,
            answer: faq.answer,
            title: faq.question,  // Add title field for compatibility
            content: faq.answer,  // Add content field for compatibility
            id: faq._id
          }))
        });
      } catch (mongoError) {
        // Fallback to config file if MongoDB fails
        const fallbackFaqs = configService.getSection(section);
        return res.status(200).json({
          success: true,
          data: fallbackFaqs
        });
      }
    }
    
    // For all other sections, use the config file
    const sectionData = configService.getSection(section);
    
    return res.status(200).json({
      success: true,
      data: sectionData
    });
  } catch (error) {
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error fetching section data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get offerings for a specific customer type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOfferings = async (req, res) => {
  try {
    const { customerType } = req.params;
    
    if (!customerType) {
      return res.status(400).json({
        success: false,
        message: 'Customer type parameter is required'
      });
    }
    
    const offerings = configService.getOfferings(customerType);
    
    return res.status(200).json({
      success: true,
      data: offerings
    });
  } catch (error) {
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error fetching offerings data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get subsidy information for a specific customer type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSubsidyInfo = async (req, res) => {
  try {
    const { customerType } = req.params;
    
    if (!customerType) {
      return res.status(400).json({
        success: false,
        message: 'Customer type parameter is required'
      });
    }
    
    const subsidyInfo = configService.getSubsidyInfo(customerType);
    
    return res.status(200).json({
      success: true,
      data: subsidyInfo
    });
  } catch (error) {
    console.error(`Error in getSubsidyInfo controller for customer type ${req.params.customerType}:`, error);
    
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error fetching subsidy information',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get ROI calculator data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getROICalculatorData = async (req, res) => {
  try {
    const roiData = configService.getROICalculatorData();
    
    return res.status(200).json({
      success: true,
      data: roiData
    });
  } catch (error) {
    console.error('Error in getROICalculatorData controller:', error);
    
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error fetching ROI calculator data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Update specific section of company profile data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    const updatedData = req.body;
    
    if (!section) {
      return res.status(400).json({
        success: false,
        message: 'Section parameter is required'
      });
    }
    
    // Special handling for FAQ section to use MongoDB
    if (section === 'faq') {
      try {
        // Import the Faq model
        const Faq = require('../models/Faq');
        
        // Delete all existing FAQs
        await Faq.deleteMany({});
        
        // Create new FAQs from the updated data
        const faqPromises = updatedData.map((faq, index) => {
          return new Faq({
            question: faq.question,
            answer: faq.answer,
            order: index,
            isActive: true
          }).save();
        });
        
        await Promise.all(faqPromises);
        
        // Also update the config file for backward compatibility
        const companyData = configService.getCompanyData();
        companyData[section] = updatedData;
        const configPath = path.join(__dirname, '../data/solar_company_profile.json');
        fs.writeFileSync(configPath, JSON.stringify(companyData, null, 2), 'utf8');
        configService.companyData = null;
        
        return res.status(200).json({
          success: true,
          message: `FAQ section updated successfully in MongoDB`,
          data: updatedData
        });
      } catch (mongoError) {
        // Fallback to updating only the config file
        const companyData = configService.getCompanyData();
        companyData[section] = updatedData;
        const configPath = path.join(__dirname, '../data/solar_company_profile.json');
        fs.writeFileSync(configPath, JSON.stringify(companyData, null, 2), 'utf8');
        configService.companyData = null;
        
        return res.status(200).json({
          success: true,
          message: `FAQ section updated successfully in config file (MongoDB update failed)`,
          data: updatedData
        });
      }
    }
    
    // For all other sections, use the config file
    const companyData = configService.getCompanyData();
    
    // Update the specific section
    companyData[section] = updatedData;
    
    // Write updated data back to file
    const configPath = path.join(__dirname, '../data/solar_company_profile.json');
    fs.writeFileSync(configPath, JSON.stringify(companyData, null, 2), 'utf8');
    
    // Reset cached data in service
    configService.companyData = null;
    
    return res.status(200).json({
      success: true,
      message: `Section '${section}' updated successfully`,
      data: updatedData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating section data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};