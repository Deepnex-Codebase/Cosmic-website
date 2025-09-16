import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaWhatsapp, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../config/config';

const WhatsAppConfigCMS = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    defaultMessage: '',
    isEnabled: true,
    countryCode: '91'
  });

  // Fetch WhatsApp config on component mount
  useEffect(() => {
    fetchWhatsAppConfig();
  }, []);

  const fetchWhatsAppConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/whatsapp-config`);
      
      if (response.data.success && response.data.data) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp config:', error);
      toast.error('Failed to load WhatsApp configuration');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await axios.put(
        `${API_URL}/api/whatsapp-config`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('WhatsApp configuration updated successfully');
      } else {
        toast.error('Failed to update WhatsApp configuration');
      }
    } catch (error) {
      console.error('Error updating WhatsApp config:', error);
      toast.error('Failed to update WhatsApp configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <FaWhatsapp className="text-green-500 text-3xl mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">WhatsApp Configuration</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country Code
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">+</span>
              <input
                type="text"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="91"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="8488835645"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Message
          </label>
          <textarea
            name="defaultMessage"
            value={formData.defaultMessage}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Hello, I would like to inquire about your services."
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isEnabled"
              checked={formData.isEnabled}
              onChange={handleInputChange}
              className="h-5 w-5 text-green-500 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-gray-700">Enable WhatsApp Button</span>
          </label>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <FaSave className="mr-2" />
                Save Configuration
              </span>
            )}
          </button>
        </div>
      </form>
      
      {/* Preview */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Preview</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-green-500 text-white p-3 rounded-full mr-3">
              <FaWhatsapp className="text-xl" />
            </div>
            <div>
              <p className="font-medium">WhatsApp Contact</p>
              <p className="text-gray-600">+{formData.countryCode} {formData.phoneNumber}</p>
              <p className="text-sm text-gray-500 mt-1">{formData.defaultMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConfigCMS;