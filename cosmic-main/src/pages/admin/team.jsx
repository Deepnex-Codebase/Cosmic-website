import React, { useState, useEffect } from 'react';
import { teamService } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaArrowUp, FaArrowDown, FaSave, FaLinkedin, FaTwitter, FaEnvelope, FaFacebook, FaInstagram } from 'react-icons/fa';
import { toast } from 'react-toastify';

const TeamAdmin = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTeamMember, setCurrentTeamMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    title: '',
    bio: '',
    image: '',
    socialLinks: [
      { platform: 'LinkedIn', url: '' }
    ]
  });

  // Fetch all team members
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await teamService.getAllTeamMembers();
      setTeamMembers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to fetch team members');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
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
      role: '',
      title: '',
      bio: '',
      image: '',
      imageFile: null,
      socialLinks: [
        { platform: 'LinkedIn', url: '' }
      ]
    });
    setIsEditing(false);
    setCurrentTeamMember(null);
  };

  // Edit team member
  const handleEdit = (teamMember) => {
    setCurrentTeamMember(teamMember);
    setFormData({
      name: teamMember.name,
      role: teamMember.role,
      title: teamMember.title,
      bio: teamMember.bio,
      image: teamMember.image,
      imageFile: null,
      socialLinks: teamMember.socialLinks.length > 0 ? teamMember.socialLinks : [
        { platform: 'LinkedIn', url: '' }
      ]
    });
    setIsEditing(true);
  };

  // Delete team member
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamService.deleteTeamMember(id);
        toast.success('Team member deleted successfully');
        fetchTeamMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
        toast.error('Failed to delete team member');
      }
    }
  };

  // Move team member up or down in order
  const handleMove = async (id, direction) => {
    try {
      await teamService.updateTeamMemberOrder(id, direction);
      toast.success(`Team member moved ${direction} successfully`);
      fetchTeamMembers();
    } catch (error) {
      console.error(`Error moving team member ${direction}:`, error);
      toast.error(`Failed to move team member ${direction}`);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.name || !formData.role || !formData.title || !formData.bio) {
        toast.error('Please fill all required fields');
        return;
      }
      
      // Validate image for new team members
      if (!isEditing && !formData.imageFile && !formData.image) {
        toast.error('Please upload a team member image');
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
        await teamService.updateTeamMember(currentTeamMember._id, formDataToSend);
        toast.success('Team member updated successfully');
      } else {
        await teamService.createTeamMember(formDataToSend);
        toast.success('Team member created successfully');
      }
      
      resetForm();
      fetchTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Failed to save team member');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    resetForm();
  };

  // Get social icon based on platform
  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'LinkedIn':
        return <FaLinkedin className="text-blue-600" />;
      case 'Twitter':
        return <FaTwitter className="text-blue-400" />;
      case 'Email':
        return <FaEnvelope className="text-red-500" />;
      case 'Facebook':
        return <FaFacebook className="text-blue-800" />;
      case 'Instagram':
        return <FaInstagram className="text-pink-600" />;
      default:
        return <FaLinkedin className="text-blue-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Team Members Management</h1>
        
        {/* Team Member Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Team Member' : 'Add New Team Member'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image *
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image.startsWith('blob:') ? formData.image : formData.image.startsWith('http') ? formData.image : `${formData.image}`}
                      alt="Team Member Preview"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio *
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            {/* Social Links */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Social Links
                </label>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="text-sm bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors"
                >
                  <FaPlus className="inline mr-1" /> Add Link
                </button>
              </div>
              
              {formData.socialLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <div className="w-1/3">
                    <select
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Email">Email</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                    </select>
                  </div>
                  <div className="flex-1 flex items-center">
                    <span className="mr-2">{getSocialIcon(link.platform)}</span>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      placeholder="URL"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
              >
                <FaSave className="mr-2" />
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Team Members List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Team Members List</h2>
          
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : teamMembers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No team members found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Social Links</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teamMembers.map((member, index) => (
                    <tr key={member._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <span>{index + 1}</span>
                          <div className="flex flex-col ml-2">
                            <button
                              onClick={() => handleMove(member._id, 'up')}
                              disabled={index === 0}
                              className={`text-gray-500 ${index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-500'}`}
                            >
                              <FaArrowUp />
                            </button>
                            <button
                              onClick={() => handleMove(member._id, 'down')}
                              disabled={index === teamMembers.length - 1}
                              className={`text-gray-500 ${index === teamMembers.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-500'}`}
                            >
                              <FaArrowDown />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.image && (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {member.socialLinks && member.socialLinks.map((link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {getSocialIcon(link.platform)}
                            </a>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(member._id)}
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

export default TeamAdmin;