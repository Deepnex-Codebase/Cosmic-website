import axios from 'axios';

const API_URL = 'https://api.cosmicpowertech.com/api/cookie-consent';

// Create or update cookie consent record
export const saveConsent = async (consentData) => {
  try {
    const response = await axios.post(API_URL, consentData);
    return response.data;
  } catch (error) {
    console.error('Error saving consent data:', error);
    throw error;
  }
};

// Track user activity
export const trackActivity = async (activityData) => {
  try {
    const response = await axios.post(`${API_URL}/track-activity`, activityData);
    return response.data;
  } catch (error) {
    console.error('Error tracking user activity:', error);
    // Silently fail for tracking to not disrupt user experience
    return null;
  }
};

// Get user's IP address (using a public API)
export const getUserIP = async () => {
  try {
    // Using ipify API to get user's IP address
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error getting user IP:', error);
    return null;
  }
};

// Get user agent string
export const getUserAgent = () => {
  return navigator.userAgent;
};