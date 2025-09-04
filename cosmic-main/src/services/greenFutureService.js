import api from './api';
import axios from 'axios';

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
 * Process news card images to ensure they have complete URLs
 * @param {Array} newsCards - Array of news card objects
 * @param {String} baseUrl - Base URL to prepend to relative image paths
 * @returns {Array} - Processed news cards with complete image URLs
 */
const processNewsCardImages = (newsCards, baseUrl) => {
  if (!Array.isArray(newsCards)) {
    return [];
  }
  ;
  
  // Ensure we have a valid base URL
  let normalizedBaseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com';
  
  // Remove /api suffix if present
  if (normalizedBaseUrl.endsWith('/api')) {
    normalizedBaseUrl = normalizedBaseUrl.slice(0, -4); // Remove /api suffix
  }
  
  // Remove any trailing slash from the base URL
  normalizedBaseUrl = normalizedBaseUrl.endsWith('/') ? normalizedBaseUrl.slice(0, -1) : normalizedBaseUrl;
  
  return newsCards.map((card, index) => {
    if (!card) {
      return card;
    }
    
    // Create a new card object to avoid mutating the original
    const processedCard = { ...card };
    
    // Process image URL if it exists
    if (processedCard.image && typeof processedCard.image === 'string') {
      
      // Fix duplicated URL pattern
      const apiUploadsPattern = '/api/uploads/news-cards/';
      const correctUploadsPattern = '/uploads/news-cards/';
      
      // Check for the specific duplicated URL pattern that was reported
      if (processedCard.image.includes(`${normalizedBaseUrl}/api/uploads/news-cards/${normalizedBaseUrl}/api/uploads/news-cards/`)) {
        processedCard.image = processedCard.image.replace(`${normalizedBaseUrl}/api/uploads/news-cards/${normalizedBaseUrl}/api/uploads/news-cards/`, `${normalizedBaseUrl}/uploads/news-cards/`);
      }
      // Check for the exact pattern shown in the error
      else if (processedCard.image.includes('https://api.cosmicpowertech.com/api/uploads/news-cards/https://api.cosmicpowertech.com/api/uploads/news-cards/')) {
        // Replace all occurrences of the duplicated pattern
        let fixedUrl = processedCard.image;
        while (fixedUrl.includes('https://api.cosmicpowertech.com/api/uploads/news-cards/https://api.cosmicpowertech.com/api/uploads/news-cards/')) {
          fixedUrl = fixedUrl.replace('https://api.cosmicpowertech.com/api/uploads/news-cards/https://api.cosmicpowertech.com/api/uploads/news-cards/', 'https://api.cosmicpowertech.com/uploads/news-cards/');
        }
        processedCard.image = fixedUrl;
      }
      // Check for other variations of duplicated URL patterns
      else if (processedCard.image.includes(`${normalizedBaseUrl}${apiUploadsPattern}${normalizedBaseUrl}${apiUploadsPattern}`)) {
        processedCard.image = processedCard.image.replace(`${normalizedBaseUrl}${apiUploadsPattern}${normalizedBaseUrl}${apiUploadsPattern}`, `${normalizedBaseUrl}${correctUploadsPattern}`);
      }
      // Check if URL has /api/uploads pattern that needs to be fixed
      else if (processedCard.image.includes(`${normalizedBaseUrl}/api/uploads`)) {
        processedCard.image = processedCard.image.replace(`${normalizedBaseUrl}/api/uploads`, `${normalizedBaseUrl}/uploads`);
      }
      // Check if URL is relative (doesn't start with http:// or https://)
      else if (!processedCard.image.startsWith('http://') && !processedCard.image.startsWith('https://')) {
        // Remove any leading slash from the image path
        const imagePath = processedCard.image.startsWith('/') ? processedCard.image.substring(1) : processedCard.image;
        // Combine to form the complete URL
        processedCard.image = `${normalizedBaseUrl}/${imagePath}`;
      }
    } else {
      // Set a default image
      processedCard.image = '/newsimage.png';
    }
    
    // Also process logo URL if it exists
    if (processedCard.logo && typeof processedCard.logo === 'string') {
      
      // Fix duplicated URL pattern
      const apiUploadsPattern = '/api/uploads/news-cards/';
      const correctUploadsPattern = '/uploads/news-cards/';
      
      // Check for the specific duplicated URL pattern that was reported
      if (processedCard.logo.includes(`${normalizedBaseUrl}/api/uploads/news-cards/${normalizedBaseUrl}/api/uploads/news-cards/`)) {
        processedCard.logo = processedCard.logo.replace(`${normalizedBaseUrl}/api/uploads/news-cards/${normalizedBaseUrl}/api/uploads/news-cards/`, `${normalizedBaseUrl}/uploads/news-cards/`);
      }
      // Check for the exact pattern shown in the error
      else if (processedCard.logo.includes('https://api.cosmicpowertech.com/api/uploads/news-cards/https://api.cosmicpowertech.com/api/uploads/news-cards/')) {
        // Replace all occurrences of the duplicated pattern
        let fixedUrl = processedCard.logo;
        while (fixedUrl.includes('https://api.cosmicpowertech.com/api/uploads/news-cards/https://api.cosmicpowertech.com/api/uploads/news-cards/')) {
          fixedUrl = fixedUrl.replace('https://api.cosmicpowertech.com/api/uploads/news-cards/https://api.cosmicpowertech.com/api/uploads/news-cards/', 'https://api.cosmicpowertech.com/uploads/news-cards/');
        }
        processedCard.logo = fixedUrl;
      }
      // Check for other variations of duplicated URL patterns
      else if (processedCard.logo.includes(`${normalizedBaseUrl}${apiUploadsPattern}${normalizedBaseUrl}${apiUploadsPattern}`)) {
        processedCard.logo = processedCard.logo.replace(`${normalizedBaseUrl}${apiUploadsPattern}${normalizedBaseUrl}${apiUploadsPattern}`, `${normalizedBaseUrl}${correctUploadsPattern}`);
      }
      // Check if URL has /api/uploads pattern that needs to be fixed
      else if (processedCard.logo.includes(`${normalizedBaseUrl}/api/uploads`)) {
        processedCard.logo = processedCard.logo.replace(`${normalizedBaseUrl}/api/uploads`, `${normalizedBaseUrl}/uploads`);
      }
      // Check if URL is relative (doesn't start with http:// or https://)
      else if (!processedCard.logo.startsWith('http://') && !processedCard.logo.startsWith('https://')) {
        // Remove any leading slash from the logo path
        const logoPath = processedCard.logo.startsWith('/') ? processedCard.logo.substring(1) : processedCard.logo;
        // Combine to form the complete URL
        processedCard.logo = `${normalizedBaseUrl}/${logoPath}`;
      }
    } else {
      // Set a default logo
      processedCard.logo = '/logo.png';
    }
    
    return processedCard;
  });
};

