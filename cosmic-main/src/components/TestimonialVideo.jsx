import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

// Import environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
import { FaQuoteLeft, FaQuoteRight, FaChevronLeft, FaChevronRight, FaUsers, FaProjectDiagram, FaSolarPanel, FaBolt, FaAward, FaGlobe, FaLeaf, FaIndustry } from 'react-icons/fa';

// This component is now repurposed as a Happy Clients section with company stats

// Icon mapping for dynamic icon rendering
const iconMap = {
  FaUsers,
  FaProjectDiagram,
  FaSolarPanel,
  FaBolt,
  FaAward,
  FaGlobe,
  FaLeaf,
  FaIndustry
};

// Legacy testimonials data - kept for reference but not used in the new design
const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'Switching to solar with Cosmic Powertech was the best decision for our home. The installation was quick and professional, and we\'ve seen significant savings on our electricity bills.',
    productImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    productName: 'Residential Solar System',
    discount: '60% OFF',
  },
  {
    id: 2,
    name: 'Rajesh Patel',
    role: 'Business Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'As a business owner, I was looking for sustainable energy solutions. Cosmic Powertech provided an excellent commercial solar setup that has reduced our operational costs significantly.',
    productImage: 'https://images.unsplash.com/photo-1566093097221-ac2335b09e70?auto=format&fit=crop&w=800&q=80',
    productName: 'Commercial Solar System',
    discount: '42% OFF',
  },
  {
    id: 3,
    name: 'Anita Desai',
    role: 'Apartment Resident',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'I was skeptical about installing solar in my apartment, but Cosmic Powertech made it possible with their innovative solutions. The service was impeccable and the results are amazing.',
    productImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    productName: 'Apartment Solar Solution',
    discount: '50% OFF',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Farm Owner',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'My agricultural farm now runs entirely on solar power thanks to Cosmic Powertech. Their team understood our specific needs and delivered a perfect solution.',
    productImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    productName: 'Agricultural Solar System',
    discount: '55% OFF',
  },
  {
    id: 5,
    name: 'Meera Kapoor',
    role: 'School Principal',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'Our school wanted to teach sustainability by example. Cosmic Powertech helped us install a comprehensive solar system that not only powers our campus but also serves as an educational tool for our students.',
    productImage: 'https://images.unsplash.com/photo-1566832512884-a1770ad0993b?auto=format&fit=crop&w=800&q=80',
    productName: 'Educational Institution Setup',
    discount: '48% OFF',
  },
  {
    id: 6,
    name: 'Arjun Mehta',
    role: 'IT Professional',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'The smart home integration with my solar system from Cosmic Powertech is fantastic. I can monitor energy production and consumption right from my phone.',
    productImage: 'https://images.unsplash.com/photo-1526481280690-9c06f8f9d5b1?auto=format&fit=crop&w=800&q=80',
    productName: 'Smart Solar Integration',
    discount: '56% OFF',
  },
];

// Default company stats - will be replaced by API data
const defaultCompanyStats = [
  {
    id: 1,
    value: 30,
    label: 'Years of Experience',
    icon: 'FaUsers',
    color: '#9fc22f',
    suffix: '+',
    animationDelay: 0
  },
  {
    id: 2,
    value: 10000,
    label: 'Successful Projects',
    icon: 'FaProjectDiagram',
    color: 'rgb(28 155 231)',
    suffix: '+',
    animationDelay: 0.2
  },
  {
    id: 3,
    value: 2,
    label: 'Modules Shipped',
    icon: 'FaSolarPanel',
    color: '#9fc22f',
    suffix: 'M+',
    animationDelay: 0.4
  },
  {
    id: 4,
    value: 1.5,
    label: 'PV Modules Manufacturing Capacity',
    icon: 'FaBolt',
    color: 'rgb(28 155 231)',
    suffix: 'GW',
    description: '+2.5 GW Under Development',
    animationDelay: 0.6
  }
];

