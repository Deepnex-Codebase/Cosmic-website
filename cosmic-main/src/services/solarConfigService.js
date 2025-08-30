  import api from './api';

const solarConfigService = {
  /**
   * Get all solar configurations
   * @returns {Promise} - Promise with all solar configurations
   */
  getAllConfigs: async () => {
    try {
      const response = await api.get('/solar-config');
      return response.data;
    } catch (error) {
      console.error('Error fetching solar configurations:', error);
      throw error;
    }
  },

  /**
   * Get specific solar configuration by type
   * @param {String} configType - The configuration type to retrieve
   * @returns {Promise} - Promise with the requested configuration
   */
  getConfigByType: async (configType) => {
    try {
      const response = await api.get(`/solar-config/${configType}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${configType} configuration:`, error);
      throw error;
    }
  },

  /**
   * Update solar configuration by type
   * @param {String} configType - The configuration type to update
   * @param {Object} data - The updated configuration data
   * @returns {Promise} - Promise with the updated configuration
   */
  updateConfig: async (configType, data) => {
    try {
      const response = await api.put(`/solar-config/${configType}`, { data });
      return response.data;
    } catch (error) {
      console.error(`Error updating ${configType} configuration:`, error);
      throw error;
    }
  },

  /**
   * Initialize default configurations
   * @returns {Promise} - Promise with initialization status
   */
  initializeConfigs: async () => {
    try {
      const response = await api.post('/solar-config/initialize');
      return response.data;
    } catch (error) {
      console.error('Error initializing default configurations:', error);
      throw error;
    }
  }
};

export default solarConfigService;