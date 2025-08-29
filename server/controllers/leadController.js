const leadService = require('../services/leadService');

/**
 * Create a new lead
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createLead = async (req, res) => {
  try {
    const leadData = req.body;
    
    // Validate required fields
    if (!leadData.name || !leadData.phone || !leadData.city) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and city are required fields'
      });
    }
    
    const lead = await leadService.createLead(leadData);
    
    return res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Error in createLead controller:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error creating lead',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get all leads
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLeads = async (req, res) => {
  try {
    const leads = await leadService.getLeads();
    
    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Error in getLeads controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching leads',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get a lead by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lead = await leadService.getLeadById(id);
    
    return res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error(`Error in getLeadById controller for ID ${req.params.id}:`, error);
    
    if (error.message === 'Lead not found') {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error fetching lead',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Update a lead by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const lead = await leadService.updateLead(id, updateData);
    
    return res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error(`Error in updateLead controller for ID ${req.params.id}:`, error);
    
    if (error.message === 'Lead not found') {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error updating lead',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Delete a lead by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    
    await leadService.deleteLead(id);
    
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(`Error in deleteLead controller for ID ${req.params.id}:`, error);
    
    if (error.message === 'Lead not found') {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error deleting lead',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get lead statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLeadStats = async (req, res) => {
  try {
    const stats = await leadService.getLeadStats();
    
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getLeadStats controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching lead statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};