/**
 * Fetch Green Future data from CMS
 * @returns {Promise} Promise object with green future data
 */
export const getGreenFutureData = async () => {
  try {
    // Try with main API first
    const response = await api.get('/cms/green-future');
    // Check if response has data property and return it
    if (response && response.data) {
      return response.data.data || response.data;
    }
    return null;
  } catch (mainError) {
    // Try with direct API as fallback
    try {
      const directResponse = await directApi.get('/cms/green-future');
      // Check if directResponse has data property and return it
      if (directResponse && directResponse.data) {
        return directResponse.data.data || directResponse.data;
      }
      return null;
    } catch (fallbackError) {
      // Return null if both attempts fail
      return null;
    }
  }
};

/**
 * Fetch News Cards data from CMS
 * @returns {Promise} Promise object with news cards data
 */
export const getNewsCards = async () => {
  try {
    // Get API base URL from environment variables
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
    
    // Normalize base URL for image processing
    let normalizedBaseUrl = API_BASE_URL;
    // Remove /api suffix if present
    if (normalizedBaseUrl.endsWith('/api')) {
      normalizedBaseUrl = normalizedBaseUrl.slice(0, -4); // Remove /api suffix
    }
    // Remove any trailing slash from the base URL
    normalizedBaseUrl = normalizedBaseUrl.endsWith('/') ? normalizedBaseUrl.slice(0, -1) : normalizedBaseUrl;
    
    // Try all possible endpoints in sequence
    const endpoints = [
      '/cms/news-cards',
      '/cms/news-cards-management',
      '/cms/news-cards/active',
      '/cms/news-cards-management/active'
    ];
    
    let newsCards = [];
    let success = false;
    
    // Try each endpoint with the main API
    for (const endpoint of endpoints) {
      if (success) break;
      
      try {
        const response = await api.get(endpoint);
        if (response && response.data) {
          // Check if we have data in various possible formats
          if (Array.isArray(response.data)) {
            newsCards = response.data;
            success = true;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            newsCards = response.data.data;
            success = true;
          } else if (typeof response.data === 'object') {
            // Look for array properties in the response
            for (const key in response.data) {
              if (Array.isArray(response.data[key])) {
                newsCards = response.data[key];
                success = true;
                break;
              }
            }
          }
        }
      } catch (error) {
      }
    }
    
    // If main API failed, try with direct API
    if (!success) {
      for (const endpoint of endpoints) {
        if (success) break;
        
        try {
            const directResponse = await directApi.get(endpoint);
          
          if (directResponse && directResponse.data) {
            // Check if we have data in various possible formats
            if (Array.isArray(directResponse.data)) {
              newsCards = directResponse.data;
              success = true;
            } else if (directResponse.data.data && Array.isArray(directResponse.data.data)) {
              newsCards = directResponse.data.data;
              success = true;
            } else if (typeof directResponse.data === 'object') {
              // Look for array properties in the response
              for (const key in directResponse.data) {
                if (Array.isArray(directResponse.data[key])) {
                  newsCards = directResponse.data[key];
                  success = true;
                  break;
                }
              }
            }
          }
        } catch (error) {
        }
      }
    }
    
    if (success && newsCards.length > 0) {
      // Process image URLs to add base URL if needed and fix duplicated URL patterns
      const processedCards = processNewsCardImages(newsCards, normalizedBaseUrl);
      return processedCards;
    } else {
      return [];
    }
  } catch (error) {
    // Handle error silently
    return [];
  }
};

/**
 * Fetch both Green Future and News Cards data in parallel
 * @returns {Promise} Promise object with both green future and news cards data
 */
export const getGreenFutureAndNewsCards = async () => {
  try {
    // Get news cards first to ensure we have them
    const newsCardsData = await getNewsCards();
    
    // Then get green future data
    const greenFutureData = await getGreenFutureData();
    
    return {
      greenFutureData,
      newsCardsData
    };
  } catch (error) {
    // Handle error silently
    return {
      greenFutureData: null,
      newsCardsData: []
    };
  }
};