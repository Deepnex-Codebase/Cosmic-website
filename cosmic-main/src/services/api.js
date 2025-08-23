import axios from 'axios';

// Create axios instance with base URL
// Using environment variables for API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add default timeout to prevent hanging requests
  timeout: 30000,
});

// Create a multipart form data instance for file uploads
const apiFormData = axios.create({
  baseURL: API_BASE_URL,
  // Add default timeout to prevent hanging requests
  timeout: 30000,
  // Set max content length and max body length for file uploads
  maxContentLength: 10 * 1024 * 1024, // 10MB
  maxBodyLength: 10 * 1024 * 1024, // 10MB
});

import { getAuthToken } from '../utils/cookies';

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 413:
          console.error('Request entity too large:', error.response.data);
          error.message = 'The file size is too large. Please use a smaller file (max 2MB).';
          break;
        case 500:
          console.error('Server error:', error.response.data);
          break;
        case 401:
          console.error('Unauthorized access:', error.response.data);
          // You could redirect to login page here if needed
          break;
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error);
      error.message = 'The request timed out. Please try again.';
    }
    return Promise.reject(error);
  }
);

// Apply the same interceptor to apiFormData
apiFormData.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 413:
          console.error('Request entity too large:', error.response.data);
          error.message = 'The file size is too large. Please use a smaller file (max 2MB).';
          break;
        case 500:
          console.error('Server error:', error.response.data);
          break;
        case 401:
          console.error('Unauthorized access:', error.response.data);
          break;
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error);
      error.message = 'The request timed out. Please try again.';
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to include auth token when available
api.interceptors.request.use(
  (config) => {
    // Try to get token from cookies first, then fallback to localStorage
    const token = getAuthToken() || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors consistently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle server errors (500) or other errors
    if (error.response && error.response.status === 500) {
      console.error('Server error:', error.response.data);
      // You can add custom handling for 500 errors here
    }
    return Promise.reject(error);
  }
);

// Apply the same interceptors to the form data instance
apiFormData.interceptors.request.use(
  api.interceptors.request.handlers[0].fulfilled,
  api.interceptors.request.handlers[0].rejected
);

