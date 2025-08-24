import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiRefreshCw, FiSearch, FiFilter, FiUpload, FiX, FiSave, FiImage, FiMapPin, FiCalendar, FiUser, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

// Define API_BASE_URL using environment variable
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com')

// Base URL for images (without /api)
const IMAGE_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com').replace(/\/api$/, '');

// Helper function to format image URLs
const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  // Remove /api from path if it exists
  const baseUrl = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
  // Remove /api from the image path if it exists
  const cleanImagePath = imageUrl.startsWith('/api/') ? imageUrl.replace('/api/', '/') : imageUrl;
  return `${baseUrl}${cleanImagePath.startsWith('/') ? '' : '/'}${cleanImagePath}`;
};

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Residential',
    location: '',
    capacity: '',
    completionDate: '',
    client: '',
    status: 'Completed',
    features: [''],
    specifications: {
      panelType: '',
      inverterType: '',
      mountingSystem: '',
      energyOutput: '',
      co2Reduction: ''
    },
    testimonial: {
      clientName: '',
      clientDesignation: '',
      feedback: '',
      rating: 5
    },
    isFeatured: false,
    seoTitle: '',
    seoDescription: ''
  });

  const [featuredImage, setFeaturedImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  const categories = ['Residential', 'Commercial', 'Industrial', 'Utility Scale'];
  const statuses = ['Planning', 'In Progress', 'Completed', 'On Hold'];

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, [currentPage, searchTerm, filterCategory, filterStatus]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !submitting && !showModal) {
        fetchProjects();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, submitting, showModal]);

  // Refresh when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (!loading && !submitting && !showModal) {
        fetchProjects();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !loading && !submitting && !showModal) {
        fetchProjects();
      }
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [loading, submitting, showModal]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(filterCategory && { category: filterCategory }),
        ...(filterStatus && { status: filterStatus })
      });

      const response = await axios.get(`${API_BASE_URL}/projects?${params}`);
      if (response.data.success) {
        setProjects(response.data.data);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          submitData.append(key, JSON.stringify(formData[key].filter(f => f.trim())));
        } else if (key === 'specifications' || key === 'testimonial') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add images
      if (featuredImage) {
        submitData.append('featuredImage', featuredImage);
      }
      additionalImages.forEach(image => {
        submitData.append('images', image);
      });

      // Add folder parameter for image uploads
      submitData.append('folder', 'navbar');
      let response;
      if (editingProject) {
        response = await axios.put(`${API_BASE_URL}/projects/${editingProject._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Project updated successfully!');
      } else {
        response = await axios.post(`${API_BASE_URL}/projects`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Project created successfully!');
      }

      if (response.data.success) {
        setShowModal(false);
        resetForm();
        fetchProjects();
        fetchStats();
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/projects/${id}`);
      if (response.data.success) {
        toast.success('Project deleted successfully!');
        fetchProjects();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      location: project.location,
      capacity: project.capacity,
      completionDate: project.completionDate ? project.completionDate.split('T')[0] : '',
      client: project.client,
      status: project.status,
      features: project.features.length > 0 ? project.features : [''],
      specifications: project.specifications || {
        panelType: '',
        inverterType: '',
        mountingSystem: '',
        energyOutput: '',
        co2Reduction: ''
      },
      testimonial: project.testimonial || {
        clientName: '',
        clientDesignation: '',
        feedback: '',
        rating: 5
      },
      isFeatured: project.isFeatured,
      seoTitle: project.seoTitle || '',
      seoDescription: project.seoDescription || ''
    });
    setFeaturedImagePreview(project.featuredImage || '');
    setAdditionalImagePreviews(project.images || []);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Residential',
      location: '',
      capacity: '',
      completionDate: '',
      client: '',
      status: 'Completed',
      features: [''],
      specifications: {
        panelType: '',
        inverterType: '',
        mountingSystem: '',
        energyOutput: '',
        co2Reduction: ''
      },
      testimonial: {
        clientName: '',
        clientDesignation: '',
        feedback: '',
        rating: 5
      },
      isFeatured: false,
      seoTitle: '',
      seoDescription: ''
    });
    setEditingProject(null);
    setFeaturedImage(null);
    setAdditionalImages([]);
    setFeaturedImagePreview('');
    setAdditionalImagePreviews([]);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      setFeaturedImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setAdditionalImagePreviews(previews);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || project.category === filterCategory;
    const matchesStatus = !filterStatus || project.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects Management</h1>
        <p className="text-gray-600">Manage your solar projects and showcase your portfolio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiEye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview?.totalProjects || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiStar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview?.completedProjects || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiRefreshCw className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview?.inProgressProjects || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiStar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview?.featuredProjects || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchProjects}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              <FiRefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Add Project
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FiEye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Get started by creating your first project.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={formatImageUrl(project.featuredImage) || '/placeholder-project.jpg'}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {project.isFeatured && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                <div className="space-y-1 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FiMapPin className="h-4 w-4 mr-1" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className="h-4 w-4 mr-1" />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="h-4 w-4 mr-1" />
                    <span>{new Date(project.completionDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600">{project.capacity}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-2 border rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
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
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 10 kW"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Completion Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.completionDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Images</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {featuredImagePreview && (
                    <img
                      src={featuredImagePreview.startsWith('blob:') ? featuredImagePreview : formatImageUrl(featuredImagePreview)}
                      alt="Featured preview"
                      className="mt-2 h-32 w-32 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {additionalImagePreviews.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {additionalImagePreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={typeof preview === 'string' && !preview.startsWith('blob:') ? formatImageUrl(preview) : preview}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Features
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter feature"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Feature
                </button>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Panel Type
                    </label>
                    <input
                      type="text"
                      value={formData.specifications.panelType}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, panelType: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inverter Type
                    </label>
                    <input
                      type="text"
                      value={formData.specifications.inverterType}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, inverterType: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mounting System
                    </label>
                    <input
                      type="text"
                      value={formData.specifications.mountingSystem}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, mountingSystem: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Energy Output
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 15,000 kWh/year"
                      value={formData.specifications.energyOutput}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, energyOutput: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CO2 Reduction
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 12 tons/year"
                      value={formData.specifications.co2Reduction}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, co2Reduction: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Client Testimonial</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={formData.testimonial.clientName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        testimonial: { ...prev.testimonial, clientName: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={formData.testimonial.clientDesignation}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        testimonial: { ...prev.testimonial, clientDesignation: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={formData.testimonial.feedback}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      testimonial: { ...prev.testimonial, feedback: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={formData.testimonial.rating}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      testimonial: { ...prev.testimonial, rating: parseInt(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SEO */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.seoDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                    Mark as Featured Project
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <FiSave className="h-4 w-4 mr-2" />
                  {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsAdmin;