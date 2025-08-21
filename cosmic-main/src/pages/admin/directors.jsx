import React, { useState, useEffect } from 'react';
import { directorService } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaArrowUp, FaArrowDown, FaSave, FaLinkedin, FaTwitter, FaEnvelope, FaFacebook, FaInstagram } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DirectorAdmin = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDirector, setCurrentDirector] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    image: '',
    qualification: '',
    experience: '',
    message: '',
    vision: '',
    socialLinks: [
      { platform: 'LinkedIn', url: '' },
      { platform: 'Twitter', url: '' },
      { platform: 'Email', url: '' }
    ]
  });

  // Fetch all directors
  const fetchDirectors = async () => {
    try {
      setLoading(true);
      const response = await directorService.getAllDirectors();
      setDirectors(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch directors');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectors();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        imageFile: files[0],
        // Preview URL for the image
        image: files[0] ? URL.createObjectURL(files[0]) : formData.image
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle social link changes
  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };

    setFormData({
      ...formData,
      socialLinks: updatedLinks
    });
  };

  // Add new social link
  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [
        ...formData.socialLinks,
        { platform: 'LinkedIn', url: '' }
      ]
    });
  };

  // Remove social link
  const removeSocialLink = (index) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks.splice(index, 1);

    setFormData({
      ...formData,
      socialLinks: updatedLinks
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      image: '',
      imageFile: null,
      qualification: '',
      experience: '',
      message: '',
      vision: '',
      socialLinks: [
        { platform: 'LinkedIn', url: '' },
        { platform: 'Twitter', url: '' },
        { platform: 'Email', url: '' }
      ]
    });
    setIsEditing(false);
    setCurrentDirector(null);
  };

  // Edit director
  const handleEdit = (director) => {
    setCurrentDirector(director);
    setFormData({
      name: director.name,
      position: director.position,
      image: director.image,
      imageFile: null,
      qualification: director.qualification,
      experience: director.experience,
      message: director.message,
      vision: director.vision,
      socialLinks: director.socialLinks.length > 0 ? director.socialLinks : [
        { platform: 'LinkedIn', url: '' },
        { platform: 'Twitter', url: '' },
        { platform: 'Email', url: '' }
      ]
    });
    setIsEditing(true);
  };

  // Delete director
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this director?')) {
      try {
        await directorService.deleteDirector(id);
        toast.success('Director deleted successfully');
        fetchDirectors();
      } catch (error) {
        console.error('Error deleting director:', error);
        toast.error('Failed to delete director');
      }
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.name || !formData.position || !formData.qualification || !formData.experience || !formData.message || !formData.vision) {
        toast.error('Please fill all required fields');
        return;
      }
      
      // Validate image for new directors
      if (!isEditing && !formData.imageFile && !formData.image) {
        toast.error('Please upload a director image');
        return;
      }
      
      const formDataToSend = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'socialLinks' && key !== 'imageFile') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append image file if exists
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }
      
      // Append social links as JSON string
      formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));
      
      if (isEditing) {
        await directorService.updateDirector(currentDirector._id, formDataToSend);
        toast.success('Director updated successfully');
      } else {
        await directorService.createDirector(formDataToSend);
        toast.success('Director created successfully');
      }
      
      resetForm();
      fetchDirectors();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Display specific error from server
        const errorMessage = Array.isArray(error.response.data.error) 
          ? error.response.data.error.join(', ') 
          : error.response.data.error;
        toast.error(`Error: ${errorMessage}`);
      } else {
        toast.error('Failed to save director');
      }
    }
  };

  // Move director up or down in order
  const moveDirector = async (id, direction) => {
    const currentIndex = directors.findIndex(d => d._id === id);
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === directors.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const reorderedDirectors = [...directors];
    const [movedDirector] = reorderedDirectors.splice(currentIndex, 1);
    reorderedDirectors.splice(newIndex, 0, movedDirector);

    // Update order property
    const directorsWithOrder = reorderedDirectors.map((director, index) => ({
      id: director._id,
      order: index
    }));

    try {
      await directorService.updateDirectorOrder(directorsWithOrder);
      setDirectors(reorderedDirectors);
      toast.success('Director order updated');
    } catch (error) {
      console.error('Error updating director order:', error);
      toast.error('Failed to update director order');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Director Management</h1>
      
      {/* Director Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Edit Director' : 'Add New Director'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Director Image</label>
              <input
                type="file"
                name="imageFile"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                accept="image/*"
                required={!isEditing}
              />
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Director preview" 
                    className="h-20 w-20 object-cover rounded-md" 
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
            <textarea
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>
          
          {/* Social Links */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Social Links</label>
              <button 
                type="button" 
                onClick={addSocialLink}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <FaPlus className="mr-1" /> Add Link
              </button>
            </div>
            
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md">
                  {link.platform === 'LinkedIn' && <FaLinkedin className="text-blue-600" />}
                  {link.platform === 'Twitter' && <FaTwitter className="text-blue-400" />}
                  {link.platform === 'Email' && <FaEnvelope className="text-gray-600" />}
                  {link.platform === 'Facebook' && <FaFacebook className="text-blue-800" />}
                  {link.platform === 'Instagram' && <FaInstagram className="text-pink-600" />}
                  <select
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    className="border-none focus:ring-0 p-0 bg-transparent"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Email">Email</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
                
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  placeholder="URL"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  required
                />
                
                {formData.socialLinks.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeSocialLink(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaSave className="mr-2" />
              {isEditing ? 'Update Director' : 'Add Director'}
            </button>
            
            {isEditing && (
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
      
      {/* Directors List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Directors List</h2>
        
        {loading ? (
          <p>Loading directors...</p>
        ) : directors.length === 0 ? (
          <p>No directors found. Add your first director above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Social Links</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {directors.map((director, index) => (
                  <tr key={director._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span>{index + 1}</span>
                        <div className="flex flex-col">
                          <button 
                            onClick={() => moveDirector(director._id, 'up')} 
                            disabled={index === 0}
                            className={`text-gray-500 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-gray-700'}`}
                          >
                            <FaArrowUp />
                          </button>
                          <button 
                            onClick={() => moveDirector(director._id, 'down')} 
                            disabled={index === directors.length - 1}
                            className={`text-gray-500 ${index === directors.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-gray-700'}`}
                          >
                            <FaArrowDown />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{director.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{director.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={director.image} alt={director.name} className="h-10 w-10 rounded-full object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {director.socialLinks && director.socialLinks.map((link, i) => (
                          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                            {link.platform === 'LinkedIn' && <FaLinkedin className="text-blue-600" />}
                            {link.platform === 'Twitter' && <FaTwitter className="text-blue-400" />}
                            {link.platform === 'Email' && <FaEnvelope className="text-gray-600" />}
                            {link.platform === 'Facebook' && <FaFacebook className="text-blue-800" />}
                            {link.platform === 'Instagram' && <FaInstagram className="text-pink-600" />}
                          </a>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(director)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(director._id)}
                          className="text-red-500 hover:text-red-700"
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

export default DirectorAdmin;