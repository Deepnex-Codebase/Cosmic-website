import React, { useState, useEffect } from 'react';
import api from '../services/api';

const OfferPopup = () => {
  const [visible, setVisible] = useState(false);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch active offer from the backend
    const fetchActiveOffer = async () => {
      try {
        setLoading(true);
        const response = await api.get('/cms/offers/active');
        
        if (response.data.success && response.data.data) {
          setOffer(response.data.data);
          
          // Check if user hasn't closed the popup before
          const popupClosed = localStorage.getItem('offerPopupClosed');
          
          // Show offer popup if it wasn't closed before
          if (!popupClosed) {
            // Show popup every time the site is opened
            setVisible(true);
          }
        }
      } catch (error) {
        console.error('Error fetching active offer:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveOffer();
  }, []);
  
  // Listen for storage changes (in case offerPopupClosed is modified in another tab)
  useEffect(() => {
    const handleStorageChange = (event) => {
      // If offerPopupClosed was changed and the popup should be visible
      if (event.key === 'offerPopupClosed' && event.newValue === null && offer) {
        setVisible(true);
      }
    };
    
    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [offer]);

  // Close the popup and remember that user closed it
  const closePopup = () => {
    setVisible(false);
    
    // Store in localStorage that user has closed the popup
    // This will prevent it from showing again
    localStorage.setItem('offerPopupClosed', 'true');
  };

  // If not visible or no active offer, don't render anything
  if (!visible || !offer || loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
        {/* Header with close button */}
        <div className="p-4 flex justify-between items-center" style={{ backgroundColor: offer.backgroundColor || '#cae28e' }}>
          <h2 className="text-white font-bold text-xl">{offer.title}</h2>
          <button 
            onClick={closePopup}
            className="text-white hover:text-yellow-green-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Offer content */}
        <div className="p-6">
          <div className="mb-4 text-center">
            <span className="inline-block bg-yellow-green-100 text-yellow-green-800 text-sm font-medium px-3 py-1 rounded-full mb-3">
              {offer.subtitle}
            </span>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{offer.discountPercentage}% OFF on Solar Panels</h3>
            <p className="text-gray-600">{offer.description}</p>
          </div>
          
          <div className="bg-yellow-green-50 p-4 rounded-lg mb-4 border border-yellow-green-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Offer ends in:</span>
              <span className="text-yellow-green-700 font-bold">{offer.expiryDays} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Discount:</span>
              <span className="text-yellow-green-700 font-bold">{offer.discountPercentage}%</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Use code <span className="font-bold text-yellow-green-600">{offer.discountCode}</span> at checkout</p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={closePopup}
                className="w-full text-white py-3 px-4 rounded-md font-medium transition-colors"
                style={{ backgroundColor: offer.buttonColor || '#4CAF50', hover: { backgroundColor: offer.buttonColor ? `${offer.buttonColor}dd` : '#45a049' } }}
              >
                Claim Offer Now
              </button>
              <p className="text-xs text-gray-500 text-center">
                By using this offer, you agree to our <a href="/privacy-policy" className="underline hover:text-yellow-green-600">Privacy Policy</a> and <a href="/terms" className="underline hover:text-yellow-green-600">Terms of Service</a>.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center text-xs text-gray-500 border-t">
          {offer.termsAndConditions}
        </div>
      </div>
    </div>
  );
};

export default OfferPopup;