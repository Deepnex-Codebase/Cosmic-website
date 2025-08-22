import axios from 'axios';

// Define API_BASE_URL using environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
const API_BASE_URL = `${BASE_URL}/processes`;

// Get all processes with filtering
export const getAllProcesses = async (params = {}) => {
  try {
    const response = await axios.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching processes:', error);
    throw error;
  }
};

// Get delivery processes specifically
export const getDeliveryProcesses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/delivery`);
    return response.data;
  } catch (error) {
    console.error('Error fetching delivery processes:', error);
    throw error;
  }
};

// Get single process by ID
export const getProcessById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching process:', error);
    throw error;
  }
};

// Create new process
export const createProcess = async (processData) => {
  try {
    const response = await axios.post(API_BASE_URL, processData);
    return response.data;
  } catch (error) {
    console.error('Error creating process:', error);
    throw error;
  }
};

// Update process
export const updateProcess = async (id, processData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, processData);
    return response.data;
  } catch (error) {
    console.error('Error updating process:', error);
    throw error;
  }
};

// Delete process
export const deleteProcess = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting process:', error);
    throw error;
  }
};

// Update process order
export const updateProcessOrder = async (processes) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/order`, { processes });
    return response.data;
  } catch (error) {
    console.error('Error updating process order:', error);
    throw error;
  }
};

export default {
  getAllProcesses,
  getDeliveryProcesses,
  getProcessById,
  createProcess,
  updateProcess,
  deleteProcess,
  updateProcessOrder
};