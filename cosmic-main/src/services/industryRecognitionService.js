import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

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
    // Try with achievements endpoint first (based on AchievementController)
    let response;
    
    try {
      response = await axios.get(`${API_BASE_URL}/achievements`);
      // Check if we have data in response
      if (response && response.data && response.data.success && response.data.data) {
        // Extract industry recognition partners from the achievement data
        const achievementData = response.data.data;
        
        if (achievementData.industryRecognition && 
            achievementData.industryRecognition.partners && 
            Array.isArray(achievementData.industryRecognition.partners) && 
            achievementData.industryRecognition.partners.length > 0) {
          
          // Format image URLs in the partners data
          const formattedData = achievementData.industryRecognition.partners.map(partner => ({
            name: partner.name,
            title: partner.name, // Use name as title for compatibility
            description: partner.description || '',
            organization: partner.description || '',
            logo: partner.logo ? formatImageUrl(partner.logo) : '/award-icon.svg',
            image: partner.logo ? formatImageUrl(partner.logo) : '/award-icon.svg'
          }));
          
          return formattedData;
        }
      }
      
      // If we didn't find partners in the achievements endpoint, try the old endpoints
      
      // Try with plural endpoint
      response = await axios.get(`${API_BASE_URL}/industry-recognitions`);
      // Check if data is directly an array
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Format image URLs in the data
        const formattedData = response.data.map(item => ({
          ...item,
          logo: item.logo ? formatImageUrl(item.logo) : item.logo,
          image: item.image ? formatImageUrl(item.image) : item.image
        }));
        return formattedData;
      }
      
      // Check if data is in response.data.data format
      if (response && response.data && response.data.data && 
          Array.isArray(response.data.data) && response.data.data.length > 0) {
        // Format image URLs in the nested data
        const formattedData = response.data.data.map(item => ({
          ...item,
          logo: item.logo ? formatImageUrl(item.logo) : item.logo,
          image: item.image ? formatImageUrl(item.image) : item.image
        }));
        return formattedData;
      }
      
    } catch (error) {
      // If achievements endpoint fails, try with singular endpoint
      try {
        response = await axios.get(`${API_BASE_URL}/industry-recognition`);

        
        // Process response data if available
        if (response && response.data) {
          if (Array.isArray(response.data) && response.data.length > 0) {
            const formattedData = response.data.map(item => ({
              ...item,
              logo: item.logo ? formatImageUrl(item.logo) : item.logo,
              image: item.image ? formatImageUrl(item.image) : item.image
            }));
            return formattedData;
          }
          
          if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            const formattedData = response.data.data.map(item => ({
              ...item,
              logo: item.logo ? formatImageUrl(item.logo) : item.logo,
              image: item.image ? formatImageUrl(item.image) : item.image
            }));
            return formattedData;
          }
        }
      } catch (singularError) {
  
      }
    }
    
    return getFallbackIndustryRecognition();
  } catch (error) {
    console.error('Error fetching industry recognition:', error);
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