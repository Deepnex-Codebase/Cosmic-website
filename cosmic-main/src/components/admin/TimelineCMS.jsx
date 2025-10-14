import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaImage, FaEye, FaVideo } from 'react-icons/fa';

// Use environment variable directly
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com';
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://api.cosmicpowertech.com';

const TimelineCMS = () => {
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    backgroundImage: '',
    backgroundVideo: '',
    mediaType: 'image',
    order: 0,
    isActive: true
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch timeline items
  const fetchTimelineItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cms/timeline/admin/all`);
      if (response.data.success) {
        setTimelineItems(response.data.data);
      }
    } catch (error) {
      // Removed console.error for fetching timeline items
      alert('Error fetching timeline items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineItems();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle media file selection
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      
      // Determine media type based on file type
      const fileType = file.type.split('/')[0];
      setFormData(prev => ({
        ...prev,
        mediaType: fileType === 'video' ? 'video' : 'image'
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      year: '',
      title: '',
      description: '',
      backgroundImage: '',
      backgroundVideo: '',
      mediaType: 'image',
      order: 0,
      isActive: true
    });
    setMediaFile(null);
    setMediaPreview('');
    setEditingItem(null);
    setShowAddForm(false);
  };

  // Handle add new item
  const handleAdd = () => {
    resetForm();
    setShowAddForm(true);
  };

  // Handle edit item
  const handleEdit = (item) => {
    setFormData({
      year: item.year,
      title: item.title,
      description: item.description,
      backgroundImage: item.backgroundImage || '',
      backgroundVideo: item.backgroundVideo || '',
      mediaType: item.mediaType || 'image',
      order: item.order,
      isActive: item.isActive
    });
    
    // Set preview based on media type
    if (item.mediaType === 'video' && item.backgroundVideo) {
      setMediaPreview(item.backgroundVideo);
    } else {
      setMediaPreview(item.backgroundImage);
    }
    
    setEditingItem(item._id);
    setShowAddForm(true);
  };

  // Handle image compression before upload
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', 0.7); // Compress with 70% quality
        };
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('year', formData.year);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('order', formData.order);
      submitData.append('isActive', formData.isActive);
      submitData.append('mediaType', formData.mediaType);
      
      if (mediaFile) {
        if (formData.mediaType === 'image') {
          // Compress image before uploading
          const compressedImage = await compressImage(mediaFile);
          submitData.append('file', compressedImage);
        } else {
          // For video, no compression
          submitData.append('file', mediaFile);
        }
      } else {
        // If no new file uploaded, use existing URLs
        if (formData.mediaType === 'image' && formData.backgroundImage) {
          submitData.append('backgroundImage', formData.backgroundImage);
        } else if (formData.mediaType === 'video' && formData.backgroundVideo) {
          submitData.append('backgroundVideo', formData.backgroundVideo);
        }
      }

      let response;
      if (editingItem) {
        response = await axios.put(`${API_BASE_URL}/cms/timeline/${editingItem}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          maxContentLength: 100 * 1024 * 1024, // 100MB max content length
          maxBodyLength: 100 * 1024 * 1024 // 100MB max body length
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/cms/timeline`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          maxContentLength: 100 * 1024 * 1024, // 100MB max content length
          maxBodyLength: 100 * 1024 * 1024 // 100MB max body length
        });
      }

      if (response.data.success) {
        alert(editingItem ? 'Timeline item updated successfully!' : 'Timeline item created successfully!');
        resetForm();
        fetchTimelineItems();
      }
    } catch (error) {
      // Removed console.error for saving timeline item
      alert('Error saving timeline item');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete item
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timeline item?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/cms/timeline/${id}`);
        if (response.data.success) {
          alert('Timeline item deleted successfully!');
          fetchTimelineItems();
        }
      } catch (error) {
        // Removed console.error for deleting timeline item
        alert('Error deleting timeline item');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Timeline Management</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add Timeline Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit Timeline Item' : 'Add New Timeline Item'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year *
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
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
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media Type
              </label>
              <div className="flex gap-4 mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="mediaType"
                    value="image"
                    checked={formData.mediaType === 'image'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="flex items-center"><FaImage className="mr-1" /> Image</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="mediaType"
                    value="video"
                    checked={formData.mediaType === 'video'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="flex items-center"><FaVideo className="mr-1" /> Video</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.mediaType === 'image' ? 'Background Image' : 'Background Video'}
              </label>
              <input
                type="file"
                accept={formData.mediaType === 'image' ? "image/*" : "video/*"}
                onChange={handleMediaChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {mediaPreview && formData.mediaType === 'image' && (
                <div className="mt-2">
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-32 h-20 object-cover rounded border"
                  />
                </div>
              )}
              {mediaPreview && formData.mediaType === 'video' && (
                <div className="mt-2">
                  <video
                    src={mediaPreview}
                    controls
                    className="w-64 h-36 rounded border"
                  />
                </div>
              )}
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

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
              >
                <FaSave /> {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline Items List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Timeline Items ({timelineItems.length})</h3>
        </div>
        
        {timelineItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No timeline items found. Add your first timeline item!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {timelineItems.map((item) => (
              <div key={item._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {item.year}
                      </span>
                      <span className="text-sm text-gray-500">Order: {item.order}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    {item.mediaType === 'video' && item.backgroundVideo ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaVideo />
                        <span>Background video attached</span>
                      </div>
                    ) : item.backgroundImage && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaImage />
                        <span>Background image attached</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
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

      {/* Preview Section */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaEye /> Timeline Preview
        </h3>
        <div className="text-sm text-gray-600">
          Active timeline items will be displayed on the website in order. 
          Users can navigate through the timeline to see your company's journey.
        </div>
      </div>
    </div>
  );
};

export default TimelineCMS;