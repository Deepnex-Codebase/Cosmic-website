import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Get about page data
export const getAboutPage = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cms/about`);
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
    const response = await axios.put(`${API_BASE_URL}/cms/about`, aboutData);
    return response.data;
  } catch (error) {
    console.error('Error updating about page:', error);
    throw error;
  }
};

// Upload expertise image
export const uploadExpertiseImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post(
      `${API_BASE_URL}/cms/about/expertise/upload`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading expertise image:', error);
    throw error;
  }
};

// Add expertise item
export const addExpertiseItem = async (itemData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cms/about/expertise/item`,
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
    const response = await axios.delete(
      `${API_BASE_URL}/cms/about/expertise/item/${itemId}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error removing expertise item:', error);
    throw error;
  }
};
