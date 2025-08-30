import React, { useState, useEffect } from 'react';

const OfferPopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has accepted cookies and hasn't closed the popup before
    const cookieConsent = localStorage.getItem('cookieConsent');
    const popupClosed = localStorage.getItem('offerPopupClosed');
    
    // Only show offer popup if cookies were accepted and popup wasn't closed before
    if ((cookieConsent === 'accepted' || cookieConsent === 'customized') && !popupClosed) {
      // Show popup after 10 seconds (only once)
      const timerId = setTimeout(() => {
        setVisible(true);
      }, 10000); // 10 seconds
      
      // Clean up timeout if component unmounts
      return () => clearTimeout(timerId);
    }
  }, []);

  // Close the popup and remember that user closed it
  const closePopup = () => {
    setVisible(false);
    
    // Store in localStorage that user has closed the popup
    // This will prevent it from showing again
    localStorage.setItem('offerPopupClosed', 'true');
  };

  // If not visible, don't render anything
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
        {/* Header with close button */}
        <div className="bg-[#cae28e] p-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-xl">Special Offer!</h2>
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
              Limited Time Offer
            </span>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">20% OFF on Solar Panels</h3>
            <p className="text-gray-600">Get 20% discount on all our premium solar panel installations when you book this month!</p>
          </div>
          
          <div className="bg-yellow-green-50 p-4 rounded-lg mb-4 border border-yellow-green-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Offer ends in:</span>
              <span className="text-yellow-green-700 font-bold">7 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Discount:</span>
              <span className="text-yellow-green-700 font-bold">20%</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Use code <span className="font-bold text-yellow-green-600">COSMIC20</span> at checkout</p>
            <button 
              onClick={closePopup}
              className="w-full bg-yellow-green-500 text-white py-3 px-4 rounded-md font-medium hover:bg-yellow-green-600 transition-colors"
            >
              Claim Offer Now
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center text-xs text-gray-500 border-t">
          *Terms and conditions apply. Offer valid until limited stock lasts.
        </div>
      </div>
    </div>
  );
};

export default OfferPopup;