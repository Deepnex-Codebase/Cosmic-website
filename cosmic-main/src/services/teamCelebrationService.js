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
    
    const response = await fetch(`${API_BASE_URL}/cms/team-celebration/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const result = await response.json();
    return `${API_BASE_URL}${result.imageUrl}`;
  } catch (error) {
    // Error handling without console.error
    throw error;
  }
};