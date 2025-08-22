import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  FaPlus, FaTrash, FaEdit, FaSave, FaUpload, 
  FaLeaf, FaUsers, FaLightbulb, FaHeart, FaShieldAlt, 
  FaRecycle, FaGlobe, FaHandshake, FaStar, FaRocket,
  FaTree, FaSun, FaWind, FaBolt,
  FaEye, FaCog
} from 'react-icons/fa';
import { getCompanyCulture, updateCompanyCulture, uploadCompanyCultureImage } from '../../services/companyCultureService';

const AdminCompanyCulture = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Available icons for selection
  const availableIcons = [
    { name: 'FaLeaf', component: FaLeaf, label: 'Leaf (Environment)' },
    { name: 'FaUsers', component: FaUsers, label: 'Users (Team)' },
    { name: 'FaLightbulb', component: FaLightbulb, label: 'Lightbulb (Innovation)' },
    { name: 'FaHeart', component: FaHeart, label: 'Heart (Care)' },
    { name: 'FaShieldAlt', component: FaShieldAlt, label: 'Shield (Protection)' },
    { name: 'FaRecycle', component: FaRecycle, label: 'Recycle (Sustainability)' },
    { name: 'FaGlobe', component: FaGlobe, label: 'Globe (Global)' },
    { name: 'FaHandshake', component: FaHandshake, label: 'Handshake (Partnership)' },
    { name: 'FaStar', component: FaStar, label: 'Star (Excellence)' },
    { name: 'FaRocket', component: FaRocket, label: 'Rocket (Growth)' },
    { name: 'FaTree', component: FaTree, label: 'Tree (Nature)' },
    { name: 'FaSun', component: FaSun, label: 'Sun (Solar Energy)' },
    { name: 'FaWind', component: FaWind, label: 'Wind (Wind Energy)' },
    { name: 'FaBolt', component: FaBolt, label: 'Bolt (Energy)' },
    { name: 'FaEye', component: FaEye, label: 'Eye (Vision)' },
    { name: 'FaCog', component: FaCog, label: 'Cog (Process)' }
  ];
  
  // Get icon component by name
  const getIconComponent = (iconName) => {
    const icon = availableIcons.find(icon => icon.name === iconName);
    return icon ? icon.component : FaLeaf; // Default to FaLeaf if not found
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
    console.log('handleAddArrayItem called:', section, field);
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
      console.log('New data after adding item:', newData[section][field]);
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
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save company culture data
  const handleSave = async () => {
    try {
      setSaving(true);
      const dataToSave = JSON.parse(JSON.stringify(companyCultureData));
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
      console.error('Error updating company culture page:', error);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Company Culture Page</h1>
      
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
                accept="image/*"
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
                    <div className="relative">
                      <select
                        className="w-full p-2 border rounded appearance-none bg-white"
                        value={principle.icon || 'FaLeaf'}
                        onChange={(e) => handleArrayItemChange('principlesThatGuideUs', 'principles', index, 'icon', e.target.value)}
                      >
                        {availableIcons.map((iconOption) => {
                          const IconComponent = iconOption.component;
                          return (
                            <option key={iconOption.name} value={iconOption.name}>
                              {iconOption.label}
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        {(() => {
                          const IconComponent = getIconComponent(principle.icon || 'FaLeaf');
                          return <IconComponent className="text-gray-500" />;
                        })()}
                      </div>
                    </div>
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
                src={companyCultureData.workEnvironment.image} 
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
                        accept="image/*"
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
    </div>
  );
};

export default AdminCompanyCulture;