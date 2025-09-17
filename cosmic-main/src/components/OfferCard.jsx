import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGift, 
  FaPercent, 
  FaClock, 
  FaCopy, 
  FaCheck,
  FaExternalLinkAlt,
  FaInfoCircle
} from 'react-icons/fa';

const OfferCard = ({ offer, index = 0 }) => {
  const [copied, setCopied] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Copy discount code to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if offer is expired
  const isExpired = () => {
    return new Date() > new Date(offer.validUntil);
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    const today = new Date();
    const validUntil = new Date(offer.validUntil);
    const diffTime = validUntil - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const expired = isExpired();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 hover:shadow-xl transition-all duration-300 ${
        expired ? 'border-gray-300 opacity-75' : 'border-transparent hover:border-[#9fc22f]'
      }`}
      style={{ 
        backgroundColor: offer.backgroundColor || '#ffffff',
        color: offer.textColor || '#000000'
      }}
    >
      {/* Header with discount badge */}
      <div className="relative p-6 pb-4">
        {expired && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            EXPIRED
          </div>
        )}
        
        {!expired && offer.discountPercentage && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
            <FaPercent className="mr-1" />
            {offer.discountPercentage}% OFF
          </div>
        )}

        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#9fc22f] to-[#8aaa28] rounded-lg flex items-center justify-center">
              <FaGift className="text-white text-xl" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2" style={{ color: offer.textColor || '#000000' }}>
              {offer.title}
            </h3>
            {offer.subtitle && (
              <p className="text-sm opacity-75 mb-3" style={{ color: offer.textColor || '#666666' }}>
                {offer.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Offer Image */}
      {offer.image && (
        <div className="px-6 pb-4">
          <img 
            src={offer.image} 
            alt={offer.title}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Description */}
      <div className="px-6 pb-4">
        <p className="text-sm leading-relaxed" style={{ color: offer.textColor || '#666666' }}>
          {offer.description}
        </p>
      </div>

      {/* Discount Code Section */}
      {offer.discountCode && !expired && (
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1 font-medium">DISCOUNT CODE</p>
                <p className="font-mono font-bold text-lg text-[#9fc22f] tracking-wider">
                  {offer.discountCode}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(offer.discountCode)}
                className="ml-3 p-2 bg-[#9fc22f] text-white rounded-lg hover:bg-[#8aaa28] transition-colors duration-200 flex items-center justify-center"
                title="Copy code"
              >
                {copied ? <FaCheck className="text-sm" /> : <FaCopy className="text-sm" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validity Information */}
      {!expired && (
        <div className="px-6 pb-4">
          <div className={`rounded-lg p-3 ${
            daysRemaining <= 3 
              ? 'bg-red-50 border border-red-200' 
              : daysRemaining <= 7 
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`text-sm flex items-center font-medium ${
              daysRemaining <= 3 
                ? 'text-red-800' 
                : daysRemaining <= 7 
                ? 'text-yellow-800'
                : 'text-green-800'
            }`}>
              <FaClock className="mr-2" />
              {daysRemaining > 0 
                ? `Valid for ${daysRemaining} more day${daysRemaining !== 1 ? 's' : ''}`
                : 'Expires today!'
              }
            </p>
            <p className="text-xs mt-1 opacity-75">
              Valid until {formatDate(offer.validUntil)}
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="px-6 pb-6">
        <button
          onClick={() => window.open(offer.buttonLink, '_blank')}
          disabled={expired}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
            expired 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
          style={{ 
            backgroundColor: expired ? '#9CA3AF' : (offer.buttonColor || '#9fc22f'),
            color: expired ? '#6B7280' : '#ffffff'
          }}
        >
          <FaGift className="mr-2" />
          {expired ? 'Offer Expired' : (offer.buttonText || 'Claim Offer')}
          {!expired && <FaExternalLinkAlt className="ml-2 text-sm" />}
        </button>
      </div>

      {/* Terms and Conditions */}
      {offer.termsAndConditions && (
        <div className="px-6 pb-6">
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FaInfoCircle className="mr-1" />
            Terms & Conditions
          </button>
          
          {showTerms && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-3 bg-gray-50 rounded-lg border"
            >
              <p className="text-xs text-gray-600 leading-relaxed">
                {offer.termsAndConditions}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default OfferCard;