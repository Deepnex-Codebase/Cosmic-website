import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaImage, FaEye, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const SolarJourneyCMS = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    order: 0,
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch solar journey milestones
  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cms/solar-journey/admin/all');
      if (response.data.success) {
        setMilestones(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching solar journey milestones:', error);
      alert('Error fetching solar journey milestones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      order: 0,
      isActive: true
    });
    setImageFile(null);
    setImagePreview('');
    setEditingItem(null);
    setShowAddForm(false);
  };

  // Handle add new milestone
  const handleAdd = () => {
    resetForm();
    setShowAddForm(true);
  };

  // Handle edit milestone
  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description,
      image: item.image,
      order: item.order,
      isActive: item.isActive
    });
    setImagePreview(item.image);
    setEditingItem(item._id);
    setShowAddForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('order', formData.order);
      submitData.append('isActive', formData.isActive);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (formData.image && !imageFile) {
        submitData.append('image', formData.image);
      }

      let response;
      if (editingItem) {
        response = await axios.put(`/api/cms/solar-journey/${editingItem}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('/api/cms/solar-journey', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.success) {
        alert(editingItem ? 'Solar journey milestone updated successfully!' : 'Solar journey milestone created successfully!');
        resetForm();
        fetchMilestones();
      }
    } catch (error) {
      console.error('Error saving solar journey milestone:', error);
      alert('Error saving solar journey milestone');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete milestone
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this solar journey milestone?')) {
      try {
        const response = await axios.delete(`/api/cms/solar-journey/${id}`);
        if (response.data.success) {
          alert('Solar journey milestone deleted successfully!');
          fetchMilestones();
        }
      } catch (error) {
        console.error('Error deleting solar journey milestone:', error);
        alert('Error deleting solar journey milestone');
      }
    }
  };

  // Handle reordering milestones
  const handleReorder = async (id, direction) => {
    try {
      const response = await axios.put(`/api/cms/solar-journey/reorder/${id}`, { direction });
      if (response.data.success) {
        fetchMilestones();
      }
    } catch (error) {
      console.error('Error reordering milestones:', error);
      alert('Error reordering milestones');
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
        <h2 className="text-2xl font-bold text-gray-800">Solar Journey Management</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add Milestone
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit Solar Journey Milestone' : 'Add New Solar Journey Milestone'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required={!editingItem}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-20 object-cover rounded border"
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

      {/* Milestones List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Solar Journey Milestones ({milestones.length})</h3>
        </div>
        
        {milestones.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No solar journey milestones found. Add your first milestone!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {milestones.map((item, index) => (
              <div key={item._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-gray-500">Order: {item.order}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    {item.image && (
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleReorder(item._id, 'up')}
                        disabled={index === 0}
                        className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 disabled:opacity-50"
                        title="Move Up"
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        onClick={() => handleReorder(item._id, 'down')}
                        disabled={index === milestones.length - 1}
                        className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 disabled:opacity-50"
                        title="Move Down"
                      >
                        <FaArrowDown />
                      </button>
                    </div>
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
          <FaEye /> Solar Journey Preview
        </h3>
        <div className="text-sm text-gray-600">
          Active milestones will be displayed on the website in order. 
          Users can navigate through the solar journey to see your company's achievements and milestones in solar energy.
        </div>
      </div>
    </div>
  );
};

export default SolarJourneyCMS;