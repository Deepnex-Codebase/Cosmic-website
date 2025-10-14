import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

// Get active service hero
export const getActiveServiceHero = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/service-hero/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active service hero:', error);
    throw error;
  }
};

// Get all service heroes
export const getAllServiceHeroes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/service-hero`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching service heroes:', error);
    throw error;
  }
};

// Create new service hero
export const createServiceHero = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/api/service-hero`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating service hero:', error);
    throw error;
  }
};

// Update service hero
export const updateServiceHero = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/api/service-hero/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating service hero:', error);
    throw error;
  }
};

// Delete service hero
export const deleteServiceHero = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/service-hero/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service hero:', error);
    throw error;
  }
};

// Set active service hero
export const setActiveServiceHero = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/api/service-hero/${id}/activate`);
    return response.data;
  } catch (error) {
    console.error('Error setting active service hero:', error);
    throw error;
  }
};