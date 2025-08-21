const Faq = require('../models/Faq');
const configService = require('../services/configService');

/**
 * Get all FAQs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ isActive: true }).sort({ order: 1 });
    
    return res.status(200).json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error('Error in getAllFaqs controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching FAQs',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get FAQ by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const faq = await Faq.findById(id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: faq
    });
  } catch (error) {
    console.error('Error in getFaqById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Create new FAQ
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createFaq = async (req, res) => {
  try {
    const { question, answer, order, isActive } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required'
      });
    }
    
    const faq = new Faq({
      question,
      answer,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await faq.save();
    
    return res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq
    });
  } catch (error) {
    console.error('Error in createFaq controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Update FAQ
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, order, isActive } = req.body;
    
    const faq = await Faq.findById(id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (order !== undefined) faq.order = order;
    if (isActive !== undefined) faq.isActive = isActive;
    
    await faq.save();
    
    return res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Delete FAQ
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    
    const faq = await Faq.findById(id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    await Faq.findByIdAndDelete(id);
    
    return res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Update FAQ order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateFaqOrder = async (req, res) => {
  try {
    const { faqs } = req.body; // Array of { id, order }
    
    if (!Array.isArray(faqs)) {
      return res.status(400).json({
        success: false,
        message: 'faqs must be an array'
      });
    }
    
    const updatePromises = faqs.map(item => 
      Faq.findByIdAndUpdate(item.id, { order: item.order })
    );
    
    await Promise.all(updatePromises);
    
    return res.status(200).json({
      success: true,
      message: 'FAQ order updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating FAQ order',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Import FAQs from config file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.importFaqsFromConfig = async (req, res) => {
  try {
    // Get FAQs from config file
    const configFaqs = configService.getSection('faq');
    
    if (!Array.isArray(configFaqs)) {
      return res.status(400).json({
        success: false,
        message: 'Config FAQs must be an array'
      });
    }
    
    // Import each FAQ
    let importedCount = 0;
    for (let i = 0; i < configFaqs.length; i++) {
      const { question, answer } = configFaqs[i];
      
      // Check if FAQ already exists
      const existingFaq = await Faq.findOne({ question });
      
      if (!existingFaq) {
        // Create new FAQ
        const faq = new Faq({
          question,
          answer,
          order: i,
          isActive: true
        });
        
        await faq.save();
        importedCount++;
      }
    }
    
    return res.status(200).json({
      success: true,
      message: `${importedCount} FAQs imported successfully`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error importing FAQs from config',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};