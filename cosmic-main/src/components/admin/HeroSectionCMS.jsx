import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaUpload, FaVideo, FaPlus, FaTrash, FaEdit, FaUsers, FaProjectDiagram, FaSolarPanel, FaBolt, FaAward, FaGlobe, FaLeaf, FaIndustry, FaChartBar, FaChartPie, FaClock, FaSortNumericDown, FaSearch, FaTimes } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

const HeroSectionCMS = () => {
  const [_heroSectionData, setHeroSectionData] = useState(null);
  const [companyStats, setCompanyStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [showStatForm, setShowStatForm] = useState(false);
  const [fontAwesomeIcons, setFontAwesomeIcons] = useState([]);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: 'At Cosmic Powertech',
    description: '',
    companyVideo: `${API_BASE_URL}/videos/enn.mp4`,
    companyImage: '',
    mediaType: 'video',
    sectionTitle: 'About Cosmic Powertech',
    sectionSubtitle: 'Happy Clients',
    ctaText: 'Learn More About Us',
    ctaLink: '/about'
  });
  
  const [companyVideoFile, setCompanyVideoFile] = useState(null);
  const [companyImageFile, setCompanyImageFile] = useState(null);

  const [statFormData, setStatFormData] = useState({
    value: 0,
    label: '',
    icon: 'FaUsers',
    customSvgIcon: '',
    color: '#9fc22f',
    suffix: '',
    description: '',
    animationDelay: 0,
    order: 0
  });

  const iconOptions = [
    { value: 'FaUsers', label: '👥 Users', icon: FaUsers },
    { value: 'FaProjectDiagram', label: '📊 Projects', icon: FaProjectDiagram },
    { value: 'FaSolarPanel', label: '☀️ Solar Panel', icon: FaSolarPanel },
    { value: 'FaBolt', label: '⚡ Bolt', icon: FaBolt },
    { value: 'FaAward', label: '🏆 Award', icon: FaAward },
    { value: 'FaGlobe', label: '🌍 Globe', icon: FaGlobe },
    { value: 'FaLeaf', label: '🍃 Leaf', icon: FaLeaf },
    { value: 'FaIndustry', label: '🏭 Industry', icon: FaIndustry }
  ];

  // Fetch hero section data
  const fetchHeroSectionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cms/hero-section`);
      if (response.data) {
        setHeroSectionData(response.data);
        
        // Format video URLs to ensure they use the API domain
        let companyVideo = response.data.companyVideo || '/videos/enn.mp4';
        let companyImage = response.data.companyImage || '';
        
        // If URLs are relative paths, prepend the API base URL without /api
        const baseUrl = API_BASE_URL.replace('/api', '');
        
        if (companyVideo && !companyVideo.startsWith('http')) {
          companyVideo = `${baseUrl}${companyVideo.startsWith('/') ? '' : '/'}${companyVideo}`;
        }
        
        if (companyImage && !companyImage.startsWith('http')) {
          companyImage = `${baseUrl}${companyImage.startsWith('/') ? '' : '/'}${companyImage}`;
        }
        
        console.log('Fetched company video URL:', companyVideo);
        console.log('Fetched company image URL:', companyImage);
        
        setFormData({
          title: response.data.title || 'At Cosmic Powertech',
          description: response.data.description || '',
          companyVideo: companyVideo,
          companyImage: companyImage,
          mediaType: response.data.mediaType || 'video',
          sectionTitle: response.data.sectionTitle || 'About Cosmic Powertech',
          sectionSubtitle: response.data.sectionSubtitle || 'Happy Clients',
          ctaText: response.data.ctaText || 'Learn More About Us',
          ctaLink: response.data.ctaLink || '/about'
        });
      }
    } catch (error) {
      // Error handling without console.error
      toast.error('Failed to fetch hero section data');
      console.log('Error fetching hero section data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch company stats
  const fetchCompanyStats = async () => {
    try {
      setStatsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cms/company-stats`);
      if (response.data) {
        setCompanyStats(response.data);
      }
    } catch (error) {
      // Error handling without console.error
      toast.error('Failed to fetch company stats');
    } finally {
      setStatsLoading(false);
    }
  };
  
  // Fetch Font Awesome icons
  const fetchFontAwesomeIcons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cms/company-stats/icons/fontawesome`);
      if (response.data && response.data.icons) {
        setFontAwesomeIcons(response.data.icons);
      }
    } catch (error) {
      toast.error('Failed to fetch Font Awesome icons');
    }
  };

  useEffect(() => {
    fetchHeroSectionData();
    fetchCompanyStats();
    fetchFontAwesomeIcons();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle file input change
  const handleFileChange = (e, fileType) => {
    if (e.target.files && e.target.files[0]) {
      if (fileType === 'video') {
        setCompanyVideoFile(e.target.files[0]);
        setFormData(prev => ({ ...prev, mediaType: 'video' }));
      } else if (fileType === 'image') {
        setCompanyImageFile(e.target.files[0]);
        setFormData(prev => ({ ...prev, mediaType: 'image' }));
      }
    }
  };

  // Convert RGB color to hex format
  const rgbToHex = (rgb) => {
    // Check if already in hex format
    if (rgb.startsWith('#')) {
      return rgb;
    }
    
    // Extract RGB values
    const rgbMatch = rgb.match(/rgb\(\s*(\d+)\s*(\d+)\s*(\d+)\s*\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      
      // Convert to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    return rgb; // Return original if not RGB format
  };
  
  // Handle stat form input changes
  const handleStatInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for icon and customSvgIcon to ensure only one is set
    if (name === 'icon' && value) {
      setStatFormData(prev => ({
        ...prev,
        icon: value,
        customSvgIcon: '' // Clear customSvgIcon when icon is selected
      }));
    } else if (name === 'customSvgIcon' && value.trim() !== '') {
      setStatFormData(prev => ({
        ...prev,
        customSvgIcon: value,
        icon: '' // Clear icon when customSvgIcon is provided
      }));
    } else if (name === 'color') {
      // Ensure color is in hex format
      const hexColor = rgbToHex(value);
      setStatFormData(prev => ({
        ...prev,
        color: hexColor
      }));
    } else {
      setStatFormData(prev => ({
        ...prev,
        [name]: name === 'value' || name === 'animationDelay' || name === 'order' ? parseFloat(value) || 0 : value
      }));
    }
  };

  // Save hero section data
  const saveHeroSection = async () => {
    try {
      setLoading(true);
      
      // Create FormData object for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields to FormData, handling video URLs properly
      Object.keys(formData).forEach(key => {
        // For video URLs, ensure they're properly formatted for storage
        if (key === 'companyVideo' && formData[key].startsWith(API_BASE_URL)) {
          // Strip the API base URL to store relative paths
          const relativePath = formData[key].replace(API_BASE_URL, '');
          formDataToSend.append(key, relativePath);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add media files if selected
      if (formData.mediaType === 'video' && companyVideoFile) {
        console.log('Uploading company video file:', companyVideoFile.name);
        formDataToSend.delete('companyVideo'); // Remove text URL if file is selected
        formDataToSend.append('companyVideo', companyVideoFile); // Use companyVideo to match server expectation
      } else if (formData.mediaType === 'image' && companyImageFile) {
        console.log('Uploading company image file:', companyImageFile.name);
        formDataToSend.delete('companyImage'); // Remove text URL if file is selected
        formDataToSend.append('companyImage', companyImageFile); // Use companyImage to match server expectation
      }
      
      // Always send mediaType
      formDataToSend.append('mediaType', formData.mediaType);
      
      // Log form data entries for debugging
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`Form data entry - ${key}:`, typeof value === 'object' ? 'File object' : value);
      }
      
      const response = await axios.put(`${API_BASE_URL}/cms/hero-section`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data) {
        setHeroSectionData(response.data.heroSection);
        toast.success('Hero section updated successfully!');
        
        // Reset file states
        setCompanyVideoFile(null);
        setCompanyImageFile(null);
        
        // Refresh data to ensure URLs are properly formatted
        fetchHeroSectionData();
      }
    } catch (error) {
      // Error handling without console.error
      toast.error('Failed to save hero section');
    } finally {
      setLoading(false);
    }
  };

  // Save or update company stat
  const saveCompanyStat = async () => {
    try {
      setStatsLoading(true);
      let response;
      
      if (editingStat) {
        response = await axios.put(`${API_BASE_URL}/cms/company-stats/${editingStat._id}`, statFormData);
        toast.success('Company stat updated successfully!');
      } else {
        response = await axios.post(`${API_BASE_URL}/cms/company-stats`, statFormData);
        toast.success('Company stat created successfully!');
      }
      
      if (response.data) {
        await fetchCompanyStats();
        resetStatForm();
      }
    } catch (error) {
      // Error handling without console.error
      toast.error('Failed to save company stat');
    } finally {
      setStatsLoading(false);
    }
  };

  // Delete company stat
  const deleteCompanyStat = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stat?')) return;
    
    try {
      setStatsLoading(true);
      await axios.delete(`${API_BASE_URL}/cms/company-stats/${id}`);
      toast.success('Company stat deleted successfully!');
      await fetchCompanyStats();
    } catch (error) {
      // Error handling without console.error
      toast.error('Failed to delete company stat');
    } finally {
      setStatsLoading(false);
    }
  };

  // Edit company stat
  const editCompanyStat = (stat) => {
    setEditingStat(stat);
    setStatFormData({
      value: stat.value,
      label: stat.label,
      icon: stat.icon,
      customSvgIcon: stat.customSvgIcon || '',
      color: stat.color,
      suffix: stat.suffix || '',
      description: stat.description || '',
      animationDelay: stat.animationDelay || 0,
      order: stat.order || 0
    });
    setShowStatForm(true);
  };

  // Reset stat form
  const resetStatForm = () => {
    setEditingStat(null);
    setStatFormData({
      value: 0,
      label: '',
      icon: 'FaUsers',
      customSvgIcon: '',
      color: '#9fc22f',
      suffix: '',
      description: '',
      animationDelay: 0,
      order: 0
    });
    setShowStatForm(false);
  };

  // Reset to default
  const resetToDefault = async () => {
    if (!window.confirm('Are you sure you want to reset to default settings?')) return;
    
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/cms/hero-section/reset`);
      await axios.post(`${API_BASE_URL}/cms/company-stats/reset`);
      toast.success('Reset to default successfully!');
      await fetchHeroSectionData();
      await fetchCompanyStats();
    } catch (error) {
      // Error handling without console.error
      toast.error('Failed to reset to default settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Section Management</h2>
          <p className="text-gray-600 mt-1">Manage the testimonial video section content and company statistics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetToDefault}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>

      {/* Hero Section Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaVideo className="text-blue-600" />
          Company Introduction
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              name="sectionTitle"
              value={formData.sectionTitle}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="About Cosmic Powertech"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Subtitle
            </label>
            <input
              type="text"
              name="sectionSubtitle"
              value={formData.sectionSubtitle}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Happy Clients"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="At Cosmic Powertech"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Company description..."
          />
        </div>

        <div className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Type
            </label>
            <div className="flex items-center space-x-4 mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="mediaType"
                  value="video"
                  checked={formData.mediaType === 'video'}
                  onChange={() => setFormData({...formData, mediaType: 'video'})}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Video</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="mediaType"
                  value="image"
                  checked={formData.mediaType === 'image'}
                  onChange={() => setFormData({...formData, mediaType: 'image'})}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Image</span>
              </label>
            </div>
          </div>
          
          {formData.mediaType === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Video (Happy Clients)
              </label>
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  name="companyVideo"
                  value={formData.companyVideo}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/enn.mp4"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="video/*"
                    id="companyVideoUpload"
                    onChange={(e) => handleFileChange(e, 'video')}
                    className="hidden"
                  />
                  <label
                    htmlFor="companyVideoUpload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center"
                  >
                    <FaUpload className="mr-2" />
                    {companyVideoFile ? 'Change Video' : 'Upload Video'}
                  </label>
                  {companyVideoFile && (
                    <span className="text-sm text-green-600">{companyVideoFile.name}</span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {formData.mediaType === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Image
              </label>
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  name="companyImage"
                  value={formData.companyImage}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/company-image.jpg"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    id="companyImageUpload"
                    onChange={(e) => handleFileChange(e, 'image')}
                    className="hidden"
                  />
                  <label
                    htmlFor="companyImageUpload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center"
                  >
                    <FaUpload className="mr-2" />
                    {companyImageFile ? 'Change Image' : 'Upload Image'}
                  </label>
                  {companyImageFile && (
                    <span className="text-sm text-green-600">{companyImageFile.name}</span>
                  )}
                </div>
                {formData.companyImage && (
                  <div className="mt-2">
                    <img
                      src={formData.companyImage}
                      alt="Company"
                      className="w-full h-auto rounded-md object-cover"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CTA Button Text
            </label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Learn More About Us"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CTA Button Link
            </label>
            <input
              type="text"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="/about"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveHeroSection}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <FaSave />
            {loading ? 'Saving...' : 'Save Hero Section'}
          </button>
        </div>
      </div>

      {/* Company Stats Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaProjectDiagram className="text-green-600" />
              Company Statistics
            </h3>
            <p className="text-gray-600 mt-1">Add or edit company statistics that appear in the hero section.</p>
          </div>
          <button
            onClick={() => setShowStatForm(!showStatForm)}
            className={`px-4 py-2.5 ${showStatForm ? 'bg-gray-600' : 'bg-green-600'} text-white rounded-lg ${showStatForm ? 'hover:bg-gray-700' : 'hover:bg-green-700'} flex items-center gap-2 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 ${showStatForm ? 'focus:ring-gray-500' : 'focus:ring-green-500'}`}
          >
            {showStatForm ? <><FaEdit className="text-gray-200" /> Cancel</> : <><FaPlus className="text-green-200" /> Add Stat</>}
          </button>
        </div>

        {/* Stat Form */}
        {showStatForm && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              {editingStat ? 'Edit Statistic' : 'Add New Statistic'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <input
                  type="number"
                  name="value"
                  value={statFormData.value}
                  onChange={handleStatInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="30"
                  step="0.1"
                />
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  name="label"
                  value={statFormData.label}
                  onChange={handleStatInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Years of Experience"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Type
                </label>
                <div className="flex gap-3 mb-2">
                  <div 
                    className={`flex-1 flex items-center cursor-pointer ${!statFormData.customSvgIcon ? 'bg-green-50 border-green-500 shadow-sm' : 'bg-gray-50 border-gray-200'} px-4 py-3 rounded-md transition-all border-2 hover:shadow-md`}
                    onClick={() => {
                      setStatFormData(prev => ({ 
                        ...prev, 
                        customSvgIcon: '',
                        icon: prev.icon || 'FaUsers'
                      }));
                    }}
                  >
                    <input
                      type="radio"
                      id="useBuiltInIcon"
                      name="iconType"
                      checked={!statFormData.customSvgIcon}
                      onChange={() => {}}
                      className="mr-3 h-4 w-4 accent-green-600"
                    />
                    <span className={`text-sm font-medium ${!statFormData.customSvgIcon ? 'text-green-700' : 'text-gray-700'}`}>
                      Built-in Icon
                    </span>
                  </div>
                  <div 
                    className={`flex-1 flex items-center cursor-pointer ${!!statFormData.customSvgIcon ? 'bg-green-50 border-green-500 shadow-sm' : 'bg-gray-50 border-gray-200'} px-4 py-3 rounded-md transition-all border-2 hover:shadow-md`}
                    onClick={() => {
                      setStatFormData(prev => ({ 
                        ...prev, 
                        icon: '',
                        customSvgIcon: prev.customSvgIcon || ' ' // Set a space if empty to activate custom SVG mode
                      }));
                    }}
                  >
                    <input
                      type="radio"
                      id="useCustomSvg"
                      name="iconType"
                      checked={!!statFormData.customSvgIcon}
                      onChange={() => {}}
                      className="mr-3 h-4 w-4 accent-green-600"
                    />
                    <span className={`text-sm font-medium ${!!statFormData.customSvgIcon ? 'text-green-700' : 'text-gray-700'}`}>
                      Custom SVG
                    </span>
                  </div>
                </div>
              </div>
              
              {!statFormData.customSvgIcon && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Built-in Icon
                  </label>
                  <div className="relative">
                    <div 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between cursor-pointer bg-white"
                      onClick={() => setShowIconSelector(!showIconSelector)}
                    >
                      <div className="flex items-center gap-2">
                        {statFormData.icon ? (
                          <>
                            <div className="text-green-600">
                              {FaIcons[statFormData.icon] ? React.createElement(FaIcons[statFormData.icon]) : <FaUsers />}
                            </div>
                            <span>{statFormData.icon}</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Select an icon</span>
                        )}
                      </div>
                      <FaSearch className="text-gray-400" />
                    </div>
                    
                    {showIconSelector && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
                        <div className="sticky top-0 bg-white p-2 border-b">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search icons..."
                              value={iconSearchTerm}
                              onChange={(e) => setIconSearchTerm(e.target.value)}
                              className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            {iconSearchTerm && (
                              <FaTimes 
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                                onClick={() => setIconSearchTerm('')}
                              />
                            )}
                          </div>
                        </div>
                        <div className="p-2 grid grid-cols-4 gap-2">
                          {fontAwesomeIcons
                            .filter(icon => icon.toLowerCase().includes(iconSearchTerm.toLowerCase()))
                            .map(icon => (
                              <div 
                                key={icon}
                                className={`p-2 flex flex-col items-center justify-center rounded-md cursor-pointer hover:bg-green-50 ${statFormData.icon === icon ? 'bg-green-100 border border-green-300' : ''}`}
                                onClick={() => {
                                  setStatFormData(prev => ({
                                    ...prev,
                                    icon,
                                    customSvgIcon: ''
                                  }));
                                  setShowIconSelector(false);
                                }}
                              >
                                <div className="text-green-600 text-xl">
                                  {FaIcons[icon] ? React.createElement(FaIcons[icon]) : <FaUsers />}
                                </div>
                                <span className="text-xs mt-1 text-center truncate w-full">{icon}</span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {!!statFormData.customSvgIcon && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom SVG Icon
                  </label>
                  <textarea
                    name="customSvgIcon"
                    value={statFormData.customSvgIcon}
                    onChange={handleStatInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="<svg>...</svg>"
                    rows="3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Paste complete SVG code here.</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      name="color"
                      value={statFormData.color}
                      onChange={handleStatInputChange}
                      className="h-12 w-12 rounded-md cursor-pointer border-2 border-gray-200 p-1"
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-md border border-white" style={{boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'}}></div>
                  </div>
                  <input
                    type="text"
                    name="color"
                    value={statFormData.color}
                    onChange={handleStatInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono"
                    placeholder="#9fc22f"
                  />
                </div>
                <div className="mt-2 flex gap-2">
                  {['#9fc22f', '#3498db', '#e74c3c', '#f39c12', '#8e44ad', '#2ecc71'].map(color => (
                    <div 
                      key={color} 
                      className="h-8 w-8 rounded-full cursor-pointer hover:scale-110 transition-transform border border-gray-200"
                      style={{backgroundColor: color}}
                      onClick={() => setStatFormData(prev => ({...prev, color}))}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suffix
                </label>
                <input
                  type="text"
                  name="suffix"
                  value={statFormData.suffix}
                  onChange={handleStatInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="+, M+, GW, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={statFormData.order}
                  onChange={handleStatInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="1"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                name="description"
                value={statFormData.description}
                onChange={handleStatInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Additional description..."
              />
            </div>
            
            {/* Icon Preview */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Preview
                </label>
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md mb-3"
                    style={{ backgroundColor: statFormData.color }}
                  >
                    {statFormData.customSvgIcon ? (
                      <div className="w-8 h-8" dangerouslySetInnerHTML={{ __html: statFormData.customSvgIcon }} />
                    ) : statFormData.icon ? (
                      React.createElement(iconOptions.find(opt => opt.value === statFormData.icon)?.icon || FaUsers, { size: 24 })
                    ) : (
                      <span className="text-gray-400 text-xs">No icon selected</span>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl" style={{ color: statFormData.color }}>
                      {statFormData.value || '0'}{statFormData.suffix || ''}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {statFormData.label || 'Label'}
                    </div>
                    {statFormData.description && (
                      <div className="text-gray-500 text-sm mt-1">{statFormData.description}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={resetStatForm}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all border border-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCompanyStat}
                  disabled={statsLoading}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-md font-medium"
                >
                  {statsLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="text-green-200" />
                      {editingStat ? 'Update Statistic' : 'Save Statistic'}
                    </>
                  )}
                </button>
              </div>
          </div>
        )}

        {/* Stats List */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
            <FaChartBar className="text-green-600" />
            Company Statistics
          </h3>
          
          {statsLoading ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="text-gray-600 mt-4 font-medium">Loading statistics...</p>
            </div>
          ) : companyStats.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-dashed border-gray-300 flex flex-col items-center justify-center">
              <div className="text-gray-400 mb-4"><FaChartPie size={48} /></div>
              <p className="text-gray-600 mb-3 text-lg font-medium">No company statistics found.</p>
              <button 
                onClick={() => setShowStatForm(true)}
                className="mt-2 inline-flex items-center px-5 py-2.5 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm hover:shadow-md"
              >
                <FaPlus className="mr-2 text-green-200" /> Add Your First Statistic
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {companyStats.map((stat) => {
                const IconComponent = iconOptions.find(opt => opt.value === stat.icon)?.icon || FaUsers;
                return (
                  <div key={stat._id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md"
                          style={{ backgroundColor: stat.color }}
                        >
                          {stat.customSvgIcon ? (
                            <div className="w-8 h-8" dangerouslySetInnerHTML={{ __html: stat.customSvgIcon }} />
                          ) : (
                            FaIcons[stat.icon] ? React.createElement(FaIcons[stat.icon], { size: 28 }) : <IconComponent size={28} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-2xl" style={{ color: stat.color }}>
                              {stat.value}{stat.suffix}
                            </h4>
                          </div>
                          <p className="text-gray-700 font-medium text-lg">{stat.label}</p>
                          {stat.description && (
                            <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-400 mt-3 border-t pt-2">
                            <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                              <FaSortNumericDown className="text-gray-500" /> Order: {stat.order}
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                              <FaClock className="text-gray-500" /> Delay: {stat.animationDelay}s
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editCompanyStat(stat)}
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors shadow-sm hover:shadow"
                          title="Edit Statistic"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => deleteCompanyStat(stat._id)}
                          className="p-2.5 text-red-600 hover:bg-red-50 rounded-md transition-colors shadow-sm hover:shadow"
                          title="Delete Statistic"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionCMS;