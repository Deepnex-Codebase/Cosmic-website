// API base URL
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.cosmicpowertech.com' 
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
