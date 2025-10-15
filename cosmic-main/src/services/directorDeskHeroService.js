import axios from 'axios';

// Create a dedicated instance for director desk hero API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

const directorDeskApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Get all director desk heroes
export const getAllDirectorDeskHeroes = async () => {
  try {
    const response = await directorDeskApi.get('/director-desk-hero');
    return response.data;
  } catch (error) {
    console.error('Error fetching director desk heroes:', error);
    throw error;
  }
};

// Get active director desk hero
export const getActiveDirectorDeskHero = async () => {
  try {
    const response = await directorDeskApi.get('/director-desk-hero/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active director desk hero:', error);
    throw error;
  }
};

// Get single director desk hero by ID
export const getDirectorDeskHeroById = async (id) => {
  try {
    const response = await directorDeskApi.get(`/director-desk-hero/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching director desk hero:', error);
    throw error;
  }
};

// Create new director desk hero
export const createDirectorDeskHero = async (formData) => {
  try {
    const response = await directorDeskApi.post('/director-desk-hero', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating director desk hero:', error);
    throw error;
  }
};

// Update director desk hero
export const updateDirectorDeskHero = async (id, formData) => {
  try {
    const response = await directorDeskApi.put(`/director-desk-hero/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating director desk hero:', error);
    throw error;
  }
};

// Delete director desk hero
export const deleteDirectorDeskHero = async (id) => {
  try {
    const response = await directorDeskApi.delete(`/director-desk-hero/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting director desk hero:', error);
    throw error;
  }
};