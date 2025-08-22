import axios from 'axios';

// Create axios instance with base URL
// Using environment variables for API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a multipart form data instance for file uploads
const apiFormData = axios.create({
  baseURL: API_BASE_URL,
});

import { getAuthToken } from '../utils/cookies';

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

// API services for different endpoints
export const authService = {
  register: (userData) => api.post('/api/users/register', userData),
  login: (credentials) => api.post('/api/users/login', credentials),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (userData) => api.put('/api/users/profile', userData),
  forgotPassword: (email) => api.post('/api/users/forgot-password', { email }),
  resetPassword: (token, passwords) => api.post(`/api/users/reset-password/${token}`, passwords),
  changePassword: (passwordData) => api.put('/api/users/change-password', passwordData),
};

export const blogService = {
  getAllPosts: (params) => api.get('/api/blog-posts', { params }),
  getActivePosts: (params) => api.get('/api/blog-posts/active', { params }),
  getFeaturedPosts: () => api.get('/api/blog-posts/featured'),
  getPostById: (id) => api.get(`/api/blog-posts/id/${id}`),
  getPostBySlug: (slug) => api.get(`/api/blog-posts/slug/${slug}`),
  searchPosts: (query) => api.get(`/api/blog-posts/search?q=${query}`),
  getPostsByCategory: (categoryId, params) => api.get(`/api/blog-posts/category/${categoryId}`, { params }),
  getPostsByTag: (tagId, params) => api.get(`/api/blog-posts/tag/${tagId}`, { params }),
};

export const projectService = {
  getAllProjects: (params) => api.get('/api/projects', { params }),
  getActiveProjects: (params) => api.get('/api/projects/active', { params }),
  getFeaturedProjects: () => api.get('/api/projects/featured'),
  getProjectById: (id) => api.get(`/api/projects/id/${id}`),
};

