import React from 'react';
import OfferBannerCMS from '../../components/admin/OfferBannerCMS';

const OfferBannerCMSPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Offer Banner Management</h1>
      <p className="text-gray-600 mb-8">
        Create and manage offer banners that will be displayed as popups on your website.
      </p>
      
      <OfferBannerCMS />
    </div>
  );
};

export default OfferBannerCMSPage;