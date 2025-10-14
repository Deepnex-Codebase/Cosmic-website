import React, { useState, useEffect } from 'react';
import { 
  getAllDirectorDeskHeroes, 
  createDirectorDeskHero, 
  updateDirectorDeskHero, 
  deleteDirectorDeskHero 
} from '../../services/directorDeskHeroService';
import { toast } from 'react-toastify';

const DirectorDeskHeroCMS = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    isActive: true
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const response = await getAllDirectorDeskHeroes();
      if (response.success) {
        setHeroes(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch hero sections');
      console.error(error);
    } finally {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      isActive: true
    });
    setMediaFile(null);
    setPreviewUrl('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mediaFile && !editingId) {
      toast.error('Please select an image or video file');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('description', formData.description);
      data.append('isActive', formData.isActive);
      
      if (mediaFile) {
        data.append('media', mediaFile);
      }

      let response;
      if (editingId) {
        response = await updateDirectorDeskHero(editingId, data);
        toast.success('Hero section updated successfully');
      } else {
        response = await createDirectorDeskHero(data);
        toast.success('Hero section created successfully');
      }

      resetForm();
      fetchHeroes();
    } catch (error) {
      toast.error('Failed to save hero section');
      console.error(error);
    }
  };

  const handleEdit = (hero) => {
    setFormData({
      title: hero.title,
      subtitle: hero.subtitle || '',
      description: hero.description || '',
      isActive: hero.isActive
    });
    setEditingId(hero._id);
    setPreviewUrl(hero.mediaUrl);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hero section?')) {
      try {
        await deleteDirectorDeskHero(id);
        toast.success('Hero section deleted successfully');
        fetchHeroes();
      } catch (error) {
        toast.error('Failed to delete hero section');
        console.error(error);
      }
    }
  };

  const isVideo = (url) => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.mp4') || 
           url.toLowerCase().endsWith('.webm') || 
           url.toLowerCase().endsWith('.ogg');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Director Desk Hero CMS</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Hero Section' : 'Add New Hero Section'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Media (Image/Video - Max 100MB)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPG, PNG, GIF, MP4, WEBM
            </p>
          </div>
          
          {previewUrl && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Preview</label>
              <div className="border rounded-md p-2 max-w-md">
                {isVideo(previewUrl) ? (
                  <video 
                    src={previewUrl} 
                    controls 
                    className="max-h-60 max-w-full"
                  />
                ) : (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-60 max-w-full"
                  />
                )}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-gray-700">Active</span>
            </label>
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Save'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Hero Sections</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : heroes.length === 0 ? (
          <p className="text-gray-500 py-4">No hero sections found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Media
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
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
                {heroes.map((hero) => (
                  <tr key={hero._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hero.mediaType === 'video' ? (
                        <video 
                          src={hero.mediaUrl} 
                          className="h-16 w-28 object-cover rounded"
                          muted
                        />
                      ) : (
                        <img 
                          src={hero.mediaUrl} 
                          alt={hero.title} 
                          className="h-16 w-28 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{hero.title}</div>
                      {hero.subtitle && (
                        <div className="text-sm text-gray-500">{hero.subtitle}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        hero.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {hero.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(hero)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hero._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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

export default DirectorDeskHeroCMS;