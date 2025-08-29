import api from './api';

// Define API path using api service
const API_BASE_URL = '/services';

// Get all services with pagination and filtering
export const getAllServices = async (params = {}) => {
  try {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Get services by category
export const getServicesByCategory = async (category) => {
  try {
    const response = await api.get(`${API_BASE_URL}/category/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services by category:', error);
    throw error;
  }
};

// Get featured services
export const getFeaturedServices = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/featured`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured services:', error);
    throw error;
  }
};

// Get single service by ID
export const getServiceById = async (id) => {
  try {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

// Create new service
export const createService = async (serviceData) => {
  try {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(serviceData).forEach(key => {
      if (key === 'features' || key === 'seo') {
        formData.append(key, JSON.stringify(serviceData[key]));
      } else if (key === 'image') {
        if (serviceData[key] instanceof File) {
          // Ensure we're dealing with a proper File object
          const imageFile = new File([serviceData[key]], serviceData[key].name, {
            type: serviceData[key].type,
            lastModified: serviceData[key].lastModified
          });
          
          formData.append('image', imageFile);
          console.log('Appending image file to FormData for create:', imageFile.name, imageFile.size, 'bytes');
          console.log('Image file type:', imageFile.type);
          console.log('Image file is instance of File:', imageFile instanceof File);
        } else if (serviceData[key] && typeof serviceData[key] === 'string' && !serviceData[key].startsWith('blob:')) {
          // If it's a string URL but not a blob URL, append it to FormData
          // The backend needs the existing image path
          formData.append('image', serviceData[key]);
          console.log('Existing image path appended to FormData for create:', serviceData[key]);
        } else {
          console.log('Image is neither a File nor a valid URL, skipping in create');
        }
      } else if (key !== 'imagePreview') { // Skip imagePreview field
        formData.append(key, serviceData[key]);
      }
    });

    // Log FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    const response = await api.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

// Update service
export const updateService = async (id, serviceData) => {
  try {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(serviceData).forEach(key => {
      if (key === 'features' || key === 'seo') {
        formData.append(key, JSON.stringify(serviceData[key]));
      } else if (key === 'image') {
        if (serviceData[key] instanceof File) {
          // Ensure we're dealing with a proper File object
          const imageFile = new File([serviceData[key]], serviceData[key].name, {
            type: serviceData[key].type,
            lastModified: serviceData[key].lastModified
          });
          
          formData.append('image', imageFile);
          console.log('Appending image file to FormData for update:', imageFile.name, imageFile.size, 'bytes');
          console.log('Image file type:', imageFile.type);
          console.log('Image file is instance of File:', imageFile instanceof File);
        } else if (serviceData[key] && typeof serviceData[key] === 'string' && !serviceData[key].startsWith('blob:')) {
          // If it's a string URL but not a blob URL, append it to FormData
          // The backend needs the existing image path
          formData.append('image', serviceData[key]);
          console.log('Existing image path appended to FormData for update:', serviceData[key]);
        } else {
          console.log('Image is neither a File nor a valid URL, skipping');
        }
      } else if (key !== 'imagePreview') { // Skip imagePreview field
        formData.append(key, serviceData[key]);
      }
    });

    // Log FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    const response = await api.put(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

// Delete service
export const deleteService = async (id) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// Get service statistics
export const getServiceStats = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service stats:', error);
    throw error;
  }
};

// Update service order
export const updateServiceOrder = async (services) => {
  try {
    const response = await api.patch(`${API_BASE_URL}/order`, { services });
    return response.data;
  } catch (error) {
    console.error('Error updating service order:', error);
    throw error;
  }
};

export default {
  getAllServices,
  getServicesByCategory,
  getFeaturedServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceStats,
  updateServiceOrder
};