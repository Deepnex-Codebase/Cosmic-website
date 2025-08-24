import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaArrowUp, 
  FaArrowDown,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaWhatsapp
} from 'react-icons/fa';

const FooterCMS = () => {
  const [footerConfig, setFooterConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [editingSocial, setEditingSocial] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // Define API_BASE_URL using environment variable
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

  useEffect(() => {
    fetchFooterConfiguration();
  }, []);

  const fetchFooterConfiguration = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/footer-config`);
      if (!response.ok) {
        throw new Error('Failed to fetch footer configuration');
      }
      const data = await response.json();
      setFooterConfig(data);
    } catch (err) {
      console.error('Error fetching footer configuration:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalSettings = async (updatedData) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/footer-config/${footerConfig._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update footer configuration');
      }
      
      const data = await response.json();
      setFooterConfig(data);
    } catch (err) {
      console.error('Error updating footer configuration:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addSection = async (sectionData) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/footer-config/${footerConfig._id}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add section');
      }
      
      const data = await response.json();
      setFooterConfig(data);
      setShowSectionModal(false);
      setEditingSection(null);
    } catch (err) {
      console.error('Error adding section:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSection = async (sectionId, sectionData) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/footer-config/${footerConfig._id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update section');
      }
      
      const data = await response.json();
      setFooterConfig(data);
      setShowSectionModal(false);
      setEditingSection(null);
    } catch (err) {
      console.error('Error updating section:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/footer-config/${footerConfig._id}/sections/${sectionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete section');
      }
      
      const data = await response.json();
      setFooterConfig(data);
    } catch (err) {
      console.error('Error deleting section:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addLink = async (sectionId, linkData) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/footer-config/${footerConfig._id}/sections/${sectionId}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add link');
      }
      
      const data = await response.json();
      setFooterConfig(data);
      setShowLinkModal(false);
      setEditingLink(null);
      setSelectedSectionId(null);
    } catch (err) {
      console.error('Error adding link:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateLink = async (sectionId, linkId, linkData) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/footer-config/${footerConfig._id}/sections/${sectionId}/links/${linkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update link');
      }
      
      const data = await response.json();
      setFooterConfig(data);
      setShowLinkModal(false);
      setEditingLink(null);
      setSelectedSectionId(null);
    } catch (err) {
      console.error('Error updating link:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteLink = async (sectionId, linkId) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/footer-config/${footerConfig._id}/sections/${sectionId}/links/${linkId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete link');
      }
      
      const data = await response.json();
      setFooterConfig(data);
    } catch (err) {
      console.error('Error deleting link:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = async (socialData) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/footer-config/${footerConfig._id}/social-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socialData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add social link');
      }
      
      const data = await response.json();
      setFooterConfig(data);
      setShowSocialModal(false);
      setEditingSocial(null);
    } catch (err) {
      console.error('Error adding social link:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSocialLink = async (socialId, socialData) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/footer-config/${footerConfig._id}/social-links/${socialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socialData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update social link');
      }
      
      const data = await response.json();
      setFooterConfig(data);
      setShowSocialModal(false);
      setEditingSocial(null);
    } catch (err) {
      console.error('Error updating social link:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSocialLink = async (socialId) => {
    if (!window.confirm('Are you sure you want to delete this social link?')) return;
    
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/footer-config/${footerConfig._id}/social-links/${socialId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete social link');
      }
      
      const data = await response.json();
      setFooterConfig(data);
    } catch (err) {
      console.error('Error deleting social link:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getSocialIcon = (platform) => {
    const iconMap = {
      facebook: FaFacebookF,
      twitter: FaTwitter,
      linkedin: FaLinkedinIn,
      instagram: FaInstagram,
      youtube: FaYoutube,
      whatsapp: FaWhatsapp
    };
    return iconMap[platform] || FaFacebookF;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading footer configuration...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading footer configuration</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchFooterConfiguration}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Footer Management</h1>
        <p className="text-gray-600">Manage your website footer content and settings</p>
      </div>

      {/* Global Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Global Settings</h2>
        
        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={footerConfig?.companyInfo?.name || ''}
              onChange={(e) => {
                const updatedConfig = {
                  ...footerConfig,
                  companyInfo: {
                    ...footerConfig.companyInfo,
                    name: e.target.value
                  }
                };
                setFooterConfig(updatedConfig);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <input
              type="text"
              value={footerConfig?.companyInfo?.logo || ''}
              onChange={(e) => {
                const updatedConfig = {
                  ...footerConfig,
                  companyInfo: {
                    ...footerConfig.companyInfo,
                    logo: e.target.value
                  }
                };
                setFooterConfig(updatedConfig);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
          <textarea
            value={footerConfig?.companyInfo?.description || ''}
            onChange={(e) => {
              const updatedConfig = {
                ...footerConfig,
                companyInfo: {
                  ...footerConfig.companyInfo,
                  description: e.target.value
                }
              };
              setFooterConfig(updatedConfig);
            }}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={footerConfig?.contactInfo?.address || ''}
              onChange={(e) => {
                const updatedConfig = {
                  ...footerConfig,
                  contactInfo: {
                    ...footerConfig.contactInfo,
                    address: e.target.value
                  }
                };
                setFooterConfig(updatedConfig);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={footerConfig?.contactInfo?.phone || ''}
              onChange={(e) => {
                const updatedConfig = {
                  ...footerConfig,
                  contactInfo: {
                    ...footerConfig.contactInfo,
                    phone: e.target.value
                  }
                };
                setFooterConfig(updatedConfig);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={footerConfig?.contactInfo?.email || ''}
              onChange={(e) => {
                const updatedConfig = {
                  ...footerConfig,
                  contactInfo: {
                    ...footerConfig.contactInfo,
                    email: e.target.value
                  }
                };
                setFooterConfig(updatedConfig);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Newsletter Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Newsletter Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Newsletter Title</label>
              <input
                type="text"
                value={footerConfig?.newsletter?.title || ''}
                onChange={(e) => {
                  const updatedConfig = {
                    ...footerConfig,
                    newsletter: {
                      ...footerConfig.newsletter,
                      title: e.target.value
                    }
                  };
                  setFooterConfig(updatedConfig);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={footerConfig?.newsletter?.buttonText || ''}
                onChange={(e) => {
                  const updatedConfig = {
                    ...footerConfig,
                    newsletter: {
                      ...footerConfig.newsletter,
                      buttonText: e.target.value
                    }
                  };
                  setFooterConfig(updatedConfig);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Newsletter Description</label>
            <textarea
              value={footerConfig?.newsletter?.description || ''}
              onChange={(e) => {
                const updatedConfig = {
                  ...footerConfig,
                  newsletter: {
                    ...footerConfig.newsletter,
                    description: e.target.value
                  }
                };
                setFooterConfig(updatedConfig);
              }}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={footerConfig?.newsletter?.isActive || false}
                onChange={(e) => {
                  const updatedConfig = {
                    ...footerConfig,
                    newsletter: {
                      ...footerConfig.newsletter,
                      isActive: e.target.checked
                    }
                  };
                  setFooterConfig(updatedConfig);
                }}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Enable Newsletter Section</span>
            </label>
          </div>
        </div>

        <button
          onClick={() => updateGlobalSettings(footerConfig)}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <FaSave className="mr-2" />
          {saving ? 'Saving...' : 'Save Global Settings'}
        </button>
      </div>

      {/* Footer Sections */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Footer Sections</h2>
          <button
            onClick={() => {
              setEditingSection(null);
              setShowSectionModal(true);
            }}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            <FaPlus className="mr-2" />
            {saving ? 'Adding...' : 'Add Section'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {footerConfig?.footerSections?.map((section) => (
            <div key={section._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-lg">{section.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingSection(section);
                      setShowSectionModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteSection(section._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="mb-3">
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  section.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {section.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="ml-2 text-sm text-gray-500">Order: {section.order}</span>
              </div>
              
              <div className="mb-3">
                <h4 className="font-medium text-sm mb-2">Links ({section.links?.length || 0})</h4>
                <div className="space-y-1">
                  {section.links?.slice(0, 3).map((link) => (
                    <div key={link._id} className="flex justify-between items-center text-sm">
                      <span className="truncate">{link.name}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingLink(link);
                            setSelectedSectionId(section._id);
                            setShowLinkModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit className="text-xs" />
                        </button>
                        <button
                          onClick={() => deleteLink(section._id, link._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {section.links?.length > 3 && (
                    <div className="text-xs text-gray-500">+{section.links.length - 3} more</div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => {
                  setEditingLink(null);
                  setSelectedSectionId(section._id);
                  setShowLinkModal(true);
                }}
                className="w-full bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
              >
                Add Link
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Social Media Links</h2>
          <button
            onClick={() => {
              setEditingSocial(null);
              setShowSocialModal(true);
            }}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            <FaPlus className="mr-2" />
            {saving ? 'Adding...' : 'Add Social Link'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {footerConfig?.socialLinks?.map((social) => {
            const IconComponent = getSocialIcon(social.platform);
            return (
              <div key={social._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <IconComponent className="mr-2 text-lg" />
                    <span className="font-medium capitalize">{social.platform}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingSocial(social);
                        setShowSocialModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteSocialLink(social._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    social.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {social.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">Order: {social.order}</span>
                </div>
                
                <div className="text-sm text-gray-600 truncate">
                  {social.url}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Modal */}
      <SectionModal
        show={showSectionModal}
        section={editingSection}
        onSave={(sectionData) => {
          if (editingSection) {
            updateSection(editingSection._id, sectionData);
          } else {
            addSection(sectionData);
          }
        }}
        onClose={() => {
          setShowSectionModal(false);
          setEditingSection(null);
        }}
        saving={saving}
      />

      {/* Link Modal */}
      <LinkModal
        show={showLinkModal}
        link={editingLink}
        onSave={(linkData) => {
          if (editingLink) {
            updateLink(selectedSectionId, editingLink._id, linkData);
          } else {
            addLink(selectedSectionId, linkData);
          }
        }}
        onClose={() => {
          setShowLinkModal(false);
          setEditingLink(null);
          setSelectedSectionId(null);
        }}
        saving={saving}
      />

      {/* Social Modal */}
      <SocialModal
        show={showSocialModal}
        social={editingSocial}
        onSave={(socialData) => {
          if (editingSocial) {
            updateSocialLink(editingSocial._id, socialData);
          } else {
            addSocialLink(socialData);
          }
        }}
        onClose={() => {
          setShowSocialModal(false);
          setEditingSocial(null);
        }}
        saving={saving}
      />
    </div>
  );
};

// Section Modal Component
const SectionModal = ({ show, section, onSave, onClose, saving }) => {
  const [formData, setFormData] = useState({
    title: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    if (section) {
      setFormData({
        title: section.title || '',
        order: section.order || 0,
        isActive: section.isActive !== undefined ? section.isActive : true
      });
    } else {
      setFormData({
        title: '',
        order: 0,
        isActive: true
      });
    }
  }, [section, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {section ? 'Edit Section' : 'Add Section'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FaSave className="mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Link Modal Component
const LinkModal = ({ show, link, onSave, onClose, saving }) => {
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    isExternal: false,
    order: 0
  });

  useEffect(() => {
    if (link) {
      setFormData({
        name: link.name || '',
        path: link.path || '',
        isExternal: link.isExternal || false,
        order: link.order || 0
      });
    } else {
      setFormData({
        name: '',
        path: '',
        isExternal: false,
        order: 0
      });
    }
  }, [link, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {link ? 'Edit Link' : 'Add Link'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Path/URL</label>
            <input
              type="text"
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={formData.isExternal ? 'https://example.com' : '/page'}
              required
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isExternal}
                onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">External Link</span>
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FaSave className="mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Social Modal Component
const SocialModal = ({ show, social, onSave, onClose, saving }) => {
  const [formData, setFormData] = useState({
    platform: 'facebook',
    url: '',
    isActive: true,
    order: 0
  });

  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'whatsapp', label: 'WhatsApp' }
  ];

  useEffect(() => {
    if (social) {
      setFormData({
        platform: social.platform || 'facebook',
        url: social.url || '',
        isActive: social.isActive !== undefined ? social.isActive : true,
        order: social.order || 0
      });
    } else {
      setFormData({
        platform: 'facebook',
        url: '',
        isActive: true,
        order: 0
      });
    }
  }, [social, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {social ? 'Edit Social Link' : 'Add Social Link'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {platforms.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FaSave className="mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FooterCMS;