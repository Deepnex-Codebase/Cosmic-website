import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const NavbarCMS = () => {
  const [navbarConfig, setNavbarConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editingSubmenu, setEditingSubmenu] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    label: '',
    href: '',
    target: '_self',
    order: 0,
    isActive: true
  });

  const [ctaFormData, setCtaFormData] = useState({
    text: '',
    href: '',
    backgroundColor: '',
    textColor: '',
    isVisible: true
  });

  const [socialFormData, setSocialFormData] = useState({
    platform: 'facebook',
    url: '',
    isActive: true
  });

  // Fetch navbar configuration
  useEffect(() => {
    fetchNavbarConfig();
  }, []);

  const fetchNavbarConfig = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/navbar-config');
      if (response.ok) {
        const data = await response.json();
        setNavbarConfig(data);
        setCtaFormData({
          text: data.ctaButton?.text || '',
          href: data.ctaButton?.href || '',
          backgroundColor: data.ctaButton?.backgroundColor || '',
          textColor: data.ctaButton?.textColor || '',
          isVisible: data.ctaButton?.isVisible !== false
        });
      }
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updates) => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:8000/api/navbar-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setNavbarConfig(data.config);
        alert('Configuration updated successfully!');
      }
    } catch (error) {
      alert('Error updating configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    const formData = new FormData();
    formData.append('logo', logoFile);
    formData.append('alt', navbarConfig?.logo?.alt || 'Logo');

    setSaving(true);
    try {
      const response = await fetch('http://localhost:8000/api/navbar-config/logo', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNavbarConfig(data.config);
        setLogoFile(null);
        setLogoPreview('');
        alert('Logo uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const openModal = (type, item = null, submenuItem = null) => {
    setModalType(type);
    setEditingItem(item);
    setEditingSubmenu(submenuItem);
    
    if (type === 'navigation' || type === 'submenu') {
      const dataToEdit = submenuItem || item;
      setFormData({
        label: dataToEdit?.label || '',
        href: dataToEdit?.href || '',
        target: dataToEdit?.target || '_self',
        order: dataToEdit?.order || 0,
        isActive: dataToEdit?.isActive !== false
      });
    } else if (type === 'social') {
      setSocialFormData({
        platform: item?.platform || 'facebook',
        url: item?.url || '',
        isActive: item?.isActive !== false
      });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setEditingSubmenu(null);
    setFormData({ label: '', href: '', target: '_self', order: 0, isActive: true });
    setSocialFormData({ platform: 'facebook', url: '', isActive: true });
  };

  const handleNavigationSubmit = async () => {
    try {
      let url, method, body;
      
      if (modalType === 'navigation') {
        if (editingItem) {
          // Update navigation item
          url = `http://localhost:8000/api/navbar-config/navigation-items/${editingItem._id}`;
          method = 'PUT';
          body = JSON.stringify(formData);
        } else {
          // Add navigation item
          url = 'http://localhost:8000/api/navbar-config/navigation-items';
          method = 'POST';
          body = JSON.stringify(formData);
        }
      } else if (modalType === 'submenu') {
        if (editingSubmenu) {
          // Update submenu item
          url = `http://localhost:8000/api/navbar-config/navigation-items/${editingItem._id}/submenu/${editingSubmenu._id}`;
          method = 'PUT';
          body = JSON.stringify(formData);
        } else {
          // Add submenu item
          url = `http://localhost:8000/api/navbar-config/navigation-items/${editingItem._id}/submenu`;
          method = 'POST';
          body = JSON.stringify(formData);
        }
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (response.ok) {
        const data = await response.json();
        setNavbarConfig(data.config);
        closeModal();
        alert('Item saved successfully!');
      }
    } catch (error) {
      alert('Error saving item');
    }
  };

  const handleDeleteNavigation = async (itemId, submenuId = null) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      let url;
      if (submenuId) {
        url = `http://localhost:8000/api/navbar-config/navigation-items/${itemId}/submenu/${submenuId}`;
      } else {
        url = `http://localhost:8000/api/navbar-config/navigation-items/${itemId}`;
      }

      const response = await fetch(url, { method: 'DELETE' });

      if (response.ok) {
        const data = await response.json();
        setNavbarConfig(data.config);
        alert('Item deleted successfully!');
      }
    } catch (error) {
      alert('Error deleting item');
    }
  };

  const handleCtaUpdate = async () => {
    await handleSave({ ctaButton: ctaFormData });
  };

  const handleSocialSubmit = async () => {
    try {
      const updatedSocialLinks = [...(navbarConfig?.mobileMenu?.socialLinks || [])];
      
      if (editingItem) {
        // Update existing social link
        const index = updatedSocialLinks.findIndex(link => link.platform === editingItem.platform);
        if (index !== -1) {
          updatedSocialLinks[index] = socialFormData;
        }
      } else {
        // Add new social link
        updatedSocialLinks.push(socialFormData);
      }

      await handleSave({
        mobileMenu: {
          ...navbarConfig?.mobileMenu,
          socialLinks: updatedSocialLinks
        }
      });
      
      closeModal();
    } catch (error) {
      console.error('Error saving social link:', error);
      alert('Error saving social link');
    }
  };

  const handleDeleteSocial = async (platform) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;

    try {
      const updatedSocialLinks = navbarConfig?.mobileMenu?.socialLinks?.filter(
        link => link.platform !== platform
      ) || [];

      await handleSave({
        mobileMenu: {
          ...navbarConfig?.mobileMenu,
          socialLinks: updatedSocialLinks
        }
      });
    } catch (error) {
      console.error('Error deleting social link:', error);
      alert('Error deleting social link');
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Navbar Configuration</h1>
          <p className="text-gray-600 mt-1">Manage your website navigation, logo, and CTA buttons</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', label: 'General Settings' },
              { id: 'navigation', label: 'Navigation Items' },
              { id: 'cta', label: 'CTA Button' },
              { id: 'social', label: 'Social Links' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Logo Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Logo
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <img
                        src={navbarConfig?.logo?.url || '/logo.png'}
                        alt={navbarConfig?.logo?.alt || 'Logo'}
                        className="h-16 w-auto"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload New Logo
                    </label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {logoPreview && (
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                          <img src={logoPreview} alt="Preview" className="h-16 w-auto" />
                        </div>
                      )}
                      <button
                        onClick={handleLogoUpload}
                        disabled={!logoFile || saving}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Uploading...' : 'Upload Logo'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items Tab */}
          {activeTab === 'navigation' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Navigation Items</h3>
                <button
                  onClick={() => openModal('navigation')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Navigation Item
                </button>
              </div>

              <div className="space-y-4">
                {navbarConfig?.navigationItems?.map((item, index) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-gray-900">{item.label}</h4>
                          <span className="text-sm text-gray-500">→ {item.href}</span>
                          <button
                            onClick={() => {
                              const updatedItems = [...navbarConfig.navigationItems];
                              updatedItems[index].isActive = !updatedItems[index].isActive;
                              handleSave({ navigationItems: updatedItems });
                            }}
                            className={`p-1 rounded ${
                              item.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {item.isActive ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                          </button>
                        </div>
                        
                        {/* Submenu items */}
                        {item.submenu && item.submenu.length > 0 && (
                          <div className="mt-3 ml-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">Submenu Items:</span>
                              <button
                                onClick={() => openModal('submenu', item)}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                              >
                                <PlusIcon className="h-3 w-3" />
                                Add Submenu
                              </button>
                            </div>
                            {item.submenu.map((subItem) => (
                              <div key={subItem._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-700">{subItem.label}</span>
                                  <span className="text-xs text-gray-500">→ {subItem.href}</span>
                                  <button
                                    onClick={() => {
                                      const updatedItems = [...navbarConfig.navigationItems];
                                      const itemIndex = updatedItems.findIndex(nav => nav._id === item._id);
                                      const subIndex = updatedItems[itemIndex].submenu.findIndex(sub => sub._id === subItem._id);
                                      updatedItems[itemIndex].submenu[subIndex].isActive = !updatedItems[itemIndex].submenu[subIndex].isActive;
                                      handleSave({ navigationItems: updatedItems });
                                    }}
                                    className={`p-1 rounded ${
                                      subItem.isActive ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                  >
                                    {subItem.isActive ? <EyeIcon className="h-3 w-3" /> : <EyeSlashIcon className="h-3 w-3" />}
                                  </button>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => openModal('submenu', item, subItem)}
                                    className="text-blue-600 hover:text-blue-800 p-1"
                                  >
                                    <PencilIcon className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNavigation(item._id, subItem._id)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                  >
                                    <TrashIcon className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('navigation', item)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNavigation(item._id)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button Tab */}
          {activeTab === 'cta' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">CTA Button Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaFormData.text}
                    onChange={(e) => setCtaFormData({ ...ctaFormData, text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enquire Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={ctaFormData.href}
                    onChange={(e) => setCtaFormData({ ...ctaFormData, href: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/contact"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color (CSS Class)
                  </label>
                  <input
                    type="text"
                    value={ctaFormData.backgroundColor}
                    onChange={(e) => setCtaFormData({ ...ctaFormData, backgroundColor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="bg-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color (CSS Class)
                  </label>
                  <input
                    type="text"
                    value={ctaFormData.textColor}
                    onChange={(e) => setCtaFormData({ ...ctaFormData, textColor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={ctaFormData.isVisible}
                      onChange={(e) => setCtaFormData({ ...ctaFormData, isVisible: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Show CTA Button</span>
                  </label>
                </div>
              </div>
              <button
                onClick={handleCtaUpdate}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save CTA Configuration'}
              </button>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>
                <button
                  onClick={() => openModal('social')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Social Link
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {navbarConfig?.mobileMenu?.socialLinks?.map((social, index) => (
                  <div key={social.platform} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <i className={`lab la-${social.platform} text-2xl text-gray-600`}></i>
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">{social.platform}</h4>
                          <p className="text-sm text-gray-500 truncate">{social.url}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            const updatedSocialLinks = [...navbarConfig.mobileMenu.socialLinks];
                            updatedSocialLinks[index].isActive = !updatedSocialLinks[index].isActive;
                            handleSave({
                              mobileMenu: {
                                ...navbarConfig.mobileMenu,
                                socialLinks: updatedSocialLinks
                              }
                            });
                          }}
                          className={`p-1 rounded ${
                            social.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {social.isActive ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => openModal('social', social)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSocial(social.platform)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {modalType === 'navigation' && (editingItem ? 'Edit Navigation Item' : 'Add Navigation Item')}
              {modalType === 'submenu' && (editingSubmenu ? 'Edit Submenu Item' : 'Add Submenu Item')}
              {modalType === 'social' && (editingItem ? 'Edit Social Link' : 'Add Social Link')}
            </h3>

            {(modalType === 'navigation' || modalType === 'submenu') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Home"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link (href)</label>
                  <input
                    type="text"
                    value={formData.href}
                    onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="_self">Same Window</option>
                    <option value="_blank">New Window</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
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
              </div>
            )}

            {modalType === 'social' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select
                    value={socialFormData.platform}
                    onChange={(e) => setSocialFormData({ ...socialFormData, platform: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={editingItem} // Don't allow changing platform when editing
                  >
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telegram">Telegram</option>
                    <option value="pinterest">Pinterest</option>
                    <option value="tiktok">TikTok</option>
                    <option value="snapchat">Snapchat</option>
                    <option value="reddit">Reddit</option>
                    <option value="discord">Discord</option>
                    <option value="github">GitHub</option>
                    <option value="behance">Behance</option>
                    <option value="dribbble">Dribbble</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="url"
                    value={socialFormData.url}
                    onChange={(e) => setSocialFormData({ ...socialFormData, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={socialFormData.isActive}
                      onChange={(e) => setSocialFormData({ ...socialFormData, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={modalType === 'social' ? handleSocialSubmit : handleNavigationSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingItem || editingSubmenu ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarCMS;