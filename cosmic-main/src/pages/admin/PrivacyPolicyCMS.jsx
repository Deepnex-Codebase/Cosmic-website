import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaUndo, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { isAuthenticated, getAuthToken } from '../../utils/cookies';
import api, { privacyPolicyService } from '../../services/api';
import { toast } from 'react-toastify';

const PrivacyPolicyCMS = () => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  // Fetch privacy policy data
  const fetchPrivacyPolicy = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await privacyPolicyService.getActivePolicy();
      
      if (response.data && response.data.data) {
        setPolicy(response.data.data);
        setFormData(response.data.data);
      } else {
        setError('Invalid data format received from server');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
      setError('Failed to load privacy policy data. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  // Handle form input changes
  const handleInputChange = (e, section, field) => {
    const { value } = e.target;
    
    if (section && field) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: value
      }));
    }
  };

  // Handle array input changes
  const handleArrayChange = (section, index, value) => {
    setFormData(prev => {
      const updatedArray = [...prev[section]];
      updatedArray[index] = value;
      return {
        ...prev,
        [section]: updatedArray
      };
    });
  };

  // Handle nested array input changes
  const handleNestedArrayChange = (section, nestedField, index, value) => {
    setFormData(prev => {
      const updatedArray = [...prev[section][nestedField]];
      updatedArray[index] = value;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [nestedField]: updatedArray
        }
      };
    });
  };

  // Add new item to array
  const handleAddArrayItem = (section) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], '']
    }));
  };

  // Add new item to nested array
  const handleAddNestedArrayItem = (section, nestedField) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedField]: [...prev[section][nestedField], '']
      }
    }));
  };

  // Remove item from array
  const handleRemoveArrayItem = (section, index) => {
    setFormData(prev => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: updatedArray
      };
    });
  };

  // Remove item from nested array
  const handleRemoveNestedArrayItem = (section, nestedField, index) => {
    setFormData(prev => {
      const updatedArray = [...prev[section][nestedField]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [nestedField]: updatedArray
        }
      };
    });
  };

  // Save privacy policy
  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Use the privacyPolicyService instead of generic api
      const response = await privacyPolicyService.updatePolicy(null, formData);
      
      if (response.data && response.data.success) {
        setPolicy(response.data.data);
        setIsEditing(false);
        toast.success('Privacy policy updated successfully');
      } else {
        toast.error('Failed to update privacy policy');
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      toast.error('Error saving privacy policy: ' + (error.response?.data?.message || error.message));
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(policy);
    setIsEditing(false);
  };

  if (!isAuthenticated()) {
    return <div>Please log in to access this page.</div>;
  }

  return (
      <div className="p-6 bg-gray-50 min-h-screen w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy Management</h1>
            <p className="text-gray-600">Manage your website's privacy policy content</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaEdit /> Edit Privacy Policy
              </button>
            ) : (
              <>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <FaUndo /> Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {isEditing ? (
              <form className="space-y-8">
                {/* Last Updated */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Last Updated</h2>
                  <p className="text-gray-500 mb-2">Current: {formData.lastUpdated}</p>
                  <p className="text-sm text-gray-500 italic">
                    <FaInfoCircle className="inline mr-1" /> 
                    This field will be automatically updated when you save changes.
                  </p>
                </div>

                {/* Introduction */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Introduction</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Introduction Text
                    </label>
                    <textarea
                      value={formData.introduction || ''}
                      onChange={(e) => handleInputChange(e, 'introduction')}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Information Collected */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Information Collected</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.informationCollected?.description || ''}
                      onChange={(e) => handleInputChange(e, 'informationCollected', 'description')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provided Information
                    </label>
                    <textarea
                      value={formData.informationCollected?.providedInfo || ''}
                      onChange={(e) => handleInputChange(e, 'informationCollected', 'providedInfo')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Automatically Collected Information
                    </label>
                    <textarea
                      value={formData.informationCollected?.automaticInfo || ''}
                      onChange={(e) => handleInputChange(e, 'informationCollected', 'automaticInfo')}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">Use new lines to separate items</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Third Party Data
                    </label>
                    <textarea
                      value={formData.informationCollected?.thirdPartyData || ''}
                      onChange={(e) => handleInputChange(e, 'informationCollected', 'thirdPartyData')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Information Usage */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Information Usage</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Purposes
                    </label>
                    {formData.informationUsage && formData.informationUsage.map((item, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleArrayChange('informationUsage', index, e.target.value)}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('informationUsage', index)}
                          className="ml-2 p-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('informationUsage')}
                      className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      + Add Purpose
                    </button>
                  </div>
                </div>

                {/* Cookies and Tracking */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Cookies and Tracking</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.cookiesAndTracking?.description || ''}
                      onChange={(e) => handleInputChange(e, 'cookiesAndTracking', 'description')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purposes
                    </label>
                    {formData.cookiesAndTracking?.purposes && formData.cookiesAndTracking.purposes.map((item, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleNestedArrayChange('cookiesAndTracking', 'purposes', index, e.target.value)}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNestedArrayItem('cookiesAndTracking', 'purposes', index)}
                          className="ml-2 p-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddNestedArrayItem('cookiesAndTracking', 'purposes')}
                      className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      + Add Purpose
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Managing Cookies
                    </label>
                    <textarea
                      value={formData.cookiesAndTracking?.managingCookies || ''}
                      onChange={(e) => handleInputChange(e, 'cookiesAndTracking', 'managingCookies')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Data Sharing */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Data Sharing</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.dataSharing?.description || ''}
                      onChange={(e) => handleInputChange(e, 'dataSharing', 'description')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sharing Entities
                    </label>
                    {formData.dataSharing?.sharingEntities && formData.dataSharing.sharingEntities.map((item, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleNestedArrayChange('dataSharing', 'sharingEntities', index, e.target.value)}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNestedArrayItem('dataSharing', 'sharingEntities', index)}
                          className="ml-2 p-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddNestedArrayItem('dataSharing', 'sharingEntities')}
                      className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      + Add Entity
                    </button>
                  </div>
                </div>

                {/* Data Security */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Data Security</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.dataSecurity?.description || ''}
                      onChange={(e) => handleInputChange(e, 'dataSecurity', 'description')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Disclaimer
                    </label>
                    <textarea
                      value={formData.dataSecurity?.disclaimer || ''}
                      onChange={(e) => handleInputChange(e, 'dataSecurity', 'disclaimer')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* User Rights */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">User Rights</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.userRights?.description || ''}
                      onChange={(e) => handleInputChange(e, 'userRights', 'description')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rights
                    </label>
                    {formData.userRights?.rights && formData.userRights.rights.map((item, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleNestedArrayChange('userRights', 'rights', index, e.target.value)}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNestedArrayItem('userRights', 'rights', index)}
                          className="ml-2 p-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddNestedArrayItem('userRights', 'rights')}
                      className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      + Add Right
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Opt-Outs
                    </label>
                    {formData.userRights?.adOptOuts && formData.userRights.adOptOuts.map((item, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleNestedArrayChange('userRights', 'adOptOuts', index, e.target.value)}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNestedArrayItem('userRights', 'adOptOuts', index)}
                          className="ml-2 p-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddNestedArrayItem('userRights', 'adOptOuts')}
                      className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      + Add Opt-Out
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Info
                    </label>
                    <textarea
                      value={formData.userRights?.contactInfo || ''}
                      onChange={(e) => handleInputChange(e, 'userRights', 'contactInfo')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* International Transfers */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">International Transfers</h2>
                  <textarea
                    value={formData.internationalTransfers || ''}
                    onChange={(e) => handleInputChange(e, 'internationalTransfers')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Children's Privacy */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Children's Privacy</h2>
                  <textarea
                    value={formData.childrenPrivacy || ''}
                    onChange={(e) => handleInputChange(e, 'childrenPrivacy')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Policy Changes */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Policy Changes</h2>
                  <textarea
                    value={formData.policyChanges || ''}
                    onChange={(e) => handleInputChange(e, 'policyChanges')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Contact Details */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactDetails?.email || ''}
                      onChange={(e) => handleInputChange(e, 'contactDetails', 'email')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={formData.contactDetails?.address || ''}
                      onChange={(e) => handleInputChange(e, 'contactDetails', 'address')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="text"
                      value={formData.contactDetails?.website || ''}
                      onChange={(e) => handleInputChange(e, 'contactDetails', 'website')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : policy ? (
              <div className="space-y-8">
                {/* Preview Mode */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        You are in preview mode. Click "Edit Privacy Policy" to make changes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-2">Last Updated</h2>
                  <p>{policy.lastUpdated}</p>
                </div>

                {/* Introduction */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-2">Introduction</h2>
                  <p className="whitespace-pre-line">{policy.introduction}</p>
                </div>

                {/* Information Collected */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Information Collected</h2>
                  
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="mb-4">{policy.informationCollected?.description}</p>
                  
                  <h3 className="text-lg font-medium mb-2">Provided Information</h3>
                  <p className="mb-4">{policy.informationCollected?.providedInfo}</p>
                  
                  <h3 className="text-lg font-medium mb-2">Automatically Collected Information</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {policy.informationCollected?.automaticInfo.split('\n').map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-medium mb-2">Third Party Data</h3>
                  <p>{policy.informationCollected?.thirdPartyData}</p>
                </div>

                {/* Information Usage */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-2">Information Usage</h2>
                  <ul className="list-disc pl-5">
                    {policy.informationUsage && policy.informationUsage.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Cookies and Tracking */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Cookies and Tracking</h2>
                  
                  <p className="mb-2">{policy.cookiesAndTracking?.description}</p>
                  
                  <ul className="list-disc pl-5 mb-4">
                    {policy.cookiesAndTracking?.purposes && policy.cookiesAndTracking.purposes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  
                  <p>{policy.cookiesAndTracking?.managingCookies}</p>
                </div>

                {/* Data Sharing */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-2">Data Sharing</h2>
                  
                  <p className="mb-2">{policy.dataSharing?.description}</p>
                  
                  <ul className="list-disc pl-5">
                    {policy.dataSharing?.sharingEntities && policy.dataSharing.sharingEntities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Data Security */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-2">Data Security</h2>
                  <p className="mb-2">{policy.dataSecurity?.description}</p>
                  <p>{policy.dataSecurity?.disclaimer}</p>
                </div>

                {/* User Rights */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">User Rights</h2>
                  
                  <p className="mb-2">{policy.userRights?.description}</p>
                  
                  <h3 className="text-lg font-medium mb-2">Rights</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {policy.userRights?.rights && policy.userRights.rights.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-medium mb-2">Ad Opt-Outs</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {policy.userRights?.adOptOuts && policy.userRights.adOptOuts.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  
                  <p>{policy.userRights?.contactInfo}</p>
                </div>

                {/* International Transfers */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-2">International Transfers</h2>
                  <p>{policy.internationalTransfers}</p>
                </div>

                {/* Children's Privacy */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-2">Children's Privacy</h2>
                  <p>{policy.childrenPrivacy}</p>
                </div>

                {/* Policy Changes */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-2">Policy Changes</h2>
                  <p>{policy.policyChanges}</p>
                </div>

                {/* Contact Details */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> {policy.contactDetails?.email}</li>
                    <li><strong>Address:</strong> {policy.contactDetails?.address}</li>
                    <li><strong>Website:</strong> {policy.contactDetails?.website}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No privacy policy found. Click "Edit Privacy Policy" to create one.</p>
              </div>
            )}
          </div>
        )}
      </div>
  );
};

export default PrivacyPolicyCMS;