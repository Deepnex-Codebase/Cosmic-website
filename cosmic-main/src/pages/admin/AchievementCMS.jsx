import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import achievementService from '../../services/achievementService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

export default function AchievementCMS() {
  const [pageData, setPageData] = useState({
    hero: {
      title: '',
      subtitle: '',
      backgroundImage: ''
    },
    awardWinningSolutions: {
      title: '',
      description: '',
      achievements: [],
      rows: [] // Initialize rows array for row-specific titles and subtitles
    },
    certifications: {
      title: '',
      description: '',
      certificates: []
    },
    industryRecognition: {
      title: '',
      description: '',
      partners: []
    },
    callToAction: {
      title: '',
      subtitle: '',
      buttonText: '',
      buttonLink: ''
    },
    status: 'published'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [availableRows, setAvailableRows] = useState(2); // Track number of available rows
  const [activeRowId, setActiveRowId] = useState(1); // Track active row ID

  // Fetch page data
  const fetchPageData = async () => {
    try {
      setLoading(true);
      const response = await achievementService.getAchievementPage();
      if (response.success) {
        // Merge with default structure to ensure all fields exist
        const data = {
          hero: {
            title: '',
            subtitle: '',
            backgroundImage: '',
            ...response.data.hero
          },
          awardWinningSolutions: {
            title: '',
            description: '',
            achievements: [],
            rows: [],
            ...response.data.awardWinningSolutions
          },
          certifications: {
            title: '',
            description: '',
            certificates: [],
            ...response.data.certifications
          },
          industryRecognition: {
            title: '',
            description: '',
            partners: [],
            ...response.data.industryRecognition
          },
          callToAction: {
            title: '',
            subtitle: '',
            buttonText: '',
            buttonLink: '',
            ...response.data.callToAction
          },
          status: response.data.status || 'published'
        };
        
        setPageData(data);
        
        // Calculate max row ID from achievements
        if (data.awardWinningSolutions?.achievements?.length > 0) {
          // Find the maximum rowId in the achievements
          const maxRowId = Math.max(
            ...data.awardWinningSolutions.achievements.map(a => parseInt(a.rowId || 1, 10)),
            1 // Ensure at least 1
          );
          
          // Max rowId found
          
          // Update availableRows if maxRowId is greater, but ensure at least 2 rows
          setAvailableRows(Math.max(maxRowId, 2));
          
          // Initialize rows array with title and subtitle for each row if not already present
          const existingRows = data.awardWinningSolutions.rows || [];
          const rowsToCreate = [];
          
          // For each row ID, check if a row entry exists, if not create one
          for (let i = 1; i <= Math.max(maxRowId, 2); i++) {
            const rowExists = existingRows.some(row => row.rowId === i);
            if (!rowExists) {
              rowsToCreate.push({
                rowId: i,
                title: `Row ${i} Title`,
                subtitle: `Row ${i} Subtitle`
              });
            }
          }
          
          // If we have new rows to create, update the data
          if (rowsToCreate.length > 0) {
            data.awardWinningSolutions.rows = [...existingRows, ...rowsToCreate];
            // Created missing row entries
          }
        }
      } else {
        toast.error('Failed to fetch page data');
      }
    } catch (error) {
      toast.error('Failed to fetch page data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);
  
  // Calculate max row ID from achievements
  useEffect(() => {
    if (pageData?.awardWinningSolutions?.achievements?.length > 0) {
      // Find the maximum rowId in the achievements
      const maxRowId = Math.max(
        ...pageData.awardWinningSolutions.achievements.map(a => parseInt(a.rowId || 1, 10)),
        1 // Ensure at least 1
      );
      
      
      
      // Update availableRows if maxRowId is greater
      if (maxRowId > availableRows) {
        setAvailableRows(maxRowId);
     
      }
    }
  }, [pageData.awardWinningSolutions?.achievements]);

  // Save page data
  const savePageData = async () => {
    try {
      setSaving(true);
      const response = await achievementService.updateAchievementPage(pageData);
      
      if (response.success) {
        toast.success('Page data saved successfully!');
        // Refresh the data to ensure UI is updated
        await fetchPageData();
        
        // Trigger refresh for the public achievements page
        const timestamp = Date.now().toString();
        
        localStorage.setItem('achievement_updated', timestamp);
        
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'achievement_updated',
          newValue: timestamp
        }));
        
        // Also dispatch a custom event for same-tab updates
        window.dispatchEvent(new CustomEvent('achievementDataUpdated', {
          detail: { timestamp: Date.now() }
        }));
        
      } else {
        throw new Error(response.error || 'Failed to save page data');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save page data');
    } finally {
      setSaving(false);
    }
  };

  // Handle input change for page data
  const handlePageDataChange = (section, field, value) => {
    setPageData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  // Handle image upload for hero section
  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        // You can implement a separate endpoint for hero image upload
        // For now, we'll use local preview
        const reader = new FileReader();
        reader.onloadend = () => {
          handlePageDataChange('hero', 'backgroundImage', reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  // Add a new row for achievements
  const addNewRow = () => {
    const newRowId = availableRows + 1;
    setAvailableRows(newRowId);
    
    // Create a placeholder achievement for the new row
    const placeholderAchievement = {
      title: `Row ${newRowId} Placeholder`,
      description: 'Click Edit to modify this placeholder',
      year: new Date().getFullYear().toString(),
      organization: 'Cosmic Power',
      image: '',
      rowId: newRowId
    };
    
    // Create a new row entry with title and subtitle
    const newRowEntry = {
      rowId: newRowId,
      title: `Row ${newRowId} Title`,
      subtitle: `Row ${newRowId} Subtitle`
    };
    
    // Update the page data to include the new row in the state with a placeholder achievement
    setPageData(prev => {
      const updatedData = {
        ...prev,
        awardWinningSolutions: {
          ...prev.awardWinningSolutions,
          // Add the placeholder achievement to the achievements array
          achievements: [...(prev.awardWinningSolutions?.achievements || []), placeholderAchievement],
          // Add the new row entry to the rows array
          rows: [...(prev.awardWinningSolutions?.rows || []), newRowEntry]
        }
      };
      
      
      
      return updatedData;
    });
    
    // Save the updated page data to persist the new row
    setTimeout(() => {
      savePageData();
    }, 500);
  };

  // Open modal for adding items
  const openModal = (type, item = null, rowId = 1) => {
    setModalType(type);
    setEditingItem(item);
    
    if (type === 'achievement') {
      // Ensure rowId is a number
      const numericRowId = parseInt(rowId, 10) || 1;
      
      setFormData({
        title: item?.title || '',
        year: item?.year || new Date().getFullYear().toString(),
        organization: item?.organization || '',
        description: item?.description || '',
        image: null,
        rowId: item?.rowId || numericRowId // Use the provided rowId or the one from the item
      });
      
      
    } else if (type === 'certificate') {
      setFormData({
        name: item?.name || '',
        description: item?.description || '',
        icon: item?.icon || '',
        image: null
      });
    } else if (type === 'partner') {
      setFormData({
        name: item?.name || '',
        logo: null
      });
    }
    
    // Check if image/logo starts with /uploads and prepend API URL
    let imageUrl = item?.image || item?.logo || '';
    if (imageUrl && imageUrl.startsWith('/uploads')) {
      imageUrl = `${SERVER_URL}${imageUrl}`;
    }
    setImagePreview(imageUrl);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
      // Validate required fields for achievement
      if (modalType === 'achievement') {
        if (!formData.title || !formData.year || !formData.organization || !formData.description) {
          toast.error('Please fill all required fields');
          return;
        }
        if (!editingItem && (!formData.image || formData.image === null)) {
          toast.error('Please select an image');
          return;
        }
        
        // Ensure rowId is a number
        const updatedFormData = {
          ...formData,
          rowId: parseInt(formData.rowId, 10) || 1
        };
        
        
        
        // Update the form data with the validated rowId
        setFormData(updatedFormData);
        
        // Make sure availableRows is updated if this is a new row
        if (updatedFormData.rowId > availableRows) {
          setAvailableRows(updatedFormData.rowId);
          
        }
      }
      

      
      let result;
      if (modalType === 'achievement') {
        // Create a copy of form data with ensured numeric rowId
        const achievementData = {
          ...formData,
          rowId: parseInt(formData.rowId, 10) || 1
        };
        
        
        if (editingItem) {
          result = await achievementService.updateAchievement(editingItem._id, achievementData);
        } else {
          result = await achievementService.addAchievement(achievementData);
        }
      } else if (modalType === 'certificate') {
        if (editingItem) {
          result = await achievementService.updateCertificate(editingItem._id, formData);
        } else {
          result = await achievementService.addCertificate(formData);
        }
      } else if (modalType === 'partner') {
        result = await achievementService.addPartner(formData);
      }
      
      toast.success(`${modalType} ${editingItem ? 'updated' : 'added'} successfully!`);
      setShowModal(false);
      fetchPageData();
    } catch (error) {
      toast.error(`Failed to ${editingItem ? 'update' : 'add'} ${modalType}`);
    }
  };

  // Handle delete
  const handleDelete = async (type, id) => {
    // Custom confirmation message based on type
    const confirmMessage = type === 'row' 
      ? `Are you sure you want to delete Row ${id}? All achievements in this row will be moved to Row 1.`
      : `Are you sure you want to delete this ${type}?`;
      
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    try {
        setLoading(true);
        
        if (type === 'row') {
          // For row deletion, we remove the row from rows array
          const rowId = parseInt(id, 10);
          
          // Don't allow deleting row 1 (default row)
          if (rowId === 1) {
            toast.error("Cannot delete the default row");
            setLoading(false);
            return;
          }
          
          
          // Make sure rows is an array
          if (!Array.isArray(pageData.awardWinningSolutions.rows)) {
            console.error('Rows is not an array:', pageData.awardWinningSolutions.rows);
            toast.error("Error deleting row: rows data is invalid");
            setLoading(false);
            return;
          }
          
          // Update rows array by filtering out the row to delete
          const updatedRows = pageData.awardWinningSolutions.rows.filter(row => row.rowId !== rowId);
          
          
          // Reassign achievements from this row to row 1
          const updatedAchievements = pageData.awardWinningSolutions.achievements.map(achievement => {
            if (parseInt(achievement.rowId, 10) === rowId) {
              return { ...achievement, rowId: 1 };
            }
            return achievement;
          });
          
          // Update the state
          setPageData(prev => {
            const newState = {
              ...prev,
              awardWinningSolutions: {
                ...prev.awardWinningSolutions,
                rows: updatedRows,
                achievements: updatedAchievements
              }
            };
            return newState;
          });
          
          // If the active row was deleted, set active row to 1
          if (activeRowId === rowId) {
            setActiveRowId(1);
          }
          
          toast.success(`Row ${rowId} deleted successfully!`);
          setLoading(false);
          return;
        }
      
      if (type === 'achievement') {
        await achievementService.deleteAchievement(id);
      } else if (type === 'certificate') {
        await achievementService.deleteCertificate(id);
      } else if (type === 'partner') {
        await achievementService.deletePartner(id);
      }
      
      toast.success(`${type} deleted successfully!`);
      fetchPageData();
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fieldName = modalType === 'partner' ? 'logo' : 'image';
      setFormData({ ...formData, [fieldName]: file });
      
      // Create a temporary URL for the file
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      
      // Optional: Revoke the URL when it's no longer needed to free up memory
      // This could be done in a useEffect cleanup function if needed
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'awards', label: 'Awards & Solutions' },
    { id: 'certificates', label: 'Certifications' },
    { id: 'recognition', label: 'Industry Recognition' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Achievement Page Management</h1>
          <p className="text-gray-600 mt-1">Manage your achievements and awards page content</p>
        </div>
        <button
          onClick={savePageData}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Hero Section */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={pageData.hero?.title || ''}
                  onChange={(e) => handlePageDataChange('hero', 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hero section title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <textarea
                  value={pageData.hero?.subtitle || ''}
                  onChange={(e) => handlePageDataChange('hero', 'subtitle', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hero section subtitle"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {pageData.hero?.backgroundImage && (
                  <div className="mt-2">
                    <img
                      src={pageData.hero?.backgroundImage && pageData.hero?.backgroundImage.startsWith('/uploads') ? SERVER_URL + pageData.hero?.backgroundImage : pageData.hero?.backgroundImage}
                      alt="Hero background"
                      className="h-32 w-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Awards & Solutions */}
        {activeTab === 'awards' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Award-Winning Solar Solutions</h2>
              <div className="flex flex-wrap gap-2">
                {/* Dynamic row buttons */}
                {[...Array(availableRows)].map((_, index) => (
                  <div key={index + 1} className="flex items-center">
                    <button
                      onClick={() => openModal('achievement', null, index + 1)}
                      className={`text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors ${index % 3 === 0 ? 'bg-blue-600' : index % 3 === 1 ? 'bg-green-600' : 'bg-purple-600'}`}
                    >
                      Add Achievement (Row {index + 1})
                    </button>
                    {index > 0 && (
                      <button
                        onClick={() => handleDelete('row', index + 1)}
                        className="ml-1 p-1 text-red-600 hover:text-red-800 bg-white rounded-full border border-red-200 hover:border-red-400"
                        title={`Delete Row ${index + 1}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                {/* Add new row button */}
                <button
                  onClick={addNewRow}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <span className="mr-1">+</span> Add New Row
                </button>
              </div>
            </div>
            
            {/* Main section title and subtitle are hidden now */}
            <div className="hidden">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Section Title (Hidden)
                </label>
                <input
                  type="text"
                  value={pageData.awardWinningSolutions?.title || ''}
                  onChange={(e) => handlePageDataChange('awardWinningSolutions', 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Section title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Section Subtitle (Hidden)
                </label>
                <input
                  type="text"
                  value={pageData.awardWinningSolutions?.description || ''}
                  onChange={(e) => handlePageDataChange('awardWinningSolutions', 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Section subtitle"
                />
              </div>
            </div>
            
            {/* Achievements List - Dynamic Rows */}
            {[...Array(availableRows)].map((_, rowIndex) => {
              const rowId = rowIndex + 1;
              const rowAchievements = pageData.awardWinningSolutions?.achievements
                ?.filter(achievement => 
                  rowId === 1 ? (!achievement.rowId || achievement.rowId === 1) : achievement.rowId === rowId
                );
                
              return (
                <div key={rowId} className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Row {rowId}</h3>
                  
                  {/* Row specific title and subtitle */}
                  <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-md font-medium text-gray-700">Row {rowId} Settings</h4>
                      {rowId !== 1 && (
                        <button
                          onClick={() => handleDelete('row', rowId)}
                          className="p-1 text-red-600 hover:text-red-800 bg-white rounded-full border border-red-200 hover:border-red-400 flex items-center"
                          title={`Delete Row ${rowId}`}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete Row</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Row {rowId} Title
                        </label>
                        <input
                          type="text"
                          value={pageData.awardWinningSolutions?.rows?.find(r => r.rowId === rowId)?.title || `Row ${rowId} Title`}
                          onChange={(e) => {
                            const updatedRows = [...(pageData.awardWinningSolutions?.rows || [])];
                            const rowIndex = updatedRows.findIndex(r => r.rowId === rowId);
                            if (rowIndex >= 0) {
                              updatedRows[rowIndex] = { ...updatedRows[rowIndex], title: e.target.value };
                            } else {
                              updatedRows.push({ rowId, title: e.target.value, subtitle: `Row ${rowId} Subtitle` });
                            }
                            handlePageDataChange('awardWinningSolutions', 'rows', updatedRows);
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Row ${rowId} Title`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Row {rowId} Subtitle
                        </label>
                        <input
                          type="text"
                          value={pageData.awardWinningSolutions?.rows?.find(r => r.rowId === rowId)?.subtitle || `Row ${rowId} Subtitle`}
                          onChange={(e) => {
                            const updatedRows = [...(pageData.awardWinningSolutions?.rows || [])];
                            const rowIndex = updatedRows.findIndex(r => r.rowId === rowId);
                            if (rowIndex >= 0) {
                              updatedRows[rowIndex] = { ...updatedRows[rowIndex], subtitle: e.target.value };
                            } else {
                              updatedRows.push({ rowId, title: `Row ${rowId} Title`, subtitle: e.target.value });
                            }
                            handlePageDataChange('awardWinningSolutions', 'rows', updatedRows);
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Row ${rowId} Subtitle`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rowAchievements?.map((achievement, index) => (
                      <div 
                        key={index} 
                        className={`border border-gray-200 rounded-lg p-4 ${rowId % 3 === 0 ? 'bg-blue-50' : rowId % 3 === 1 ? '' : 'bg-green-50'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openModal('achievement', achievement)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('achievement', achievement._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{achievement.organization} - {achievement.year}</p>
                        <p className="text-sm text-gray-500 mt-1">{achievement.description?.substring(0, 100)}...</p>
                      </div>
                    ))}
                    {rowAchievements?.length === 0 && (
                      <div className="col-span-3 text-center py-8 border border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500">No achievements added to Row {rowId} yet.</p>
                        <button
                          onClick={() => openModal('achievement', null, rowId)}
                          className="mt-2 text-blue-600 hover:text-blue-800 underline"
                        >
                          Add Achievement
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* Certifications */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
              <button
                onClick={() => openModal('certificate')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Certificate
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={pageData.certifications?.title || ''}
                  onChange={(e) => handlePageDataChange('certifications', 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Section title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={pageData.certifications?.description || ''}
                  onChange={(e) => handlePageDataChange('certifications', 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Section subtitle"
                />
              </div>
            </div>
            
            {/* Certificates List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageData.certifications?.certificates?.map((certificate, index) => (
                <div key={certificate._id || index} className="border border-gray-200 rounded-lg p-4 relative">
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => openModal('certificate', certificate)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit certificate"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete('certificate', certificate._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete certificate"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="font-medium text-gray-900 pr-16">{certificate.name}</h3>
                  <p className="text-sm text-gray-600">{certificate.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Icon: {certificate.icon}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Industry Recognition */}
        {activeTab === 'recognition' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Industry Recognition</h2>
              <button
                onClick={() => openModal('partner')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Partner
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={pageData.industryRecognition?.title || ''}
                  onChange={(e) => handlePageDataChange('industryRecognition', 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Section title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={pageData.industryRecognition?.description || ''}
                  onChange={(e) => handlePageDataChange('industryRecognition', 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Section subtitle"
                />
              </div>
            </div>
            
            {/* Partners List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pageData.industryRecognition?.partners?.map((partner, index) => (
                <div key={partner._id || index} className="border border-gray-200 rounded-lg p-4 text-center relative">
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => openModal('partner', partner)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit partner"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete('partner', partner._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete partner"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {partner.logo && (
                    <img
                      src={partner.logo.startsWith('/uploads') ? `${SERVER_URL}${partner.logo}` : partner.logo}
                      alt={partner.name}
                      className="h-16 w-auto mx-auto mb-2"
                    />
                  )}
                  <h3 className="font-medium text-gray-900 pr-16">{partner.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {modalType === 'achievement' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Achievement title"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Year *
                        </label>
                        <input
                          type="text"
                          name="year"
                          value={formData.year || ''}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="2024"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organization *
                        </label>
                        <input
                          type="text"
                          name="organization"
                          value={formData.organization || ''}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Awarding organization"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Achievement description"
                      />
                    </div>
                  </>
                )}
                
                {modalType === 'certificate' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Certificate name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Certificate description"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon
                      </label>
                      <select
                        name="icon"
                        value={formData.icon || 'shield'}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="shield">🛡️ Shield</option>
                        <option value="certificate">📜 Certificate</option>
                        <option value="award">🏆 Award</option>
                        <option value="star">⭐ Star</option>
                        <option value="check">✅ Check</option>
                        <option value="badge">🏅 Badge</option>
                        <option value="medal">🥇 Medal</option>
                        <option value="crown">👑 Crown</option>
                        <option value="gem">💎 Gem</option>
                        <option value="ribbon">🎗️ Ribbon</option>
                      </select>
                    </div>
                  </>
                )}
                
                {modalType === 'partner' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partner Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Partner name"
                    />
                  </div>
                )}
                
                {modalType !== 'certificate' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {modalType === 'partner' ? 'Logo' : 'Image'} {modalType === 'achievement' && !editingItem && '*'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={modalType === 'achievement' && !editingItem}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview.startsWith('/uploads') ? `${SERVER_URL}${imagePreview}` : imagePreview}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingItem ? 'Update' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}