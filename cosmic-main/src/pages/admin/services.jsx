import React, { useState, useEffect } from 'react';
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
  deleteService 
} from '../../services/serviceService';

// Define image base URL
const IMAGE_BASE_URL = 'https://api.cosmicpowertech.com';

// Helper function to format image URLs
const formatImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a complete URL or a blob URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  
  // Clean the path by removing /api/ if present
  const cleanImagePath = imagePath.replace(/^\/api\//, '/');
  
  // Combine with base URL
  return `${IMAGE_BASE_URL}${cleanImagePath}`;
};

const AdminServices = () => {
  // State management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    features: [],
    icon: 'FiSun',
    image: null,
    category: 'core',
    color: 'from-accent-400 to-accent-600',
    bgColor: 'bg-accent-50',
    hoverColor: 'group-hover:text-accent-500',
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

  const [newFeature, setNewFeature] = useState('');

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

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllServices();
      setServices(response.data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Auto-refresh services every 30 seconds when component is active
  useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-refresh if not currently loading or submitting
      if (!loading && !submitting && !showModal) {
        fetchServices();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loading, submitting, showModal]);

  // Refresh data when user returns to the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading && !submitting) {
        fetchServices();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loading, submitting]);

  // Refresh data when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (!loading && !submitting) {
        fetchServices();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loading, submitting]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const serviceData = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== '')
      };

      if (editingService) {
        await updateService(editingService._id, serviceData);
        toast.success('Service updated successfully!');
      } else {
        await createService(serviceData);
        toast.success('Service created successfully!');
      }

      // Auto refresh services list
      await fetchServices();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error('Error saving service:', err);
      const errorMessage = editingService ? 'Failed to update service' : 'Failed to create service';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        toast.success('Service deleted successfully!');
        
        // Auto refresh services list
        await fetchServices();
      } catch (err) {
        console.error('Error deleting service:', err);
        setError('Failed to delete service');
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
      category: 'core',
      color: 'from-accent-400 to-accent-600',
      bgColor: 'bg-accent-50',
      hoverColor: 'group-hover:text-accent-500',
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
  };

  // Handle edit
  const handleEdit = (service) => {
    setFormData({
      ...service,
      features: service.features || [],
      seo: service.seo || { title: '', description: '', keywords: '' }
    });
    setEditingService(service);
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
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
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
            onClick={fetchServices}
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
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredServices.map((service) => (
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
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
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

      {/* Empty state */}
      {filteredServices.length === 0 && (
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
                    Service Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
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
                    className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin mr-2" />
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