import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiSave, 
  FiX, 
  FiUpload,
  FiLoader,
  FiSearch,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import { 
  getAllServices, 
  createService, 
  updateService, 
  deleteService,
  getServiceStats,
  getPageSections,
  updatePageSections
} from '../../services/serviceService';

// Define image base URL
const IMAGE_BASE_URL = 'https://api.cosmicpowertech.com';

// Helper function to format image URLs
const formatImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a complete URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  
  // Clean the path and ensure it doesn't start with a slash
  let cleanImagePath = imagePath.replace(/^\/api\//, '');
  if (cleanImagePath.startsWith('/')) {
    cleanImagePath = cleanImagePath.substring(1);
  }
  
  // Combine with base URL
  return `${IMAGE_BASE_URL}/${cleanImagePath}`;
};

const AdminServices = () => {
  // State for services data
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    featured: 0,
    byCategory: []
  });
  
  // State for page sections
  const [pageSections, setPageSections] = useState({
    coreServicesTitle: 'Our Core Services',
    coreServicesSubtitle: 'We provide comprehensive solar solutions to meet your energy needs',
    specializedSolutionsTitle: 'Specialized Solutions',
    specializedSolutionsSubtitle: 'Enhance your solar experience with our additional specialized services',
    processTitle: 'Our Streamlined Process',
    processSubtitle: 'We\'ve perfected our approach to deliver exceptional solar solutions with efficiency and precision',
    heroTitle: 'Service'
  });
  const [savingSections, setSavingSections] = useState(false);
  
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Fixed limit of 10 items per page
  
  // State for modal and form
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  // Form state with initial values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    features: [],
    icon: 'FiSun',
    image: null,
    imagePreview: null,
    category: 'core',
    order: 0,
    stepNumber: 1,
    isActive: true,
    featured: false,
    seo: {
      title: '',
      description: '',
      keywords: ''
    }
  });

  // Categories and icons
  const categories = [
    { value: 'core', label: 'Core Services' },
    { value: 'specialized', label: 'Specialized Services' },
    { value: 'process', label: 'Process Steps' }
  ];

  const iconOptions = [
    'FiSun', 'FiSettings', 'FiBarChart', 'FiZap', 'FiHome', 
    'FiTruck', 'FiCpu', 'FiTool', 'FiCheckCircle'
  ];

  // Fetch services with pagination and filters
  const fetchServices = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = {
        page,
        limit,
        ...(searchTerm && { search: searchTerm }),
        ...(filterCategory !== 'all' && { category: filterCategory })
      };
      
      const response = await getAllServices(params);
      
      if (response.success) {
        setServices(response.data || []);
        setCurrentPage(response.pagination?.currentPage || 1);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        throw new Error(response.message || 'Failed to fetch services');
      }
      
      // Fetch stats
      await fetchServiceStats();
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services: ' + (err.message || 'Unknown error'));
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategory, limit]);

  // Fetch service statistics
  const fetchServiceStats = async () => {
    try {
      const response = await getServiceStats();
      if (response.success) {
        setStats(response.data || {
          total: 0,
          active: 0,
          featured: 0,
          byCategory: []
        });
      }
    } catch (err) {
      console.error('Error fetching service stats:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchServices(1);
    fetchPageSections();
  }, [fetchServices]);
  
  // Fetch page sections
  const fetchPageSections = async () => {
    try {
      const response = await getPageSections();
      if (response.success && response.data) {
        setPageSections(response.data);
      }
    } catch (err) {
      console.error('Error fetching page sections:', err);
      toast.error('Failed to load page section settings');
    }
  };
  
  // Handle page sections update
  const handleUpdatePageSections = async () => {
    try {
      setSavingSections(true);
      
      // Extract the specific fields expected by the server
      const sectionData = {
        coreServicesTitle: pageSections.coreServicesTitle || '',
        coreServicesSubtitle: pageSections.coreServicesSubtitle || '',
        specializedSolutionsTitle: pageSections.specializedSolutionsTitle || '',
        specializedSolutionsSubtitle: pageSections.specializedSolutionsSubtitle || '',
        processTitle: pageSections.processTitle || '',
        processSubtitle: pageSections.processSubtitle || '',
        heroTitle: pageSections.heroTitle || ''
      };
      
      // Make sure we're sending a non-empty object
      if (Object.values(sectionData).some(value => value !== '')) {
        const response = await updatePageSections(sectionData);
        
        if (response && response.success) {
          toast.success('Page section settings updated successfully');
        } else if (response) {
          throw new Error(response.message || 'Failed to update page sections');
        } else {
          throw new Error('No response received from server');
        }
      } else {
        throw new Error('No data to update');
      }
    } catch (err) {
      console.error('Error updating page sections:', err);
      toast.error(`Failed to update page section settings: ${err.message}`);
    } finally {
      setSavingSections(false);
    }
  };

  // Handle search and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices(1); // Reset to first page when filters change
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, filterCategory, fetchServices]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validate required fields
    const requiredFields = ['title', 'description', 'category'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      const errorMsg = `Please fill in all required fields: ${missingFields.join(', ')}`;
      setError(errorMsg);
      toast.error(errorMsg);
      setSubmitting(false);
      return;
    }

    // Image is now optional for all services
    // No validation needed for image

    try {
      // Prepare service data for submission
      const serviceData = {
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription || '',
        category: formData.category,
        icon: formData.icon || '', // Make icon optional
        order: parseInt(formData.order) || 0,
        stepNumber: parseInt(formData.stepNumber) || 1,
        isActive: Boolean(formData.isActive),
        featured: Boolean(formData.featured),
        
        // Filter out empty features
        features: formData.features ? formData.features.filter(f => f.trim() !== '') : [],
        
        // Include SEO data
        seo: formData.seo || { title: '', description: '', keywords: '' },
        
        // Include image if it exists
        image: formData.image
      };
      
      let response;
      if (editingService) {
        response = await updateService(editingService._id, serviceData);
        if (response.success) {
          toast.success('Service updated successfully!');
        } else {
          throw new Error(response.message || 'Failed to update service');
        }
      } else {
        response = await createService(serviceData);
        if (response.success) {
          toast.success('Service created successfully!');
        } else {
          throw new Error(response.message || 'Failed to create service');
        }
      }

      resetForm();
      setShowModal(false);
      // Fetch services after modal is closed
      fetchServices(currentPage);
    } catch (err) {
      console.error('Error saving service:', err);
      const errorMessage = editingService ? 'Failed to update service' : 'Failed to create service';
      setError(`${errorMessage}: ${err.message || 'Unknown error'}`);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await deleteService(id);
        
        if (response.success) {
          toast.success('Service deleted successfully!');
          // Auto refresh services list
          fetchServices(currentPage);
        } else {
          throw new Error(response.message || 'Failed to delete service');
        }
      } catch (err) {
        console.error('Error deleting service:', err);
        setError('Failed to delete service: ' + (err.message || 'Unknown error'));
        toast.error('Failed to delete service');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      features: [],
      icon: 'FiSun',
      image: null,
      imagePreview: null,
      category: 'core',
      order: 0,
      stepNumber: 1,
      isActive: true,
      featured: false,
      seo: {
        title: '',
        description: '',
        keywords: ''
      }
    });
    setEditingService(null);
    setNewFeature('');
    
    // Reset any file input elements
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle edit
  const handleEdit = (service) => {
    // Format image URL if it exists
    let imageUrl = service.image ? formatImageUrl(service.image) : null;
    
    setFormData({
      ...service,
      features: service.features || [],
      seo: service.seo || { title: '', description: '', keywords: '' },
      image: service.image, // Store the existing image path string
      imagePreview: imageUrl // Set the image preview URL
    });
    setEditingService(service);
    
    // Reset any file input elements
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
    
    setShowModal(true);
  };

  // Add feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // Remove feature
  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size exceeds 5MB limit. Please upload a smaller file.');
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image files (JPEG, PNG, JPG, WEBP) are allowed.');
        return;
      }
      
      // Show loading toast while processing image
      const loadingToast = toast.loading('Processing image...');
      
      // Create a temporary URL for the image preview
      const imageUrl = URL.createObjectURL(file);
      
      // Use setTimeout to give browser time to process the image
      setTimeout(() => {
        setFormData(prev => ({ 
          ...prev, 
          image: file,
          imagePreview: imageUrl // Store the URL for preview
        }));
        
        // Update loading toast
        toast.update(loadingToast, {
          render: 'Image ready',
          type: 'success',
          isLoading: false,
          autoClose: 1000
        });
        
        // Reset the file input value to ensure onChange triggers even if same file is selected again
        e.target.value = '';
      }, 500);
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchServices(page);
  };

  // Loading component
  if (loading && services.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FiLoader className="w-8 h-8 animate-spin text-accent-500" />
        <span className="ml-2 text-gray-600">Loading services...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Services Management</h1>
        <p className="text-gray-600">Manage your website services and content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Services</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Active Services</h3>
          <p className="text-2xl font-bold text-green-600">{stats.active || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Featured Services</h3>
          <p className="text-2xl font-bold text-yellow-500">{stats.featured || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-accent-500">{stats.byCategory?.length || 0}</p>
        </div>
      </div>

      {/* Page Section Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Page Section Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hero Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Title
            </label>
            <input
              type="text"
              value={pageSections.heroTitle || ''}
              onChange={(e) => setPageSections({...pageSections, heroTitle: e.target.value})}
              placeholder="Hero Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
          
          {/* Core Services Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Core Services Title
            </label>
            <input
              type="text"
              value={pageSections.coreServicesTitle || ''}
              onChange={(e) => setPageSections({...pageSections, coreServicesTitle: e.target.value})}
              placeholder="Core Services Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Core Services Subtitle
            </label>
            <input
              type="text"
              value={pageSections.coreServicesSubtitle || ''}
              onChange={(e) => setPageSections({...pageSections, coreServicesSubtitle: e.target.value})}
              placeholder="Core Services Subtitle"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
          
          {/* Specialized Solutions Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialized Solutions Title
            </label>
            <input
              type="text"
              value={pageSections.specializedSolutionsTitle || ''}
              onChange={(e) => setPageSections({...pageSections, specializedSolutionsTitle: e.target.value})}
              placeholder="Specialized Solutions Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialized Solutions Subtitle
            </label>
            <input
              type="text"
              value={pageSections.specializedSolutionsSubtitle || ''}
              onChange={(e) => setPageSections({...pageSections, specializedSolutionsSubtitle: e.target.value})}
              placeholder="Specialized Solutions Subtitle"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
          
          {/* Process Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Process Title
            </label>
            <input
              type="text"
              value={pageSections.processTitle || ''}
              onChange={(e) => setPageSections({...pageSections, processTitle: e.target.value})}
              placeholder="Process Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Process Subtitle
            </label>
            <input
              type="text"
              value={pageSections.processSubtitle || ''}
              onChange={(e) => setPageSections({...pageSections, processSubtitle: e.target.value})}
              placeholder="Process Subtitle"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpdatePageSections}
            disabled={savingSections}
            className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 flex items-center"
          >
            {savingSections ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Section Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchServices(currentPage)}
            disabled={loading}
            className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Service Image */}
              <div className="h-48 bg-gray-200 relative">
                {service.image ? (
                  <img
                    src={formatImageUrl(service.image)}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FiUpload className="w-12 h-12" />
                  </div>
                )}
                
                {/* Status badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {service.featured && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                      Featured
                    </span>
                  )}
                  <span className={`px-2 py-1 text-white text-xs rounded ${
                    service.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Category badge */}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-accent-500 text-white text-xs rounded">
                    {categories.find(c => c.value === service.category)?.label || service.category}
                  </span>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {service.description}
                </p>
                
                {/* Features count */}
                <div className="text-xs text-gray-500 mb-3">
                  {service.features?.length || 0} features • Order: {service.order || 0}
                  {service.category === 'process' && ` • Step: ${service.stepNumber || 1}`}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    <FiEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    <FiTrash2 className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-12">
          <FiEye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first service'
            }
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Your First Service
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-accent-500 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Long Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.longDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.features];
                            newFeatures[index] = e.target.value;
                            setFormData(prev => ({ ...prev, features: newFeatures }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add new feature"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                  </div>

                  {formData.category === 'process' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Step Number
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.stepNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, stepNumber: parseInt(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                    />
                    Active
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="mr-2"
                    />
                    Featured
                  </label>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Image {!editingService && '*'}
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
                      {formData.imagePreview ? (
                        <img 
                          src={formData.imagePreview} 
                          alt="Service preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : formData.image ? (
                        <img 
                          src={formatImageUrl(formData.image)} 
                          alt="Service image" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                          }}
                        />
                      ) : (
                        <FiUpload className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="service-image-upload"
                        name="image"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleImageUpload}
                        className="w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-accent-50 file:text-accent-700
                          hover:file:bg-accent-100
                          cursor-pointer"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Recommended size: 800x600px. Max size: 5MB. Supported formats: JPEG, PNG, JPG, WEBP.
                      </p>
                      {formData.image instanceof File && (
                        <p className="mt-1 text-xs text-green-500">
                          Selected file: {formData.image.name} ({Math.round(formData.image.size / 1024)} KB)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={formData.seo.title}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: { ...prev.seo, title: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO Description
                      </label>
                      <textarea
                        rows={2}
                        value={formData.seo.description}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: { ...prev.seo, description: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.seo.keywords}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: { ...prev.seo, keywords: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[150px]"
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="w-5 h-5 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        {editingService ? 'Update Service' : 'Create Service'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;