import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  FaPlus, FaTrash, FaEdit, FaSave, FaUpload, FaSearch
} from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import { getCompanyCulture, updateCompanyCulture, uploadCompanyCultureImage, formatImageUrl, getFontAwesomeIcons } from '../../services/companyCultureService';

const AdminCompanyCulture = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [availableIcons, setAvailableIcons] = useState([]);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [currentIconField, setCurrentIconField] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get icon component by name
  const getIconComponent = (iconName) => {
    if (!iconName) return FaIcons.FaLeaf; // Default to FaLeaf if not found
    return FaIcons[iconName] || FaIcons.FaLeaf;
  };
  
  // Fetch Font Awesome icons
  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const iconsData = await getFontAwesomeIcons();
        
        // Get all available icons from react-icons/fa
        const allFaIconNames = Object.keys(FaIcons).filter(key => 
          typeof FaIcons[key] === 'function' && key.startsWith('Fa')
        );
        
        // Found total Font Awesome icons
        
        // Format all available icons
        const formattedIcons = allFaIconNames.map(icon => ({
          name: icon,
          component: FaIcons[icon],
          label: icon.replace('Fa', '')
        }));
        
        // Loaded icons
        setAvailableIcons(formattedIcons);
        setFilteredIcons(formattedIcons);
      } catch (error) {
        console.error('Error fetching Font Awesome icons:', error);
        toast.error('Failed to load icons. Using default icons instead.');
        
        // Fallback to default icons
        const defaultIcons = [
          'FaLeaf', 'FaUsers', 'FaLightbulb', 'FaHeart', 'FaShieldAlt',
          'FaRecycle', 'FaGlobe', 'FaHandshake', 'FaStar', 'FaRocket',
          'FaTree', 'FaSun', 'FaWind', 'FaBolt', 'FaEye', 'FaCog'
        ];
        
        const formattedDefaultIcons = defaultIcons.map(icon => ({
          name: icon,
          component: FaIcons[icon],
          label: icon.replace('Fa', '')
        }));
        
        setAvailableIcons(formattedDefaultIcons);
        setFilteredIcons(formattedDefaultIcons);
      }
    };
    
    fetchIcons();
  }, []);
  
  // Filter icons based on search term and category
  useEffect(() => {
    // First filter by category
    let categoryFiltered = availableIcons;
    if (selectedCategory && selectedCategory !== 'all') {
      categoryFiltered = availableIcons.filter(icon => {
        const iconName = icon.name.toLowerCase();
        switch(selectedCategory) {
          case 'regular':
            return iconName.includes('far');
          case 'solid':
            return iconName.includes('fas') || (!iconName.includes('far') && !iconName.includes('fab'));
          case 'brands':
            return iconName.includes('fab');
          case 'business':
            return iconName.includes('building') || iconName.includes('briefcase') || iconName.includes('chart') || 
                   iconName.includes('file') || iconName.includes('money') || iconName.includes('dollar');
          case 'chart':
            return iconName.includes('chart') || iconName.includes('graph') || iconName.includes('bar') || 
                   iconName.includes('pie') || iconName.includes('line');
          case 'communication':
            return iconName.includes('comment') || iconName.includes('envelope') || iconName.includes('phone') || 
                   iconName.includes('message') || iconName.includes('bell');
          case 'devices':
            return iconName.includes('mobile') || iconName.includes('tablet') || iconName.includes('laptop') || 
                   iconName.includes('desktop') || iconName.includes('tv') || iconName.includes('camera');
          case 'document':
            return iconName.includes('file') || iconName.includes('document') || iconName.includes('pdf') || 
                   iconName.includes('word') || iconName.includes('excel');
          case 'education':
            return iconName.includes('book') || iconName.includes('graduation') || iconName.includes('school') || 
                   iconName.includes('university') || iconName.includes('student');
          case 'emoji':
            return iconName.includes('smile') || iconName.includes('frown') || iconName.includes('laugh') || 
                   iconName.includes('angry') || iconName.includes('meh');
          case 'map':
            return iconName.includes('map') || iconName.includes('location') || iconName.includes('marker') || 
                   iconName.includes('compass') || iconName.includes('globe');
          case 'media':
            return iconName.includes('play') || iconName.includes('pause') || iconName.includes('stop') || 
                   iconName.includes('music') || iconName.includes('video') || iconName.includes('camera');
          case 'medical':
            return iconName.includes('hospital') || iconName.includes('medkit') || iconName.includes('ambulance') || 
                   iconName.includes('stethoscope') || iconName.includes('heartbeat');
          case 'nature':
            return iconName.includes('leaf') || iconName.includes('tree') || iconName.includes('flower') || 
                   iconName.includes('sun') || iconName.includes('moon') || iconName.includes('mountain');
          case 'security':
            return iconName.includes('lock') || iconName.includes('shield') || iconName.includes('key') || 
                   iconName.includes('fingerprint') || iconName.includes('user-shield');
          case 'shapes':
            return iconName.includes('square') || iconName.includes('circle') || iconName.includes('triangle') || 
                   iconName.includes('star') || iconName.includes('heart');
          case 'shopping':
            return iconName.includes('shopping') || iconName.includes('cart') || iconName.includes('bag') || 
                   iconName.includes('credit-card') || iconName.includes('tag');
          case 'social':
            return iconName.includes('facebook') || iconName.includes('twitter') || iconName.includes('instagram') || 
                   iconName.includes('linkedin') || iconName.includes('youtube');
          case 'spinners':
            return iconName.includes('spinner') || iconName.includes('circle-notch') || iconName.includes('sync') || 
                   iconName.includes('cog') || iconName.includes('loading');
          case 'sports':
            return iconName.includes('football') || iconName.includes('basketball') || iconName.includes('baseball') || 
                   iconName.includes('volleyball') || iconName.includes('golf');
          case 'technology':
            return iconName.includes('code') || iconName.includes('laptop') || iconName.includes('server') || 
                   iconName.includes('database') || iconName.includes('wifi');
          case 'transportation':
            return iconName.includes('car') || iconName.includes('bus') || iconName.includes('truck') || 
                   iconName.includes('plane') || iconName.includes('train');
          case 'users':
            return iconName.includes('user') || iconName.includes('users') || iconName.includes('person') || 
                   iconName.includes('people') || iconName.includes('profile');
          case 'weather':
            return iconName.includes('cloud') || iconName.includes('sun') || iconName.includes('moon') || 
                   iconName.includes('rain') || iconName.includes('snow') || iconName.includes('wind');
          default:
            return true;
        }
      });
    }
    
    // Then filter by search term
    if (!searchTerm.trim()) {
      setFilteredIcons(categoryFiltered);
      return;
    }
    
    const filtered = categoryFiltered.filter(icon => 
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      icon.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredIcons(filtered);
  }, [searchTerm, availableIcons, selectedCategory]);
  
  // Open icon selector modal
  const openIconSelector = (fieldPath, currentValue) => {
    setCurrentIconField(fieldPath);
    setShowIconSelector(true);
    setSearchTerm('');
    setFilteredIcons(availableIcons);
  };
  
  // Select icon and update field
  const selectIcon = (iconName) => {
    if (!currentIconField) return;
    
    // Update the companyCultureData with the selected icon
    const newData = { ...companyCultureData };
    
    // Parse the field path (e.g., "principles.0.icon")
    const pathParts = currentIconField.split('.');
    let current = newData;
    
    // Navigate to the parent object
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    // Update the icon field
    current[pathParts[pathParts.length - 1]] = iconName;
    
    // Update state
    setCompanyCultureData(newData);
    setShowIconSelector(false);
    setCurrentIconField(null);
  };
  const [companyCultureData, setCompanyCultureData] = useState({
    hero: {
      title: 'Company Culture',
      subtitle: 'Building a Sustainable Future Together',
      backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80'
    },
    brandVision: {
      title: 'Brand Vision & Strategy',
      subtitle: 'Our commitment to excellence drives everything we do',
      description: 'We are dedicated to creating innovative renewable energy solutions that not only meet today\'s needs but also pave the way for a sustainable future. Our comprehensive approach combines cutting-edge technology with environmental responsibility.',
      coreValues: [],
      buttonText: 'Join Our Mission',
      buttonLink: '/contact'
    },
    principlesThatGuideUs: {
      title: 'The Principles That Guide Us',
      subtitle: 'Our Core Values',
      principles: []
    },
    workEnvironment: {
      title: 'Our Work Environment',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      content: []
    },
    sustainabilityManagement: {
      title: 'SUSTAINABILITY MANAGEMENT',
      cards: []
    },
    sustainabilityCommitment: {
      title: 'Our Commitment to Sustainability',
      subtitle: 'Beyond our products, we\'re committed to sustainable operations in every aspect of our business.',
      commitments: []
    },
    joinTeam: {
      title: 'Join Our Team',
      description: 'We\'re always looking for talented individuals who share our passion for renewable energy and sustainability. Explore our current openings and become part of our mission to create a greener future.',
      buttonText: 'View Career Opportunities',
      buttonLink: '/careers'
    }
  });
  const [activeTab, setActiveTab] = useState('hero');

  // Fetch company culture data
  useEffect(() => {
    const fetchCompanyCultureData = async () => {
      try {
        setLoading(true);
        const response = await getCompanyCulture();
        const data = response.data || response;
        if (data && Object.keys(data).length > 0) {
          // Format image URLs in the data
          if (data.hero && data.hero.backgroundImage) {
            data.hero.backgroundImage = formatImageUrl(data.hero.backgroundImage);
          }
          
          if (data.workEnvironment && data.workEnvironment.image) {
            data.workEnvironment.image = formatImageUrl(data.workEnvironment.image);
          }
          
          if (data.sustainabilityManagement && data.sustainabilityManagement.cards) {
            data.sustainabilityManagement.cards = data.sustainabilityManagement.cards.map(card => ({
              ...card,
              image: card.image ? formatImageUrl(card.image) : card.image
            }));
          }
          
          setCompanyCultureData(data);
        } else {
          toast.warning('Using default company culture data as server data could not be loaded');
        }
      } catch (error) {
        console.error('Error fetching company culture data:', error);
        toast.error('Failed to load company culture data');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyCultureData();
  }, []);

  // Handle input change
  const handleInputChange = (section, field, value, index = null) => {
    setCompanyCultureData(prevData => {
      const newData = { ...prevData };
      
      // Ensure section exists
      if (!newData[section]) {
        newData[section] = {};
      }
      
      if (index !== null && Array.isArray(newData[section][field])) {
        newData[section][field][index] = value;
      } else if (index !== null && typeof newData[section] === 'object' && Array.isArray(newData[section])) {
        newData[section][index][field] = value;
      } else if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        if (!newData[section][parentField]) {
          newData[section][parentField] = {};
        }
        newData[section][parentField][childField] = value;
      } else {
        newData[section][field] = value;
      }
      
      return newData;
    });
  };

  // Handle array item input change
  const handleArrayItemChange = (section, field, index, subfield, value) => {
    setCompanyCultureData(prevData => {
      const newData = { ...prevData };
      
      // Ensure section and field exist
      if (!newData[section]) {
        newData[section] = {};
      }
      if (!newData[section][field]) {
        newData[section][field] = [];
      }
      if (!newData[section][field][index]) {
        newData[section][field][index] = {};
      }
      
      newData[section][field][index][subfield] = value;
      return newData;
    });
  };

  // Add array item
  const handleAddArrayItem = (section, field, defaultItem) => {
    setCompanyCultureData(prevData => {
      const newData = { ...prevData };
      
      // Ensure section exists
      if (!newData[section]) {
        newData[section] = {};
      }
      if (!newData[section][field]) {
        newData[section][field] = [];
      }
      
      newData[section][field].push(defaultItem);
      return newData;
    });
  };

  // Remove array item
  const handleRemoveArrayItem = (section, field, index) => {
    setCompanyCultureData(prevData => {
      const newData = { ...prevData };
      
      // Ensure section and field exist
      if (!newData[section]) {
        newData[section] = {};
      }
      if (!newData[section][field]) {
        newData[section][field] = [];
      }
      
      newData[section][field].splice(index, 1);
      return newData;
    });
  };

  // Handle image upload
  const handleImageUpload = async (event, section, field) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size before uploading
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 40) {
      toast.error('File size exceeds 40MB limit. Please choose a smaller file.');
      return;
    }

    try {
      setUploadingImage(true);
      const result = await uploadCompanyCultureImage(file);
      
      // Handle nested field paths like 'cards.0.image'
      if (field.includes('.')) {
        const fieldParts = field.split('.');
        if (fieldParts.length === 3) {
          // For nested array items like 'cards.0.image'
          const [arrayField, index, subField] = fieldParts;
          handleArrayItemChange(section, arrayField, parseInt(index), subField, result.imageUrl);
        } else {
          // For simple nested fields like 'hero.image'
          handleInputChange(section, field, result.imageUrl);
        }
      } else {
        handleInputChange(section, field, result.imageUrl);
      }
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error.message && error.message.includes('File size exceeds')) {
        toast.error(error.message);
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('Failed to upload image: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setUploadingImage(false);
    }
  };

  // Save company culture data
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Create a clean copy of the data to avoid reference issues
      const dataToSave = JSON.parse(JSON.stringify(companyCultureData));
      
      // Ensure all required sections exist
      if (!dataToSave.hero) dataToSave.hero = {};
      if (!dataToSave.brandVision) dataToSave.brandVision = {};
      if (!dataToSave.principlesThatGuideUs) dataToSave.principlesThatGuideUs = {};
      if (!dataToSave.workEnvironment) dataToSave.workEnvironment = {};
      if (!dataToSave.sustainabilityManagement) dataToSave.sustainabilityManagement = {};
      if (!dataToSave.sustainabilityCommitment) dataToSave.sustainabilityCommitment = {};
      if (!dataToSave.joinTeam) dataToSave.joinTeam = {};
      
      // Send data to API
      const result = await updateCompanyCulture(dataToSave);
      
      if (result && result.success) {
        // Update local state with the saved data from backend
        if (result.data) {
          setCompanyCultureData(result.data);
        } else {
          // Fallback: refresh data from server
          const refreshedData = await getCompanyCulture();
          setCompanyCultureData(refreshedData.data || refreshedData);
        }
        toast.success('Company Culture page updated successfully');
      } else {
        toast.error('Failed to update company culture page: ' + (result?.error || 'Unknown error'));
      }
    } catch (error) {
      toast.error('Failed to update company culture page: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // FontAwesomeIconSelector component for icon selection modal
  const FontAwesomeIconSelector = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const categories = [
      { id: 'all', name: 'All Icons' },
      { id: 'regular', name: 'Regular' },
      { id: 'solid', name: 'Solid' },
      { id: 'brands', name: 'Brands' },
      { id: 'business', name: 'Business' },
      { id: 'chart', name: 'Charts' },
      { id: 'communication', name: 'Communication' },
      { id: 'devices', name: 'Devices' },
      { id: 'document', name: 'Documents' },
      { id: 'education', name: 'Education' },
      { id: 'emoji', name: 'Emoji' },
      { id: 'map', name: 'Maps' },
      { id: 'media', name: 'Media' },
      { id: 'medical', name: 'Medical' },
      { id: 'nature', name: 'Nature' },
      { id: 'security', name: 'Security' },
      { id: 'shapes', name: 'Shapes' },
      { id: 'shopping', name: 'Shopping' },
      { id: 'social', name: 'Social' },
      { id: 'spinners', name: 'Spinners' },
      { id: 'sports', name: 'Sports' },
      { id: 'technology', name: 'Technology' },
      { id: 'transportation', name: 'Transportation' },
      { id: 'users', name: 'Users' },
      { id: 'weather', name: 'Weather' },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold">Select an Icon</h3>
            <button 
              onClick={() => setShowIconSelector(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="p-4 border-b">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                className="bg-transparent border-none outline-none w-full"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-4 border-b overflow-x-auto">
            <div className="flex space-x-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedCategory === category.id ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {filteredIcons.map((icon, index) => {
                  const IconComponent = icon.component;
                  return (
                    <button
                      key={index}
                      className="p-3 border rounded-lg hover:bg-gray-100 flex flex-col items-center justify-center h-24"
                      onClick={() => selectIcon(icon.name)}
                    >
                      <div className="text-2xl mb-2">
                        {IconComponent && <IconComponent />}
                      </div>
                      <div className="text-xs text-center truncate w-full">{icon.label}</div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No icons found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Company Culture Page</h1>
      
      {/* Icon Selector Modal */}
      {showIconSelector && <FontAwesomeIconSelector />}
      
      {/* Tabs */}
      <div className="flex flex-wrap mb-6 border-b">
        {['hero', 'brandVision', 'principlesThatGuideUs', 'workEnvironment', 'sustainabilityManagement', 'sustainabilityCommitment', 'joinTeam'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 mr-2 ${activeTab === tab ? 'bg-primary-500 text-white' : 'bg-gray-200'} rounded-t-lg`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>
      
      {/* Hero Section */}
      {activeTab === 'hero' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Hero Section</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={companyCultureData.hero?.title || ''}
              onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={companyCultureData.hero?.subtitle || ''}
              onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Background Image</label>
            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer flex items-center w-fit">
              <FaUpload className="mr-2" />
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'hero', 'backgroundImage')}
                disabled={uploadingImage}
              />
            </label>
            {companyCultureData.hero?.backgroundImage && (
              <p className="text-sm text-gray-600 mt-2">Current: {companyCultureData.hero.backgroundImage.split('/').pop()}</p>
            )}
          </div>
          
          {companyCultureData.hero?.backgroundImage && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Image Preview</label>
              <img 
                src={companyCultureData.hero.backgroundImage} 
                alt="Hero Background" 
                className="w-full h-64 object-cover rounded" 
              />
            </div>
          )}
        </div>
      )}
      
      {/* Brand Vision Section */}
      {activeTab === 'brandVision' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Brand Vision & Strategy</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={companyCultureData.brandVision?.title || ''}
              onChange={(e) => handleInputChange('brandVision', 'title', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={companyCultureData.brandVision?.subtitle || ''}
              onChange={(e) => handleInputChange('brandVision', 'subtitle', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full p-2 border rounded h-32"
              value={companyCultureData.brandVision?.description || ''}
              onChange={(e) => handleInputChange('brandVision', 'description', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Core Values</label>
            {companyCultureData.brandVision?.coreValues?.map((value, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded mr-2"
                  value={value}
                  onChange={(e) => handleInputChange('brandVision', 'coreValues', e.target.value, index)}
                  placeholder="Core value"
                />
                <button
                  onClick={() => handleRemoveArrayItem('brandVision', 'coreValues', index)}
                  className="bg-red-500 text-white px-3 py-2 rounded"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddArrayItem('brandVision', 'coreValues', '')}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Core Value
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={companyCultureData.brandVision?.buttonText || ''}
                onChange={(e) => handleInputChange('brandVision', 'buttonText', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Button Link</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={companyCultureData.brandVision?.buttonLink || ''}
                onChange={(e) => handleInputChange('brandVision', 'buttonLink', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* The Principles That Guide Us Section */}
      {activeTab === 'principlesThatGuideUs' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">The Principles That Guide Us</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={companyCultureData.principlesThatGuideUs?.title || ''}
              onChange={(e) => handleInputChange('principlesThatGuideUs', 'title', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={companyCultureData.principlesThatGuideUs?.subtitle || ''}
              onChange={(e) => handleInputChange('principlesThatGuideUs', 'subtitle', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Principles</label>
            {companyCultureData.principlesThatGuideUs?.principles?.map((principle, index) => (
              <div key={index} className="border p-4 rounded mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-gray-700 mb-1">Icon</label>
                    <div className="flex items-center">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          className="w-full p-2 border rounded appearance-none bg-white"
                          value={principle.icon || 'FaLeaf'}
                          readOnly
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          {(() => {
                            const IconComponent = getIconComponent(principle.icon || 'FaLeaf');
                            return <IconComponent className="text-gray-500" />;
                          })()}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ml-2 bg-blue-500 text-white px-3 py-2 rounded flex items-center"
                        onClick={() => openIconSelector(`principlesThatGuideUs.principles.${index}.icon`, principle.icon)}
                      >
                        <FaSearch className="mr-1" /> Choose Icon
                      </button>
                    </div>
                    
                    <label className="block text-gray-700 mt-2 mb-1">Custom SVG Icon (optional)</label>
                    <textarea
                      className="w-full p-2 border rounded h-24"
                      value={principle.customSvgIcon || ''}
                      onChange={(e) => handleArrayItemChange('principlesThatGuideUs', 'principles', index, 'customSvgIcon', e.target.value)}
                      placeholder="<svg>...</svg>"
                    />
                    {principle.customSvgIcon && (
                      <div className="mt-2">
                        <label className="block text-gray-700 mb-1">Preview:</label>
                        <div className="p-2 border rounded flex items-center justify-center">
                          <div className="h-10 w-10 text-[#9fc22f]" dangerouslySetInnerHTML={{ __html: principle.customSvgIcon }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={principle.title || ''}
                      onChange={(e) => handleArrayItemChange('principlesThatGuideUs', 'principles', index, 'title', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows="3"
                    value={principle.description || ''}
                    onChange={(e) => handleArrayItemChange('principlesThatGuideUs', 'principles', index, 'description', e.target.value)}
                  />
                </div>
                <button
                  onClick={() => handleRemoveArrayItem('principlesThatGuideUs', 'principles', index)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <FaTrash className="mr-1" /> Remove Principle
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddArrayItem('principlesThatGuideUs', 'principles', { icon: 'FaLeaf', title: '', description: '' })}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Principle
            </button>
          </div>
        </div>
      )}
      
      {/* Work Environment Section */}
      {activeTab === 'workEnvironment' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Work Environment</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={companyCultureData.workEnvironment?.title || ''}
              onChange={(e) => handleInputChange('workEnvironment', 'title', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Image</label>
            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer flex items-center w-fit">
              <FaUpload className="mr-2" />
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'workEnvironment', 'image')}
                disabled={uploadingImage}
              />
            </label>
            {companyCultureData.workEnvironment?.image && (
              <p className="text-sm text-gray-600 mt-2">Current: {companyCultureData.workEnvironment.image.split('/').pop()}</p>
            )}
          </div>
          
          {companyCultureData.workEnvironment?.image && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Image Preview</label>
              <img 
                src={companyCultureData.workEnvironment.image && companyCultureData.workEnvironment.image.startsWith('/uploads') ? 'https://api.cosmicpowertech.com' + companyCultureData.workEnvironment.image : companyCultureData.workEnvironment.image} 
                alt="Work Environment" 
                className="w-full h-64 object-cover rounded" 
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Content</label>
            {companyCultureData.workEnvironment?.content?.map((paragraph, index) => (
              <div key={index} className="flex mb-2">
                <textarea
                  className="flex-1 p-2 border rounded mr-2"
                  rows="3"
                  value={paragraph}
                  onChange={(e) => handleInputChange('workEnvironment', 'content', e.target.value, index)}
                  placeholder="Content paragraph"
                />
                <button
                  onClick={() => handleRemoveArrayItem('workEnvironment', 'content', index)}
                  className="bg-red-500 text-white px-3 py-2 rounded"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddArrayItem('workEnvironment', 'content', '')}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Content Paragraph
            </button>
          </div>
        </div>
      )}
      
      {/* Sustainability Management Section */}
      {activeTab === 'sustainabilityManagement' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Sustainability Management</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={companyCultureData.sustainabilityManagement?.title || ''}
              onChange={(e) => handleInputChange('sustainabilityManagement', 'title', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Cards</label>
            {companyCultureData.sustainabilityManagement?.cards?.map((card, index) => (
              <div key={index} className="border p-4 rounded mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={card.title || ''}
                      onChange={(e) => handleArrayItemChange('sustainabilityManagement', 'cards', index, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Image</label>
                    <label className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer flex items-center w-fit">
                      <FaUpload className="mr-2" />
                      {uploadingImage ? 'Uploading...' : 'Upload'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            // Handle image upload for card
                            handleImageUpload(e, 'sustainabilityManagement', `cards.${index}.image`);
                          }
                        }}
                        disabled={uploadingImage}
                      />
                    </label>
                    {card.image && (
                      <p className="text-sm text-gray-600 mt-1">Current: {card.image.split('/').pop()}</p>
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows="3"
                    value={card.description || ''}
                    onChange={(e) => handleArrayItemChange('sustainabilityManagement', 'cards', index, 'description', e.target.value)}
                  />
                </div>
                <button
                  onClick={() => handleRemoveArrayItem('sustainabilityManagement', 'cards', index)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <FaTrash className="mr-1" /> Remove Card
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddArrayItem('sustainabilityManagement', 'cards', { title: '', image: '', description: '' })}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Card
            </button>
          </div>
        </div>
      )}
      
      {/* Sustainability Commitment Section */}
      {activeTab === 'sustainabilityCommitment' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Sustainability Commitment</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={companyCultureData.sustainabilityCommitment?.title || ''}
              onChange={(e) => handleInputChange('sustainabilityCommitment', 'title', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={companyCultureData.sustainabilityCommitment?.subtitle || ''}
              onChange={(e) => handleInputChange('sustainabilityCommitment', 'subtitle', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Commitments</label>
            {companyCultureData.sustainabilityCommitment?.commitments?.map((commitment, index) => (
              <div key={index} className="border p-4 rounded mb-4">
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={commitment.title || ''}
                    onChange={(e) => handleArrayItemChange('sustainabilityCommitment', 'commitments', index, 'title', e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows="3"
                    value={commitment.description || ''}
                    onChange={(e) => handleArrayItemChange('sustainabilityCommitment', 'commitments', index, 'description', e.target.value)}
                  />
                </div>
                <button
                  onClick={() => handleRemoveArrayItem('sustainabilityCommitment', 'commitments', index)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <FaTrash className="mr-1" /> Remove Commitment
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddArrayItem('sustainabilityCommitment', 'commitments', { title: '', description: '' })}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Commitment
            </button>
          </div>
        </div>
      )}
      
      {/* Join Team Section */}
      {activeTab === 'joinTeam' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Join Our Team</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={companyCultureData.joinTeam?.title || ''}
              onChange={(e) => handleInputChange('joinTeam', 'title', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full p-2 border rounded h-24"
              value={companyCultureData.joinTeam?.description || ''}
              onChange={(e) => handleInputChange('joinTeam', 'description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={companyCultureData.joinTeam?.buttonText || ''}
                onChange={(e) => handleInputChange('joinTeam', 'buttonText', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Button Link</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={companyCultureData.joinTeam?.buttonLink || ''}
                onChange={(e) => handleInputChange('joinTeam', 'buttonLink', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Save Button */}
      <div className="flex justify-end">
        <button
          className="bg-primary-500 text-white px-6 py-3 rounded-lg flex items-center"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave className="mr-2" /> Save Changes
            </>
          )}
        </button>
      </div>
      
      {/* Icon Selector Modal */}
      {showIconSelector && (
        <FontAwesomeIconSelector
          onClose={() => setShowIconSelector(false)}
          onSelectIcon={selectIcon}
        />
      )}
    </div>
  );
};

// Font Awesome Icon Selector Modal
const FontAwesomeIconSelector = ({ onClose, onSelectIcon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [availableIcons, setAvailableIcons] = useState([]);
  
  // Fetch icons when component mounts
  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const iconsData = await getFontAwesomeIcons();
        // Get all icons from all categories
        const allIcons = iconsData.all || Object.values(iconsData.categories || {}).flat();
        
        const formattedIcons = allIcons.map(icon => ({
          name: icon,
          component: FaIcons[icon],
          label: icon.replace('Fa', '')
        })).filter(icon => icon.component);
        
        setAvailableIcons(formattedIcons);
        setFilteredIcons(formattedIcons);
      } catch (error) {
        console.error('Error fetching Font Awesome icons in modal:', error);
        // Fallback to default icons
        const defaultIcons = [
          'FaLeaf', 'FaUsers', 'FaLightbulb', 'FaHeart', 'FaShieldAlt',
          'FaRecycle', 'FaGlobe', 'FaHandshake', 'FaStar', 'FaRocket'
        ];
        
        const formattedDefaultIcons = defaultIcons.map(icon => ({
          name: icon,
          component: FaIcons[icon],
          label: icon.replace('Fa', '')
        }));
        
        setAvailableIcons(formattedDefaultIcons);
        setFilteredIcons(formattedDefaultIcons);
      }
    };
    
    fetchIcons();
  }, []);
  
  // Filter icons based on search term and category
  useEffect(() => {
    let filtered = availableIcons;
    
    // Filter by category if not 'all'
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(icon => {
        // Check if icon name contains the category
        const iconNameLower = icon.name.toLowerCase();
        const categoryLower = selectedCategory.toLowerCase();
        
        // Special case for regular/solid/brands
        if (categoryLower === 'regular') return iconNameLower.includes('far');
        if (categoryLower === 'solid') return iconNameLower.includes('fas') || (!iconNameLower.includes('far') && !iconNameLower.includes('fab'));
        if (categoryLower === 'brands') return iconNameLower.includes('fab');
        
        // For other categories, check if the icon name or label contains the category
        return iconNameLower.includes(categoryLower) || 
               icon.label.toLowerCase().includes(categoryLower);
      });
    }
    
    // Filter by search term if provided
    if (searchTerm.trim()) {
      filtered = filtered.filter(icon => 
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        icon.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredIcons(filtered);
  }, [searchTerm, selectedCategory, availableIcons]);
  
  // Categories for the selector
  const categories = [
    { id: 'all', label: 'All Icons' },
    { id: 'regular', label: 'Regular' },
    { id: 'solid', label: 'Solid' },
    { id: 'brands', label: 'Brands' },
    { id: 'business', label: 'Business' },
    { id: 'chart', label: 'Charts' },
    { id: 'communication', label: 'Communication' },
    { id: 'devices', label: 'Devices' },
    { id: 'document', label: 'Documents' },
    { id: 'education', label: 'Education' },
    { id: 'emoji', label: 'Emoji' },
    { id: 'map', label: 'Maps' },
    { id: 'media', label: 'Media' },
    { id: 'medical', label: 'Medical' },
    { id: 'nature', label: 'Nature' },
    { id: 'security', label: 'Security' },
    { id: 'shapes', label: 'Shapes' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'social', label: 'Social' },
    { id: 'spinners', label: 'Spinners' },
    { id: 'sports', label: 'Sports' },
    { id: 'technology', label: 'Technology' },
    { id: 'transportation', label: 'Transportation' },
    { id: 'users', label: 'Users' },
    { id: 'weather', label: 'Weather' }
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-primary-600">Select an Icon</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-primary-500" />
          </div>
          <input
            type="text"
            placeholder="Search icons by name..."
            className="w-full pl-12 p-3 border-2 border-gray-300 focus:border-primary-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2 bg-gray-50 p-4 rounded-lg">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.id 
                ? 'bg-primary-500 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 max-h-[50vh] overflow-y-auto p-2 bg-white rounded-lg">
          {filteredIcons.map((icon, index) => {
            const IconComponent = icon.component;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 transform hover:scale-105"
                onClick={() => onSelectIcon(icon.name)}
              >
                <div className="text-2xl mb-2 text-primary-600">
                  <IconComponent />
                </div>
                <div className="text-xs text-center truncate w-full font-medium">{icon.label}</div>
              </div>
            );
          })}
        </div>
        
        {filteredIcons.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <FaSearch className="mx-auto text-4xl mb-3 text-gray-400" />
            <p className="text-lg">No icons found matching your search.</p>
            <p className="text-sm mt-2">Try a different search term or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCompanyCulture;