import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaWhatsapp, FaSave } from 'react-icons/fa';

// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const WhatsAppConfig = () => {
  const [config, setConfig] = useState({
    phoneNumber: '',
    countryCode: '',
    defaultMessage: '',
    isEnabled: true
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <FaWhatsapp className="text-green-500 mr-2" />
          WhatsApp Configuration
        </h1>
        <p className="text-gray-600">
          Configure the WhatsApp button that appears on your website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Configuration Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Enable WhatsApp Button
                  </label>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
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
                <div>
                  <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700">
                    Country Code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="countryCode"
                      id="countryCode"
                      value={config.countryCode}
                      onChange={handleChange}
                      placeholder="91"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter country code without the + symbol (e.g., 91 for India)
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={config.phoneNumber}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter phone number without country code
                  </p>
                </div>

                {/* Default Message */}
                <div>
                  <label htmlFor="defaultMessage" className="block text-sm font-medium text-gray-700">
                    Default Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="defaultMessage"
                      id="defaultMessage"
                      rows={3}
                      value={config.defaultMessage}
                      onChange={handleChange}
                      placeholder="Hello, I'm interested in your services..."
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    This message will be pre-filled when users click the WhatsApp button
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {saving ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
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
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">WhatsApp Button Preview:</p>
              
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
                
                <p className="mt-4 text-sm font-medium text-gray-700">
                  {previewNumber || '+00 0000000000'}
                </p>
                
                {!config.isEnabled && (
                  <div className="mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    Currently Disabled
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700">Default Message:</p>
                <p className="text-sm text-gray-500 mt-1 italic">
                  {config.defaultMessage || 'No default message set'}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Notes:</h4>
              <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
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