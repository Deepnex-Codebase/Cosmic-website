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
    console.log('News cards is not an array, returning empty array');
    return [];
  }
  
  console.log(`Processing ${newsCards.length} news cards with base URL: ${baseUrl}`);
  
  // Ensure we have a valid base URL
  let normalizedBaseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com';
  console.log(`Using normalized base URL: ${normalizedBaseUrl}`);
  
  // Remove /api suffix if present
  if (normalizedBaseUrl.endsWith('/api')) {
    normalizedBaseUrl = normalizedBaseUrl.slice(0, -4); // Remove /api suffix
    console.log(`Removed /api suffix from base URL: ${normalizedBaseUrl}`);
  }
  
  // Remove any trailing slash from the base URL
  normalizedBaseUrl = normalizedBaseUrl.endsWith('/') ? normalizedBaseUrl.slice(0, -1) : normalizedBaseUrl;
  console.log(`Final normalized base URL: ${normalizedBaseUrl}`);
  
  return newsCards.map((card, index) => {
    if (!card) {
      console.log(`Card at index ${index} is null or undefined`);
      return card;
    }
    
    console.log(`Processing card ${index}:`, card);
    
    // Create a new card object to avoid mutating the original
    const processedCard = { ...card };
    
    // Process image URL if it exists and is a relative path
    if (processedCard.image && typeof processedCard.image === 'string') {
      console.log(`Original image URL for card ${index}: ${processedCard.image}`);
      
      // Check if the image URL is relative (doesn't start with http:// or https://)
      if (!processedCard.image.startsWith('http://') && !processedCard.image.startsWith('https://')) {
        // Remove any leading slash from the image path
        const imagePath = processedCard.image.startsWith('/') ? processedCard.image.substring(1) : processedCard.image;
        // Combine to form the complete URL
        processedCard.image = `${normalizedBaseUrl}/${imagePath}`;
        console.log(`Processed image URL for card ${index}: ${processedCard.image}`);
      } else {
        console.log(`Image URL for card ${index} already has http/https prefix, keeping as is: ${processedCard.image}`);
      }
    } else {
      console.log(`No image URL found or it is not a string for card ${index}`);
      // Set a default image
      processedCard.image = '/newsimage.png';
      console.log(`Set default image for card ${index}: ${processedCard.image}`);
    }
    
    // Also process logo URL if it exists
    if (processedCard.logo && typeof processedCard.logo === 'string') {
      console.log(`Original logo URL for card ${index}: ${processedCard.logo}`);
      
      // Check if the logo URL is relative (doesn't start with http:// or https://)
      if (!processedCard.logo.startsWith('http://') && !processedCard.logo.startsWith('https://')) {
        // Remove any leading slash from the logo path
        const logoPath = processedCard.logo.startsWith('/') ? processedCard.logo.substring(1) : processedCard.logo;
        // Combine to form the complete URL
        processedCard.logo = `${normalizedBaseUrl}/${logoPath}`;
        console.log(`Processed logo URL for card ${index}: ${processedCard.logo}`);
      } else {
        console.log(`Logo URL for card ${index} already has http/https prefix, keeping as is: ${processedCard.logo}`);
      }
    } else {
      console.log(`No logo URL found or it is not a string for card ${index}`);
      // Set a default logo
      processedCard.logo = '/logo.png';
      console.log(`Set default logo for card ${index}: ${processedCard.logo}`);
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
    console.log('Green Future API Response:', response);
    // Check if response has data property and return it
    if (response && response.data) {
      return response.data.data || response.data;
    }
    return null;
  } catch (mainError) {
    console.log('Error fetching from main API:', mainError);
    // Try with direct API as fallback
    try {
      const directResponse = await directApi.get('/cms/green-future');
      console.log('Green Future Direct API Response:', directResponse);
      // Check if directResponse has data property and return it
      if (directResponse && directResponse.data) {
        return directResponse.data.data || directResponse.data;
      }
      return null;
    } catch (fallbackError) {
      console.log('Error fetching from fallback API:', fallbackError);
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
    console.log('Using API_BASE_URL:', API_BASE_URL);
    
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
        console.log(`Trying endpoint with main API: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`Response from ${endpoint}:`, response);
        
        if (response && response.data) {
          // Check if we have data in various possible formats
          if (Array.isArray(response.data)) {
            newsCards = response.data;
            success = true;
            console.log(`Found array data at ${endpoint}:`, newsCards);
          } else if (response.data.data && Array.isArray(response.data.data)) {
            newsCards = response.data.data;
            success = true;
            console.log(`Found nested array data at ${endpoint}:`, newsCards);
          } else if (typeof response.data === 'object') {
            console.log(`Found object data at ${endpoint}, checking properties:`, response.data);
            // Look for array properties in the response
            for (const key in response.data) {
              if (Array.isArray(response.data[key])) {
                newsCards = response.data[key];
                success = true;
                console.log(`Found array in property ${key} at ${endpoint}:`, newsCards);
                break;
              }
            }
          }
        }
      } catch (error) {
        console.log(`Error with endpoint ${endpoint}:`, error.message);
      }
    }
    
    // If main API failed, try with direct API
    if (!success) {
      for (const endpoint of endpoints) {
        if (success) break;
        
        try {
          console.log(`Trying endpoint with direct API: ${endpoint}`);
          const directResponse = await directApi.get(endpoint);
          console.log(`Direct response from ${endpoint}:`, directResponse);
          
          if (directResponse && directResponse.data) {
            // Check if we have data in various possible formats
            if (Array.isArray(directResponse.data)) {
              newsCards = directResponse.data;
              success = true;
              console.log(`Found array data at direct ${endpoint}:`, newsCards);
            } else if (directResponse.data.data && Array.isArray(directResponse.data.data)) {
              newsCards = directResponse.data.data;
              success = true;
              console.log(`Found nested array data at direct ${endpoint}:`, newsCards);
            } else if (typeof directResponse.data === 'object') {
              console.log(`Found object data at direct ${endpoint}, checking properties:`, directResponse.data);
              // Look for array properties in the response
              for (const key in directResponse.data) {
                if (Array.isArray(directResponse.data[key])) {
                  newsCards = directResponse.data[key];
                  success = true;
                  console.log(`Found array in property ${key} at direct ${endpoint}:`, newsCards);
                  break;
                }
              }
            }
          }
        } catch (error) {
          console.log(`Error with direct endpoint ${endpoint}:`, error.message);
        }
      }
    }
    
    if (success && newsCards.length > 0) {
      console.log('News Cards before processing:', newsCards);
      // Process image URLs to add base URL if needed
      const processedCards = processNewsCardImages(newsCards, API_BASE_URL);
      console.log('News Cards after processing:', processedCards);
      return processedCards;
    } else {
      console.log('No news cards found after trying all endpoints');
      return [];
    }
  } catch (error) {
    console.error('Unexpected error in getNewsCards:', error);
    return [];
  }
};

/**
 * Fetch both Green Future and News Cards data in parallel
 * @returns {Promise} Promise object with both green future and news cards data
 */
export const getGreenFutureAndNewsCards = async () => {
  try {
    console.log('Fetching Green Future and News Cards data...');
    
    // Get news cards first to ensure we have them
    console.log('Fetching news cards first...');
    const newsCardsData = await getNewsCards();
    console.log('News Cards Data fetched:', newsCardsData);
    
    // Then get green future data
    console.log('Fetching green future data...');
    const greenFutureData = await getGreenFutureData();
    console.log('Green Future Data fetched:', greenFutureData);
    
    // Log the final data we're returning
    console.log('Final data being returned:');
    console.log('- Green Future Data:', greenFutureData);
    console.log('- News Cards Data:', newsCardsData, 'Length:', newsCardsData ? newsCardsData.length : 0);
    
    return {
      greenFutureData,
      newsCardsData
    };
  } catch (error) {
    console.error('Error in getGreenFutureAndNewsCards:', error);
    return {
      greenFutureData: null,
      newsCardsData: []
    };
  }
};