import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
console.log('API_BASE_URL for industry recognition:', API_BASE_URL);

// Format image URLs to ensure they use the production API URL
export const formatImageUrl = (url) => {
  if (!url) return '/award-icon.svg'; // Return default image if URL is empty
  
  // If URL already has http/https, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL is from localhost, convert to production URL
  if (url.includes('localhost')) {
    const path = url.split('/').slice(3).join('/');
    return `https://api.cosmicpowertech.com/${path}`;
  }
  
  // If URL is relative, add base URL
  const imagePath = url.startsWith('/') ? url.substring(1) : url;
  
  // Use the base URL without /api suffix for image URLs
  let normalizedBaseUrl = API_BASE_URL;
  if (normalizedBaseUrl.endsWith('/api')) {
    normalizedBaseUrl = normalizedBaseUrl.slice(0, -4); // Remove /api suffix
  }
  normalizedBaseUrl = normalizedBaseUrl.endsWith('/') ? normalizedBaseUrl.slice(0, -1) : normalizedBaseUrl;
  
  // For static assets that start with /, use them directly
  if (url.startsWith('/') && !url.includes('uploads')) {
    return url;
  }
  
  return `${normalizedBaseUrl}/${imagePath}`;
};

export const getIndustryRecognition = async () => {
  try {
    // Try with plural endpoint first (industry-recognitions)
    console.log('Fetching industry recognition from API (plural):', `${API_BASE_URL}/industry-recognitions`);
    let response;
    
    try {
      response = await axios.get(`${API_BASE_URL}/industry-recognitions`);
      console.log('API Response for industry-recognitions:', response);
    } catch (pluralError) {
      console.log('Error with plural endpoint, trying singular endpoint');
      // If plural fails, try with singular endpoint
      response = await axios.get(`${API_BASE_URL}/industry-recognition`);
      console.log('API Response for industry-recognition:', response);
    }
    
    // Check if we have data in response
    if (response && response.data) {
      // Check if data is directly an array
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log('Using API data (array) for industry recognition:', response.data);
        // Format image URLs in the data
        const formattedData = response.data.map(item => ({
          ...item,
          logo: item.logo ? formatImageUrl(item.logo) : item.logo,
          image: item.image ? formatImageUrl(item.image) : item.image
        }));
        return formattedData;
      }
      
      // Check if data is in response.data.data format (common API pattern)
      if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        console.log('Using API data (nested data) for industry recognition:', response.data.data);
        // Format image URLs in the nested data
        const formattedData = response.data.data.map(item => ({
          ...item,
          logo: item.logo ? formatImageUrl(item.logo) : item.logo,
          image: item.image ? formatImageUrl(item.image) : item.image
        }));
        return formattedData;
      }
    }
    
    console.log('API returned empty or invalid data, using fallback data');
    return getFallbackIndustryRecognition();
  } catch (error) {
    console.error('Error fetching industry recognition:', error);
    console.log('Using fallback data due to error');
    return getFallbackIndustryRecognition();
  }
};

export const getFallbackIndustryRecognition = () => {
  // Apply formatImageUrl to fallback data as well
  return [
    {
      title: "Best Solar Installer 2023",
      organization: "Solar Energy Association",
      logo: "/award-icon.svg"
    },
    {
      title: "Green Energy Excellence Award",
      organization: "Renewable Energy Council",
      logo: "/award-icon.svg"
    },
    {
      title: "Top 10 Solar Companies",
      organization: "Energy Business Review",
      logo: "/award-icon.svg"
    },
    {
      title: "Sustainability Leadership Award",
      organization: "Green Business Alliance",
      logo: "/award-icon.svg"
    },
    {
      title: "Innovation in Solar Technology",
      organization: "Tech Innovators Forum",
      logo: "/award-icon.svg"
    }
  ];
};