const TestimonialVideo = () => {
  const [heroSectionData, setHeroSectionData] = useState(null);
  const [companyStats, setCompanyStats] = useState(defaultCompanyStats);
  const [animatedValues, setAnimatedValues] = useState(new Array(defaultCompanyStats.length).fill(0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const companyVideoRef = useRef(null);
  
  // Fetch hero section data from API
  const fetchHeroSectionData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cms/hero-section`);
      if (response.data) {
        setHeroSectionData(response.data);
      }
    } catch (error) {
      console.error('Error fetching hero section data:', error);
      // Use default values if API fails
      setHeroSectionData({
        title: 'At Cosmic Powertech',
        description: '',
        backgroundVideo: '/videos/solar-installation.mp4',
        companyVideo: '/enn.mp4',
        sectionTitle: 'About Cosmic Powertech',
        sectionSubtitle: 'Happy Clients',
        ctaText: 'Learn More About Us',
        ctaLink: '/about'
      });
    }
  };
  
  // Fetch company stats from API
  const fetchCompanyStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cms/company-stats`);
      if (response.data && response.data.length > 0) {
        // Sort by order field
        const sortedStats = response.data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCompanyStats(sortedStats);
        setAnimatedValues(new Array(sortedStats.length).fill(0));
      } else {
        setCompanyStats(defaultCompanyStats);
        setAnimatedValues(new Array(defaultCompanyStats.length).fill(0));
      }
    } catch (error) {
      console.error('Error fetching company stats:', error);
      setCompanyStats(defaultCompanyStats);
      setAnimatedValues(new Array(defaultCompanyStats.length).fill(0));
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchHeroSectionData();
    fetchCompanyStats();
  }, []);
  
  // Handle counter animation
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || hasAnimated || companyStats.length === 0) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isVisible) {
        setHasAnimated(true);
        
        companyStats.forEach((stat, index) => {
          const targetValue = stat.value;
          const duration = 2000; // 2 seconds for animation
          const frameDuration = 1000 / 60; // 60fps
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;
          
          const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentValue = easeOutQuad(progress) * targetValue;
            
            setAnimatedValues(prev => {
              const newValues = [...prev];
              newValues[index] = currentValue;
              return newValues;
            });
            
            if (frame === totalFrames) {
              clearInterval(counter);
            }
          }, frameDuration);
        });
      }
    };
    
    // Easing function for smoother animation
    const easeOutQuad = t => t * (2 - t);
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated, companyStats]);
  
  // Ensure background video is always playing
  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      video.play().catch(error => {
        console.error("Background video play failed:", error);
      });
      
      // Add event listener for when video ends
      const handleVideoEnded = () => {
        video.play();
      };
      
      video.addEventListener('ended', handleVideoEnded);
      
      return () => {
        video.removeEventListener('ended', handleVideoEnded);
      };
    }
  }, []);
  
  // Ensure company video is always playing
  useEffect(() => {
    const video = companyVideoRef.current;
    
    if (video) {
      video.play().catch(error => {
        console.error("Company video play failed:", error);
      });
      
      // Add event listener for when video ends
      const handleVideoEnded = () => {
        video.play();
      };
      
      video.addEventListener('ended', handleVideoEnded);
      
      return () => {
        video.removeEventListener('ended', handleVideoEnded);
      };
    }
  }, []);
  
  return (
    <section ref={sectionRef} className="w-full py-12 bg-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-widest text-[#9fc22f] font-semibold mb-2"
          >
            {heroSectionData?.sectionTitle || 'About Cosmic Powertech'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight font-space-grotesk"
          >
            {heroSectionData?.sectionSubtitle || 'Happy Clients'}
          </motion.h2>
        </div>
        
        <div className="relative">
          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0 opacity-20">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={heroSectionData?.backgroundVideo || '/videos/solar-installation.mp4'} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="relative z-10">
            {/* Company Introduction */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <video 
                    ref={companyVideoRef}
                    src={heroSectionData?.companyVideo || '/enn.mp4'} 
                    alt="Company Introduction" 
                    className="w-full h-auto rounded-lg shadow-md"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </motion.div>
              </div>
              
              <div className="lg:col-span-7 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold text-white font-space-grotesk">{heroSectionData?.title || 'At Cosmic Powertech'}</h3>
                  {heroSectionData?.description && (
                    <p className="text-gray-300">
                      {heroSectionData.description}
                    </p>
                  )}
                  {!heroSectionData?.description && (
                    <p className="text-gray-300">
                      At Cosmic Powertech, we don't just install solar — we empower the future.
Driven by a mission to accelerate the world's transition to clean energy, we specialize in delivering smart, sustainable, and cost-efficient solar solutions across residential, commercial, and industrial sectors.
Our expertise blends cutting-edge technology with proven performance, making us a trusted partner in the journey toward a zero-carbon tomorrow. From rooftop systems to large-scale projects, every solution we offer is designed to maximize savings, reduce emissions, and support long-term sustainability.
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
            
            {/* Stats Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {companyStats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon] || FaUsers;
                return (
                <motion.div
                  key={stat._id || stat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: stat.animationDelay || 0 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-center relative overflow-hidden group border border-gray-700"
                >
                  {/* Background circle decoration */}
                  <div 
                    className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-10 transition-all duration-500 group-hover:scale-125"
                    style={{ backgroundColor: stat.color }}
                  />
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                      style={{ backgroundColor: stat.color }}
                    >
                      <IconComponent size={22} />
                    </div>
                  </div>
                  
                  {/* Counter */}
                  <div className="mb-1 flex items-center justify-center">
                    <h3 className="text-3xl font-bold" style={{ color: stat.color }}>
                      {animatedValues[index] !== undefined ? (
                        stat.suffix && (stat.suffix.includes('M') || stat.suffix.includes('GW'))
                          ? animatedValues[index].toFixed(1) 
                          : Math.round(animatedValues[index])
                      ) : (
                        stat.suffix && (stat.suffix.includes('M') || stat.suffix.includes('GW'))
                          ? stat.value.toFixed(1)
                          : Math.round(stat.value)
                      )}
                    </h3>
                    <span className="text-xl font-bold ml-1" style={{ color: stat.color }}>
                      {stat.suffix}
                    </span>
                  </div>
                  
                  {/* Label */}
                  <p className="text-gray-300 font-medium text-sm">{stat.label}</p>
                  
                  {/* Description (if any) */}
                  {stat.description && (
                    <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                  )}
                  
                  {/* Animated border effect */}
                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                    initial={{ width: '0%', x: '-100%' }}
                    animate={{ 
                      width: '100%', 
                      x: ['-100%', '100%'],
                      transition: { 
                        x: { repeat: Infinity, duration: 2, ease: 'linear' },
                        width: { duration: 0.4 }
                      }
                    }}
                    style={{ backgroundColor: stat.color }}
                  />
                </motion.div>
                );
              })}
            </div>
            
            {/* CTA Button */}
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <a 
                href="/about" 
                className="inline-flex items-center px-5 py-2 bg-[#9fc22f] text-black font-semibold rounded-full hover:bg-[#8db327] transition-colors shadow-md hover:shadow-lg group text-sm"
              >
                <span>Learn More About Us</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default TestimonialVideo;