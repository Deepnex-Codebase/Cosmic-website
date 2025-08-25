import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaEdit, FaSave, FaUpload } from 'react-icons/fa';
import { getAboutPage, updateAboutPage, uploadExpertiseImage, uploadHeroVideo, addExpertiseItem, removeExpertiseItem } from '../../services/aboutService';

const AdminAbout = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState({
    hero: { title: '', subtitle: '', videoUrl: '' },
    aboutUs: { title: '', content: [''] },
    whoWeAre: { title: '', content: '' },
    expertise: { title: '', description: '', items: [] },
    visionMissionValues: {
      title: 'Our Core Principles',
      description: 'The foundation of our approach to sustainable energy solutions.',
      vision: { title: 'Vision', content: [''] },
      mission: { title: 'Mission', content: [''] },
      values: { title: 'Values', content: [''] }
    },
    clientTestimonials: {
      title: 'What Our Clients Say',
      subtitle: 'Client Testimonials',
      testimonials: []
    }
  });
  const [activeTab, setActiveTab] = useState('hero');
  const [newExpertiseItem, setNewExpertiseItem] = useState({ title: '', image: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const videoInputRef = useRef(null);

  // Fetch about page data
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const data = await getAboutPage();
        // Only update state if we got valid data
        if (data && Object.keys(data).length > 0) {
          setAboutData(data);
        } else {
          toast.warning('Using default about page data as server data could not be loaded');
        }
      } catch (error) {
        console.error('Error fetching about page data:', error);
        toast.error('Failed to load about page data');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Handle input change
  const handleInputChange = (section, field, value, index = null) => {
    setAboutData(prevData => {
      const newData = { ...prevData };
      
      if (index !== null && Array.isArray(newData[section][field])) {
        // Handle array fields
        newData[section][field][index] = value;
      } else if (index !== null && typeof newData[section] === 'object' && Array.isArray(newData[section])) {
        // Handle array of objects
        newData[section][index][field] = value;
      } else if (field.includes('.')) {
        // Handle nested fields
        const [parentField, childField] = field.split('.');
        newData[section][parentField][childField] = value;
      } else {
        // Handle simple fields
        newData[section][field] = value;
      }
      
      return newData;
    });
  };

  // Handle array item input change
  const handleArrayItemChange = (section, field, index, subfield, value) => {
    setAboutData(prevData => {
      const newData = { ...prevData };
      
      // Ensure section exists
      if (!newData[section]) {
        newData[section] = {};
      }
      
      // Ensure field array exists
      if (!newData[section][field]) {
        newData[section][field] = [];
      }
      
      // Ensure the item at index exists
      if (!newData[section][field][index]) {
        newData[section][field][index] = {};
      }
      
      newData[section][field][index][subfield] = value;
      console.log('Updated expertise item:', newData[section][field][index]);
      return newData;
    });
  };

  // Add array item
  const handleAddArrayItem = (section, field, defaultItem) => {
    setAboutData(prevData => {
      const newData = { ...prevData };
      if (!newData[section][field]) {
        newData[section][field] = [];
      }
      newData[section][field].push(defaultItem);
      return newData;
    });
  };

  // Remove array item
  const handleRemoveArrayItem = (section, field, index) => {
    setAboutData(prevData => {
      const newData = { ...prevData };
      newData[section][field].splice(index, 1);
      return newData;
    });
  };

  // Handle expertise image upload
  const handleExpertiseImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WEBP)');
      return;
    }

    try {
      setUploadingImage(true);
      const result = await uploadExpertiseImage(file);
      setNewExpertiseItem(prev => ({ ...prev, image: result.imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      // Display specific error message if available
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to upload image. Please try again.');
      }
      
      // Reset the file input
      e.target.value = '';
    } finally {
      setUploadingImage(false);
    }
  };
  
  // Handle hero video upload
  const handleHeroVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
    if (!validVideoTypes.includes(file.type)) {
      toast.error('Please select a valid video file (MP4, WebM, Ogg, AVI, MOV)');
      return;
    }
    
    try {
      setUploadingVideo(true);
      const result = await uploadHeroVideo(file);
      
      // Update the state with the new video URL
      setAboutData(prevData => ({
        ...prevData,
        hero: {
          ...prevData.hero,
          videoUrl: result.videoUrl
        }
      }));
      
      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };
  
  // Trigger video file input click
  const triggerVideoUpload = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  // Add expertise item
  const handleAddExpertiseItem = async () => {
    if (!newExpertiseItem.title || !newExpertiseItem.image) {
      toast.error('Title and image are required');
      return;
    }

    try {
      setSaving(true);
      const result = await addExpertiseItem(newExpertiseItem);
      
      // Check if the result has a success message
      if (result && result.message && result.message.includes('successfully')) {
        // Refresh data
        const updatedData = await getAboutPage();
        
        // Make sure we have the expertise items array
        if (!updatedData.expertise) {
          updatedData.expertise = { title: 'Our Expertise', description: '', items: [] };
        }
        if (!updatedData.expertise.items) {
          updatedData.expertise.items = [];
        }
        
        // Make sure items is an array
        if (!Array.isArray(updatedData.expertise.items)) {
          updatedData.expertise.items = [];
        }
        
        setAboutData(updatedData);
        
        // Reset form
        setNewExpertiseItem({ title: '', image: '' });
        
        toast.success('Expertise item added successfully');
        
        // Save the updated data to ensure it's reflected on the website
        const saveResult = await updateAboutPage(updatedData);
        console.log('Save result after adding expertise item:', saveResult);
      } else {
        toast.error('Failed to add expertise item: ' + (result?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding expertise item:', error);
      toast.error('Failed to add expertise item: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  // Remove expertise item
  const handleRemoveExpertiseItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;

    try {
      setSaving(true);
      const result = await removeExpertiseItem(itemId);
      
      // Check if the result has a success message
      if (result && result.message && result.message.includes('successfully')) {
        // Refresh data
        const updatedData = await getAboutPage();
        
        // Make sure we have the expertise items array
        if (!updatedData.expertise) {
          updatedData.expertise = { title: 'Our Expertise', description: '', items: [] };
        }
        if (!updatedData.expertise.items) {
          updatedData.expertise.items = [];
        }
        
        // Make sure items is an array
        if (!Array.isArray(updatedData.expertise.items)) {
          updatedData.expertise.items = [];
        }
        
        setAboutData(updatedData);
        
        toast.success('Expertise item removed successfully');
        
        // Save the updated data to ensure it's reflected on the website
        const saveResult = await updateAboutPage(updatedData);
        console.log('Save result after removing expertise item:', saveResult);
      } else {
        toast.error('Failed to remove expertise item: ' + (result?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error removing expertise item:', error);
      toast.error('Failed to remove expertise item: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  // Save about page data
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Create a deep copy of the aboutData to avoid reference issues
      const dataToSave = JSON.parse(JSON.stringify(aboutData));
      
      // Make sure we have the expertise items array
      if (!dataToSave.expertise) {
        dataToSave.expertise = { title: 'Our Expertise', description: '', items: [] };
      }
      if (!dataToSave.expertise.items) {
        dataToSave.expertise.items = [];
      }
      
      const result = await updateAboutPage(dataToSave);
      
      if (result && result.success) {
        // Refresh data to ensure we have the latest from server
        const refreshedData = await getAboutPage();
        setAboutData(refreshedData);
        
        toast.success('About page updated successfully');
      } else {
        toast.error('Failed to update about page: ' + (result?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating about page:', error);
      toast.error('Failed to update about page: ' + (error.message || 'Unknown error'));
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
      <h1 className="text-3xl font-bold mb-6">Manage About Page</h1>
      
      {/* Tabs */}
      <div className="flex flex-wrap mb-6 border-b">
        {['hero', 'aboutUs', 'whoWeAre', 'expertise', 'visionMissionValues', 'clientTestimonials'].map(tab => (
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
      {activeTab === 'hero' && aboutData.hero && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Hero Section</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={aboutData.hero.title || ''}
              onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={aboutData.hero.subtitle || ''}
              onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Video</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={aboutData.hero.videoUrl || ''}
                onChange={(e) => handleInputChange('hero', 'videoUrl', e.target.value)}
                placeholder="Video URL will appear here after upload"
                readOnly
              />
              <button
                type="button"
                onClick={triggerVideoUpload}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                disabled={uploadingVideo}
              >
                {uploadingVideo ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <>
                    <FaUpload className="mr-2" /> Upload Video
                  </>
                )}
              </button>
              <input
                type="file"
                ref={videoInputRef}
                onChange={handleHeroVideoUpload}
                accept="video/mp4,video/webm,video/ogg,video/avi,video/mov"
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Upload a video file (MP4, WebM, Ogg, AVI, MOV) - Max size: 50MB</p>
          </div>
          
          {aboutData.hero.videoUrl && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Video Preview</label>
              <video 
                className="w-full h-64 object-cover rounded" 
                controls
              >
                <source src={aboutData.hero.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      )}
      
      {/* About Us Section */}
      {activeTab === 'aboutUs' && aboutData.aboutUs && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">About Us Section</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={aboutData.aboutUs.title || ''}
              onChange={(e) => handleInputChange('aboutUs', 'title', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Content</label>
            {aboutData.aboutUs.content && aboutData.aboutUs.content.map((paragraph, index) => (
              <div key={index} className="flex mb-2">
                <textarea
                  className="w-full p-2 border rounded mr-2"
                  rows="3"
                  value={paragraph}
                  onChange={(e) => handleInputChange('aboutUs', 'content', e.target.value, index)}
                />
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => handleRemoveArrayItem('aboutUs', 'content', index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center mt-2"
              onClick={() => handleAddArrayItem('aboutUs', 'content', '')}
            >
              <FaPlus className="mr-2" /> Add Paragraph
            </button>
          </div>
        </div>
      )}
      
      {/* Who We Are Section */}
      {activeTab === 'whoWeAre' && aboutData.whoWeAre && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Who We Are Section</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={aboutData.whoWeAre.title || ''}
              onChange={(e) => handleInputChange('whoWeAre', 'title', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Content</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="4"
              value={aboutData.whoWeAre.content || ''}
              onChange={(e) => handleInputChange('whoWeAre', 'content', e.target.value)}
            />
          </div>
        </div>
      )}
      
      {/* Expertise Section */}
      {activeTab === 'expertise' && aboutData.expertise && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Expertise Section</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={aboutData.expertise.title || ''}
              onChange={(e) => handleInputChange('expertise', 'title', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="2"
              value={aboutData.expertise.description || ''}
              onChange={(e) => handleInputChange('expertise', 'description', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Expertise Items</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {aboutData.expertise.items && aboutData.expertise.items.map((item, index) => (
                <div key={index} className="border rounded p-4 relative">
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                    onClick={() => handleRemoveExpertiseItem(item._id)}
                  >
                    <FaTrash />
                  </button>
                  
                  <div className="mb-2">
                    <label className="block text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={item.title || ''}
                      onChange={(e) => handleArrayItemChange('expertise', 'items', index, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-2">
                    <label className="block text-gray-700 mb-1">Image</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={item.image || ''}
                      onChange={(e) => handleArrayItemChange('expertise', 'items', index, 'image', e.target.value)}
                    />
                  </div>
                  
                  {item.image && (
                    <div className="mt-2">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-32 object-cover rounded" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="border rounded p-4">
              <h4 className="text-md font-semibold mb-2">Add New Expertise Item</h4>
              
              <div className="mb-2">
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newExpertiseItem.title}
                  onChange={(e) => setNewExpertiseItem(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-gray-700 mb-1">Image</label>
                <div className="flex">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full p-2 border rounded"
                    onChange={handleExpertiseImageUpload}
                    disabled={uploadingImage}
                  />
                </div>
              </div>
              
              {newExpertiseItem.image && (
                <div className="mt-2 mb-2">
                  <img 
                    src={newExpertiseItem.image} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded" 
                  />
                </div>
              )}
              
              <button
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center mt-2"
                onClick={handleAddExpertiseItem}
                disabled={!newExpertiseItem.title || !newExpertiseItem.image || uploadingImage}
              >
                <FaPlus className="mr-2" /> Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vision Mission Values Section */}
      {activeTab === 'visionMissionValues' && aboutData.visionMissionValues && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Our Core Principles</h2>
          
          {/* Section Title and Description */}
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={aboutData.visionMissionValues.title || ''}
                onChange={(e) => handleInputChange('visionMissionValues', 'title', e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Section Description</label>
              <textarea
                className="w-full p-2 border rounded h-20"
                value={aboutData.visionMissionValues.description || ''}
                onChange={(e) => handleInputChange('visionMissionValues', 'description', e.target.value)}
              />
            </div>
          </div>

          {/* Vision Section */}
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Vision</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Vision Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={aboutData.visionMissionValues.vision?.title || ''}
                onChange={(e) => {
                  setAboutData(prev => ({
                    ...prev,
                    visionMissionValues: {
                      ...prev.visionMissionValues,
                      vision: {
                        ...prev.visionMissionValues.vision,
                        title: e.target.value
                      }
                    }
                  }));
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Vision Content (Paragraphs)</label>
              {aboutData.visionMissionValues.vision?.content?.map((paragraph, index) => (
                <div key={index} className="mb-2 flex">
                  <textarea
                    className="w-full p-2 border rounded h-20 mr-2"
                    value={paragraph}
                    onChange={(e) => {
                      const newContent = [...(aboutData.visionMissionValues.vision?.content || [])];
                      newContent[index] = e.target.value;
                      setAboutData(prev => ({
                        ...prev,
                        visionMissionValues: {
                          ...prev.visionMissionValues,
                          vision: {
                            ...prev.visionMissionValues.vision,
                            content: newContent
                          }
                        }
                      }));
                    }}
                    placeholder={`Vision paragraph ${index + 1}`}
                  />
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      const newContent = aboutData.visionMissionValues.vision?.content?.filter((_, i) => i !== index) || [];
                      setAboutData(prev => ({
                        ...prev,
                        visionMissionValues: {
                          ...prev.visionMissionValues,
                          vision: {
                            ...prev.visionMissionValues.vision,
                            content: newContent
                          }
                        }
                      }));
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                onClick={() => {
                  const newContent = [...(aboutData.visionMissionValues.vision?.content || []), ''];
                  setAboutData(prev => ({
                    ...prev,
                    visionMissionValues: {
                      ...prev.visionMissionValues,
                      vision: {
                        ...prev.visionMissionValues.vision,
                        content: newContent
                      }
                    }
                  }));
                }}
              >
                <FaPlus className="mr-2" /> Add Vision Paragraph
              </button>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Mission</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Mission Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={aboutData.visionMissionValues.mission?.title || ''}
                onChange={(e) => {
                  setAboutData(prev => ({
                    ...prev,
                    visionMissionValues: {
                      ...prev.visionMissionValues,
                      mission: {
                        ...prev.visionMissionValues.mission,
                        title: e.target.value
                      }
                    }
                  }));
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Mission Content (Paragraphs)</label>
              {aboutData.visionMissionValues.mission?.content?.map((paragraph, index) => (
                <div key={index} className="mb-2 flex">
                  <textarea
                    className="w-full p-2 border rounded h-20 mr-2"
                    value={paragraph}
                    onChange={(e) => {
                      const newContent = [...(aboutData.visionMissionValues.mission?.content || [])];
                      newContent[index] = e.target.value;
                      setAboutData(prev => ({
                        ...prev,
                        visionMissionValues: {
                          ...prev.visionMissionValues,
                          mission: {
                            ...prev.visionMissionValues.mission,
                            content: newContent
                          }
                        }
                      }));
                    }}
                    placeholder={`Mission paragraph ${index + 1}`}
                  />
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      const newContent = aboutData.visionMissionValues.mission?.content?.filter((_, i) => i !== index) || [];
                      setAboutData(prev => ({
                        ...prev,
                        visionMissionValues: {
                          ...prev.visionMissionValues,
                          mission: {
                            ...prev.visionMissionValues.mission,
                            content: newContent
                          }
                        }
                      }));
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                onClick={() => {
                  const newContent = [...(aboutData.visionMissionValues.mission?.content || []), ''];
                  setAboutData(prev => ({
                    ...prev,
                    visionMissionValues: {
                      ...prev.visionMissionValues,
                      mission: {
                        ...prev.visionMissionValues.mission,
                        content: newContent
                      }
                    }
                  }));
                }}
              >
                <FaPlus className="mr-2" /> Add Mission Paragraph
              </button>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Values</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Values Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={aboutData.visionMissionValues.values?.title || ''}
                onChange={(e) => {
                  setAboutData(prev => ({
                    ...prev,
                    visionMissionValues: {
                      ...prev.visionMissionValues,
                      values: {
                        ...prev.visionMissionValues.values,
                        title: e.target.value
                      }
                    }
                  }));
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Values Content (Paragraphs)</label>
              {aboutData.visionMissionValues.values?.content?.map((paragraph, index) => (
                <div key={index} className="mb-2 flex">
                  <textarea
                    className="w-full p-2 border rounded h-20 mr-2"
                    value={paragraph}
                    onChange={(e) => {
                      const newContent = [...(aboutData.visionMissionValues.values?.content || [])];
                      newContent[index] = e.target.value;
                      setAboutData(prev => ({
                        ...prev,
                        visionMissionValues: {
                          ...prev.visionMissionValues,
                          values: {
                            ...prev.visionMissionValues.values,
                            content: newContent
                          }
                        }
                      }));
                    }}
                    placeholder={`Values paragraph ${index + 1}`}
                  />
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      const newContent = aboutData.visionMissionValues.values?.content?.filter((_, i) => i !== index) || [];
                      setAboutData(prev => ({
                        ...prev,
                        visionMissionValues: {
                          ...prev.visionMissionValues,
                          values: {
                            ...prev.visionMissionValues.values,
                            content: newContent
                          }
                        }
                      }));
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                onClick={() => {
                  const newContent = [...(aboutData.visionMissionValues.values?.content || []), ''];
                  setAboutData(prev => ({
                    ...prev,
                    visionMissionValues: {
                      ...prev.visionMissionValues,
                      values: {
                        ...prev.visionMissionValues.values,
                        content: newContent
                      }
                    }
                  }));
                }}
              >
                <FaPlus className="mr-2" /> Add Values Paragraph
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Testimonials Section */}
      {activeTab === 'clientTestimonials' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">What Our Clients Say</h2>
          
          {/* Section Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={aboutData.clientTestimonials?.title || ''}
              onChange={(e) => setAboutData(prev => ({
                ...prev,
                clientTestimonials: {
                  ...prev.clientTestimonials,
                  title: e.target.value
                }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="What Our Clients Say"
            />
          </div>

          {/* Section Subtitle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
            <input
              type="text"
              value={aboutData.clientTestimonials?.subtitle || ''}
              onChange={(e) => setAboutData(prev => ({
                ...prev,
                clientTestimonials: {
                  ...prev.clientTestimonials,
                  subtitle: e.target.value
                }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Client Testimonials"
            />
          </div>

          {/* Testimonials */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Testimonials</label>
            {aboutData.clientTestimonials?.testimonials?.map((testimonial, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={testimonial.name || ''}
                      onChange={(e) => {
                        const newTestimonials = [...(aboutData.clientTestimonials?.testimonials || [])];
                        newTestimonials[index] = { ...newTestimonials[index], name: e.target.value };
                        setAboutData(prev => ({
                          ...prev,
                          clientTestimonials: {
                            ...prev.clientTestimonials,
                            testimonials: newTestimonials
                          }
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Client Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={testimonial.role || ''}
                      onChange={(e) => {
                        const newTestimonials = [...(aboutData.clientTestimonials?.testimonials || [])];
                        newTestimonials[index] = { ...newTestimonials[index], role: e.target.value };
                        setAboutData(prev => ({
                          ...prev,
                          clientTestimonials: {
                            ...prev.clientTestimonials,
                            testimonials: newTestimonials
                          }
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Client Role"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={testimonial.image || ''}
                      onChange={(e) => {
                        const newTestimonials = [...(aboutData.clientTestimonials?.testimonials || [])];
                        newTestimonials[index] = { ...newTestimonials[index], image: e.target.value };
                        setAboutData(prev => ({
                          ...prev,
                          clientTestimonials: {
                            ...prev.clientTestimonials,
                            testimonials: newTestimonials
                          }
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Image URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating || 5}
                      onChange={(e) => {
                        const newTestimonials = [...(aboutData.clientTestimonials?.testimonials || [])];
                        newTestimonials[index] = { ...newTestimonials[index], rating: parseInt(e.target.value) };
                        setAboutData(prev => ({
                          ...prev,
                          clientTestimonials: {
                            ...prev.clientTestimonials,
                            testimonials: newTestimonials
                          }
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                  <textarea
                    value={testimonial.quote || ''}
                    onChange={(e) => {
                      const newTestimonials = [...(aboutData.clientTestimonials?.testimonials || [])];
                      newTestimonials[index] = { ...newTestimonials[index], quote: e.target.value };
                      setAboutData(prev => ({
                        ...prev,
                        clientTestimonials: {
                          ...prev.clientTestimonials,
                          testimonials: newTestimonials
                        }
                      }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="3"
                    placeholder="Client testimonial quote"
                  />
                </div>
                <button
                  onClick={() => {
                    const newTestimonials = aboutData.clientTestimonials?.testimonials?.filter((_, i) => i !== index) || [];
                    setAboutData(prev => ({
                      ...prev,
                      clientTestimonials: {
                        ...prev.clientTestimonials,
                        testimonials: newTestimonials
                      }
                    }));
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <FaTrash className="mr-1" /> Remove
                </button>
              </div>
            ))}
            
            <button
              onClick={() => {
                const newTestimonial = {
                  id: Date.now(),
                  name: '',
                  role: '',
                  image: '',
                  quote: '',
                  rating: 5
                };
                setAboutData(prev => ({
                  ...prev,
                  clientTestimonials: {
                    ...prev.clientTestimonials,
                    testimonials: [...(prev.clientTestimonials?.testimonials || []), newTestimonial]
                  }
                }));
              }}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add New Testimonial
            </button>
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

export default AdminAbout;