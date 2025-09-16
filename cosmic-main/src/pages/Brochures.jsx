import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaFileDownload, FaEye, FaCalendarAlt, FaRupeeSign, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

const Brochures = () => {
  const [brochures, setBrochures] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('brochures'); // 'brochures' or 'rates'

  useEffect(() => {
    fetchBrochures();
  }, []);

  const fetchBrochures = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/brochures`);
      if (response.data.success) {
        setBrochures(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brochures:', error);
      setLoading(false);
    }
  };

  const fetchRates = async () => {
    try {
      setRatesLoading(true);
      const response = await axios.get(`${API_BASE_URL}/rates`);
      setRates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rates:', error);
      setRates([]);
    } finally {
      setRatesLoading(false);
    }
  };

  const handleView = (brochure) => {
    if (brochure && brochure.fileUrl) {
      window.open(`${SERVER_URL}${brochure.fileUrl}`, '_blank');
    }
  };

  const handleDownload = (brochure) => {
    if (brochure && brochure.fileUrl) {
      const link = document.createElement('a');
      link.href = `${SERVER_URL}${brochure.fileUrl}`;
      link.download = `${brochure.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRateView = (rate) => {
    if (rate && rate.fileUrl) {
      window.open(`${SERVER_URL}${rate.fileUrl}`, '_blank');
    } else {
      // If no file, show rate details in a modal or alert
      alert(`Rate Details:\n\nTitle: ${rate.title}\nCategory: ${rate.category}\nPrice: ₹${rate.price} ${rate.unit}\nDescription: ${rate.description}\n\nFeatures:\n${rate.features ? rate.features.join('\n• ') : 'No features listed'}`);
    }
  };

  const handleRateDownload = (rate) => {
    if (rate && rate.fileUrl) {
      const link = document.createElement('a');
      link.href = `${SERVER_URL}${rate.fileUrl}`;
      link.download = `${rate.title}-rate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate a simple text file with rate details
      const rateDetails = `Rate Information
      
Title: ${rate.title}
Category: ${rate.category}
Price: ₹${rate.price} ${rate.unit}
Description: ${rate.description}

Features:
${rate.features ? rate.features.map(f => `• ${f}`).join('\n') : '• No features listed'}

Generated on: ${new Date().toLocaleDateString()}
`;
      
      const blob = new Blob([rateDetails], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${rate.title}-rate-details.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/contact-from-bg.jpeg')`
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Brochures & Rates
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/90 mb-8 max-w-3xl leading-relaxed"
            >
              Download our comprehensive brochures and explore our competitive pricing plans. 
              Get detailed information about our solar solutions and transparent pricing structure.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center space-x-2 text-white/80"
            >
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span>Brochures</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white shadow-sm border-b">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="flex max-w-lg w-full">
              <button 
                className={`flex-1 px-8 py-4 text-center font-semibold relative transition-all duration-300 ${
                  activeTab === 'brochures' 
                    ? 'bg-[#9fc22f] text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setActiveTab('brochures');
                }}
              >
                <span className="flex items-center justify-center">
                  <FaFileDownload className="mr-2" />
                  Brochures
                </span>
                {activeTab === 'brochures' && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[15px] border-l-transparent border-r-transparent border-t-[#9fc22f]"></div>
                )}
              </button>
              <button 
                className={`flex-1 px-8 py-4 text-center font-semibold transition-all duration-300 ${
                  activeTab === 'rates' 
                    ? 'bg-[#9fc22f] text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setActiveTab('rates');
                  if (rates.length === 0) {
                    fetchRates();
                  }
                }}
              >
                <span className="flex items-center justify-center">
                  <FaRupeeSign className="mr-2" />
                  Rates
                </span>
                {activeTab === 'rates' && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[15px] border-l-transparent border-r-transparent border-t-[#9fc22f]"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* Content Section */}
      <section className="pt-8 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="px-6 py-6 bg-gradient-to-r from-[#9fc22f] to-[#8aaa28] text-white">
              <h2 className="text-3xl font-bold mb-2">
                {activeTab === 'brochures' ? 'Available Brochures' : 'Our Pricing Plans'}
              </h2>
              <p className="text-green-100">
                {activeTab === 'brochures' 
                  ? 'Download our comprehensive company brochures and product catalogs'
                  : 'Transparent and competitive pricing for all your solar energy needs'
                }
              </p>
            </div>

            {/* Brochures Content */}
            {activeTab === 'brochures' && (
              <div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#9fc22f]"></div>
                <p className="mt-4 text-gray-600">Loading brochures...</p>
              </div>
            ) : brochures.length === 0 ? (
              <div className="p-12 text-center">
                <FaFileDownload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">
                  No brochures available at the moment.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Added
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {brochures.map((brochure, index) => (
                      <motion.tr 
                        key={brochure._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {brochure.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="mr-2" />
                            {new Date(brochure.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleView(brochure)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#9fc22f] hover:bg-[#8aaa28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9fc22f] transition-colors duration-200"
                            >
                              <FaEye className="mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => handleDownload(brochure)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9fc22f] transition-colors duration-200"
                            >
                              <FaFileDownload className="mr-1" />
                              Download
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
              </div>
            )}

            {/* Rates Content */}
            {activeTab === 'rates' && (
              <div>
                {ratesLoading ? (
                  <div className="p-12 text-center">
                    <FaSpinner className="animate-spin text-4xl text-[#9fc22f] mx-auto mb-4" />
                    <p className="text-gray-600">Loading rates...</p>
                  </div>
                ) : rates.length === 0 ? (
                  <div className="p-12 text-center">
                    <FaRupeeSign className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">
                      No pricing information available at the moment.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 bg-white">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">
                            <div className="flex items-center">
                              <span>Title</span>
                            </div>
                          </th>
                          <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/8">
                            <div className="flex items-center">
                              <span>Category</span>
                            </div>
                          </th>
                          <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/8">
                            <div className="flex items-center">
                              <FaRupeeSign className="mr-1 text-[#9fc22f]" />
                              <span>Price</span>
                            </div>
                          </th>
                          <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/4">
                            <div className="flex items-center">
                              <span>Description</span>
                            </div>
                          </th>
                          <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/4">
                            <div className="flex items-center">
                              <FaCheckCircle className="mr-1 text-[#9fc22f]" />
                              <span>Features</span>
                            </div>
                          </th>
                          <th scope="col" className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">
                            <div className="flex items-center justify-center">
                              <span>Actions</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {rates.map((rate, index) => (
                          <motion.tr 
                            key={rate._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300 border-b border-gray-100"
                          >
                            <td className="px-4 py-5">
                              <div className="text-sm font-semibold text-gray-900 leading-relaxed">
                                {rate.title}
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                                rate.category === 'residential' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                rate.category === 'commercial' ? 'bg-green-100 text-green-800 border border-green-200' :
                                rate.category === 'industrial' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                rate.category === 'maintenance' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}>
                                {rate.category.charAt(0).toUpperCase() + rate.category.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex items-center text-sm text-gray-900">
                                <div className="bg-green-50 p-1 rounded-full mr-2">
                                  <FaRupeeSign className="text-[#9fc22f] text-xs" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-gray-900">
                                    {rate.price ? rate.price.toLocaleString() : 'N/A'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {rate.unit || 'per unit'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <div className="text-sm text-gray-700 leading-relaxed">
                                <p className="line-clamp-2" title={rate.description}>
                                  {rate.description}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <div className="text-sm text-gray-700">
                                {rate.features && rate.features.length > 0 ? (
                                  <div className="space-y-1">
                                    {rate.features.slice(0, 2).map((feature, featureIndex) => (
                                      <div key={featureIndex} className="flex items-start">
                                        <div className="bg-green-50 p-0.5 rounded-full mr-2 mt-0.5">
                                          <FaCheckCircle className="text-[#9fc22f] text-xs" />
                                        </div>
                                        <span className="text-xs text-gray-600 leading-relaxed">{feature}</span>
                                      </div>
                                    ))}
                                    {rate.features.length > 2 && (
                                      <div className="flex items-center mt-1">
                                        <div className="bg-gray-100 px-2 py-1 rounded-full">
                                          <span className="text-gray-600 text-xs font-medium">
                                            +{rate.features.length - 2} more features
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs italic">No features listed</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-5 text-center">
                              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <button
                                  onClick={() => handleRateView(rate)}
                                  className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-[#9fc22f] to-[#8aaa28] hover:from-[#8aaa28] hover:to-[#7a9625] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9fc22f] transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                  <FaEye className="mr-1" />
                                  View
                                </button>
                                <button
                                  onClick={() => handleRateDownload(rate)}
                                  className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9fc22f] transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                  <FaFileDownload className="mr-1" />
                                  Download
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-4 p-4">
                    {rates.map((rate, index) => (
                      <motion.div
                        key={rate._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{rate.title}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              rate.category === 'residential' ? 'bg-blue-100 text-blue-800' :
                              rate.category === 'commercial' ? 'bg-green-100 text-green-800' :
                              rate.category === 'industrial' ? 'bg-purple-100 text-purple-800' :
                              rate.category === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {rate.category.charAt(0).toUpperCase() + rate.category.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center mb-3">
                            <div className="bg-green-50 p-1 rounded-full mr-2">
                              <FaRupeeSign className="text-[#9fc22f] text-sm" />
                            </div>
                            <div>
                              <span className="text-lg font-bold text-gray-900">
                                {rate.price ? rate.price.toLocaleString() : 'N/A'}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">
                                {rate.unit || 'per unit'}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3">{rate.description}</p>
                          
                          {rate.features && rate.features.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <FaCheckCircle className="text-[#9fc22f] mr-1" />
                                Features
                              </h4>
                              <div className="space-y-1">
                                {rate.features.slice(0, 3).map((feature, featureIndex) => (
                                  <div key={featureIndex} className="flex items-start">
                                    <div className="bg-green-50 p-0.5 rounded-full mr-2 mt-0.5">
                                      <FaCheckCircle className="text-[#9fc22f] text-xs" />
                                    </div>
                                    <span className="text-xs text-gray-600">{feature}</span>
                                  </div>
                                ))}
                                {rate.features.length > 3 && (
                                  <div className="text-xs text-gray-500 ml-5">
                                    +{rate.features.length - 3} more features
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRateView(rate)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#9fc22f] to-[#8aaa28] hover:from-[#8aaa28] hover:to-[#7a9625] transition-all duration-200"
                            >
                              <FaEye className="mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => handleRateDownload(rate)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                            >
                              <FaFileDownload className="mr-1" />
                              Download
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Brochures;