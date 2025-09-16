import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaWhatsapp, FaSave, FaPhone, FaGlobe, FaCommentDots, FaExclamationTriangle } from 'react-icons/fa';

// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const WhatsAppConfig = () => {
  const [config, setConfig] = useState({
    phoneNumber: '',
    countryCode: '',
    defaultMessage: '',
    isEnabled: true
  });
  const [errors, setErrors] = useState({
    phoneNumber: '',
    countryCode: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewNumber, setPreviewNumber] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    // Update preview when config changes
    if (config.countryCode && config.phoneNumber) {
      setPreviewNumber(`+${config.countryCode}${config.phoneNumber}`);
    }
  }, [config.countryCode, config.phoneNumber]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      // Import the getAuthToken function from cookies.js
      const { getAuthToken } = await import('../../utils/cookies');
      const token = getAuthToken() || localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/whatsapp-config`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data && response.data.data) {
        setConfig(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp configuration:', error);
      toast.error('Failed to load WhatsApp configuration');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    let errorMessage = '';
    
    if (name === 'countryCode') {
      if (!value.trim()) {
        errorMessage = 'देश कोड आवश्यक है';
      } else if (!/^\d+$/.test(value)) {
        errorMessage = 'देश कोड में केवल अंक होने चाहिए';
      } else if (value.length < 1 || value.length > 4) {
        errorMessage = 'देश कोड 1-4 अंकों का होना चाहिए';
      }
    }
    
    if (name === 'phoneNumber') {
      if (!value.trim()) {
        errorMessage = 'फोन नंबर आवश्यक है';
      } else if (!/^\d+$/.test(value)) {
        errorMessage = 'फोन नंबर में केवल अंक होने चाहिए';
      } else if (value.length < 8 || value.length > 12) {
        errorMessage = 'फोन नंबर 8-12 अंकों का होना चाहिए';
      }
    }
    
    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setConfig({
      ...config,
      [name]: newValue
    });
    
    // Only validate phone and country code fields
    if (name === 'phoneNumber' || name === 'countryCode') {
      const errorMessage = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      countryCode: validateField('countryCode', config.countryCode),
      phoneNumber: validateField('phoneNumber', config.phoneNumber)
    };
    
    setErrors(newErrors);
    
    // Form is valid if there are no error messages
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('कृपया फॉर्म में सभी त्रुटियों को ठीक करें');
      return;
    }
    
    try {
      setSaving(true);
      // Import the getAuthToken function from cookies.js
      const { getAuthToken } = await import('../../utils/cookies');
      const token = getAuthToken() || localStorage.getItem('token');
      
      await axios.put(`${API_BASE_URL}/whatsapp-config`, config, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('WhatsApp configuration updated successfully');
    } catch (error) {
      console.error('Error updating WhatsApp configuration:', error);
      toast.error('Failed to update WhatsApp configuration');
    } finally {
      setSaving(false);
    }
  };

  const generateWhatsAppLink = () => {
    if (!config.phoneNumber || !config.countryCode) return '#';
    const message = encodeURIComponent(config.defaultMessage || '');
    return `https://wa.me/${config.countryCode}${config.phoneNumber}?text=${message}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="mb-8 bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-3 flex items-center">
          <FaWhatsapp className="text-green-600 mr-3 text-4xl" />
          WhatsApp Configuration
        </h1>
        <p className="text-gray-600 ml-1 pl-8 border-l-4 border-green-500">
          Configure the WhatsApp button that appears on your website for customer communication
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Configuration Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Button Settings
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="text-base font-medium text-gray-800">
                      Enable WhatsApp Button
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      When enabled, the WhatsApp button will be visible on your website
                    </p>
                  </div>
                  <div className="relative inline-block w-16 align-middle select-none transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      name="isEnabled"
                      id="isEnabled"
                      checked={config.isEnabled}
                      onChange={handleChange}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor="isEnabled"
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                        config.isEnabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></label>
                  </div>
                </div>

                {/* Country Code */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label htmlFor="countryCode" className="block text-base font-medium text-gray-800 mb-2 flex items-center">
                    <FaGlobe className="text-green-500 mr-2" />
                    Country Code
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      +
                    </span>
                    <input
                      type="text"
                      name="countryCode"
                      id="countryCode"
                      value={config.countryCode}
                      onChange={handleChange}
                      placeholder="91"
                      className={`pl-7 shadow-sm focus:ring-green-500 focus:border-green-500 block w-full text-base ${
                        errors.countryCode ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                      } rounded-md`}
                    />
                    {errors.countryCode && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.countryCode ? (
                    <p className="mt-2 text-sm text-red-600">
                      <span className="flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        {errors.countryCode}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      Enter country code without the + symbol (e.g., 91 for India)
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label htmlFor="phoneNumber" className="block text-base font-medium text-gray-800 mb-2 flex items-center">
                    <FaPhone className="text-green-500 mr-2" />
                    Phone Number
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={config.phoneNumber}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`shadow-sm focus:ring-green-500 focus:border-green-500 block w-full text-base ${
                        errors.phoneNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                      } rounded-md`}
                    />
                    {errors.phoneNumber && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.phoneNumber ? (
                    <p className="mt-2 text-sm text-red-600">
                      <span className="flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        {errors.phoneNumber}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      Enter phone number without country code
                    </p>
                  )}
                </div>

                {/* Default Message */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label htmlFor="defaultMessage" className="block text-base font-medium text-gray-800 mb-2 flex items-center">
                    <FaCommentDots className="text-green-500 mr-2" />
                    Default Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="defaultMessage"
                      id="defaultMessage"
                      rows={4}
                      value={config.defaultMessage}
                      onChange={handleChange}
                      placeholder="Hello, I'm interested in your services..."
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full text-base border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    This message will be pre-filled when users click the WhatsApp button
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    {saving ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Configuration
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 h-full border border-gray-100 sticky top-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
              <span className="w-2 h-6 bg-green-500 rounded mr-2"></span>
              Live Preview
            </h3>
            
            <div className="border rounded-xl p-6 bg-gray-50 shadow-inner">
              <p className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                WhatsApp Button Preview:
              </p>
              
              <div className="flex flex-col items-center">
                <div className={`relative w-16 h-16 ${!config.isEnabled && 'opacity-50'}`}>
                  {/* Pulse Animation */}
                  <div className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping"></div>
                  
                  {/* Button */}
                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white shadow-lg hover:scale-105 transition-transform ${
                      !config.isEnabled && 'pointer-events-none'
                    }`}
                  >
                    <FaWhatsapp className="text-3xl" />
                  </a>
                </div>
                
                <p className="mt-4 text-base font-medium text-gray-700">
                  {previewNumber || '+00 0000000000'}
                </p>
                
                {!config.isEnabled && (
                  <div className="mt-2 px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                    Currently Disabled
                  </div>
                )}
                
                {config.isEnabled && (
                  <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    Active
                  </div>
                )}
              </div>
              
              <div className="mt-8 bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Default Message:</p>
                <p className="text-sm text-gray-600 mt-1 italic bg-gray-50 p-3 rounded border border-gray-100">
                  {config.defaultMessage || 'No default message set'}
                </p>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Notes:
              </h4>
              <ul className="text-xs text-blue-700 space-y-2 list-disc pl-5">
                <li>The WhatsApp button appears in the bottom left corner of your website</li>
                <li>Users will be redirected to WhatsApp with your pre-filled message</li>
                <li>Make sure to test the configuration on your website after saving</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConfig;