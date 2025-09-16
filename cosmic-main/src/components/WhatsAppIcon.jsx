import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';

// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const WhatsAppIcon = () => {
  const [config, setConfig] = useState({
    phoneNumber: '8488835645',
    countryCode: '91',
    defaultMessage: 'Hello, I would like to inquire about your services.',
    isEnabled: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch WhatsApp configuration from API
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/whatsapp-config`);
        if (response.data && response.data.data) {
          setConfig(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp configuration:', error);
        // Keep using default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);
  
  // Make sure we have valid values for phone number and country code
  const countryCode = config?.countryCode || '91';
  const phoneNumber = config?.phoneNumber || '8488835645';
  const defaultMessage = config?.defaultMessage || 'Hello, I would like to inquire about your services.';
  
  // Using WhatsApp API URL format that works on all devices with proper message encoding
  // For mobile devices
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Different URL formats for mobile and desktop
  const mobileUrl = `whatsapp://send?phone=${countryCode}${phoneNumber}&text=${encodeURIComponent(defaultMessage)}`;
  const desktopUrl = `https://web.whatsapp.com/send?phone=${countryCode}${phoneNumber}&text=${encodeURIComponent(defaultMessage)}`;
  
  // Choose the appropriate URL based on device
  const finalUrl = isMobile ? mobileUrl : desktopUrl;

  // Always show the icon regardless of loading state or config
  // We'll use the default values if config is not loaded

  return (
    <div className="fixed bottom-5 left-5 z-50">
      {/* WhatsApp button with improved styling */}
      <button 
        onClick={() => window.open(finalUrl, '_blank')}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none hover:scale-110"
        aria-label="Chat on WhatsApp"
        style={{
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.6)',
          animation: 'pulse-whatsapp 2s infinite'
        }}
      >
        <FaWhatsapp className="text-3xl" />
      </button>
    </div>
  );
};

export default WhatsAppIcon;