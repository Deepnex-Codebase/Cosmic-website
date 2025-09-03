/**
 * Configuration constants for the application
 */

// API URL with fallback to production URL
export const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

// Base URL for image paths (without /api suffix)
export const BASE_URL = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

// Format image URL to ensure it uses the correct base URL
export const formatImageUrl = (url) => {
  if (!url) return '';
  
  // If URL already has http/https, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL is relative, add base URL
  const imagePath = url.startsWith('/') ? url.substring(1) : url;
  return `${BASE_URL}/${imagePath}`;
};