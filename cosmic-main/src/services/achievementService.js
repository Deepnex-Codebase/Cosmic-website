import api from './api';

class AchievementService {
  // Get achievement page data
  async getAchievementPage() {
    try {
      const response = await api.get('/achievements', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        params: {
          _t: Date.now() // Cache busting parameter
        }
      });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error fetching achievement page:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch achievement data'
      };
    }
  }

  // Update achievement page data
  async updateAchievementPage(data) {
    try {
      const response = await api.put('/achievements', data, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log('Achievement page update response:', response.data);
      return {
        success: response.data.success || true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating achievement page:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update achievement data';
      throw new Error(errorMessage);
    }
  }

  // Add new achievement
  async addAchievement(achievementData) {
    try {
      console.log('Achievement data received:', achievementData);
      const formData = new FormData();
      
      // Append text fields
      Object.keys(achievementData).forEach(key => {
        if (key !== 'image' && achievementData[key] !== undefined) {
          formData.append(key, achievementData[key]);
          console.log(`Appended ${key}:`, achievementData[key]);
        }
      });
      
      // Append image file if exists
      if (achievementData.image && achievementData.image instanceof File) {
        formData.append('image', achievementData.image);
        console.log('Image file appended:', achievementData.image.name);
      } else {
        console.log('No image file found or not a File instance:', achievementData.image);
      }
      
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await api.post('/achievements/achievement', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding achievement:', error);
      throw error;
    }
  }

  // Update achievement
  async updateAchievement(achievementId, achievementData) {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(achievementData).forEach(key => {
        if (key !== 'image' && achievementData[key] !== undefined) {
          formData.append(key, achievementData[key]);
        }
      });
      
      // Append image file if exists
      if (achievementData.image && achievementData.image instanceof File) {
        formData.append('image', achievementData.image);
      }
      
      const response = await api.put(`/achievements/achievement/${achievementId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating achievement:', error);
      throw error;
    }
  }

  // Delete achievement
  async deleteAchievement(achievementId) {
    try {
      const response = await api.delete(`/achievements/achievement/${achievementId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting achievement:', error);
      throw error;
    }
  }

  // Add certificate
  async addCertificate(certificateData) {
    try {
      const response = await api.post('/achievements/certificate', certificateData);
      return response.data;
    } catch (error) {
      console.error('Error adding certificate:', error);
      throw error;
    }
  }

  // Update certificate
  async updateCertificate(certificateId, certificateData) {
    try {
      const response = await api.put(`/achievements/certificate/${certificateId}`, certificateData);
      return response.data;
    } catch (error) {
      console.error('Error updating certificate:', error);
      throw error;
    }
  }

  // Delete certificate
  async deleteCertificate(certificateId) {
    try {
      const response = await api.delete(`/achievements/certificate/${certificateId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting certificate:', error);
      throw error;
    }
  }

  // Add partner
  async addPartner(partnerData) {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(partnerData).forEach(key => {
        if (key !== 'logo' && partnerData[key] !== undefined) {
          formData.append(key, partnerData[key]);
        }
      });
      
      // Append logo file if exists
      if (partnerData.logo && partnerData.logo instanceof File) {
        formData.append('logo', partnerData.logo);
      }
      
      const response = await api.post('/achievements/partner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding partner:', error);
      throw error;
    }
  }

  // Delete partner
  async deletePartner(partnerId) {
    try {
      const response = await api.delete(`/achievements/partner/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting partner:', error);
      throw error;
    }
  }

  // Get achievement statistics
  async getAchievementStats() {
    try {
      const response = await api.get('/achievements/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievement stats:', error);
      throw error;
    }
  }
}

export default new AchievementService();