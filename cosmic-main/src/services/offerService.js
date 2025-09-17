import api from './api';
import axios from 'axios';

// Define API path
const API_BASE_URL = '/cms/offers';

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
 * Get all offers
 * @returns {Promise} - Promise with offers data
 */
export const getAllOffers = async () => {
  try {
    const response = await api.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching offers:', error);
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        const fallbackResponse = await directApi.get(`/cms/offers`);
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
 * Get only active offers
 * @returns {Promise} - Promise with active offers data
 */
export const getActiveOffers = async () => {
  try {
    const response = await api.get(API_BASE_URL);
    // Filter only active offers on the frontend
    const allOffers = response.data;
    const currentDate = new Date();
    
    const activeOffers = allOffers.data?.filter(offer => {
      // Check if offer is marked as active
      if (!offer.isActive) return false;
      
      // Check date range if dates are provided
      if (offer.startDate && offer.endDate) {
        const startDate = new Date(offer.startDate);
        const endDate = new Date(offer.endDate);
        return currentDate >= startDate && currentDate <= endDate;
      }
      
      // If no date range, just check isActive flag
      return true;
    }) || [];
    
    return {
      ...allOffers,
      data: activeOffers,
      count: activeOffers.length
    };
  } catch (error) {
    console.error('Error fetching active offers:', error);
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        const fallbackResponse = await directApi.get(`/cms/offers`);
        const allOffers = fallbackResponse.data;
        const currentDate = new Date();
        
        const activeOffers = allOffers.data?.filter(offer => {
          if (!offer.isActive) return false;
          
          if (offer.startDate && offer.endDate) {
            const startDate = new Date(offer.startDate);
            const endDate = new Date(offer.endDate);
            return currentDate >= startDate && currentDate <= endDate;
          }
          
          return true;
        }) || [];
        
        return {
          ...allOffers,
          data: activeOffers,
          count: activeOffers.length
        };
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

/**
 * Get active offer
 * @returns {Promise} - Promise with active offer data
 */
export const getActiveOffer = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active offer:', error);
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        const fallbackResponse = await directApi.get(`/cms/offers/active`);
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
 * Get single offer by ID
 * @param {string} id - Offer ID
 * @returns {Promise} - Promise with offer data
 */
export const getOfferById = async (id) => {
  try {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching offer:', error);
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        const fallbackResponse = await directApi.get(`/cms/offers/${id}`);
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
 * Create new offer
 * @param {Object} offerData - Offer data
 * @returns {Promise} - Promise with created offer data
 */
export const createOffer = async (offerData) => {
  try {
    const response = await api.post(API_BASE_URL, offerData);
    return response.data;
  } catch (error) {
    console.error('Error creating offer:', error);
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        const fallbackResponse = await directApi.post(`/cms/offers`, offerData);
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
 * Update offer
 * @param {string} id - Offer ID
 * @param {Object} offerData - Updated offer data
 * @returns {Promise} - Promise with updated offer data
 */
export const updateOffer = async (id, offerData) => {
  try {
    const response = await api.put(`${API_BASE_URL}/${id}`, offerData);
    return response.data;
  } catch (error) {
    console.error('Error updating offer:', error);
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        const fallbackResponse = await directApi.put(`/cms/offers/${id}`, offerData);
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
 * Delete offer
 * @param {string} id - Offer ID
 * @returns {Promise} - Promise with deletion status
 */
export const deleteOffer = async (id) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting offer:', error);
    
    // Try direct API as fallback
    if (error.response && error.response.status >= 500) {
      try {
        const fallbackResponse = await directApi.delete(`/cms/offers/${id}`);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

// Export all functions as default object
export default {
  getAllOffers,
  getActiveOffers,
  getActiveOffer,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer
};