import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileUpload, FaTrash, FaEdit, FaEye, FaCheck, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

const RateCMS = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    unit: 'per kW',
    features: [''],
    isActive: true
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch rates on component mount
  useEffect(() => {
    fetchRates();
  }, []);

  // Fetch all rates
  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/rates`);
      setRates(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rates:', error);
      toast.error('Failed to fetch rates');
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle features array changes
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  // Add new feature field
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  // Remove feature field
  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        features: newFeatures
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file && !editingId) {
      toast.error('Please select a PDF file');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('features', JSON.stringify(formData.features.filter(f => f.trim())));
      formDataToSend.append('isActive', formData.isActive);
      
      if (file) {
        formDataToSend.append('rateFile', file);
      }
      
      if (editingId) {
        // Update existing rate
        await axios.put(`${API_BASE_URL}/rates/${editingId}`, formDataToSend);
        toast.success('Rate updated successfully');
      } else {
        // Create new rate
        await axios.post(`${API_BASE_URL}/rates`, formDataToSend);
        toast.success('Rate uploaded successfully');
      }
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        features: [''],
        isActive: true
      });
      setFile(null);
      setEditingId(null);
      
      // Refresh rates list
      fetchRates();
      
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting rate:', error);
      toast.error('Failed to submit rate');
      setSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEdit = (rate) => {
    setFormData({
      title: rate.title,
      category: rate.category,
      description: rate.description,
      price: rate.price || '',
      unit: rate.unit || 'per kW',
      features: rate.features && rate.features.length > 0 ? rate.features : [''],
      isActive: rate.isActive
    });
    setEditingId(rate._id);
    setFile(null); // Clear file input
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rate?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/rates/${id}`);
      toast.success('Rate deleted successfully');
      fetchRates();
    } catch (error) {
      console.error('Error deleting rate:', error);
      toast.error('Failed to delete rate');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      price: '',
      unit: 'per kW',
      features: [''],
      isActive: true
    });
    setEditingId(null);
    setFile(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Rate Management</h1>
        <p className="text-gray-600">Upload and manage company rates</p>
      </div>
      
      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Rate' : 'Upload New Rate'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
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
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="per kW">per kW</option>
                <option value="per sq ft">per sq ft</option>
                <option value="per hour">per hour</option>
                <option value="per project">per project</option>
                <option value="per consultation">per consultation</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features
            </label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Feature ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  disabled={formData.features.length === 1}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaMinus />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
            >
              <FaPlus /> Add Feature
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF File {!editingId && <span className="text-red-500">*</span>}
              {editingId && <span className="text-gray-500 text-xs ml-2">(Leave empty to keep current file)</span>}
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required={!editingId}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Set as active rate (will be shown on website)
            </label>
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              <FaFileUpload />
              {submitting ? 'Processing...' : (editingId ? 'Update Rate' : 'Upload Rate')}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
              >
                <FaTimes />
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Rates List */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Uploaded Rates</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading rates...</p>
        ) : rates.length === 0 ? (
          <p className="text-gray-500">No rates uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rates.map((rate) => (
                  <tr key={rate._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{rate.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{rate.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{rate.price} {rate.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={rate.description}>
                        {rate.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {rate.features && rate.features.length > 0 ? (
                          <ul className="list-disc list-inside max-w-xs">
                            {rate.features.slice(0, 2).map((feature, index) => (
                              <li key={index} className="truncate">{feature}</li>
                            ))}
                            {rate.features.length > 2 && (
                              <li className="text-gray-500">+{rate.features.length - 2} more</li>
                            )}
                          </ul>
                        ) : (
                          <span className="text-gray-500">No features</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rate.isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <FaCheck className="mr-1" /> Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(rate.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <a
                          href={`${SERVER_URL}${rate.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <FaEye /> View
                        </a>
                        <button
                          onClick={() => handleEdit(rate)}
                          className="text-yellow-600 hover:text-yellow-900 flex items-center gap-1"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rate._id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateCMS;