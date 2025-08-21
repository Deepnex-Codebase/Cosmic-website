import axios from 'axios';

const API_URL = import.meta.env.API_BASE_URL || 'https://api.cosmicpowertech.com';

const api = axios.create({
  baseURL: `${API_URL}/api/cms/company-culture`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get company culture data
export const getCompanyCulture = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching company culture data:', error);
    throw error;
  }
};

// Update company culture data
export const updateCompanyCulture = async (data) => {
  try {
    const response = await api.put('/', data);
    return response.data;
  } catch (error) {
    console.error('Error updating company culture data:', error);
    throw error;
  }
};

// Upload image
export const uploadCompanyCultureImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default {
  getCompanyCulture,
  updateCompanyCulture,
  uploadCompanyCultureImage,
};