import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion'; // Removed unused import
import { FiSun,FiCheck, FiZap, FiSettings, FiTool, FiCheckCircle, FiHome, FiTruck, FiCpu, FiBarChart, FiArrowRight, FiLoader } from 'react-icons/fi';
import { getAllServices } from '../services/serviceService';

const Services = () => {
  // State management
  const [mainServices, setMainServices] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [activeService, setActiveService] = useState(null); // Removed unused state

  // Icon mapping for dynamic services
  const iconMap = {
    'FiSun': <FiSun className="w-10 h-10" />,
    'FiSettings': <FiSettings className="w-10 h-10" />,
    'FiBarChart': <FiBarChart className="w-10 h-10" />,
    'FiZap': <FiZap />,
    'FiHome': <FiHome />,
    'FiTruck': <FiTruck />,
    'FiCpu': <FiCpu />,
    'FiTool': <FiTool />,
    'FiCheckCircle': <FiCheckCircle />
  };

  // Fetch services data
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        // Fetch all services
        const allServicesResponse = await getAllServices({ isActive: true });
        const services = allServicesResponse.data || [];
        
        // Separate main services (core category) and additional services
        const coreServices = services.filter(service => service.category === 'core');
        const specializedServices = services.filter(service => service.category === 'specialized');
        const processServices = services.filter(service => service.category === 'process');
        
        // Sort by order
        coreServices.sort((a, b) => (a.order || 0) - (b.order || 0));
        specializedServices.sort((a, b) => (a.order || 0) - (b.order || 0));
        processServices.sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0));
        
        setMainServices(coreServices);
        setAdditionalServices(specializedServices);
        setProcessSteps(processServices);
        
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <FiLoader className="w-8 h-8 animate-spin text-accent-500" />
      <span className="ml-2 text-gray-600">Loading services...</span>
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="text-center py-20">
      <p className="text-red-600 mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-accent-500 text-white rounded hover:bg-accent-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  // Render icon from string
  const renderIcon = (iconName, className = '') => {
    return iconMap[iconName] || <FiSun className={className} />;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header
        className="relative bg-cover bg-center h-64 sm:h-80 md:h-[300px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://zolar.wpengine.com/wp-content/uploads/2025/01/zolar-breadcrumb-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Service</h1>
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-accent-500 transition">
              Home
            </Link>
            <span>—</span>
            <span className="text-accent-500">Service</span>
          </nav>
        </div>
      </header>

      {/* Main Services Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive solar solutions to meet your energy needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {mainServices.map((service, index) => (
              <div 
                key={service._id || index} 
                className={`group relative bg-white rounded-xl p-8 shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 ${service.bgColor || 'bg-accent-50'}`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.color || 'from-accent-400 to-accent-600'}`}></div>
                
                <div className="relative z-10">
                  <div className={`text-4xl mb-6 text-gray-800 transition-all duration-300 ${service.hoverColor || 'group-hover:text-accent-500'}`}>
                    {renderIcon(service.icon, 'w-10 h-10')}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 transition-all duration-300 group-hover:text-gray-800">
                    {service.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-6 transition-all duration-300">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-4">
                    {service.features && service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <FiCheckCircle className={`mt-1 mr-2 transition-all duration-300 ${service.hoverColor || 'group-hover:text-accent-500'}`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <Link to="/contact" className={`inline-flex items-center text-sm font-medium transition-all duration-300 ${service.hoverColor || 'group-hover:text-accent-500'}`}>
                      Learn more <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Services Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Specialized Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your solar experience with our additional specialized services
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {additionalServices.map((service, index) => (
              <div 
                key={service._id || index} 
                className="group bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.color || 'from-accent-400 to-accent-600'} opacity-0 group-hover:opacity-70 transition-opacity duration-500 z-10`}></div>
                  <img
                    src={service.image || 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <span className="text-white text-4xl">{renderIcon(service.icon)}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-yellow-green-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-4 transition-all duration-500">
                    <p className="text-gray-700 text-sm">
                      {service.longDescription || service.description}
                    </p>
                    <Link 
                      to="/contact" 
                      className="mt-4 inline-flex items-center text-sm font-medium text-yellow-green-600 hover:text-yellow-green-700 transition-colors duration-300"
                    >
                      Learn more <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Streamlined Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've perfected our approach to deliver exceptional solar solutions with efficiency and precision
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-green-200 via-yellow-green-400 to-yellow-green-200 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4 relative z-10">
              {processSteps.map((step, index) => (
                <div 
                  key={step._id || index}
                  className="relative"
                >
                  <div className="text-center group cursor-pointer">
                    <div className="relative">
                      <div className="bg-white rounded-full h-28 w-28 flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-yellow-green-100 group-hover:border-yellow-green-400 transition-all duration-300 z-20">
                        <div className="absolute inset-0 bg-yellow-green-50 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                        <span className="text-4xl text-yellow-green-600 relative z-10 group-hover:scale-110 transition-transform duration-300">{renderIcon(step.icon)}</span>
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-green-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-xl border-2 border-white shadow-lg z-30">
                        {step.stepNumber || step.number || index + 1}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-yellow-green-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4 px-4">
                      {step.description}
                    </p>
                    
                    <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 px-4">
                      <p className="text-gray-700 text-sm">
                        {step.longDescription || step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/contact" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2" style={{backgroundColor: '#9fc22e'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#8fb526'} onMouseLeave={(e) => e.target.style.backgroundColor = '#9fc22e'}
            >
              Start Your Solar Journey <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Services;