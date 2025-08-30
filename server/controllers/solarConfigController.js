const SolarConfig = require('../models/SolarConfig');
const fs = require('fs');
const path = require('path');

/**
 * Get all solar configurations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllConfigs = async (req, res) => {
  try {
    const configs = await SolarConfig.find({}, { __v: 0 });
    
    return res.status(200).json({
      success: true,
      data: configs
    });
  } catch (error) {
    console.error('Error in getAllConfigs controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching solar configurations',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get specific solar configuration by type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getConfigByType = async (req, res) => {
  try {
    const { configType } = req.params;
    
    if (!configType) {
      return res.status(400).json({
        success: false,
        message: 'Configuration type parameter is required'
      });
    }
    
    const config = await SolarConfig.findOne({ configType }, { __v: 0 });
    
    if (!config) {
      return res.status(404).json({
        success: false,
        message: `Configuration with type '${configType}' not found`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error(`Error in getConfigByType controller for type ${req.params.configType}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching solar configuration',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Update solar configuration by type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateConfig = async (req, res) => {
  try {
    const { configType } = req.params;
    const { data } = req.body;
    
    if (!configType) {
      return res.status(400).json({
        success: false,
        message: 'Configuration type parameter is required'
      });
    }
    
    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Configuration data is required'
      });
    }
    
    // Find and update the configuration
    const updatedConfig = await SolarConfig.findOneAndUpdate(
      { configType },
      { data, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedConfig) {
      return res.status(404).json({
        success: false,
        message: `Configuration with type '${configType}' not found`
      });
    }
    
    // Update the corresponding JSON file
    await SolarConfig.updateJsonFiles(configType, data);
    
    return res.status(200).json({
      success: true,
      message: `Configuration '${configType}' updated successfully`,
      data: updatedConfig
    });
  } catch (error) {
    console.error(`Error in updateConfig controller for type ${req.params.configType}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Error updating solar configuration',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Initialize default configurations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.initializeConfigs = async (req, res) => {
  try {
    await SolarConfig.initializeDefaultConfigs();
    
    return res.status(200).json({
      success: true,
      message: 'Default configurations initialized successfully'
    });
  } catch (error) {
    console.error('Error in initializeConfigs controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error initializing default configurations',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};