import api from './api';
import axios from 'axios';

// Define API path
const API_BASE_URL = '/services';

// Define direct API URL as fallback
const DIRECT_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

// Create a direct axios instance for fallback
const directApi = axios.create({
  baseURL: DIRECT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Get all services with pagination and filtering
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise} - Promise with services data and pagination info
 */
export const getAllServices = async (params = {}) => {
  try {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        const fallbackResponse = await directApi.get(`/services`, { params });
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

/**
 * Get services by category
 * @param {string} category - Category to filter by
 * @returns {Promise} - Promise with services data
 */
export const getServicesByCategory = async (category) => {
  try {
    const response = await api.get(`${API_BASE_URL}/category/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services by category:', error);
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        const fallbackResponse = await directApi.get(`/services/category/${category}`);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

/**
 * Get featured services
 * @returns {Promise} - Promise with featured services data
 */
export const getFeaturedServices = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/featured`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured services:', error);
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        const fallbackResponse = await directApi.get(`/services/featured`);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

/**
 * Get single service by ID
 * @param {string} id - Service ID
 * @returns {Promise} - Promise with service data
 */
export const getServiceById = async (id) => {
  try {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        const fallbackResponse = await directApi.get(`/services/${id}`);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

/**
 * Helper function to prepare FormData for service creation/update
 * @param {Object} serviceData - Service data to prepare
 * @returns {FormData} - Prepared FormData object
 */
const prepareServiceFormData = (serviceData) => {
  const formData = new FormData();
  
  // Ensure required fields are present
  if (!serviceData.title) {
    console.error('Missing required field: title');
  }
  
  if (!serviceData.description) {
    console.error('Missing required field: description');
  }
  
  if (!serviceData.category) {
    console.error('Missing required field: category');
  }
  
  // Process each field
  Object.keys(serviceData).forEach(key => {
    // Skip imagePreview field as it's only for UI
    if (key === 'imagePreview') return;
    
    // Handle arrays and objects that need to be stringified
    if (key === 'features' || key === 'seo') {
      formData.append(key, JSON.stringify(serviceData[key] || []));
      return;
    }
    
    // Handle image field specially
    if (key === 'image') {
      if (serviceData[key] instanceof File) {
        // It's a File object, append it as 'file' for the backend
        formData.append('file', serviceData[key]);
      } else if (
        serviceData[key] && 
        typeof serviceData[key] === 'string' && 
        !serviceData[key].startsWith('blob:')
      ) {
        // It's a string URL (not a blob URL), append as 'image'
        formData.append('image', serviceData[key]);
      }
      return;
    }
    
    // Handle all other fields, ensuring they're not undefined
    if (serviceData[key] !== undefined) {
      formData.append(key, serviceData[key]);
    } else if (key === 'icon') {
      // Ensure icon is at least an empty string if undefined
      formData.append(key, '');
    }
  });
  
  // Log the form data for debugging
  console.log('Form data prepared for submission:');
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }
  
  return formData;
};

/**
 * Create new service
 * @param {Object} serviceData - Service data including image file
 * @returns {Promise} - Promise with created service data
 */
export const createService = async (serviceData) => {
  try {
    // Validate required fields before sending
    if (!serviceData.title || !serviceData.description || !serviceData.category) {
      const missingFields = [];
      if (!serviceData.title) missingFields.push('title');
      if (!serviceData.description) missingFields.push('description');
      if (!serviceData.category) missingFields.push('category');
      
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    const formData = prepareServiceFormData(serviceData);
    
    // Log what we're sending
    console.log('Creating service with data:', serviceData);
    
    const response = await api.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    
    // If it's our validation error, throw it directly
    if (error.message && error.message.includes('Missing required fields')) {
      throw error;
    }
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        // Re-prepare form data for fallback API
        const fallbackFormData = prepareServiceFormData(serviceData);
        
        const fallbackResponse = await directApi.post('/services', fallbackFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

/**
 * Update existing service
 * @param {string} id - Service ID to update
 * @param {Object} serviceData - Updated service data
 * @returns {Promise} - Promise with updated service data
 */
export const updateService = async (id, serviceData) => {
  try {
    const formData = prepareServiceFormData(serviceData);
    
    const response = await api.put(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

/**
 * Delete service
 * @param {string} id - Service ID to delete
 * @returns {Promise} - Promise with deletion status
 */
export const deleteService = async (id) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

/**
 * Get service statistics
 * @returns {Promise} - Promise with service statistics
 */
export const getServiceStats = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service stats:', error);
    throw error;
  }
};

/**
 * Update service order
 * @param {Array} services - Array of service objects with id and order
 * @returns {Promise} - Promise with update status
 */
export const updateServiceOrder = async (services) => {
  try {
    const response = await api.patch(`${API_BASE_URL}/order`, { services });
    return response.data;
  } catch (error) {
    console.error('Error updating service order:', error);
    throw error;
  }
};

// Export all functions as default object
export default {
  getAllServices,
  getServicesByCategory,
  getFeaturedServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceStats,
  updateServiceOrder
};