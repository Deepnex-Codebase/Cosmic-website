import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaUpload, FaVideo, FaPlus, FaTrash, FaEdit, FaUsers, FaProjectDiagram, FaSolarPanel, FaBolt, FaAward, FaGlobe, FaLeaf, FaIndustry } from 'react-icons/fa';
// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

const HeroSectionCMS = () => {
  const [_heroSectionData, setHeroSectionData] = useState(null);
  const [companyStats, setCompanyStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [showStatForm, setShowStatForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: 'At Cosmic Powertech',
    description: '',
    backgroundVideo: '/videos/solar-installation.mp4',
    companyVideo: '/enn.mp4',
    sectionTitle: 'About Cosmic Powertech',
    sectionSubtitle: 'Happy Clients',
    ctaText: 'Learn More About Us',
    ctaLink: '/about'
  });

  const [statFormData, setStatFormData] = useState({
    value: 0,
    label: '',
    icon: 'FaUsers',
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
        setFormData({
          title: response.data.title || 'At Cosmic Powertech',
          description: response.data.description || '',
          backgroundVideo: response.data.backgroundVideo || '/videos/solar-installation.mp4',
          companyVideo: response.data.companyVideo || '/enn.mp4',
          sectionTitle: response.data.sectionTitle || 'About Cosmic Powertech',
          sectionSubtitle: response.data.sectionSubtitle || 'Happy Clients',
          ctaText: response.data.ctaText || 'Learn More About Us',
          ctaLink: response.data.ctaLink || '/about'
        });
      }
    } catch (error) {
      console.error('Error fetching hero section data:', error);
      toast.error('Failed to fetch hero section data');
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
      console.error('Error fetching company stats:', error);
      toast.error('Failed to fetch company stats');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSectionData();
    fetchCompanyStats();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle stat form input changes
  const handleStatInputChange = (e) => {
    const { name, value } = e.target;
    setStatFormData(prev => ({
      ...prev,
      [name]: name === 'value' || name === 'animationDelay' || name === 'order' ? parseFloat(value) || 0 : value
    }));
  };

  // Save hero section data
  const saveHeroSection = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/cms/hero-section`, formData);
      if (response.data) {
        setHeroSectionData(response.data.heroSection);
        toast.success('Hero section updated successfully!');
      }
    } catch (error) {
      console.error('Error saving hero section:', error);
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
      console.error('Error saving company stat:', error);
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
      console.error('Error deleting company stat:', error);
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
      console.error('Error resetting to default:', error);
      toast.error('Failed to reset to default');
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Video URL
            </label>
            <input
              type="text"
              name="backgroundVideo"
              value={formData.backgroundVideo}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="/videos/solar-installation.mp4"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Video URL
            </label>
            <input
              type="text"
              name="companyVideo"
              value={formData.companyVideo}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="/enn.mp4"
            />
          </div>
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaProjectDiagram className="text-green-600" />
            Company Statistics
          </h3>
          <button
            onClick={() => setShowStatForm(!showStatForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FaPlus />
            {showStatForm ? 'Cancel' : 'Add Stat'}
          </button>
        </div>

        {/* Stat Form */}
        {showStatForm && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              {editingStat ? 'Edit Statistic' : 'Add New Statistic'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <input
                  type="number"
                  name="value"
                  value={statFormData.value}
                  onChange={handleStatInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="30"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  name="label"
                  value={statFormData.label}
                  onChange={handleStatInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Years of Experience"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  name="icon"
                  value={statFormData.icon}
                  onChange={handleStatInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={statFormData.color}
                  onChange={handleStatInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="#9fc22f"
                />
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
            
            <div className="flex justify-end gap-2">
              <button
                onClick={resetStatForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCompanyStat}
                disabled={statsLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <FaSave />
                {statsLoading ? 'Saving...' : (editingStat ? 'Update' : 'Save')}
              </button>
            </div>
          </div>
        )}

        {/* Stats List */}
        <div className="space-y-4">
          {statsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="text-gray-600 mt-2">Loading statistics...</p>
            </div>
          ) : companyStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No company statistics found. Add your first statistic above.</p>
            </div>
          ) : (
            companyStats.map((stat) => {
              const IconComponent = iconOptions.find(opt => opt.value === stat.icon)?.icon || FaUsers;
              return (
                <div key={stat._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: stat.color }}
                      >
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg" style={{ color: stat.color }}>
                            {stat.value}{stat.suffix}
                          </h4>
                        </div>
                        <p className="text-gray-700 font-medium">{stat.label}</p>
                        {stat.description && (
                          <p className="text-sm text-gray-500">{stat.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                          <span>Order: {stat.order}</span>
                          <span>Delay: {stat.animationDelay}s</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editCompanyStat(stat)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteCompanyStat(stat._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionCMS;