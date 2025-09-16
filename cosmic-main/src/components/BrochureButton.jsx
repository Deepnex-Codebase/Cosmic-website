import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileDownload } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

const BrochureButton = () => {
  const navigate = useNavigate();
  const [brochure, setBrochure] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBrochure = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/brochures/active`);
        if (response.data.success) {
          setBrochure(response.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching brochure:', error);
        setLoading(false);
      }
    };

    fetchActiveBrochure();
  }, []);

  const handleBrochureClick = () => {
    navigate('/brochures');
  };

  if (loading || !brochure) {
    return null; // Don't render anything while loading or if no active brochure
  }

  return (
    <button
      onClick={handleBrochureClick}
      className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-[#9fc22f] hover:bg-[#8aaa28] text-white h-32 w-10 rounded-l-none shadow-lg transition-all duration-300 flex items-center justify-center z-40 group"
      aria-label="View Brochures"
    >
      <span className="font-medium rotate-90 transform origin-center whitespace-nowrap uppercase tracking-widest text-sm">Brochure</span>
    </button>
  );
};

export default BrochureButton;