export const directorService = {
  getAllDirectors: () => api.get('/api/directors', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getDirector: (id) => api.get(`/api/directors/${id}`, {
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
      return apiFormData.post('/api/directors', directorData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.post('/api/directors', directorData);
  },
  updateDirector: (id, directorData) => {
    // Check if directorData is FormData
    if (directorData instanceof FormData) {
      return apiFormData.put(`/api/directors/${id}`, directorData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.put(`/api/directors/${id}`, directorData);
  },
  deleteDirector: (id) => api.delete(`/api/directors/${id}`),
  updateDirectorOrder: (id, direction) => api.put(`/api/directors/order/${id}/${direction}`),
};

export const teamService = {
  getAllTeamMembers: () => api.get('/api/team', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getTeamMember: (id) => api.get(`/api/team/${id}`, {
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
      return apiFormData.post('/api/team', teamMemberData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.post('/api/team', teamMemberData);
  },
  updateTeamMember: (id, teamMemberData) => {
    // Check if teamMemberData is FormData
    if (teamMemberData instanceof FormData) {
      return apiFormData.put(`/api/team/${id}`, teamMemberData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.put(`/api/team/${id}`, teamMemberData);
  },
  deleteTeamMember: (id) => api.delete(`/api/team/${id}`),
  updateTeamMemberOrder: (id, direction) => api.put(`/api/team/order/${id}/${direction}`),
};

export const journeyService = {
  getAllMilestones: (params) => api.get('/api/cms/solar-journey', { params }),
  getActiveMilestones: () => api.get('/api/cms/solar-journey/active', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getMilestoneById: (id) => api.get(`/api/cms/solar-journey/${id}`),
  createMilestone: (data) => api.post('/api/cms/solar-journey', data),
  updateMilestone: (id, data) => api.put(`/api/cms/solar-journey/${id}`, data),
  deleteMilestone: (id) => api.delete(`/api/cms/solar-journey/${id}`),
  reorderMilestones: (items) => api.put('/api/cms/solar-journey/reorder', { items }),
};

export const contactService = {
  submitContactForm: (formData) => api.post('/api/contacts', formData),
};

export const heroService = {
  getActiveSlides: () => api.get('/api/heroes/active'),
  getFeaturedSlides: () => api.get('/api/heroes/featured'),
  getSlideById: (id) => api.get(`/api/heroes/${id}`),
};

export const energySolutionService = {
  getAllSolutions: (params) => api.get('/api/energy-solutions', { params }),
  getActiveSolutions: (params) => api.get('/api/energy-solutions/active', { params }),
  getFeaturedSolutions: () => api.get('/api/energy-solutions/featured'),
  getSolutionById: (id) => api.get(`/api/energy-solutions/id/${id}`),
  getSolutionBySlug: (slug) => api.get(`/api/energy-solutions/slug/${slug}`),
};

export const productService = {
  getAllProducts: (params) => api.get('/api/products', { params }),
  getActiveProducts: (params) => api.get('/api/products/active', { params }),
  getFeaturedProducts: () => api.get('/api/products/featured'),
  getProductById: (id) => api.get(`/api/products/${id}`),
  getProductBySlug: (slug) => api.get(`/api/products/slug/${slug}`),
  getProductsByCategory: (categoryId, params) => api.get(`/api/products/category/${categoryId}`, { params }),
  searchProducts: (query) => api.get(`/api/products/search?q=${query}`),
  getRelatedProducts: (id) => api.get(`/api/products/${id}/related`),
  createProduct: (productData) => {
    // Check if productData is FormData for file uploads
    if (productData instanceof FormData) {
      return apiFormData.post('/api/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.post('/api/products', productData);
  },
  updateProduct: (id, productData) => {
    // Check if productData is FormData for file uploads
    if (productData instanceof FormData) {
      return apiFormData.put(`/api/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    return api.put(`/api/products/${id}`, productData);
  },
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
  getProductStats: () => api.get('/api/products/stats'),
};

export const reviewService = {
  getAllReviews: (params) => api.get('/api/reviews', { params }),
  getProductReviews: (productId, params) => api.get(`/api/reviews/product/${productId}`, { params }),
  getReview: (id) => api.get(`/api/reviews/${id}`),
  createReview: (productId, reviewData) => api.post(`/api/reviews/product/${productId}`, reviewData),
  updateReview: (id, reviewData) => api.put(`/api/reviews/${id}`, reviewData),
  updateReviewStatus: (id, statusData) => api.put(`/api/reviews/${id}/status`, statusData),
  deleteReview: (id) => api.delete(`/api/reviews/${id}`),
  getReviewStats: () => api.get('/api/reviews/stats'),
  markReviewHelpful: (id) => api.put(`/api/reviews/${id}/helpful`),
};

export const wishlistService = {
  getUserWishlist: () => api.get('/api/wishlist'),
  addToWishlist: (productId) => api.post('/api/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/api/wishlist/${productId}`),
  isInWishlist: (productId) => api.get(`/api/wishlist/check/${productId}`),
  clearWishlist: () => api.delete('/api/wishlist'),
};

export const configService = {
  getCompanyConfig: () => api.get('/api/config/company'),
  getCurrencyConfig: () => api.get('/api/config/currency'),
  getSiteSettings: () => api.get('/api/config/site'),
};

export const testimonialService = {
  getAllTestimonials: (params) => api.get('/api/testimonials', { params }),
  getActiveTestimonials: (params) => api.get('/api/testimonials/active', { params }),
  getFeaturedTestimonials: () => api.get('/api/testimonials/featured'),
  getTestimonialsByProjectType: (type) => api.get(`/api/testimonials/project-type/${type}`),
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
  getAllCareers: (params) => api.get('/api/careers', { params }),
  getActiveCareers: (params) => api.get('/api/careers/active', { params }),
  getFeaturedCareers: () => api.get('/api/careers/featured'),
  getCareerBySlug: (slug) => api.get(`/api/careers/slug/${slug}`),
  searchCareers: (query) => api.get(`/api/careers/search?q=${query}`),
};

export const faqService = {
  getAllFaqs: (params) => api.get('/api/faqs', { params }),
  getActiveFaqs: (params) => api.get('/api/faqs/active', { params }),
  getFaqsByCategory: (categoryId) => api.get(`/api/faqs/category/${categoryId}`),
};

export const categoryService = {
  getAllCategories: (params) => api.get('/api/categories', { params }),
  getCategoriesByType: (type) => api.get(`/api/categories/type/${type}`),
  getFeaturedCategories: () => api.get('/api/categories/featured'),
  getCategoryBySlug: (slug) => api.get(`/api/categories/slug/${slug}`),
};

export const tagService = {
  getAllTags: (params) => api.get('/api/tags', { params }),
  getTagsByType: (type) => api.get(`/api/tags/type/${type}`),
  getTagBySlug: (slug) => api.get(`/api/tags/slug/${slug}`),
};

export const settingService = {
  getPublicSettings: () => api.get('/api/settings/public'),
};

export const co2EmissionReductionService = {
  getAllReductions: (params) => api.get('/api/co2-emission-reduction', { params }),
  getActiveReductions: () => api.get('/api/co2-emission-reduction/active', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getReductionById: (id) => api.get(`/api/co2-emission-reduction/${id}`),
  createReduction: (data) => api.post('/api/co2-emission-reduction', data),
  updateReduction: (id, data) => api.put(`/api/co2-emission-reduction/${id}`, data),
  deleteReduction: (id) => api.delete(`/api/co2-emission-reduction/${id}`),
  reorderReductions: (items) => api.put('/api/co2-emission-reduction/reorder', { items }),
};

export const intelligentSolutionService = {
  getAllSolutions: (params) => api.get('/api/intelligent-solution', { params }),
  getActiveSolutions: () => api.get('/api/intelligent-solution/active', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getSolutionById: (id) => api.get(`/api/intelligent-solution/${id}`),
  createSolution: (data) => api.post('/api/intelligent-solution', data),
  updateSolution: (id, data) => api.put(`/api/intelligent-solution/${id}`, data),
  deleteSolution: (id) => api.delete(`/api/intelligent-solution/${id}`),
  reorderSolutions: (items) => api.put('/api/intelligent-solution/reorder', { items }),
};

// Create a separate axios instance for chatbot API
const chatbotApi = axios.create({
  baseURL: import.meta.env.VITE_CHATBOT_API_URL || 'https://cosmic-support-chatbor.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: (message, conversationId) => chatbotApi.post('/api/chat/message', { message, conversationId }),
  getConversationHistory: (conversationId) => chatbotApi.get(`/api/chat/history/${conversationId}`),
  clearConversation: (conversationId) => chatbotApi.delete(`/api/chat/history/${conversationId}`),
  calculateROI: (monthlyBill, state) => chatbotApi.post('/api/chat/roi', { monthlyBill, state }),
};

export default api;