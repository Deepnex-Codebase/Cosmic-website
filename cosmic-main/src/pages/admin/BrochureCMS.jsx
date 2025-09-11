import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileUpload, FaTrash, FaEdit, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

const BrochureCMS = () => {
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    isActive: true
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch brochures on component mount
  useEffect(() => {
    fetchBrochures();
  }, []);

  // Fetch all brochures
  const fetchBrochures = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/brochures`);
      setBrochures(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brochures:', error);
      toast.error('Failed to fetch brochures');
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
      formDataToSend.append('isActive', formData.isActive);
      
      if (file) {
        formDataToSend.append('brochureFile', file);
      }
      
      let response;
      
      if (editingId) {
        // Update existing brochure
        response = await axios.put(`${API_BASE_URL}/brochures/${editingId}`, formDataToSend);
        toast.success('Brochure updated successfully');
      } else {
        // Create new brochure
        response = await axios.post(`${API_BASE_URL}/brochures`, formDataToSend);
        toast.success('Brochure uploaded successfully');
      }
      
      // Reset form
      setFormData({
        title: '',
        isActive: true
      });
      setFile(null);
      setEditingId(null);
      
      // Refresh brochures list
      fetchBrochures();
      
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting brochure:', error);
      toast.error('Failed to submit brochure');
      setSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEdit = (brochure) => {
    setFormData({
      title: brochure.title,
      isActive: brochure.isActive
    });
    setEditingId(brochure._id);
    setFile(null); // Clear file input
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brochure?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/brochures/${id}`);
      toast.success('Brochure deleted successfully');
      fetchBrochures();
    } catch (error) {
      console.error('Error deleting brochure:', error);
      toast.error('Failed to delete brochure');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setFormData({
      title: '',
      isActive: true
    });
    setEditingId(null);
    setFile(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Brochure Management</h1>
        <p className="text-gray-600">Upload and manage company brochures</p>
      </div>
      
      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Brochure' : 'Upload New Brochure'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Set as active brochure (will be shown on website)
            </label>
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              <FaFileUpload />
              {submitting ? 'Processing...' : (editingId ? 'Update Brochure' : 'Upload Brochure')}
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
      
      {/* Brochures List */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Uploaded Brochures</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading brochures...</p>
        ) : brochures.length === 0 ? (
          <p className="text-gray-500">No brochures uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
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
                {brochures.map((brochure) => (
                  <tr key={brochure._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{brochure.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {brochure.isActive ? (
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
                        {new Date(brochure.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <a
                          href={`${SERVER_URL}${brochure.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <FaEye /> View
                        </a>
                        <button
                          onClick={() => handleEdit(brochure)}
                          className="text-yellow-600 hover:text-yellow-900 flex items-center gap-1"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(brochure._id)}
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

export default BrochureCMS;