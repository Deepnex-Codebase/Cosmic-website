import api from './api';

export const navigationService = {
  // Get menus by location (header, footer, sidebar, mobile, other)
  getMenusByLocation: (location) => api.get(`/menus/location/${location}`),
  
  // Get menus by location with navigation formatting
  getFormattedMenusByLocation: (location) => api.get(`/menus/location/${location}?includeNavigation=true`),
  
  // Get navigation data directly from navigation API
  getNavigationByLocation: (location) => api.get(`/navigation/location/${location}`),
  
  // Get menu by ID
  getMenuById: (id) => api.get(`/menus/id/${id}`),
  
  // Get menu by slug
  getMenuBySlug: (slug) => api.get(`/menus/slug/${slug}`),
};

export default navigationService;