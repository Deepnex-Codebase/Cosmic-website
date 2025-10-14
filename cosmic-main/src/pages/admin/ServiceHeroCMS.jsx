import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { 
  getAllServiceHeroes, 
  createServiceHero, 
  updateServiceHero, 
  deleteServiceHero, 
  setActiveServiceHero 
} from '../../services/serviceHeroService';

// Simple Modal Component
const Modal = ({ children, title, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ServiceHeroCMS = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentHero, setCurrentHero] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    backgroundType: 'image',
    overlayOpacity: 50,
    active: false
  });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundVideo, setBackgroundVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  // Fetch all service heroes
  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const data = await getAllServiceHeroes();
      setHeroes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load service heroes');
      toast.error('Failed to load service heroes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (name === 'backgroundImage') {
      setBackgroundImage(files[0]);
      setPreviewImage(URL.createObjectURL(files[0]));
    } else if (name === 'backgroundVideo') {
      setBackgroundVideo(files[0]);
      setPreviewVideo(URL.createObjectURL(files[0]));
    }
  };

  // Open modal for creating new hero
  const handleAddNew = () => {
    setCurrentHero(null);
    setFormData({
      title: '',
      backgroundType: 'image',
      overlayOpacity: 50,
      active: false
    });
    setBackgroundImage(null);
    setBackgroundVideo(null);
    setPreviewImage(null);
    setPreviewVideo(null);
    setShowModal(true);
  };

  // Open modal for editing existing hero
  const handleEdit = (hero) => {
    setCurrentHero(hero);
    setFormData({
      title: hero.title,
      backgroundType: hero.backgroundType,
      overlayOpacity: hero.overlayOpacity,
      active: hero.active
    });
    setPreviewImage(hero.backgroundImage ? `${import.meta.env.VITE_API_URL}${hero.backgroundImage}` : null);
    setPreviewVideo(hero.backgroundVideo ? `${import.meta.env.VITE_API_URL}${hero.backgroundVideo}` : null);
    setBackgroundImage(null);
    setBackgroundVideo(null);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('backgroundType', formData.backgroundType);
      formDataToSend.append('overlayOpacity', formData.overlayOpacity);
      formDataToSend.append('active', formData.active);
      
      if (backgroundImage) {
        formDataToSend.append('backgroundImage', backgroundImage);
      }
      
      if (backgroundVideo) {
        formDataToSend.append('backgroundVideo', backgroundVideo);
      }
      
      if (currentHero) {
        // Update existing hero
        await updateServiceHero(currentHero._id, formDataToSend);
        toast.success('Service hero updated successfully');
      } else {
        // Create new hero
        await createServiceHero(formDataToSend);
        toast.success('Service hero created successfully');
      }
      
      setShowModal(false);
      fetchHeroes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle hero deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hero section?')) {
      try {
        setLoading(true);
        await deleteServiceHero(id);
        toast.success('Service hero deleted successfully');
        fetchHeroes();
      } catch (err) {
        toast.error('Failed to delete service hero');
      } finally {
        setLoading(false);
      }
    }
  };

  // Set hero as active
  const handleSetActive = async (id) => {
    try {
      setLoading(true);
      await setActiveServiceHero(id);
      toast.success('Service hero set as active');
      fetchHeroes();
    } catch (err) {
      toast.error('Failed to set hero as active');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Service Hero CMS</h1>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
          >
            <FaPlus className="mr-2" /> Add New Hero
          </button>
        </div>

        {loading && !showModal ? (
          <Loader />
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Background Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {heroes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No service heroes found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  heroes.map((hero) => (
                    <tr key={hero._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{hero.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 capitalize">{hero.backgroundType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hero.backgroundType === 'image' && hero.backgroundImage ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}${hero.backgroundImage}`}
                            alt={hero.title}
                            className="h-16 w-24 object-cover rounded"
                          />
                        ) : hero.backgroundType === 'video' && hero.backgroundVideo ? (
                          <video
                            src={`${import.meta.env.VITE_API_URL}${hero.backgroundVideo}`}
                            className="h-16 w-24 object-cover rounded"
                          />
                        ) : (
                          <span className="text-sm text-gray-500">No preview</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            hero.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {hero.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(hero)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FaEdit className="inline" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(hero._id)}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          <FaTrash className="inline" /> Delete
                        </button>
                        {!hero.active && (
                          <button
                            onClick={() => handleSetActive(hero._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FaCheck className="inline" /> Set Active
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <Modal title={currentHero ? 'Edit Service Hero' : 'Add New Service Hero'} onClose={() => setShowModal(false)}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Background Type</label>
                <select
                  name="backgroundType"
                  value={formData.backgroundType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              {formData.backgroundType === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Background Image</label>
                  <input
                    type="file"
                    name="backgroundImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    required={!currentHero}
                  />
                  {previewImage && (
                    <div className="mt-2">
                      <img src={previewImage} alt="Preview" className="h-32 object-cover rounded" />
                    </div>
                  )}
                </div>
              )}

              {formData.backgroundType === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Background Video</label>
                  <input
                    type="file"
                    name="backgroundVideo"
                    onChange={handleFileChange}
                    accept="video/*"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    required={!currentHero}
                  />
                  {previewVideo && (
                    <div className="mt-2">
                      <video src={previewVideo} controls className="h-32 rounded" />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Overlay Opacity ({formData.overlayOpacity}%)
                </label>
                <input
                  type="range"
                  name="overlayOpacity"
                  min="0"
                  max="100"
                  value={formData.overlayOpacity}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Set as active</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

export default ServiceHeroCMS;