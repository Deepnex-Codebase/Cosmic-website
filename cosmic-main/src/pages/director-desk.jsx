import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLinkedin, FaTwitter, FaEnvelope, FaQuoteLeft, FaQuoteRight, FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import TeamSection from '../components/TeamSection';
import { directorService } from '../services/api';
import { toast } from 'react-toastify';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Modal component for director's message popup
const MessageModal = ({ isOpen, onClose, director }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 transition-opacity duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900">Message from {director?.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <FaTimesCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="relative text-gray-700 space-y-4">
            <FaQuoteLeft className="text-accent-500/30 h-8 w-8 mb-4" />
            
            {director?.message.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">{paragraph}</p>
            ))}
            
            <FaQuoteRight className="text-accent-500/30 h-8 w-8 ml-auto mt-4" />
          </div>
          
          <div className="mt-8 p-4 bg-primary-600 text-white rounded-lg">
            <h4 className="text-lg font-bold mb-2 flex items-center">
              <span className="mr-2 text-accent-500">Vision</span>
              <span className="h-px flex-grow bg-accent-500/30"></span>
            </h4>
            <p className="italic">"{director?.vision}"</p>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent-500 text-black rounded-md hover:bg-accent-600 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DirectorDesk = () => {
  // State for message modal
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch directors from API
  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        setLoading(true);
        console.log('Fetching directors data...');
        const response = await directorService.getAllDirectors();
        if (response.data && response.data.data) {
          console.log('Directors data received:', response.data.data);
          setDirectors(response.data.data);
        } else {
          console.log('No directors data found, using fallback');
          // Fallback to default directors if API fails
          setDirectors(defaultDirectors);
        }
      } catch (error) {
        console.error('Error fetching directors:', error);
        toast.error('Failed to load directors information');
        // Fallback to default directors if API fails
        setDirectors(defaultDirectors);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDirectors();
    
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(() => {
      fetchDirectors();
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const openModal = (director) => {
    setSelectedDirector(director);
    setIsModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
  };
  
  // Default directors information as fallback
  const defaultDirectors = [
    {
      name: "Alex Morgan",
      position: "Director & Head - Operations",
      image: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg",
      qualification: "MBA (Operations), B.Tech",
      experience: "15+ years in Operations Management",
      message: "As the Director of Operations at Cosmic Solar Tech, I am committed to ensuring operational excellence across all our projects. My focus is on streamlining processes, optimizing resource allocation, and maintaining the highest standards of quality in every installation we undertake.\n\nAt Cosmic Solar Tech, we believe that operational efficiency is the backbone of successful solar implementation. Our team works diligently to create seamless experiences for our clients, from initial consultation to final installation and beyond. We continuously refine our methodologies to stay ahead of industry standards and deliver projects on time and within budget.\n\nI am particularly proud of our track record in handling complex, large-scale solar installations for industrial clients. Our systematic approach to project management has enabled us to tackle challenging projects while maintaining our commitment to quality and customer satisfaction.\n\nI look forward to bringing operational excellence to your solar energy projects and helping you achieve your sustainability goals with confidence and ease.",
      vision: "To establish industry-leading operational standards that make solar energy adoption seamless and efficient for all our clients.",
      socialLinks: [
        { platform: "LinkedIn", url: "https://linkedin.com", icon: FaLinkedin },
        { platform: "Twitter", url: "https://twitter.com", icon: FaTwitter },
        { platform: "Email", url: "mailto:alex@cosmicsolar.com", icon: FaEnvelope },
      ],
    },
    {
      name: "Henry Wilson",
      position: "Director & Head - Quality",
      image: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg",
      qualification: "M.Sc (Quality Management), Six Sigma Black Belt",
      experience: "18+ years in Quality Assurance",
      message: "As the Director of Quality at Cosmic Solar Tech, my primary responsibility is ensuring that every solar solution we deliver meets the highest standards of excellence. Quality is not just a department at our company—it's a mindset that permeates everything we do.\n\nIn the renewable energy sector, quality directly translates to system performance, longevity, and return on investment for our clients. That's why we've implemented rigorous quality control processes at every stage of our operations, from component selection to installation and after-sales service.\n\nOur quality assurance team works closely with suppliers, installation crews, and maintenance personnel to create a seamless quality ecosystem. We continuously monitor industry developments and regulatory changes to ensure our practices remain at the cutting edge.\n\nI am committed to maintaining Cosmic Solar Tech's reputation for reliability and excellence in the solar industry, and I look forward to demonstrating our quality commitment on your next project.",
      vision: "To set new benchmarks for quality in the solar industry through rigorous standards, continuous improvement, and unwavering attention to detail.",
      socialLinks: [
        { platform: "LinkedIn", url: "https://linkedin.com", icon: FaLinkedin },
        { platform: "Twitter", url: "https://twitter.com", icon: FaTwitter },
        { platform: "Email", url: "mailto:henry@cosmicsolar.com", icon: FaEnvelope },
      ],
    },
    {
      name: "James Peterson",
      position: "Director & Head - Production",
      image: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg",
      qualification: "M.Tech (Manufacturing), PMP Certified",
      experience: "16+ years in Production Management",
      message: "As the Director of Production at Cosmic Solar Tech, I oversee the critical processes that transform innovative designs into functional solar energy systems. My team is responsible for ensuring that every component meets our exacting specifications and that our installation teams have everything they need to deliver exceptional results.\n\nProduction excellence in the solar industry requires a delicate balance of precision engineering, quality control, and efficient logistics. At Cosmic Solar Tech, we've developed sophisticated production methodologies that allow us to scale our operations while maintaining the highest standards of quality and reliability.\n\nI take particular pride in our ability to customize production processes for unique project requirements. Whether we're working on residential rooftop installations or large-scale commercial projects, our production team adapts to ensure optimal outcomes.\n\nI am excited about the continuous advancements in solar technology and look forward to incorporating these innovations into our production processes to deliver even greater value to our clients.",
      vision: "To create the most efficient and adaptable production systems in the solar industry, capable of delivering customized solutions with consistent quality and reliability.",
      socialLinks: [
        { platform: "LinkedIn", url: "https://linkedin.com", icon: FaLinkedin },
        { platform: "Twitter", url: "https://twitter.com", icon: FaTwitter },
        { platform: "Email", url: "mailto:james@cosmicsolar.com", icon: FaEnvelope },
      ],
    },
  ];

  return (
    <div className="min-h-screen font-['Space_Grotesk']">
      {/* Message Modal */}
      <MessageModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        director={selectedDirector} 
      />
      
      {/* HERO SECTION */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="relative h-64 sm:h-80 md:h-[800px] flex items-center justify-center overflow-hidden"
      >
        <video 
          className="absolute inset-0 w-full h-full object-cover" 
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src="/directordesk.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Director's Desk</h1>
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-accent-500 transition">
              Home
            </Link>
            <span>—</span>
            <Link to="/about" className="hover:text-accent-500 transition">
              About
            </Link>
            <span>—</span>
            <span className="text-accent-500">Director's Desk</span>
          </nav>
        </div>
      </motion.header>

      {/* DIRECTORS PROFILES SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold relative inline-block">
              <span className="relative z-10">Our Directors</span>
              <span className="absolute bottom-0 left-0 h-3 w-full bg-accent-500/40 -z-0"></span>
            </h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
            </div>
          ) : directors.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No directors information available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {directors.map((director, index) => (
                <motion.div
                  key={director.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUpVariant}
                  className="flex flex-col md:flex-row gap-8 items-center"
                >
                  {/* Director Image - Prominent */}
                  <div className={`relative w-full md:w-1/3 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                    <div className="relative overflow-hidden rounded-lg shadow-xl h-[550px]" >
                      <img
                        src={director.image}
                        alt={director.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-0 right-0 bg-accent-500 p-2 rounded-bl-lg">
                        <img
                          src="/logo.png"
                          alt="Company Logo"
                          className="h-6 w-auto"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Director Info with Short Message */}
                  <div className={`w-full md:w-2/3 ${index % 2 !== 0 ? 'md:order-1 md:text-right' : ''}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{director.name}</h3>
                    <p className="text-accent-500 font-semibold text-lg mb-4">{director.position}</p>
                    
                    {/* Short Message Preview - Larger size with better styling */}
                    <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-accent-500 mb-6 shadow-sm relative min-h-[200px]">
                      <FaQuoteLeft className="text-accent-500/30 text-4xl absolute top-3 left-3" />
                      <p className="text-gray-700 leading-relaxed text-base italic pl-8 pt-2 whitespace-pre-line">
                        {director.message?.split('\n').slice(0, 6).join('\n')}
                      </p>
                      <FaQuoteRight className="text-accent-500/30 text-2xl absolute bottom-3 right-3" />
                    </div>
                     
                    <div className={`flex ${index % 2 !== 0 ? 'justify-end' : 'justify-start'} gap-4`}>
                      {/* Message Button */}
                      <button
                        onClick={() => openModal(director)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-accent-500 text-black font-medium rounded-md hover:bg-accent-600 transition-colors duration-300"
                      >
                        <FaMessage className="h-4 w-4" />
                        <span>Read Full Message</span>
                      </button>
                      
                      {/* Social Media Links */}
                      {director.socialLinks?.map((link, i) => {
                        let Icon;
                        let iconColor;
                        let linkText;
                        
                        switch(link.platform) {
                          case 'LinkedIn':
                            Icon = FaLinkedin;
                            iconColor = 'text-blue-600';
                            linkText = 'LinkedIn';
                            break;
                          case 'Twitter':
                            Icon = FaTwitter;
                            iconColor = 'text-blue-400';
                            linkText = 'Twitter';
                            break;
                          case 'Email':
                            Icon = FaEnvelope;
                            iconColor = 'text-gray-600';
                            linkText = 'Email';
                            break;
                          case 'Facebook':
                            Icon = FaFacebook;
                            iconColor = 'text-blue-800';
                            linkText = 'Facebook';
                            break;
                          case 'Instagram':
                            Icon = FaInstagram;
                            iconColor = 'text-pink-600';
                            linkText = 'Instagram';
                            break;
                          default:
                            return null;
                        }
                        
                        return (
                          <a 
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition-colors duration-300"
                          >
                            <Icon className={`h-4 w-4 ${iconColor}`} />
                            <span>{linkText}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TEAM SECTION */}
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <TeamSection />
      </motion.div>

      {/* CTA SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-600 text-white"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us in Our Solar Mission</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Whether you're looking to power your home, business, or join our team, we invite you to be part of our journey towards a sustainable future.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="group relative overflow-hidden inline-flex items-center px-8 py-4 rounded-full bg-accent-500 text-black font-semibold shadow-lg border-2 border-transparent hover:border-accent-500 transition-all duration-300"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Contact Us</span>
              <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
            </Link>
            <Link
              to="/careers"
              className="group relative overflow-hidden inline-flex items-center px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:border-accent-500 transition-all duration-300"
            >
              <span className="relative z-10 transition-colors duration-300">Join Our Team</span>
              <span className="absolute inset-0 bg-accent-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default DirectorDesk;