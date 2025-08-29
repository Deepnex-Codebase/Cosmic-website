const Process = require('../models/Process');

// Get all processes
exports.getAllProcesses = async (req, res) => {
  try {
    const { category = 'delivery', isActive } = req.query;
    
    let query = { category };
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const processes = await Process.find(query).sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: processes.length,
      data: processes
    });
  } catch (error) {
    console.error('Error fetching processes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching processes',
      error: error.message
    });
  }
};

// Get single process by ID
exports.getProcessById = async (req, res) => {
  try {
    const { id } = req.params;
    const process = await Process.findById(id);
    
    if (!process) {
      return res.status(404).json({
        success: false,
        message: 'Process not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: process
    });
  } catch (error) {
    console.error('Error fetching process:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching process',
      error: error.message
    });
  }
};

// Create new process
exports.createProcess = async (req, res) => {
  try {
    const { title, description, icon, category = 'delivery', isActive = true } = req.body;
    
    // Get the next order number
    const lastProcess = await Process.findOne({ category }).sort({ order: -1 });
    const order = lastProcess ? lastProcess.order + 1 : 1;
    
    const process = await Process.create({
      title,
      description,
      icon,
      category,
      isActive,
      order
    });
    
    res.status(201).json({
      success: true,
      data: process
    });
  } catch (error) {
    console.error('Error creating process:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating process',
      error: error.message
    });
  }
};

// Update process
exports.updateProcess = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const process = await Process.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!process) {
      return res.status(404).json({
        success: false,
        message: 'Process not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: process
    });
  } catch (error) {
    console.error('Error updating process:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating process',
      error: error.message
    });
  }
};

// Delete process
exports.deleteProcess = async (req, res) => {
  try {
    const { id } = req.params;
    const process = await Process.findByIdAndDelete(id);
    
    if (!process) {
      return res.status(404).json({
        success: false,
        message: 'Process not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Process deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting process:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting process',
      error: error.message
    });
  }
};

// Update process order
exports.updateProcessOrder = async (req, res) => {
  try {
    const { processes } = req.body; // Array of { id, order }
    
    if (!processes || !Array.isArray(processes)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid processes array'
      });
    }
    
    const updatePromises = processes.map(item => 
      Process.findByIdAndUpdate(item.id, { order: item.order })
    );
    
    await Promise.all(updatePromises);
    
    res.status(200).json({
      success: true,
      message: 'Process order updated successfully'
    });
  } catch (error) {
    console.error('Error updating process order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating process order',
      error: error.message
    });
  }
};

// Get delivery processes (specific endpoint for frontend)
exports.getDeliveryProcesses = async (req, res) => {
  try {
    const processes = await Process.find({ 
      category: 'delivery', 
      isActive: true 
    }).sort({ order: 1 });
    
    res.status(200).json({
      success: true,
      count: processes.length,
      data: processes
    });
  } catch (error) {
    console.error('Error fetching delivery processes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery processes',
      error: error.message
    });
  }
};