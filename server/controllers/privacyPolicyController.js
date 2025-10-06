const PrivacyPolicy = require('../models/PrivacyPolicy');

// Get privacy policy
exports.getPrivacyPolicy = async (req, res) => {
  try {
    // Find the most recent privacy policy or create a default one if none exists
    let privacyPolicy = await PrivacyPolicy.findOne().sort({ createdAt: -1 });
    
    if (!privacyPolicy) {
      privacyPolicy = await PrivacyPolicy.create({});
    }
    
    res.status(200).json({
      success: true,
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching privacy policy',
      error: error.message
    });
  }
};

// Update privacy policy
exports.updatePrivacyPolicy = async (req, res) => {
  try {
    const updates = req.body;
    
    // Update the lastUpdated field
    updates.lastUpdated = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    // Find the most recent privacy policy
    let privacyPolicy = await PrivacyPolicy.findOne().sort({ createdAt: -1 });
    
    if (!privacyPolicy) {
      // If no policy exists, create a new one
      privacyPolicy = await PrivacyPolicy.create(updates);
    } else {
      // Update the existing policy
      privacyPolicy = await PrivacyPolicy.findByIdAndUpdate(
        privacyPolicy._id,
        updates,
        { new: true, runValidators: true }
      );
    }
    
    res.status(200).json({
      success: true,
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error updating privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating privacy policy',
      error: error.message
    });
  }
};

// Create new privacy policy version
exports.createPrivacyPolicy = async (req, res) => {
  try {
    const policyData = req.body;
    
    // Set the lastUpdated field
    policyData.lastUpdated = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const privacyPolicy = await PrivacyPolicy.create(policyData);
    
    res.status(201).json({
      success: true,
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error creating privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating privacy policy',
      error: error.message
    });
  }
};

// Delete privacy policy
exports.deletePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    
    const privacyPolicy = await PrivacyPolicy.findByIdAndDelete(id);
    
    if (!privacyPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy policy not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Privacy policy deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting privacy policy',
      error: error.message
    });
  }
};