import axios from 'axios';
// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

// Create axios instance for about API
const aboutApi = axios.create({
  baseURL: `${API_BASE_URL}/cms/about`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get about page data
export const getAboutPage = async () => {
  try {
    const response = await aboutApi.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching about page:', error);
    // Return default structure instead of throwing error
    return {
      hero: { title: 'About', subtitle: '', videoUrl: '/aboutvideo.mp4' },
      aboutUs: { title: 'About Us :', content: [''] },
      whoWeAre: { title: 'Who we are ?', content: '' },
      expertise: { title: 'Our Expertise', description: 'We are hands down our expertise in product distributorship.', items: [] },
      visionMissionValues: {
        title: 'Our Core Principles',
        description: 'The foundation of our approach to sustainable energy solutions.',
        vision: { title: 'Vision', content: [] },
        mission: { title: 'Mission', content: [] },
        values: { title: 'Values', content: [] }
      },
      clientTestimonials: {
        title: 'What Our Clients Say',
        subtitle: 'Client Testimonials',
        testimonials: []
      },
      whyChooseUs: { title: 'Why Choose Us', items: [] }
    };
  }
};

// Update about page data
export const updateAboutPage = async (aboutData) => {
  try {
    const response = await aboutApi.put('/', aboutData);
    return response.data;
  } catch (error) {
    console.error('Error updating about page:', error);
    throw error;
  }
};

// Upload expertise image
export const uploadExpertiseImage = async (imageFile) => {
  try {
    // Check file size before uploading (limit to 2MB)
    if (imageFile.size > 2 * 1024 * 1024) {
      throw new Error('Image size exceeds 2MB limit. Please compress the image or choose a smaller one.');
    }
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Use the aboutApi instance with the correct endpoint
    const response = await aboutApi.post(
      '/expertise/upload', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Add timeout to prevent long-running requests
        timeout: 30000
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading expertise image:', error);
    // Provide more specific error messages
    if (error.response && error.response.status === 413) {
      throw new Error('Image size is too large for the server. Please use an image smaller than 2MB.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

// Upload hero video
export const uploadHeroVideo = async (videoFile) => {
  try {
    // Check file size before uploading (limit to 50MB)
    if (videoFile.size > 50 * 1024 * 1024) {
      throw new Error('Video size exceeds 50MB limit. Please compress the video or choose a smaller one.');
    }
    
    const formData = new FormData();
    formData.append('video', videoFile);
    
    // Use the aboutApi instance with the correct endpoint
    const response = await aboutApi.post(
      '/video/upload', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Add timeout to prevent long-running requests
        timeout: 60000
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading hero video:', error);
    // Provide more specific error messages
    if (error.response && error.response.status === 413) {
      throw new Error('Video size is too large for the server. Please use a video smaller than 50MB.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

// Add expertise item
export const addExpertiseItem = async (itemData) => {
  try {
    const response = await aboutApi.post(
      '/expertise/item',
      itemData
    );
    
    return response.data;
  } catch (error) {
    console.error('Error adding expertise item:', error);
    throw error;
  }
};

// Remove expertise item
export const removeExpertiseItem = async (itemId) => {
  try {
    const response = await aboutApi.delete(
      `/expertise/item/${itemId}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error removing expertise item:', error);
    throw error;
  }
};
