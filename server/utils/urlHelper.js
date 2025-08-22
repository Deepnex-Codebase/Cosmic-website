/**
 * Utility function to generate full URLs for uploaded files
 * Uses the API base URL from environment variables instead of request host
 */

const getFullUrl = (relativePath) => {
  // Use the API base URL from environment variables
  const baseUrl = process.env.API_BASE_URL || 'https://api.cosmicpowertech.com';
  
  // Make sure relativePath starts with a slash
  if (relativePath && !relativePath.startsWith('/')) {
    relativePath = '/' + relativePath;
  }
  
  return `${baseUrl}${relativePath}`;
};

module.exports = {
  getFullUrl
};