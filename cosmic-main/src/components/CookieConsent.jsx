import React, { useState, useEffect } from 'react';
import { setCookie, setAllCookies, getCookie } from '../utils/cookies';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Essential cookies are always required
    analytics: true,
    marketing: true,
    preferences: true
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    // If no choice has been made, show the consent banner
    if (!cookieConsent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    // Set cookie consent to true in localStorage
    localStorage.setItem('cookieConsent', 'accepted');
    
    // Set expiry date to 1 month from now
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    localStorage.setItem('cookieConsentExpiry', expiryDate.toISOString());
    
    // Hide the consent banner
    setVisible(false);
    
    // Set all cookies using the utility function
    setAllCookies();
  };
  
  const savePreferences = () => {
    // Save user preferences
    localStorage.setItem('cookieConsent', 'customized');
    
    // Set expiry date to 1 month from now
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    localStorage.setItem('cookieConsentExpiry', expiryDate.toISOString());
    
    // Set cookies based on user preferences
    if (cookieSettings.analytics) {
      setCookie('analyticsCookie', 'true', 30);
    }
    
    if (cookieSettings.marketing) {
      setCookie('marketingCookie', 'true', 30);
    }
    
    if (cookieSettings.preferences) {
      setCookie('preferenceCookie', 'true', 30);
    }
    
    // Hide the modal and banner
    setShowModal(false);
    setVisible(false);
  };

  const declineCookies = () => {
    // Set cookie consent to false in localStorage
    localStorage.setItem('cookieConsent', 'declined');
    
    // Hide the consent banner
    setVisible(false);
    
    // No cookies will be set
  };

  // Check if consent has expired (1 month)
  useEffect(() => {
    const checkConsentExpiry = () => {
      const consentExpiry = localStorage.getItem('cookieConsentExpiry');
      
      if (consentExpiry) {
        const expiryDate = new Date(consentExpiry);
        const currentDate = new Date();
        
        // If consent has expired, remove it and show banner again
        if (currentDate > expiryDate) {
          localStorage.removeItem('cookieConsent');
          localStorage.removeItem('cookieConsentExpiry');
          setVisible(true);
        }
      }
    };
    
    checkConsentExpiry();
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Main Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-5 md:p-6 border-t-2 border-yellow-green-300 w-full">
        <div className="container mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div className="text-gray-800 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-xl">Privacy Preference Center</p>
            </div>
            <p className="text-sm mb-3">We use cookies to enhance your browsing experience and provide personalized services. Our website uses different types of cookies:</p>
            <ul className="text-sm list-disc pl-5 mb-3 space-y-1">
              <li><span className="font-medium">Essential cookies:</span> Necessary for the website to function properly.</li>
              <li><span className="font-medium">Analytics cookies:</span> Help us understand how visitors interact with our website.</li>
              <li><span className="font-medium">Marketing cookies:</span> Allow us to offer you relevant content and promotions.</li>
              <li><span className="font-medium">Preference cookies:</span> Remember your settings and preferences for a better experience.</li>
            </ul>
            <p className="text-sm">By accepting cookies, you help us improve our website and services. You can customize your preferences or decline non-essential cookies.</p>
          </div>
          <div className="flex flex-col gap-3 justify-end min-w-[200px]">
            <button 
              onClick={acceptCookies}
              className="px-4 py-2.5 bg-yellow-green-500 text-white rounded-md hover:bg-yellow-green-600 transition-colors text-sm font-medium w-full flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Accept All Cookies
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-white border border-yellow-green-500 text-yellow-green-600 rounded-md hover:bg-yellow-green-50 transition-colors text-sm font-medium w-full flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Customize Settings
            </button>
            <button 
              onClick={declineCookies}
              className="px-4 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium w-full flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Decline All
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Cookie Settings
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Customize your cookie preferences. Essential cookies are always active as they are necessary for the website to function properly.
                You can choose which optional cookies to enable or disable. Learn more about how we use cookies in our Privacy Policy.
              </p>

              {/* Cookie Categories */}
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Essential Cookies
                      </h3>
                      <p className="text-sm text-gray-600">These cookies are necessary for the website to function properly and cannot be disabled.</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 bg-gray-200 rounded-full cursor-not-allowed">
                      <span className="absolute inset-0 flex items-center justify-end p-1">
                        <span className="w-4 h-4 bg-yellow-green-500 rounded-full"></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analytics Cookies
                      </h3>
                      <p className="text-sm text-gray-600">These cookies help us understand how visitors interact with our website, helping us improve our services.</p>
                    </div>
                    <button 
                      onClick={() => setCookieSettings({...cookieSettings, analytics: !cookieSettings.analytics})}
                      className={`relative inline-block w-12 h-6 ${cookieSettings.analytics ? 'bg-yellow-green-500' : 'bg-gray-200'} rounded-full transition-colors`}
                    >
                      <span className={`absolute inset-0 flex items-center ${cookieSettings.analytics ? 'justify-end' : 'justify-start'} p-1 transition-all`}>
                        <span className="w-4 h-4 bg-white rounded-full shadow"></span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        Marketing Cookies
                      </h3>
                      <p className="text-sm text-gray-600">These cookies allow us to provide personalized ads and content based on your interests.</p>
                    </div>
                    <button 
                      onClick={() => setCookieSettings({...cookieSettings, marketing: !cookieSettings.marketing})}
                      className={`relative inline-block w-12 h-6 ${cookieSettings.marketing ? 'bg-yellow-green-500' : 'bg-gray-200'} rounded-full transition-colors`}
                    >
                      <span className={`absolute inset-0 flex items-center ${cookieSettings.marketing ? 'justify-end' : 'justify-start'} p-1 transition-all`}>
                        <span className="w-4 h-4 bg-white rounded-full shadow"></span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Preference Cookies */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Preference Cookies
                      </h3>
                      <p className="text-sm text-gray-600">These cookies remember your settings and preferences for a better experience.</p>
                    </div>
                    <button 
                      onClick={() => setCookieSettings({...cookieSettings, preferences: !cookieSettings.preferences})}
                      className={`relative inline-block w-12 h-6 ${cookieSettings.preferences ? 'bg-yellow-green-500' : 'bg-gray-200'} rounded-full transition-colors`}
                    >
                      <span className={`absolute inset-0 flex items-center ${cookieSettings.preferences ? 'justify-end' : 'justify-start'} p-1 transition-all`}>
                        <span className="w-4 h-4 bg-white rounded-full shadow"></span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={savePreferences}
                className="px-4 py-2 bg-yellow-green-500 text-white rounded-md hover:bg-yellow-green-600 transition-colors text-sm font-medium"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;