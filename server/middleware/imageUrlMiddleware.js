/**
 * Middleware to transform image URLs to use the API base URL
 */

const { getFullUrl } = require('../utils/urlHelper');

/**
 * Middleware that intercepts responses containing image URLs and transforms them
 * to use the API base URL instead of the local server URL
 */
const transformImageUrls = (req, res, next) => {
  // Store the original res.json method
  const originalJson = res.json;

  // Override the res.json method
  res.json = function(data) {
    // Process the response data to transform image URLs
    if (data) {
      // If data has imageUrl property, add fullUrl property
      if (data.imageUrl && typeof data.imageUrl === 'string' && data.imageUrl.startsWith('/uploads/')) {
        data.fullUrl = getFullUrl(data.imageUrl);
      }

      // If data has img property, add fullUrl property
      if (data.img && typeof data.img === 'string' && data.img.startsWith('/uploads/')) {
        data.fullUrl = getFullUrl(data.img);
      }

      // If data is an array, process each item
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.startsWith('/uploads/')) {
            item.fullUrl = getFullUrl(item.imageUrl);
          }
          if (item.img && typeof item.img === 'string' && item.img.startsWith('/uploads/')) {
            item.fullUrl = getFullUrl(item.img);
          }
        });
      }

      // If data has a data property that is an array, process each item
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach(item => {
          if (item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.startsWith('/uploads/')) {
            item.fullUrl = getFullUrl(item.imageUrl);
          }
          if (item.img && typeof item.img === 'string' && item.img.startsWith('/uploads/')) {
            item.fullUrl = getFullUrl(item.img);
          }
        });
      }
    }

    // Call the original json method
    return originalJson.call(this, data);
  };

  next();
};

module.exports = transformImageUrls;