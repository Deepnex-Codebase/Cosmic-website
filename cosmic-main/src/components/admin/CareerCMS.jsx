import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaImage, FaCheck, FaMapMarkerAlt, FaClock, FaUserTie, FaCheckCircle, FaBriefcase, FaGraduationCap, FaUsers, FaBolt, FaLeaf, FaLightbulb, FaSolarPanel, FaHandshake } from 'react-icons/fa';
import { API_URL } from '../../config/constants';

const CareerCMS = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [careerData, setCareerData] = useState(null);
  const [error, setError] = useState(null);
  
  // For benefits section
  const [showBenefitForm, setShowBenefitForm] = useState(false);
  const [editingBenefitIndex, setEditingBenefitIndex] = useState(null);
  const [benefitFormData, setBenefitFormData] = useState({
    title: '',
    icon: 'FaCheckCircle',
    items: ['']
  });

  // For culture values section
  const [showValueForm, setShowValueForm] = useState(false);
  const [editingValueIndex, setEditingValueIndex] = useState(null);
  const [valueFormData, setValueFormData] = useState({
    title: '',
    icon: 'FaBolt',
    description: ''
  });

  // For job positions section
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

  // For department section
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

  // Fetch career data
  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cms/careers`);
      setCareerData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching career data:', err);
      setError('Failed to load career information. Please try again later.');
      setLoading(false);
      toast.error('Failed to load career data');
    }
  };

  // Save career data
  const saveCareerData = async () => {
    try {
      setSaving(true);
      
      // Create a deep copy of the data to ensure all nested objects are properly sent
      const dataToSend = JSON.parse(JSON.stringify(careerData));
      
      // Send the data to the server
      const response = await axios.put(`${API_URL}/cms/careers?t=${new Date().getTime()}`, dataToSend);
      
      // Update local state with the response data to ensure consistency
      setCareerData(response.data);
      
      setSaving(false);
      toast.success('Career data saved successfully');
      
      // Force a cache refresh by making a GET request with a timestamp
      await axios.get(`${API_URL}/cms/careers?refresh=${new Date().getTime()}`);
    } catch (err) {
      console.error('Error saving career data:', err);
      setSaving(false);
      toast.error('Failed to save career data');
    }
  };

  // Handle image upload
  const handleImageUpload = async (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('section', section);

    try {
      const response = await axios.post(`${API_URL}/cms/careers/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update the state with the new image URL
      setCareerData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: response.data.imageUrl
        }
      }));

      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to upload image');
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

  const handleAddBenefit = () => {
    const updatedCareerData = { ...careerData };
    if (!updatedCareerData.benefits.categories) {
      updatedCareerData.benefits.categories = [];
    }

    if (editingBenefitIndex !== null) {
      // Edit existing benefit
      updatedCareerData.benefits.categories[editingBenefitIndex] = benefitFormData;
    } else {
      // Add new benefit
      updatedCareerData.benefits.categories.push(benefitFormData);
    }

    setCareerData(updatedCareerData);
    resetBenefitForm();
    toast.success(editingBenefitIndex !== null ? 'Benefit updated successfully' : 'Benefit added successfully');
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

  const deleteBenefit = (index) => {
    if (window.confirm('Are you sure you want to delete this benefit?')) {
      const updatedCareerData = { ...careerData };
      updatedCareerData.benefits.categories.splice(index, 1);
      setCareerData(updatedCareerData);
      toast.success('Benefit deleted successfully');
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

  const handleAddValue = () => {
    const updatedCareerData = { ...careerData };
    if (!updatedCareerData.culture.values) {
      updatedCareerData.culture.values = [];
    }

    if (editingValueIndex !== null) {
      // Edit existing value
      updatedCareerData.culture.values[editingValueIndex] = valueFormData;
    } else {
      // Add new value
      updatedCareerData.culture.values.push(valueFormData);
    }

    setCareerData(updatedCareerData);
    resetValueForm();
    toast.success(editingValueIndex !== null ? 'Value updated successfully' : 'Value added successfully');
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

  const deleteValue = (index) => {
    if (window.confirm('Are you sure you want to delete this value?')) {
      const updatedCareerData = { ...careerData };
      updatedCareerData.culture.values.splice(index, 1);
      setCareerData(updatedCareerData);
      toast.success('Value deleted successfully');
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

  const handleAddJob = () => {
    const updatedCareerData = { ...careerData };
    if (!updatedCareerData.openPositions.jobs) {
      updatedCareerData.openPositions.jobs = [];
    }

    if (editingJobIndex !== null) {
      // Edit existing job
      updatedCareerData.openPositions.jobs[editingJobIndex] = jobFormData;
    } else {
      // Add new job
      updatedCareerData.openPositions.jobs.push(jobFormData);
    }

    setCareerData(updatedCareerData);
    resetJobForm();
    toast.success(editingJobIndex !== null ? 'Job updated successfully' : 'Job added successfully');
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

  const deleteJob = (index) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const updatedCareerData = { ...careerData };
      updatedCareerData.openPositions.jobs.splice(index, 1);
      setCareerData(updatedCareerData);
      toast.success('Job deleted successfully');
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

  const handleAddDepartment = () => {
    const updatedCareerData = { ...careerData };
    if (!updatedCareerData.openPositions.departments) {
      updatedCareerData.openPositions.departments = [];
    }

    if (editingDepartmentIndex !== null) {
      // Edit existing department
      updatedCareerData.openPositions.departments[editingDepartmentIndex] = departmentFormData;
    } else {
      // Add new department
      updatedCareerData.openPositions.departments.push(departmentFormData);
    }

    setCareerData(updatedCareerData);
    resetDepartmentForm();
    toast.success(editingDepartmentIndex !== null ? 'Department updated successfully' : 'Department added successfully');
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

  const deleteDepartment = (index) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      const updatedCareerData = { ...careerData };
      updatedCareerData.openPositions.departments.splice(index, 1);
      setCareerData(updatedCareerData);
      toast.success('Department deleted successfully');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={fetchCareerData} 
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!careerData) return null;

  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'culture', label: 'Culture Section' },
    { id: 'benefits', label: 'Benefits & Perks' },
    { id: 'openPositions', label: 'Open Positions' },
    { id: 'cta', label: 'CTA Section' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Careers Page Management</h1>
        <button
          onClick={saveCareerData}
          disabled={saving}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
        >
          <FaSave /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Hero Section */}
      {activeTab === 'hero' && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800">Hero Section</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={careerData.hero.title || ''}
                onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={careerData.hero.subtitle || ''}
                onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={careerData.hero.buttonText || ''}
                onChange={(e) => handleInputChange('hero', 'buttonText', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Link
              </label>
              <input
                type="text"
                value={careerData.hero.buttonLink || ''}
                onChange={(e) => handleInputChange('hero', 'buttonLink', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Image
              </label>
              <div className="flex items-center space-x-4">
                {careerData.hero.backgroundImage && (
                  <div className="relative w-40 h-24 overflow-hidden rounded-md">
                    <img 
                      src={careerData.hero.backgroundImage} 
                      alt="Hero Background" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center gap-2">
                  <FaImage /> {careerData.hero.backgroundImage ? 'Change Image' : 'Upload Image'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleImageUpload(e, 'hero', 'backgroundImage')}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Culture Section */}
      {activeTab === 'culture' && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800">Culture Section</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={careerData.culture.title || ''}
                onChange={(e) => handleInputChange('culture', 'title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={careerData.culture.subtitle || ''}
                onChange={(e) => handleInputChange('culture', 'subtitle', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Culture Values */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Culture Values</h3>
              <button
                onClick={() => setShowValueForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2"
              >
                <FaPlus /> Add Value
              </button>
            </div>

            {showValueForm && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-800">
                    {editingValueIndex !== null ? 'Edit Value' : 'Add New Value'}
                  </h4>
                  <button
                    onClick={resetValueForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={valueFormData.title}
                      onChange={(e) => handleValueFormChange('title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableIcons.map((icon) => (
                        <button
                          key={icon.name}
                          type="button"
                          onClick={() => handleValueFormChange('icon', icon.name)}
                          className={`p-2 border rounded-md flex items-center justify-center ${valueFormData.icon === icon.name ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
                        >
                          <icon.component className="h-6 w-6" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={valueFormData.description}
                      onChange={(e) => handleValueFormChange('description', e.target.value)}
                      rows="4"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAddValue}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2"
                  >
                    <FaSave /> {editingValueIndex !== null ? 'Update Value' : 'Add Value'}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerData.culture.values && careerData.culture.values.map((value, index) => {
                const IconComponent = availableIcons.find(icon => icon.name === value.icon)?.component || FaBolt;
                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md border relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <button
                        onClick={() => editValue(index)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteValue(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                        <IconComponent className="h-5 w-5 text-primary-600" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-800">{value.title}</h4>
                    </div>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      {activeTab === 'benefits' && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800">Benefits & Perks Section</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={careerData.benefits.title || ''}
                onChange={(e) => handleInputChange('benefits', 'title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={careerData.benefits.subtitle || ''}
                onChange={(e) => handleInputChange('benefits', 'subtitle', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Benefits Categories */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Benefit Categories</h3>
              <button
                onClick={() => setShowBenefitForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2"
              >
                <FaPlus /> Add Benefit Category
              </button>
            </div>

            {showBenefitForm && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-800">
                    {editingBenefitIndex !== null ? 'Edit Benefit Category' : 'Add New Benefit Category'}
                  </h4>
                  <button
                    onClick={resetBenefitForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={benefitFormData.title}
                      onChange={(e) => handleBenefitFormChange('title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableIcons.map((icon) => (
                        <button
                          key={icon.name}
                          type="button"
                          onClick={() => handleBenefitFormChange('icon', icon.name)}
                          className={`p-2 border rounded-md flex items-center justify-center ${benefitFormData.icon === icon.name ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
                        >
                          <icon.component className="h-6 w-6" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Benefit Items
                  </label>
                  {benefitFormData.items.map((item, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleBenefitItemChange(index, e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeBenefitItem(index)}
                        className="ml-2 p-2 text-red-600 hover:text-red-800"
                        disabled={benefitFormData.items.length <= 1}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBenefitItem}
                    className="mt-2 text-primary-600 hover:text-primary-800 flex items-center gap-1"
                  >
                    <FaPlus size={12} /> Add Item
                  </button>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAddBenefit}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2"
                  >
                    <FaSave /> {editingBenefitIndex !== null ? 'Update Benefit' : 'Add Benefit'}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careerData.benefits.categories && careerData.benefits.categories.map((benefit, index) => {
                const IconComponent = availableIcons.find(icon => icon.name === benefit.icon)?.component || FaCheckCircle;
                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md border relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <button
                        onClick={() => editBenefit(index)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteBenefit(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                        <IconComponent className="h-5 w-5 text-primary-600" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-800">{benefit.title}</h4>
                    </div>
                    <ul className="space-y-2">
                      {benefit.items && benefit.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <FaCheckCircle className="text-primary-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Open Positions Section */}
      {activeTab === 'openPositions' && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800">Open Positions Section</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={careerData.openPositions.title || ''}
                onChange={(e) => handleInputChange('openPositions', 'title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={careerData.openPositions.subtitle || ''}
                onChange={(e) => handleInputChange('openPositions', 'subtitle', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Departments */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Departments</h3>
              <button
                onClick={() => setShowDepartmentForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2"
              >
                <FaPlus /> Add Department
              </button>
            </div>

            {showDepartmentForm && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-800">
                    {editingDepartmentIndex !== null ? 'Edit Department' : 'Add New Department'}
                  </h4>
                  <button
                    onClick={resetDepartmentForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID (unique identifier)
                    </label>
                    <input
                      type="text"
                      value={departmentFormData.id}
                      onChange={(e) => handleDepartmentFormChange('id', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={departmentFormData.name}
                      onChange={(e) => handleDepartmentFormChange('name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAddDepartment}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2"
                  >
                    <FaSave /> {editingDepartmentIndex !== null ? 'Update Department' : 'Add Department'}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {careerData.openPositions.departments && careerData.openPositions.departments.map((department, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{department.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{department.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => editDepartment(index)}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteDepartment(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Job Positions */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Job Positions</h3>
              <button
                onClick={() => setShowJobForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2"
              >
                <FaPlus /> Add Job Position
              </button>
            </div>

            {showJobForm && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-800">
                    {editingJobIndex !== null ? 'Edit Job Position' : 'Add New Job Position'}
                  </h4>
                  <button
                    onClick={resetJobForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={jobFormData.title}
                      onChange={(e) => handleJobFormChange('title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={jobFormData.location}
                      onChange={(e) => handleJobFormChange('location', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={jobFormData.type}
                      onChange={(e) => handleJobFormChange('type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={jobFormData.experience}
                      onChange={(e) => handleJobFormChange('experience', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g. 2-4 years"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={jobFormData.department}
                      onChange={(e) => handleJobFormChange('department', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      {careerData.openPositions.departments && careerData.openPositions.departments
                        .filter(dept => dept.id !== 'all')
                        .map((dept, index) => (
                          <option key={index} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={jobFormData.description}
                      onChange={(e) => handleJobFormChange('description', e.target.value)}
                      rows="4"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements
                  </label>
                  {jobFormData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleJobRequirementChange(index, e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeJobRequirement(index)}
                        className="ml-2 p-2 text-red-600 hover:text-red-800"
                        disabled={jobFormData.requirements.length <= 1}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addJobRequirement}
                    className="mt-2 text-primary-600 hover:text-primary-800 flex items-center gap-1"
                  >
                    <FaPlus size={12} /> Add Requirement
                  </button>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAddJob}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2"
                  >
                    <FaSave /> {editingJobIndex !== null ? 'Update Job' : 'Add Job'}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {careerData.openPositions.jobs && careerData.openPositions.jobs.map((job, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md border relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button
                      onClick={() => editJob(index)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteJob(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-start justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">{job.title}</h4>
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
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {careerData.openPositions.departments.find(dept => dept.id === job.department)?.name || job.department}
                    </span>
                  </div>
                  <p className="mt-4 text-gray-600">{job.description}</p>
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-800 mb-2">Requirements:</h5>
                    <ul className="space-y-2">
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start">
                          <FaCheckCircle className="text-primary-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {activeTab === 'cta' && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800">CTA Section</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={careerData.cta.title || ''}
                onChange={(e) => handleInputChange('cta', 'title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={careerData.cta.buttonText || ''}
                onChange={(e) => handleInputChange('cta', 'buttonText', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Link
              </label>
              <input
                type="text"
                value={careerData.cta.buttonLink || ''}
                onChange={(e) => handleInputChange('cta', 'buttonLink', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={careerData.cta.description || ''}
                onChange={(e) => handleInputChange('cta', 'description', e.target.value)}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Image
              </label>
              <div className="flex items-center space-x-4">
                {careerData.cta.backgroundImage && (
                  <div className="relative w-40 h-24 overflow-hidden rounded-md">
                    <img 
                      src={careerData.cta.backgroundImage} 
                      alt="CTA Background" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center gap-2">
                  <FaImage /> {careerData.cta.backgroundImage ? 'Change Image' : 'Upload Image'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleImageUpload(e, 'cta', 'backgroundImage')}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerCMS;