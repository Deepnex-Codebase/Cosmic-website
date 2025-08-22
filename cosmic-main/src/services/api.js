import axios from 'axios';

// Create axios instance with base URL
// Using environment variables for API URL configuration
const API_BASE_URL = '/api';

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
  deleteTeamMember: (id) => api.delete(`/team/${id}`),
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
  sendMessage: (message, conversationId) => chatbotApi.post('/api/chat/message', { message, conversationId }),
  getConversationHistory: (conversationId) => chatbotApi.get(`/api/chat/history/${conversationId}`),
  clearConversation: (conversationId) => chatbotApi.delete(`/api/chat/history/${conversationId}`),
  calculateROI: (monthlyBill, state) => chatbotApi.post('/api/chat/roi', { monthlyBill, state }),
};

export default api;