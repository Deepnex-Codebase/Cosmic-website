import axios from 'axios';
// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

// Create axios instance for blog API
const blogApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Blog service functions
export const blogService = {
  // Get all blogs with pagination and filters
  getAllBlogs: async (params = {}) => {
    try {
      const response = await blogApi.get('/blogs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  // Get single blog by ID
  getBlog: async (id) => {
    try {
      const response = await blogApi.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  },

  // Create new blog
  createBlog: async (blogData) => {
    try {
      console.log('blogService.createBlog called with:', blogData);
      console.log('API Base URL:', blogApi.defaults.baseURL);
      
      // Create FormData for multipart/form-data
      const formData = new FormData();
      
      // Append all fields to FormData
        Object.keys(blogData).forEach(key => {
          if (key === 'tags') {
            formData.append(key, JSON.stringify(blogData[key]));
          } else if (key === 'author') {
            formData.append(key, JSON.stringify(blogData[key]));
          } else if (key === 'featuredImageFile' && blogData[key]) {
            // Only append file if it exists
            formData.append('featuredImage', blogData[key]);
          } else if (key !== 'featuredImageFile') {
            // Skip featuredImageFile if it doesn't exist or is null
            formData.append(key, blogData[key]);
          }
        });
      
      const response = await blogApi.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('blogService.createBlog response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating blog in service:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.keys(blogData).forEach(key => {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(blogData[key]));
        } else if (key === 'author') {
          formData.append(key, JSON.stringify(blogData[key]));
        } else if (key === 'featuredImageFile' && blogData[key]) {
          // Only append file if it exists
          formData.append('featuredImage', blogData[key]);
        } else if (key !== 'featuredImageFile') {
          // Skip featuredImageFile if it doesn't exist or is null
          formData.append(key, blogData[key]);
        }
      });
      
      const response = await blogApi.put(`/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  // Delete blog
  deleteBlog: async (id) => {
    try {
      const response = await blogApi.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  // Upload blog image
  uploadImage: async (formData) => {
    try {
      // formData already contains image and folder parameters from the component
      const response = await blogApi.post('/blogs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Get blog statistics
  getBlogStats: async () => {
    try {
      const response = await blogApi.get('/blogs/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      throw error;
    }
  },

  // Get blog categories
  getBlogCategories: async () => {
    try {
      const response = await blogApi.get('/blogs/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }
  },
};

export default blogService;