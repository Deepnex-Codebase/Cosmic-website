// API base URL
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.cosmicpowertech.com/api' 
  : 'http://localhost:8000/api';
