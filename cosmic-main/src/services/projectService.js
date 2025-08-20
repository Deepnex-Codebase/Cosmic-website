import api from './api';

const API_BASE_URL = '/projects';

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
    const response = await api.get(`${API_BASE_URL}/featured`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    throw error;
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
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

// Get projects by category
export const getProjectsByCategory = async (category, params = {}) => {
  try {
    const response = await api.get(`${API_BASE_URL}`, { 
      params: { ...params, category } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects by category:', error);
    throw error;
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

export default {
  getAllProjects,
  getFeaturedProjects,
  getProjectStats,
  getProjectById,
  getProjectsByCategory,
  createProject,
  updateProject,
  deleteProject
};