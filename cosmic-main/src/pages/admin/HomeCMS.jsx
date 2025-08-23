import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaArrowUp, FaArrowDown, FaSave, FaTimes, FaHome, FaUser, FaCog, FaHeart, FaStar, FaShoppingCart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendar, FaClock, FaCamera, FaVideo, FaMusic, FaGamepad, FaBook, FaCar, FaPlane, FaShip, FaBicycle, FaTree, FaSun, FaMoon, FaCloud, FaSnowflake, FaBolt, FaFire, FaLeaf, FaGift, FaTrophy, FaFlag, FaBell, FaLock, FaKey, FaSearch, FaDownload, FaUpload, FaShare, FaPrint, FaQuestion } from 'react-icons/fa';
import CompanyIntro from '../../components/admin/CompanyIntro';
import VideoHeroCMS from '../../components/admin/VideoHeroCMS';
import TimelineCMS from '../../components/admin/TimelineCMS';
import HeroSectionCMS from '../../components/admin/HeroSectionCMS';
import GreenFutureCMS from '../../components/admin/GreenFutureCMS';
import SolarJourneyCMS from '../../components/admin/SolarJourneyCMS';
import FaqCMS from '../../components/admin/FaqCMS';
// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

const HomeCMS = () => {
  // Icon mapping for safe component rendering
  const iconMap = {
    FaHome, FaUser, FaCog, FaHeart, FaStar, FaShoppingCart, FaPhone, FaEnvelope, 
    FaMapMarkerAlt, FaCalendar, FaClock, FaCamera, FaVideo, FaMusic, FaGamepad, 
    FaBook, FaCar, FaPlane, FaShip, FaBicycle, FaTree, FaSun, FaMoon, FaCloud, 
    FaSnowflake, FaBolt, FaFire, FaLeaf, FaGift, FaTrophy, FaFlag, FaBell, 
    FaLock, FaKey, FaSearch, FaDownload, FaUpload, FaShare, FaPrint
  };
  const [activeTab, setActiveTab] = useState('hero');
  const [heroes, setHeroes] = useState([]);
  const [panIndiaData, setPanIndiaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingHero, setEditingHero] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [panIndiaLoading, setPanIndiaLoading] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    num: '',
    railTitle: '',
    subtitle: '',
    title: [''],
    body: '',
    img: null,
    icon: '',
    order: 0,
    isActive: true
  });

  const [panIndiaFormData, setPanIndiaFormData] = useState({
    title: 'Pan India Presence',
    description: 'Our growing network spans across India, providing reliable solar solutions to homes and businesses nationwide.',
    mapImage: null,
    stats: [
      {
        title: '25+ States',
        description: 'Serving customers across more than 25 states with dedicated local support teams.',
        borderColor: '#003e63',
        order: 1
      },
      {
        title: '100+ Cities',
        description: 'Operating in over 100 cities with installation and maintenance capabilities.',
        borderColor: '#9fc22f',
        order: 2
      },
      {
        title: '1000+ Projects',
        description: 'Successfully completed over 1000 solar installations of various scales nationwide.',
        borderColor: '#003e63',
        order: 3
      }
    ],
    isActive: true
  });

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <FaHome />, component: null },
    { id: 'videoHero', label: 'Video Hero', icon: <FaVideo />, component: <VideoHeroCMS /> },
    { id: 'timeline', label: 'Timeline Section', icon: <FaClock />, component: <TimelineCMS /> },
    { id: 'companyIntro', label: 'Company Intro', icon: <FaUser />, component: <CompanyIntro /> },
    { id: 'heroSection', label: 'Happy Clients', icon: <FaHeart />, component: <HeroSectionCMS /> },
    { id: 'greenFuture', label: 'Green Future', icon: <FaLeaf />, component: <GreenFutureCMS /> },
    { id: 'solarJourney', label: 'Solar Journey', icon: <FaSun />, component: <SolarJourneyCMS /> },
    { id: 'panIndia', label: 'Pan India Presence', icon: <FaMapMarkerAlt />, component: null },
    { id: 'faq', label: 'FAQ Section', icon: <FaQuestion />, component: <FaqCMS /> }
  ];

  useEffect(() => {
    fetchHeroes();
    fetchPanIndiaPresence();
  }, []);

  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/heroes`);
      if (response.data.success) {
        setHeroes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching heroes:', error);
      toast.error('Failed to fetch hero slides');
    } finally {
      setLoading(false);
    }
  };

  const fetchPanIndiaPresence = async () => {
    setPanIndiaLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/pan-india-presence`);
      if (response.data.success && response.data.data.length > 0) {
        const data = response.data.data[0];
        setPanIndiaData(data);
        setPanIndiaFormData({
          title: data.title,
          description: data.description,
          mapImage: null,
          stats: Array.isArray(data.stats) ? data.stats : [],
          isActive: data.isActive
        });
        console.log('Fetched Pan India data:', data);
      }
    } catch (error) {
      console.error('Error fetching Pan India Presence:', error);
      toast.error('Failed to fetch Pan India Presence data');
    } finally {
      setPanIndiaLoading(false);
    }
  };

  const handlePanIndiaInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setPanIndiaFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setPanIndiaFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setPanIndiaFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...panIndiaFormData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setPanIndiaFormData(prev => ({ ...prev, stats: newStats }));
  };

  const addStat = () => {
    const newStat = {
      title: '',
      description: '',
      borderColor: '#003e63',
      order: panIndiaFormData.stats.length + 1
    };
    setPanIndiaFormData(prev => ({ ...prev, stats: [...prev.stats, newStat] }));
  };

  const removeStat = (index) => {
    if (panIndiaFormData.stats.length > 1) {
      const newStats = panIndiaFormData.stats.filter((_, i) => i !== index);
      setPanIndiaFormData(prev => ({ ...prev, stats: newStats }));
    }
  };

  const savePanIndiaPresence = async () => {
    setPanIndiaLoading(true);
    try {
      // Log the API URL being used
      console.log('Pan India API URL:', `${API_BASE_URL}/pan-india-presence`);
      
      // Create a new FormData object
      const formDataToSend = new FormData();
      formDataToSend.append('title', panIndiaFormData.title);
      formDataToSend.append('description', panIndiaFormData.description);
      
      // Properly handle stats array
      if (Array.isArray(panIndiaFormData.stats)) {
        formDataToSend.append('stats', JSON.stringify(panIndiaFormData.stats));
      } else {
        formDataToSend.append('stats', JSON.stringify([]));
      }
      
      // Convert boolean to string for proper FormData handling
      formDataToSend.append('isActive', panIndiaFormData.isActive.toString());
      
      // Check if there's an image to upload and log its size
      if (panIndiaFormData.mapImage) {
        console.log('Image size:', panIndiaFormData.mapImage.size, 'bytes');
        console.log('Image type:', panIndiaFormData.mapImage.type);
        console.log('Image name:', panIndiaFormData.mapImage.name);
        
        // Compress the image if it's too large (over 5MB)
        if (panIndiaFormData.mapImage.size > 5 * 1024 * 1024) {
          toast.info('Image is large, compressing before upload...');
        }
        
        // Ensure the file is properly appended with the correct field name
        formDataToSend.append('mapImage', panIndiaFormData.mapImage, panIndiaFormData.mapImage.name);
        
        // Log FormData contents for debugging
        console.log('FormData entries:');
        for (let pair of formDataToSend.entries()) {
          console.log(pair[0], pair[1]);
        }
      }

      // Always use the API_BASE_URL for consistency
      const apiUrl = `${API_BASE_URL}/pan-india-presence`;
      
      console.log('Using API URL:', apiUrl);
      
      const response = await axios.post(apiUrl, formDataToSend, {
        headers: {
          // Remove Content-Type header to let the browser set it with the boundary parameter
          // for proper multipart/form-data encoding
        },
        maxContentLength: 50 * 1024 * 1024, // 50MB max content length
        maxBodyLength: 50 * 1024 * 1024 // 50MB max body length
      });

      if (response.data.success) {
        toast.success('Pan India Presence updated successfully!');
        fetchPanIndiaPresence();
      }
    } catch (error) {
      console.error('Error saving Pan India Presence:', error);
      // Check for specific error responses
      if (error.response) {
        if (error.response.status === 413) {
          toast.error('Image file is too large. Maximum size is 50MB.');
        } else if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to save Pan India Presence data');
        }
      } else {
        toast.error('Failed to save Pan India Presence data');
      }
    } finally {
      setPanIndiaLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTitleChange = (index, value) => {
    const newTitles = [...formData.title];
    newTitles[index] = value;
    setFormData(prev => ({ ...prev, title: newTitles }));
  };

  const addTitleLine = () => {
    setFormData(prev => ({ ...prev, title: [...prev.title, ''] }));
  };

  const removeTitleLine = (index) => {
    if (formData.title.length > 1) {
      const newTitles = formData.title.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, title: newTitles }));
    }
  };

  const resetForm = () => {
    setFormData({
      key: '',
      num: '',
      railTitle: '',
      subtitle: '',
      title: [''],
      body: '',
      img: null,
      icon: '',
      order: 0,
      isActive: true
    });
    setEditingHero(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'title') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'img' && formData[key]) {
          submitData.append(key, formData[key]);
        } else if (key !== 'img') {
          submitData.append(key, formData[key]);
        }
      });

      let response;
      if (editingHero) {
        response = await axios.put(`${API_BASE_URL}/heroes/${editingHero._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/heroes`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.success) {
        toast.success(editingHero ? 'Hero slide updated successfully!' : 'Hero slide created successfully!');
        fetchHeroes();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving hero:', error);
      // Check for specific error responses
      if (error.response) {
        if (error.response.status === 413) {
          toast.error('Image file is too large. Maximum size is 50MB.');
        } else if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to save hero slide');
        }
      } else {
        toast.error('Failed to save hero slide');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hero) => {
    setFormData({
      key: hero.key || '',
      num: hero.num || '',
      railTitle: hero.railTitle || '',
      subtitle: hero.subtitle || '',
      title: Array.isArray(hero.title) ? hero.title : [''],
      body: hero.body || '',
      img: null,
      icon: hero.icon || '',
      order: hero.order || 0,
      isActive: hero.isActive !== undefined ? hero.isActive : true
    });
    setEditingHero(hero);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hero slide?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/heroes/${id}`);
        if (response.data.success) {
          toast.success('Hero slide deleted successfully!');
          fetchHeroes();
        }
      } catch (error) {
        console.error('Error deleting hero:', error);
        toast.error('Failed to delete hero slide');
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/heroes/${id}/toggle-status`);
      if (response.data.success) {
        toast.success('Hero slide status updated!');
        fetchHeroes();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  const moveHero = async (id, direction) => {
    const currentIndex = heroes.findIndex(hero => hero._id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === heroes.length - 1)
    ) {
      return;
    }

    const newHeroes = [...heroes];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap the heroes
    [newHeroes[currentIndex], newHeroes[targetIndex]] = [newHeroes[targetIndex], newHeroes[currentIndex]];
    
    // Update order values
    const updateData = newHeroes.map((hero, index) => ({
      id: hero._id,
      order: index + 1
    }));

    try {
      const response = await axios.patch(`${API_BASE_URL}/heroes/update-order`, { heroes: updateData });
      if (response.data.success) {
        toast.success('Hero slide order updated!');
        fetchHeroes();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const renderHeroSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Hero Slides Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add New Hero Slide
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {editingHero ? 'Edit Hero Slide' : 'Add New Hero Slide'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key (Unique Identifier)
                </label>
                <input
                  type="text"
                  name="key"
                  value={formData.key}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number (e.g., 01, 02)
                </label>
                <input
                  type="text"
                  name="num"
                  value={formData.num}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rail Title (Left sidebar title)
              </label>
              <textarea
                name="railTitle"
                value={formData.railTitle}
                onChange={handleInputChange}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Use \n for line breaks"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title Lines
              </label>
              {formData.title.map((line, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Title line ${index + 1}`}
                    required
                  />
                  {formData.title.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTitleLine(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTitleLine}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add another title line
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body Text
              </label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Image
              </label>
              <input
                type="file"
                name="img"
                onChange={handleInputChange}
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                {...(!editingHero && { required: true })}
              />
              {editingHero && editingHero.img && (
                <p className="text-sm text-gray-500 mt-1">
                  Current image: {editingHero.img}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select an icon</option>
                <option value="FaHome">🏠 Home</option>
                <option value="FaUser">👤 User</option>
                <option value="FaCog">⚙️ Settings</option>
                <option value="FaHeart">❤️ Heart</option>
                <option value="FaStar">⭐ Star</option>
                <option value="FaShoppingCart">🛒 Shopping Cart</option>
                <option value="FaPhone">📞 Phone</option>
                <option value="FaEnvelope">✉️ Email</option>
                <option value="FaMapMarkerAlt">📍 Location</option>
                <option value="FaCalendar">📅 Calendar</option>
                <option value="FaClock">🕐 Clock</option>
                <option value="FaCamera">📷 Camera</option>
                <option value="FaVideo">🎥 Video</option>
                <option value="FaMusic">🎵 Music</option>
                <option value="FaGamepad">🎮 Gaming</option>
                <option value="FaBook">📚 Book</option>
                <option value="FaCar">🚗 Car</option>
                <option value="FaPlane">✈️ Plane</option>
                <option value="FaShip">🚢 Ship</option>
                <option value="FaBicycle">🚲 Bicycle</option>
                <option value="FaTree">🌳 Tree</option>
                <option value="FaSun">☀️ Sun</option>
                <option value="FaMoon">🌙 Moon</option>
                <option value="FaCloud">☁️ Cloud</option>
                <option value="FaCloud">🌧️ Rain</option>
                <option value="FaSnowflake">❄️ Snow</option>
                <option value="FaBolt">⚡ Lightning</option>
                <option value="FaFire">🔥 Fire</option>
                <option value="FaLeaf">🍃 Leaf</option>
                <option value="FaGift">🎁 Gift</option>
                <option value="FaTrophy">🏆 Trophy</option>
                <option value="FaFlag">🚩 Flag</option>
                <option value="FaBell">🔔 Bell</option>
                <option value="FaLock">🔒 Lock</option>
                <option value="FaKey">🔑 Key</option>
                <option value="FaSearch">🔍 Search</option>
                <option value="FaDownload">⬇️ Download</option>
                <option value="FaUpload">⬆️ Upload</option>
                <option value="FaShare">📤 Share</option>
                <option value="FaPrint">🖨️ Print</option>
              </select>
              {formData.icon && iconMap[formData.icon] && (
                <div className="mt-2 p-2 bg-gray-50 rounded border">
                  <span className="text-sm text-gray-600">Preview: </span>
                  {React.createElement(iconMap[formData.icon], { className: "inline text-lg" })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FaSave /> {loading ? 'Saving...' : 'Save Hero Slide'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Existing Hero Slides</h3>
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : heroes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hero slides found</p>
          ) : (
            <div className="space-y-4">
              {heroes.map((hero, index) => (
                <div key={hero._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          {hero.num}
                        </span>
                        <span className="text-sm text-gray-500">Key: {hero.key}</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          hero.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {hero.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">{hero.subtitle}</h4>
                      <div className="text-gray-600 mb-2">
                        {Array.isArray(hero.title) ? hero.title.join(' ') : hero.title}
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-2">{hero.body}</p>
                      {hero.img && (
                        <div className="mt-2">
                          <img 
                            src={hero.img.startsWith('http') ? hero.img : hero.fullUrl || `${API_BASE_URL}${hero.img}`}
                            alt={hero.subtitle}
                            className="w-20 h-12 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => moveHero(hero._id, 'up')}
                        disabled={index === 0}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        title="Move up"
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        onClick={() => moveHero(hero._id, 'down')}
                        disabled={index === heroes.length - 1}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        title="Move down"
                      >
                        <FaArrowDown />
                      </button>
                      <button
                        onClick={() => toggleStatus(hero._id)}
                        className={`p-2 ${hero.isActive ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
                        title={hero.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {hero.isActive ? <FaEye /> : <FaEyeSlash />}
                      </button>
                      <button
                        onClick={() => handleEdit(hero)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(hero._id)}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPanIndiaSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pan India Presence Management</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border">
        <form onSubmit={(e) => { e.preventDefault(); savePanIndiaPresence(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={panIndiaFormData.title}
                onChange={handlePanIndiaInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Map Image (Max 5MB recommended)
              </label>
              <input
                type="file"
                name="mapImage"
                onChange={handlePanIndiaInputChange}
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">For best results, use images smaller than 5MB</p>
              {panIndiaData && panIndiaData.mapImage && !panIndiaFormData.mapImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Current image:</p>
                  <img
                    src={panIndiaData.mapImage.startsWith('http') ? panIndiaData.mapImage : `${API_BASE_URL}${panIndiaData.mapImage}`}
                    alt="Current map"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
              {panIndiaFormData.mapImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">New image preview:</p>
                  <img
                    src={typeof panIndiaFormData.mapImage === 'string' ? panIndiaFormData.mapImage : URL.createObjectURL(panIndiaFormData.mapImage)}
                    alt="Map preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={panIndiaFormData.description}
              onChange={handlePanIndiaInputChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Statistics</h3>
              <button
                type="button"
                onClick={addStat}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <FaPlus /> Add Stat
              </button>
            </div>

            {panIndiaFormData.stats.map((stat, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={stat.title}
                    onChange={(e) => handleStatChange(index, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={stat.description}
                    onChange={(e) => handleStatChange(index, 'description', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Border Color
                  </label>
                  <input
                    type="color"
                    value={stat.borderColor}
                    onChange={(e) => handleStatChange(index, 'borderColor', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={panIndiaLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <FaSave /> {panIndiaLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Home Page CMS</h1>
          <p className="mt-2 text-gray-600">
            {activeTab === 'hero' && 'Manage your hero section slides and content'}
            {activeTab === 'videoHero' && 'Manage your video hero section'}
            {activeTab === 'timeline' && 'Manage your timeline section events'}
            {activeTab === 'companyIntro' && 'Manage your company introduction content'}
            {activeTab === 'heroSection' && 'Manage your happy clients section'}
            {activeTab === 'greenFuture' && 'Manage your green future section and news cards'}
            {activeTab === 'panIndia' && 'Manage your pan India presence section'}
            {activeTab === 'faq' && 'Manage your frequently asked questions section'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'hero' && renderHeroSection()}
            {activeTab === 'videoHero' && <VideoHeroCMS />}
            {activeTab === 'timeline' && <TimelineCMS />}
            {activeTab === 'companyIntro' && <CompanyIntro />}
            {activeTab === 'heroSection' && <HeroSectionCMS />}
            {activeTab === 'greenFuture' && <GreenFutureCMS />}
            {activeTab === 'solarJourney' && <SolarJourneyCMS />}
            {activeTab === 'panIndia' && renderPanIndiaSection()}
            {activeTab === 'faq' && <FaqCMS />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCMS;