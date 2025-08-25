import axios from 'axios';

// Define API_URL using environment variable
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

// Log the API URL for debugging
console.log('Company Culture API URL:', API_URL);

const api = axios.create({
  baseURL: `${API_URL}/cms/company-culture`,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 30000,
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
    // Log the data being sent to the API for debugging
    console.log('Sending data to API:', JSON.stringify(data));
    
    // Make sure we're sending valid JSON data
    const cleanData = JSON.parse(JSON.stringify(data));
    
    // Try using fetch instead of axios for this specific call
    const response = await fetch(`${API_URL}/cms/company-culture`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server responded with error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error updating company culture data:', error);
    console.error('Error details:', error.response?.data || 'No response data');
    throw error;
  }
};

// Upload image
export const uploadCompanyCultureImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    // Check file size before uploading
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 5) {
      throw new Error('File size exceeds 5MB limit. Please choose a smaller file.');
    }
    
    // Use fetch API instead of axios for more reliable multipart/form-data handling
    const response = await fetch(`${API_URL}/cms/company-culture/uploads`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
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