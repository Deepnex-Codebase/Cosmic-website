import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaImage, FaVideo } from 'react-icons/fa';

// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const ProjectHeroCMS = () => {
  const [projectHeroes, setProjectHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Explore Now',
    buttonLink: '#projects',
    mediaType: 'image',
    isActive: false
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch project heroes on component mount
  useEffect(() => {
    fetchProjectHeroes();
  }, []);

  const fetchProjectHeroes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/project-hero`);
      setProjectHeroes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project heroes:', error);
      toast.error('Failed to fetch project heroes');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      buttonText: 'Explore Now',
      buttonLink: '#projects',
      mediaType: 'image',
      isActive: false
    });
    setMediaFile(null);
    setMediaPreview('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subtitle || (!editingId && !mediaFile)) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('buttonText', formData.buttonText);
      formDataToSend.append('buttonLink', formData.buttonLink);
      formDataToSend.append('mediaType', formData.mediaType);
      formDataToSend.append('isActive', formData.isActive);
      
      // Include updated time in form data
      if (editingId) {
        formDataToSend.append('updatedAt', new Date().toISOString());
      }
      
      if (mediaFile) {
        formDataToSend.append('media', mediaFile);
      }

      let response;
      if (editingId) {
        response = await axios.put(`${API_BASE_URL}/project-hero/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Project hero updated successfully');
      } else {
        response = await axios.post(`${API_BASE_URL}/project-hero`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Project hero created successfully');
      }

      resetForm();
      fetchProjectHeroes();
    } catch (error) {
      console.error('Error saving project hero:', error);
      toast.error(error.response?.data?.message || 'Failed to save project hero');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (hero) => {
    setFormData({
      title: hero.title,
      subtitle: hero.subtitle,
      buttonText: hero.buttonText,
      buttonLink: hero.buttonLink,
      mediaType: hero.mediaType,
      isActive: hero.isActive,
      createdAt: hero.createdAt,
      updatedAt: new Date().toISOString() // Update edit time to current time
    });
    // Fix URL by removing /api/ if present
    const mediaUrl = hero.media.startsWith('/api/') 
      ? hero.media.replace('/api/', '/') 
      : hero.media;
    
    setMediaPreview(hero.mediaType === 'image' 
      ? `${API_BASE_URL.replace('/api', '')}${mediaUrl}` 
      : '');
    setEditingId(hero._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project hero?')) {
      try {
        await axios.delete(`${API_BASE_URL}/project-hero/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Project hero deleted successfully');
        fetchProjectHeroes();
      } catch (error) {
        console.error('Error deleting project hero:', error);
        toast.error('Failed to delete project hero');
      }
    }
  };

  const handleSetActive = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/project-hero/${id}/activate`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Project hero set as active');
      fetchProjectHeroes();
    } catch (error) {
      console.error('Error setting active project hero:', error);
      toast.error('Failed to set active project hero');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Project Hero Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          {showForm ? 'Cancel' : <><FaPlus className="mr-2" /> Add New Project Hero</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Project Hero' : 'Add New Project Hero'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subtitle">
                  Subtitle *
                </label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="buttonText">
                  Button Text
                </label>
                <input
                  type="text"
                  id="buttonText"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="buttonLink">
                  Button Link
                </label>
                <input
                  type="text"
                  id="buttonLink"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Media Type
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="mediaType"
                      value="image"
                      checked={formData.mediaType === 'image'}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-primary-600"
                    />
                    <span className="ml-2 text-gray-700">Image</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="mediaType"
                      value="video"
                      checked={formData.mediaType === 'video'}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-primary-600"
                    />
                    <span className="ml-2 text-gray-700">Video</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="media">
                  {formData.mediaType === 'image' ? 'Image' : 'Video'} *
                </label>
                <input
                  type="file"
                  id="media"
                  name="media"
                  onChange={handleMediaChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  accept={formData.mediaType === 'image' ? 'image/*' : 'video/*'}
                  required={!editingId}
                />
                {mediaPreview && formData.mediaType === 'image' && (
                  <div className="mt-2">
                    <img src={mediaPreview} alt="Preview" className="h-32 object-cover rounded" />
                  </div>
                )}
                {editingId && !mediaFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.mediaType === 'image' ? 'Current image will be kept if no new file is selected.' : 'Current video will be kept if no new file is selected.'}
                  </p>
                )}
              </div>
              
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="form-checkbox h-4 w-4 text-primary-600"
                />
                <label className="ml-2 block text-gray-700 text-sm font-bold" htmlFor="isActive">
                  Set as Active
                </label>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded flex items-center"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">Project Heroes List</h2>
        
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : projectHeroes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No project heroes found. Create one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtitle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Button</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectHeroes.map((hero) => (
                  <tr key={hero._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hero.mediaType === 'image' ? (
                        <div className="flex items-center">
                          <FaImage className="mr-2 text-blue-500" />
                          <img 
                            src={`${API_BASE_URL.replace('/api', '')}${hero.media.startsWith('/api/') ? hero.media.replace('/api/', '/') : hero.media}`} 
                            alt={hero.title} 
                            className="h-10 w-16 object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <FaVideo className="mr-2 text-red-500" />
                          <span>Video</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{hero.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{hero.subtitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hero.buttonText} → {hero.buttonLink}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hero.isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {!hero.isActive && (
                          <button
                            onClick={() => handleSetActive(hero._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Set as Active"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(hero)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(hero._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
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

export default ProjectHeroCMS;