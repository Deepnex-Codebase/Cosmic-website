import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaImage, FaCheck, FaMapMarkerAlt, FaClock, FaUserTie, FaCheckCircle, FaBriefcase, FaGraduationCap, FaUsers, FaBolt, FaLeaf, FaLightbulb, FaSolarPanel, FaHandshake } from 'react-icons/fa';
import { API_URL, formatImageUrl } from '../../config/constants';

const CareerCMS = () => {
  // Main state variables
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [careerData, setCareerData] = useState(null);
  const [error, setError] = useState(null);
  
  // Form states for different sections
  const [showBenefitForm, setShowBenefitForm] = useState(false);
  const [editingBenefitIndex, setEditingBenefitIndex] = useState(null);
  const [benefitFormData, setBenefitFormData] = useState({
    title: '',
    icon: 'FaCheckCircle',
    items: ['']
  });

  const [showValueForm, setShowValueForm] = useState(false);
  const [editingValueIndex, setEditingValueIndex] = useState(null);
  const [valueFormData, setValueFormData] = useState({
    title: '',
    icon: 'FaBolt',
    description: ''
  });

  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJobIndex, setEditingJobIndex] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    experience: '',
    department: 'engineering',
    description: '',
    requirements: ['']
  });

  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [editingDepartmentIndex, setEditingDepartmentIndex] = useState(null);
  const [departmentFormData, setDepartmentFormData] = useState({
    id: '',
    name: ''
  });

  // Available icons for selection
  const availableIcons = [
    { name: 'FaCheckCircle', component: FaCheckCircle },
    { name: 'FaBriefcase', component: FaBriefcase },
    { name: 'FaGraduationCap', component: FaGraduationCap },
    { name: 'FaUsers', component: FaUsers },
    { name: 'FaBolt', component: FaBolt },
    { name: 'FaLeaf', component: FaLeaf },
    { name: 'FaLightbulb', component: FaLightbulb },
    { name: 'FaSolarPanel', component: FaSolarPanel },
    { name: 'FaHandshake', component: FaHandshake }
  ];

  // Fetch career data with cache busting
  const fetchCareerData = useCallback(async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const response = await axios.get(`${API_URL}/cms/careers?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      setCareerData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load career information. Please try again later.');
      setLoading(false);
      toast.error('Failed to load career data');
    }
  }, []);

  useEffect(() => {
    fetchCareerData();
  }, [fetchCareerData]);

  // Save career data with cache busting
  const saveCareerData = async () => {
    try {
      setSaving(true);
      
      // Create a deep copy of the data to ensure all nested objects are properly sent
      const dataToSend = JSON.parse(JSON.stringify(careerData));
      
      // Send the data to the server with cache busting
      const timestamp = new Date().getTime();
      const response = await axios.put(`${API_URL}/cms/careers?t=${timestamp}`, dataToSend, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      // Update local state with the response data to ensure consistency
      setCareerData(response.data);
      
      setSaving(false);
      toast.success('Career data saved successfully');
      
      // Force a refresh of the data
      fetchCareerData();
    } catch (err) {
      setSaving(false);
      toast.error('Failed to save career data');
    }
  };

  // Handle image upload
  const handleImageUpload = async (e, section, field) => {
    // Skip if trying to upload for CTA section
    if (section === 'cta') {
      toast.info('Image upload for CTA section has been disabled');
      return;
    }
    
    const file = e.target.files[0];
    if (!file) {
      toast.error('No file selected');
      return;
    }

    // Show file info for debugging
    toast.info(`Uploading ${file.name}...`);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('section', section);

    try {
      
      const response = await axios.post(`${API_URL}/cms/careers/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });


      // Update the state with the new image URL using formatImageUrl
      setCareerData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: formatImageUrl(response.data.imageUrl)
        }
      }));

      toast.success('Image uploaded successfully');
      
      // Save the updated data to ensure persistence
      await saveCareerData();
    } catch (err) {
      // Removed console.error for upload error
      toast.error(`Upload failed: ${err.message || 'Unknown error'}`);
      
      // Show more detailed error if available
      if (err.response) {
        // Removed console.error for error response
        toast.error(`Server error: ${err.response.data.message || err.response.statusText}`);
      }
    }
  };

  // Handle input change for main sections
  const handleInputChange = (section, field, value) => {
    setCareerData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Benefits section handlers
  const handleBenefitFormChange = (field, value) => {
    setBenefitFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBenefitItemChange = (index, value) => {
    const updatedItems = [...benefitFormData.items];
    updatedItems[index] = value;
    setBenefitFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addBenefitItem = () => {
    setBenefitFormData(prev => ({
      ...prev,
      items: [...prev.items, '']
    }));
  };

  const removeBenefitItem = (index) => {
    const updatedItems = [...benefitFormData.items];
    updatedItems.splice(index, 1);
    setBenefitFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const handleAddBenefit = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      
      if (editingBenefitIndex !== null) {
        // Edit existing benefit
        const categoryId = careerData.benefits.categories[editingBenefitIndex]._id;
        await axios.put(`${API_URL}/cms/careers/benefit-categories/${categoryId}`, benefitFormData);
      } else {
        // Add new benefit
        await axios.post(`${API_URL}/cms/careers/benefit-categories`, benefitFormData);
      }

      // Reset form
      resetBenefitForm();
      
      // Refresh data
      await fetchCareerData();
      
      toast.success(editingBenefitIndex !== null ? 'Benefit updated successfully' : 'Benefit added successfully');
    } catch (error) {
      toast.error('Failed to save benefit');
      // Refresh data in case of error
      fetchCareerData();
    }
  };

  const editBenefit = (index) => {
    const benefit = careerData.benefits.categories[index];
    setBenefitFormData({
      title: benefit.title,
      icon: benefit.icon,
      items: [...benefit.items]
    });
    setEditingBenefitIndex(index);
    setShowBenefitForm(true);
  };

  const deleteBenefit = async (index) => {
    if (window.confirm('Are you sure you want to delete this benefit?')) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const categoryId = careerData.benefits.categories[index]._id;
        
        // Delete from API
        await axios.delete(`${API_URL}/cms/careers/benefit-categories/${categoryId}`);
        
        // Refresh data
        await fetchCareerData();
        
        toast.success('Benefit deleted successfully');
      } catch (error) {
        // Removed console.error for benefit deletion
        toast.error('Failed to delete benefit');
        // Refresh data in case of error
        fetchCareerData();
      }
    }
  };

  const resetBenefitForm = () => {
    setBenefitFormData({
      title: '',
      icon: 'FaCheckCircle',
      items: ['']
    });
    setEditingBenefitIndex(null);
    setShowBenefitForm(false);
  };

  // Culture values section handlers
  const handleValueFormChange = (field, value) => {
    setValueFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddValue = async () => {
    try {
      if (editingValueIndex !== null) {
        // Edit existing value using dedicated API endpoint
        const valueId = careerData.culture.values[editingValueIndex]._id;
        await axios.put(`${API_URL}/cms/careers/culture-values/${valueId}`, valueFormData);
      } else {
        // Add new value using dedicated API endpoint
        await axios.post(`${API_URL}/cms/careers/culture-values`, valueFormData);
      }

      // Refresh data to get updated values from server
      await fetchCareerData();
      resetValueForm();
      
      toast.success(editingValueIndex !== null ? 'Value updated successfully' : 'Value added successfully');
    } catch (error) {
      toast.error('Failed to save value');
      // Refresh data in case of error
      fetchCareerData();
    }
  };


  const editValue = (index) => {
    const value = careerData.culture.values[index];
    setValueFormData({
      title: value.title,
      icon: value.icon,
      description: value.description
    });
    setEditingValueIndex(index);
    setShowValueForm(true);
  };

  const deleteValue = async (index) => {
    if (window.confirm('Are you sure you want to delete this value?')) {
      try {
        const valueId = careerData.culture.values[index]._id;
        
        // Delete using dedicated API endpoint
        await axios.delete(`${API_URL}/cms/careers/culture-values/${valueId}`);
        
        // Refresh data to get updated values from server
        await fetchCareerData();
        
        toast.success('Value deleted successfully');
      } catch (error) {
        toast.error('Failed to delete value');
        // Refresh data in case of error
        fetchCareerData();
      }
    }
  };

  const resetValueForm = () => {
    setValueFormData({
      title: '',
      icon: 'FaBolt',
      description: ''
    });
    setEditingValueIndex(null);
    setShowValueForm(false);
  };

  // Job positions section handlers
  const handleJobFormChange = (field, value) => {
    setJobFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleJobRequirementChange = (index, value) => {
    const updatedRequirements = [...jobFormData.requirements];
    updatedRequirements[index] = value;
    setJobFormData(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  const addJobRequirement = () => {
    setJobFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeJobRequirement = (index) => {
    const updatedRequirements = [...jobFormData.requirements];
    updatedRequirements.splice(index, 1);
    setJobFormData(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  const handleAddJob = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      
      if (editingJobIndex !== null) {
        // Edit existing job using dedicated API endpoint
        const jobId = careerData.openPositions.jobs[editingJobIndex]._id;
        await axios.put(`${API_URL}/cms/careers/job-positions/${jobId}`, jobFormData);
      } else {
        // Add new job using dedicated API endpoint
        await axios.post(`${API_URL}/cms/careers/job-positions`, jobFormData);
      }

      // Reset form
      resetJobForm();
      
      // Refresh data
      await fetchCareerData();
      
      toast.success(editingJobIndex !== null ? 'Job updated successfully' : 'Job added successfully');
    } catch (error) {
      toast.error('Failed to save job');
      // Refresh data in case of error
      fetchCareerData();
    }
  };

  const editJob = (index) => {
    const job = careerData.openPositions.jobs[index];
    setJobFormData({
      title: job.title,
      location: job.location,
      type: job.type,
      experience: job.experience,
      department: job.department,
      description: job.description,
      requirements: [...job.requirements]
    });
    setEditingJobIndex(index);
    setShowJobForm(true);
  };

  const deleteJob = async (index) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const jobId = careerData.openPositions.jobs[index]._id;
        
        // Delete using dedicated API endpoint
        await axios.delete(`${API_URL}/cms/careers/job-positions/${jobId}`);
        
        // Refresh data
        await fetchCareerData();
        
        toast.success('Job deleted successfully');
      } catch (error) {
        // Removed console.error for job deletion
        toast.error('Failed to delete job');
        // Refresh data in case of error
        fetchCareerData();
      }
    }
  };

  const resetJobForm = () => {
    setJobFormData({
      title: '',
      location: '',
      type: 'Full-time',
      experience: '',
      department: 'engineering',
      description: '',
      requirements: ['']
    });
    setEditingJobIndex(null);
    setShowJobForm(false);
  };

  // Department section handlers
  const handleDepartmentFormChange = (field, value) => {
    setDepartmentFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddDepartment = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      
      if (editingDepartmentIndex !== null) {
        // Edit existing department using dedicated API endpoint
        const departmentId = careerData.openPositions.departments[editingDepartmentIndex]._id;
        await axios.put(`${API_URL}/cms/careers/departments/${departmentId}`, departmentFormData);
      } else {
        // Add new department using dedicated API endpoint
        await axios.post(`${API_URL}/cms/careers/departments`, departmentFormData);
      }

      // Reset form
      resetDepartmentForm();
      
      // Refresh data
      await fetchCareerData();
      
      toast.success(editingDepartmentIndex !== null ? 'Department updated successfully' : 'Department added successfully');
    } catch (error) {
      toast.error('Failed to save department');
      // Refresh data in case of error
      fetchCareerData();
    }
  };

  const editDepartment = (index) => {
    const department = careerData.openPositions.departments[index];
    setDepartmentFormData({
      id: department.id,
      name: department.name
    });
    setEditingDepartmentIndex(index);
    setShowDepartmentForm(true);
  };

  const deleteDepartment = async (index) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const departmentId = careerData.openPositions.departments[index]._id;
        
        // Delete using dedicated API endpoint
        await axios.delete(`${API_URL}/cms/careers/departments/${departmentId}`);
        
        // Refresh data
        await fetchCareerData();
        
        toast.success('Department deleted successfully');
      } catch (error) {
        // Removed console.error for department deletion
        toast.error('Failed to delete department');
        // Refresh data in case of error
        fetchCareerData();
      }
    }
  };

  const resetDepartmentForm = () => {
    setDepartmentFormData({
      id: '',
      name: ''
    });
    setEditingDepartmentIndex(null);
    setShowDepartmentForm(false);
  };

  // If data is loading, show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // If there's an error, show error message
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={fetchCareerData}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no data is available yet, return null
  if (!careerData) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Careers Page Management</h1>
      
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'hero' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Hero Section
        </button>
        <button
          onClick={() => setActiveTab('culture')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'culture' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Culture Values
        </button>
        <button
          onClick={() => setActiveTab('benefits')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'benefits' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Benefits & Perks
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'departments' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Departments
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'jobs' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Job Positions
        </button>
        <button
          onClick={() => setActiveTab('cta')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'cta' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Call to Action
        </button>
      </div>

      {/* Hero Section */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hero Section</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={careerData.hero.title || ''}
                  onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={careerData.hero.subtitle || ''}
                  onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={careerData.hero.buttonText || ''}
                  onChange={(e) => handleInputChange('hero', 'buttonText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                <input
                  type="text"
                  value={careerData.hero.buttonLink || ''}
                  onChange={(e) => handleInputChange('hero', 'buttonLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
                <div className="flex items-center space-x-4">
                  <div className="relative w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                    {careerData.hero.backgroundImage && (
                      <img 
                        src={formatImageUrl(careerData.hero.backgroundImage)} 
                        alt="Hero background" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <label className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md cursor-pointer hover:bg-primary-700 transition-colors">
                      <FaImage className="mr-2" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'hero', 'backgroundImage')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Culture Values Section */}
      {activeTab === 'culture' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Culture Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                value={careerData.culture.title || ''}
                onChange={(e) => handleInputChange('culture', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
              <input
                type="text"
                value={careerData.culture.subtitle || ''}
                onChange={(e) => handleInputChange('culture', 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Culture Values</h3>
              <button
                onClick={() => setShowValueForm(true)}
                className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <FaPlus className="mr-2" /> Add Value
              </button>
            </div>
            
            {/* Values List */}
            <div className="space-y-4">
              {careerData.culture.values && careerData.culture.values.length > 0 ? (
                careerData.culture.values.map((value, index) => {
                  const IconComponent = availableIcons.find(icon => icon.name === value.icon)?.component || FaBolt;
                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <IconComponent className="text-primary-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{value.title}</h4>
                            <p className="text-gray-600 mt-1">{value.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editValue(index)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteValue(index)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No culture values added yet. Click "Add Value" to create one.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Value Form */}
          {showValueForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingValueIndex !== null ? 'Edit Culture Value' : 'Add Culture Value'}
                  </h3>
                  <button onClick={resetValueForm} className="text-gray-500 hover:text-gray-700">
                    <FaTimes />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={valueFormData.title}
                      onChange={(e) => handleValueFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Innovation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {availableIcons.map((icon) => (
                        <button
                          key={icon.name}
                          type="button"
                          onClick={() => handleValueFormChange('icon', icon.name)}
                          className={`p-2 rounded-md flex flex-col items-center ${valueFormData.icon === icon.name ? 'bg-primary-100 border-2 border-primary-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          <icon.component className="text-primary-600 text-xl" />
                          <span className="text-xs mt-1">{icon.name.replace('Fa', '')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={valueFormData.description}
                      onChange={(e) => handleValueFormChange('description', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe this cultural value..."
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={resetValueForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddValue}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <FaSave className="mr-2" />
                    {editingValueIndex !== null ? 'Update Value' : 'Add Value'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Benefits Section */}
      {activeTab === 'benefits' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Benefits & Perks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                value={careerData.benefits.title || ''}
                onChange={(e) => handleInputChange('benefits', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
              <input
                type="text"
                value={careerData.benefits.subtitle || ''}
                onChange={(e) => handleInputChange('benefits', 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Benefit Categories</h3>
              <button
                onClick={() => setShowBenefitForm(true)}
                className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <FaPlus className="mr-2" /> Add Benefit Category
              </button>
            </div>
            
            {/* Benefits List */}
            <div className="space-y-4">
              {careerData.benefits.categories && careerData.benefits.categories.length > 0 ? (
                careerData.benefits.categories.map((benefit, index) => {
                  const IconComponent = availableIcons.find(icon => icon.name === benefit.icon)?.component || FaCheckCircle;
                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <IconComponent className="text-primary-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{benefit.title}</h4>
                            <ul className="mt-2 space-y-1">
                              {benefit.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start">
                                  <FaCheckCircle className="text-primary-500 mr-2 mt-1 flex-shrink-0" />
                                  <span className="text-gray-600">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editBenefit(index)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteBenefit(index)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No benefit categories added yet. Click "Add Benefit Category" to create one.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Benefit Form */}
          {showBenefitForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingBenefitIndex !== null ? 'Edit Benefit Category' : 'Add Benefit Category'}
                  </h3>
                  <button onClick={resetBenefitForm} className="text-gray-500 hover:text-gray-700">
                    <FaTimes />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={benefitFormData.title}
                      onChange={(e) => handleBenefitFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Health & Wellness"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {availableIcons.map((icon) => (
                        <button
                          key={icon.name}
                          type="button"
                          onClick={() => handleBenefitFormChange('icon', icon.name)}
                          className={`p-2 rounded-md flex flex-col items-center ${benefitFormData.icon === icon.name ? 'bg-primary-100 border-2 border-primary-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          <icon.component className="text-primary-600 text-xl" />
                          <span className="text-xs mt-1">{icon.name.replace('Fa', '')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Benefit Items</label>
                    {benefitFormData.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleBenefitItemChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={`Benefit item ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeBenefitItem(index)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                          disabled={benefitFormData.items.length <= 1}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addBenefitItem}
                      className="mt-2 flex items-center text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <FaPlus className="mr-1" /> Add Another Item
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={resetBenefitForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBenefit}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <FaSave className="mr-2" />
                    {editingBenefitIndex !== null ? 'Update Benefit' : 'Add Benefit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Departments Section */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Departments</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Department List</h3>
              <button
                onClick={() => setShowDepartmentForm(true)}
                className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <FaPlus className="mr-2" /> Add Department
              </button>
            </div>
            
            {/* Departments List */}
            <div className="space-y-4">
              {careerData.openPositions.departments && careerData.openPositions.departments.length > 0 ? (
                careerData.openPositions.departments.map((department, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{department.name}</h4>
                        <p className="text-gray-600 text-sm">ID: {department.id}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editDepartment(index)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteDepartment(index)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No departments added yet. Click "Add Department" to create one.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Department Form */}
          {showDepartmentForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingDepartmentIndex !== null ? 'Edit Department' : 'Add Department'}
                  </h3>
                  <button onClick={resetDepartmentForm} className="text-gray-500 hover:text-gray-700">
                    <FaTimes />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department ID</label>
                    <input
                      type="text"
                      value={departmentFormData.id}
                      onChange={(e) => handleDepartmentFormChange('id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., engineering"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use lowercase, no spaces (e.g., "engineering", "sales-marketing")</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                    <input
                      type="text"
                      value={departmentFormData.name}
                      onChange={(e) => handleDepartmentFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Engineering"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={resetDepartmentForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDepartment}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <FaSave className="mr-2" />
                    {editingDepartmentIndex !== null ? 'Update Department' : 'Add Department'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Jobs Section */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Positions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                value={careerData.openPositions.title || ''}
                onChange={(e) => handleInputChange('openPositions', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
              <input
                type="text"
                value={careerData.openPositions.subtitle || ''}
                onChange={(e) => handleInputChange('openPositions', 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Job Listings</h3>
              <button
                onClick={() => setShowJobForm(true)}
                className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <FaPlus className="mr-2" /> Add Job Position
              </button>
            </div>
            
            {/* Jobs List */}
            <div className="space-y-4">
              {careerData.openPositions.jobs && careerData.openPositions.jobs.length > 0 ? (
                careerData.openPositions.jobs.map((job, index) => {
                  const departmentName = careerData.openPositions.departments.find(d => d.id === job.department)?.name || job.department;
                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                          <div className="mt-2 flex flex-wrap gap-4">
                            <span className="flex items-center text-gray-600 text-sm">
                              <FaMapMarkerAlt className="mr-1 text-primary-500" />
                              {job.location}
                            </span>
                            <span className="flex items-center text-gray-600 text-sm">
                              <FaClock className="mr-1 text-primary-500" />
                              {job.type}
                            </span>
                            <span className="flex items-center text-gray-600 text-sm">
                              <FaUserTie className="mr-1 text-primary-500" />
                              {job.experience}
                            </span>
                            <span className="flex items-center text-gray-600 text-sm">
                              <FaBriefcase className="mr-1 text-primary-500" />
                              {departmentName}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-600">{job.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editJob(index)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteJob(index)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No job positions added yet. Click "Add Job Position" to create one.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Job Form */}
          {showJobForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingJobIndex !== null ? 'Edit Job Position' : 'Add Job Position'}
                  </h3>
                  <button onClick={resetJobForm} className="text-gray-500 hover:text-gray-700">
                    <FaTimes />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={jobFormData.title}
                      onChange={(e) => handleJobFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Senior Solar Engineer"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={jobFormData.location}
                        onChange={(e) => handleJobFormChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., Mumbai, India"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                      <select
                        value={jobFormData.type}
                        onChange={(e) => handleJobFormChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <input
                        type="text"
                        value={jobFormData.experience}
                        onChange={(e) => handleJobFormChange('experience', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., 3-5 years"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select
                        value={jobFormData.department}
                        onChange={(e) => handleJobFormChange('department', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {careerData.openPositions.departments && careerData.openPositions.departments.map((dept, index) => (
                          <option key={index} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                    <textarea
                      value={jobFormData.description}
                      onChange={(e) => handleJobFormChange('description', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Brief description of the job position..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                    {jobFormData.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) => handleJobRequirementChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={`Requirement ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeJobRequirement(index)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                          disabled={jobFormData.requirements.length <= 1}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addJobRequirement}
                      className="mt-2 flex items-center text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <FaPlus className="mr-1" /> Add Another Requirement
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={resetJobForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddJob}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <FaSave className="mr-2" />
                    {editingJobIndex !== null ? 'Update Job' : 'Add Job'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Call to Action Section */}
      {activeTab === 'cta' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Call to Action</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={careerData.cta.title || ''}
                  onChange={(e) => handleInputChange('cta', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={careerData.cta.subtitle || ''}
                  onChange={(e) => handleInputChange('cta', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={careerData.cta.buttonText || ''}
                  onChange={(e) => handleInputChange('cta', 'buttonText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                <input
                  type="text"
                  value={careerData.cta.buttonLink || ''}
                  onChange={(e) => handleInputChange('cta', 'buttonLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            {/* Background image upload removed */}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={saveCareerData}
          disabled={saving}
          className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave className="mr-2" />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CareerCMS;
                    