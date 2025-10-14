import axios from 'axios';

// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

// Get active project hero
export const getProjectHero = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/project-hero/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project hero:', error);
    return null;
  }
};