apiFormData.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle server errors (500) or other errors
    if (error.response && error.response.status === 500) {
      console.error('Server error in form data request:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// API services for different endpoints
export const authService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, passwords) => api.post(`/users/reset-password/${token}`, passwords),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

export const blogService = {
  getAllPosts: (params) => api.get('/blog-posts', { params }),
  getActivePosts: (params) => api.get('/blog-posts/active', { params }),
  getFeaturedPosts: () => api.get('/blog-posts/featured'),
  getPostById: (id) => api.get(`/blog-posts/id/${id}`),
  getPostBySlug: (slug) => api.get(`/blog-posts/slug/${slug}`),
  searchPosts: (query) => api.get(`/blog-posts/search?q=${query}`),
  getPostsByCategory: (categoryId, params) => api.get(`/blog-posts/category/${categoryId}`, { params }),
  getPostsByTag: (tagId, params) => api.get(`/blog-posts/tag/${tagId}`, { params }),
};

export const projectService = {
  getAllProjects: (params) => api.get('/projects', { params }),
  getActiveProjects: (params) => api.get('/projects/active', { params }),
  getFeaturedProjects: () => api.get('/projects/featured'),
  getProjectById: (id) => api.get(`/projects/id/${id}`),
};

export const directorService = {
  getAllDirectors: () => api.get('/directors', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getDirector: (id) => api.get(`/directors/${id}`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    params: { _t: new Date().getTime() }
  }),
  createDirector: (directorData) => {
    // Check if directorData is FormData
    if (directorData instanceof FormData) {
      return apiFormData.post('/directors', directorData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.post('/directors', directorData);
  },
  updateDirector: (id, directorData) => {
    // Check if directorData is FormData
    if (directorData instanceof FormData) {
      return apiFormData.put(`/directors/${id}`, directorData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.put(`/directors/${id}`, directorData);
  },
  deleteDirector: (id) => api.delete(`/directors/${id}`),
  updateDirectorOrder: (id, direction) => api.put(`/directors/order/${id}/${direction}`),
};

export const teamService = {
  getAllTeamMembers: () => api.get('/team', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getTeamMember: (id) => api.get(`/team/${id}`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    params: { _t: new Date().getTime() }
  }),
  createTeamMember: (teamMemberData) => {
    // Check if teamMemberData is FormData
    if (teamMemberData instanceof FormData) {
      return apiFormData.post('/team', teamMemberData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.post('/team', teamMemberData);
  },
  updateTeamMember: (id, teamMemberData) => {
    // Check if teamMemberData is FormData
    if (teamMemberData instanceof FormData) {
      return apiFormData.put(`/team/${id}`, teamMemberData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.put(`/team/${id}`, teamMemberData);
  },
  deleteTeamMember: (id) => {
    // Add specific error handling for team member deletion
    console.log(`Attempting to delete team member with ID: ${id}`);
    
    // Get auth token and log it (masked for security)
    const token = getAuthToken() || localStorage.getItem('token');
    console.log('Auth token available:', token ? 'Yes (token exists)' : 'No (token missing)');
    
    // Try using the Vite proxy instead of direct URL
    // This will use the proxy configured in vite.config.js
    const url = `/api/team/${id}`;
    console.log('Making DELETE request to:', url, '(using Vite proxy)');
    
    return api.delete(url)
    .then(response => {
      console.log('Delete successful, response:', response.data);
      return response;
    })
    .catch(error => {
      console.error(`Error in deleteTeamMember for ID ${id}:`, error);
      // Add additional logging for server errors
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        console.error('Server response data:', error.response.data);
        
        // Try direct URL as fallback if proxy fails
        if (error.response.status === 500) {
          console.log('Trying direct URL as fallback...');
          const directUrl = `https://api.cosmicpowertech.com/api/team/${id}`;
          
          return axios({
            method: 'DELETE',
            url: directUrl,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
          .then(response => {
            console.log('Fallback delete successful, response:', response.data);
            return response;
          })
          .catch(fallbackError => {
            console.error('Fallback also failed:', fallbackError);
            throw fallbackError;
          });
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error; // Re-throw the error for the component to handle
    });
  },
  updateTeamMemberOrder: (id, direction) => api.put(`/team/order/${id}/${direction}`),
};

export const journeyService = {
  getAllMilestones: (params) => api.get('/cms/solar-journey', { params }),
  getActiveMilestones: () => api.get('/cms/solar-journey/active', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getMilestoneById: (id) => api.get(`/cms/solar-journey/${id}`),
  createMilestone: (data) => api.post('/cms/solar-journey', data),
  updateMilestone: (id, data) => api.put(`/cms/solar-journey/${id}`, data),
  deleteMilestone: (id) => api.delete(`/cms/solar-journey/${id}`),
  reorderMilestones: (items) => api.put('/cms/solar-journey/reorder', { items }),
};

export const contactService = {
  submitContactForm: (formData) => api.post('/contacts', formData),
};

export const heroService = {
  getActiveSlides: () => api.get('/heroes/active'),
  getFeaturedSlides: () => api.get('/heroes/featured'),
  getSlideById: (id) => api.get(`/heroes/${id}`),
};

export const energySolutionService = {
  getAllSolutions: (params) => api.get('/energy-solutions', { params }),
  getActiveSolutions: (params) => api.get('/energy-solutions/active', { params }),
  getFeaturedSolutions: () => api.get('/energy-solutions/featured'),
  getSolutionById: (id) => api.get(`/energy-solutions/id/${id}`),
  getSolutionBySlug: (slug) => api.get(`/energy-solutions/slug/${slug}`),
};

export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),
  getActiveProducts: (params) => api.get('/products/active', { params }),
  getFeaturedProducts: () => api.get('/products/featured'),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getProductsByCategory: (categoryId, params) => api.get(`/products/category/${categoryId}`, { params }),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
  getRelatedProducts: (id) => api.get(`/products/${id}/related`),
  createProduct: (productData) => {
    // Check if productData is FormData for file uploads
    if (productData instanceof FormData) {
      return apiFormData.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.post('/products', productData);
  },
  updateProduct: (id, productData) => {
    // Check if productData is FormData for file uploads
    if (productData instanceof FormData) {
      return apiFormData.put(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.put(`/products/${id}`, productData);
  },
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getProductStats: () => api.get('/products/stats'),
};

export const reviewService = {
  getAllReviews: (params) => api.get('/reviews', { params }),
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  getReview: (id) => api.get(`/reviews/${id}`),
  createReview: (productId, reviewData) => api.post(`/reviews/product/${productId}`, reviewData),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  updateReviewStatus: (id, statusData) => api.put(`/reviews/${id}/status`, statusData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  getReviewStats: () => api.get('/reviews/stats'),
  markReviewHelpful: (id) => api.put(`/reviews/${id}/helpful`),
};

export const wishlistService = {
  getUserWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  isInWishlist: (productId) => api.get(`/wishlist/check/${productId}`),
  clearWishlist: () => api.delete('/wishlist'),
};

export const configService = {
  getCompanyConfig: () => api.get('/config/company'),
  getCurrencyConfig: () => api.get('/config/currency'),
  getSiteSettings: () => api.get('/config/site'),
};

export const testimonialService = {
  getAllTestimonials: (params) => api.get('/testimonials', { params }),
  getActiveTestimonials: (params) => api.get('/testimonials/active', { params }),
  getFeaturedTestimonials: () => api.get('/testimonials/featured'),
  getTestimonialsByProjectType: (type) => api.get(`/testimonials/project-type/${type}`),
};

// teamService is already defined above
// Keeping this commented for reference
// export const teamService = {
//   getAllMembers: (params) => api.get('/team', { params }),
//   getActiveMembers: (params) => api.get('/team/active', { params }),
//   getFeaturedMembers: () => api.get('/team/featured'),
//   getMembersByDepartment: (department) => api.get(`/team/department/${department}`),
// };

export const careerService = {
  getAllCareers: (params) => api.get('/careers', { params }),
  getActiveCareers: (params) => api.get('/careers/active', { params }),
  getFeaturedCareers: () => api.get('/careers/featured'),
  getCareerBySlug: (slug) => api.get(`/careers/slug/${slug}`),
  searchCareers: (query) => api.get(`/careers/search?q=${query}`),
};

export const faqService = {
  getAllFaqs: (params) => api.get('/faqs', { params }),
  getActiveFaqs: (params) => api.get('/faqs/active', { params }),
  getFaqsByCategory: (categoryId) => api.get(`/faqs/category/${categoryId}`),
};

export const categoryService = {
  getAllCategories: (params) => api.get('/categories', { params }),
  getCategoriesByType: (type) => api.get(`/categories/type/${type}`),
  getFeaturedCategories: () => api.get('/categories/featured'),
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`),
};

export const tagService = {
  getAllTags: (params) => api.get('/tags', { params }),
  getTagsByType: (type) => api.get(`/tags/type/${type}`),
  getTagBySlug: (slug) => api.get(`/tags/slug/${slug}`),
};

export const settingService = {
  getPublicSettings: () => api.get('/settings/public'),
};

export const co2EmissionReductionService = {
  getAllReductions: (params) => api.get('/co2-emission-reduction', { params }),
  getActiveReductions: () => api.get('/co2-emission-reduction/active', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getReductionById: (id) => api.get(`/co2-emission-reduction/${id}`),
  createReduction: (data) => api.post('/co2-emission-reduction', data),
  updateReduction: (id, data) => api.put(`/co2-emission-reduction/${id}`, data),
  deleteReduction: (id) => api.delete(`/co2-emission-reduction/${id}`),
  reorderReductions: (items) => api.put('/co2-emission-reduction/reorder', { items }),
};

export const intelligentSolutionService = {
  getAllSolutions: (params) => api.get('/intelligent-solution', { params }),
  getActiveSolutions: () => api.get('/intelligent-solution/active', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getSolutionById: (id) => api.get(`/intelligent-solution/${id}`),
  createSolution: (data) => api.post('/intelligent-solution', data),
  updateSolution: (id, data) => api.put(`/intelligent-solution/${id}`, data),
  deleteSolution: (id) => api.delete(`/intelligent-solution/${id}`),
  reorderSolutions: (items) => api.put('/intelligent-solution/reorder', { items }),
};

// Create a separate axios instance for chatbot API
const chatbotApi = axios.create({
  baseURL: import.meta.env.VITE_CHATBOT_API_URL || 'https://cosmic-support-chatbor.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: (message, conversationId) => chatbotApi.post('/chat/message', { message, conversationId }),
  getConversationHistory: (conversationId) => chatbotApi.get(`/chat/history/${conversationId}`),
  clearConversation: (conversationId) => chatbotApi.delete(`/chat/history/${conversationId}`),
  calculateROI: (monthlyBill, state) => chatbotApi.post('/chat/roi', { monthlyBill, state }),
};

export default api;