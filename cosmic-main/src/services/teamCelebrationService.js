// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

// Get team celebration data
export const getTeamCelebration = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cms/team-celebration`);
    if (!response.ok) {
      throw new Error('Failed to fetch team celebration data');
    }
    return await response.json();
  } catch (error) {
    // Error handling without console.error
    throw error;
  }
};

// Update team celebration data
export const updateTeamCelebration = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cms/team-celebration`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update team celebration data');
    }
    return await response.json();
  } catch (error) {
    // Error handling without console.error
    throw error;
  }
};

// Upload team celebration image
export const uploadTeamCelebrationImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/cms/team-celebration/upload-image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const result = await response.json();
    // Handle different types of image URLs
    if (result.imageUrl) {
      // If it's a data:image URL (base64), return it directly
      if (result.imageUrl.startsWith('data:image')) {
        return result.imageUrl;
      }
      // If it starts with /uploads, prepend the server URL
      else if (result.imageUrl.startsWith('/uploads')) {
        return `https://api.cosmicpowertech.com${result.imageUrl}`;
      }
      // If it's already an https URL, return it as is
      else if (result.imageUrl.startsWith('https://')) {
        return result.imageUrl;
      }
      // Otherwise return the URL as is
      return result.imageUrl;
    }
    return '';
  } catch (error) {
    // Error handling without console.error
    throw error;
  }
};


// Upload team celebration video
export const uploadTeamCelebrationVideo = async (file) => {
  try {
    const formData = new FormData();
    formData.append('video', file);
    
    const response = await fetch(`${API_BASE_URL}/cms/team-celebration/upload-video`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload video');
    }
    
    const result = await response.json();
    // Handle different types of video URLs
    if (result.imageUrl) {
      // If it starts with /uploads, prepend the server URL
      if (result.imageUrl.startsWith('/uploads')) {
        return `https://api.cosmicpowertech.com${result.imageUrl}`;
      }
      // If it's already an https URL, return it as is
      else if (result.filePath.startsWith('https://')) {
        return result.filePath;
      }
      // Otherwise return the URL as is
      return result.filePath;
    }
    return '';
  } catch (error) {
    // Error handling without console.error
    throw error;
  }
};