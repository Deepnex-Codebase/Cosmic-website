import api from './api';
import axios from 'axios';

// Import for Green Future data
import { getGreenFutureData } from './greenFutureService';

// Define API path using api service
const API_BASE_URL = '/projects';

// Define direct API URL as fallback
const DIRECT_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

// Create a direct axios instance for fallback
const directApi = axios.create({
  baseURL: DIRECT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Get all projects with pagination and filtering
export const getAllProjects = async (params = {}) => {
  try {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Get featured projects
export const getFeaturedProjects = async () => {
  try {
    // Try with main API first
    const response = await api.get(`${API_BASE_URL}/featured`);
    // Return the entire response to handle different API response formats in the component
    return response;
  } catch (mainError) {
    console.error('Error fetching featured projects from main API:', mainError);
    
    // Try with direct API as fallback
    try {
      console.log('Attempting to fetch from direct API URL...');
      const directResponse = await directApi.get(`/projects/featured`);
      return directResponse;
    } catch (fallbackError) {
      console.error('Error fetching featured projects from fallback API:', fallbackError);
      // Return empty array if both attempts fail
      return [];
    }
  }
};

// Get project statistics
export const getProjectStats = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project stats:', error);
    throw error;
  }
};

// Get single project by ID or slug
export const getProjectById = async (id) => {
  try {
    // Try with main API first
    const response = await api.get(`${API_BASE_URL}/${id}`);
    // Return the entire response to handle different API response formats in the component
    return response;
  } catch (mainError) {
    console.error('Error fetching project from main API:', mainError);
    
    // Try with direct API as fallback
    try {
      console.log('Attempting to fetch project from direct API URL...');
      const directResponse = await directApi.get(`/projects/${id}`);
      return directResponse;
    } catch (fallbackError) {
      console.error('Error fetching project from fallback API:', fallbackError);
      // Return empty object if both attempts fail
      return {};
    }
  }
};

// Get projects by category
export const getProjectsByCategory = async (category, params = {}) => {
  try {
    // Try with main API first
    const response = await api.get(`${API_BASE_URL}`, { 
      params: { ...params, category } 
    });
    // Return the entire response to handle different API response formats in the component
    return response;
  } catch (mainError) {
    console.error('Error fetching projects by category from main API:', mainError);
    
    // Try with direct API as fallback
    try {
      console.log('Attempting to fetch projects by category from direct API URL...');
      const directResponse = await directApi.get(`/projects`, {
        params: { ...params, category }
      });
      return directResponse;
    } catch (fallbackError) {
      console.error('Error fetching projects by category from fallback API:', fallbackError);
      // Return empty array if both attempts fail
      return [];
    }
  }
};

// Create new project
export const createProject = async (projectData) => {
  try {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(projectData).forEach(key => {
      if (key === 'features' || key === 'specifications' || key === 'seo' || key === 'testimonial') {
        formData.append(key, JSON.stringify(projectData[key]));
      } else if (key === 'featuredImage' && projectData[key] instanceof File) {
        formData.append('featuredImage', projectData[key]);
      } else if (key === 'images' && Array.isArray(projectData[key])) {
        projectData[key].forEach((file) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
      } else {
        formData.append(key, projectData[key]);
      }
    });

    const response = await api.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update project
export const updateProject = async (id, projectData) => {
  try {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(projectData).forEach(key => {
      if (key === 'features' || key === 'specifications' || key === 'seo' || key === 'testimonial') {
        formData.append(key, JSON.stringify(projectData[key]));
      } else if (key === 'featuredImage' && projectData[key] instanceof File) {
        formData.append('featuredImage', projectData[key]);
      } else if (key === 'images' && Array.isArray(projectData[key])) {
        projectData[key].forEach((file) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
      } else {
        formData.append(key, projectData[key]);
      }
    });

    const response = await api.put(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete project (soft delete)
export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Fetch projects with pagination and filtering
export const fetchProjects = async (params = {}) => {
  try {
    // Try with main API first
    const response = await api.get(`${API_BASE_URL}`, { params });
    return response;
  } catch (mainError) {
    console.error('Error fetching projects from main API:', mainError);
    
    // Try with direct API as fallback
    try {
      console.log('Attempting to fetch projects from direct API URL...');
      const directResponse = await directApi.get(`/projects`, { params });
      return directResponse;
    } catch (fallbackError) {
      console.error('Error fetching projects from fallback API:', fallbackError);
      // Return empty array if both attempts fail
      return { data: { data: [] } };
    }
  }
};

export default {
  getAllProjects,
  getFeaturedProjects,
  getProjectStats,
  getProjectById,
  getProjectsByCategory,
  createProject,
  updateProject,
  deleteProject,
  fetchProjects
};