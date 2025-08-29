const Lead = require('../models/Lead');

class LeadService {
  /**
   * Create a new lead in the database
   * @param {Object} leadData - The lead data to be stored
   * @returns {Promise} - The created lead object
   */
  async createLead(leadData) {
    try {
      const lead = new Lead(leadData);
      await lead.validate();
      return await lead.save();
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  /**
   * Get all leads from the database
   * @param {Object} filter - Optional filter criteria
   * @returns {Promise} - Array of lead objects
   */
  async getLeads(filter = {}) {
    try {
      return await Lead.find(filter).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  /**
   * Get a lead by ID
   * @param {String} id - The lead ID
   * @returns {Promise} - The lead object
   */
  async getLeadById(id) {
    try {
      const lead = await Lead.findById(id);
      if (!lead) {
        throw new Error('Lead not found');
      }
      return lead;
    } catch (error) {
      console.error(`Error fetching lead with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a lead by ID
   * @param {String} id - The lead ID
   * @param {Object} updateData - The data to update
   * @returns {Promise} - The updated lead object
   */
  async updateLead(id, updateData) {
    try {
      const lead = await Lead.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!lead) {
        throw new Error('Lead not found');
      }
      
      return lead;
    } catch (error) {
      console.error(`Error updating lead with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a lead by ID
   * @param {String} id - The lead ID
   * @returns {Promise} - The deleted lead object
   */
  async deleteLead(id) {
    try {
      const lead = await Lead.findByIdAndDelete(id);
      
      if (!lead) {
        throw new Error('Lead not found');
      }
      
      return lead;
    } catch (error) {
      console.error(`Error deleting lead with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get leads statistics
   * @returns {Promise} - Statistics object
   */
  async getLeadStats() {
    try {
      const totalLeads = await Lead.countDocuments();
      
      const intentStats = await Lead.aggregate([
        { $group: { _id: '$intent', count: { $sum: 1 } } }
      ]);
      
      const userTypeStats = await Lead.aggregate([
        { $group: { _id: '$userType', count: { $sum: 1 } } }
      ]);
      
      const cityStats = await Lead.aggregate([
        { $group: { _id: '$city', count: { $sum: 1 } } }
      ]);
      
      return {
        totalLeads,
        intentStats,
        userTypeStats,
        cityStats
      };
    } catch (error) {
      console.error('Error fetching lead statistics:', error);
      throw error;
    }
  }
}

module.exports = new LeadService();