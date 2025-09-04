/*  src/pages/Home.jsx  */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getGreenFutureAndNewsCards } from "../services/greenFutureService";
import { getIndustryRecognition, formatImageUrl } from '../services/industryRecognitionService';
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');
// SmartEnergySolutions component removed
import Portfolio from "../components/Portfolio";
import FaqSection from "../components/FaqSection";
// CO2Section and CO2Counter imports removed
import CompanyIntro from "../components/CompanyIntro";
import VideoHero from "../components/VideoHero";
import TimelineSection from "../components/TimelineSection";
import TestimonialVideo from "../components/TestimonialVideo";
import SolarJourney from "../components/SolarJourney";
import { useAppContext } from "../context/AppContext";
import {
  CalculatorIcon,
  ClipboardDocumentCheckIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

// NewsCard Component with Popup functionality
const NewsCard = ({ title, image, logo, date, excerpt, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);
  
  // Debug image URL removed
  
  // API_BASE_URL is no longer needed as we use formatImageUrl
  
  // Use formatImageUrl from industryRecognitionService.js
  const getImageUrl = (url) => {
    if (!url) return '/newsimage.png'; // Default image
    return formatImageUrl(url);
  };
  
  // Use formatImageUrl from industryRecognitionService.js for logos too
  const getLogoUrl = (url) => {
    if (!url) return '/logo.png'; // Default logo
    return formatImageUrl(url);
  };
  
  // Get processed URLs
  const processedImageUrl = getImageUrl(image);
  const processedLogoUrl = getLogoUrl(logo);
  
  return (
    <>
      {/* News Card - Music Player Style */}
       <motion.div 
         className="bg-primary-50 backdrop-blur-sm rounded-lg overflow-hidden border border-primary-100 hover:border-primary-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center h-[70px] w-full px-4"
         initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
       >
          {/* Logo */}
          <div className="bg-primary-100 p-2 rounded-full shadow-sm mr-3 flex-shrink-0">
            <img src={processedLogoUrl} alt="Company Logo" className="w-8 h-8" />
          </div>
          
          {/* Title and Date */}
          <div className="flex-grow overflow-hidden">
            <h3 className="font-semibold text-primary-700 text-sm line-clamp-1">{title}</h3>
            <div className="flex items-center text-primary-500 text-xs mt-0.5">
              <CalendarDaysIcon className="w-3 h-3 mr-1" />
              <span>{date}</span>
            </div>
          </div>
          
          {/* View Button */}
          <button 
            onClick={openPopup}
            className="ml-auto bg-accent-500 hover:bg-accent-600 text-white rounded-full px-5 py-1.5 text-xs font-medium transition-colors flex items-center group"
          >
            <EyeIcon className="w-3.5 h-3.5 mr-1" />
            <span>View</span>
          </button>
       </motion.div>
      
      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-primary-900/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Popup Header */}
            <div className="relative h-72 overflow-hidden">
              <img 
                src={processedImageUrl || "/newsimage.png"} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  // Prevent infinite error loop by checking if already using fallback
                  if (e.target.src !== window.location.origin + "/newsimage.png") {
                    e.target.src = "/newsimage.png";
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-transparent"></div>
              
              {/* Close Button */}
              <button 
                onClick={closePopup}
                className="absolute top-4 right-4 bg-white/90 rounded-full p-1.5 shadow-lg hover:bg-white transition-colors z-10"
              >
                <XMarkIcon className="w-5 h-5 text-primary-700" />
              </button>
              
              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center mb-2">
                  <div className="bg-primary-50 p-1.5 rounded-full shadow-md mr-2 animate-pulse-slow">
                    <img 
                      src={processedLogoUrl || "/logo.png"} 
                      alt="Company Logo" 
                      className="w-5 h-5" 
                      onError={(e) => {
                        // Prevent infinite error loop by checking if already using fallback
                        if (e.target.src !== window.location.origin + "/logo.png") {
                          e.target.src = "/logo.png";
                        }
                      }}
                    />
                  </div>
                  <span className="text-white text-sm font-medium">{date}</span>
                </div>
                <h2 className="text-white text-2xl font-bold drop-shadow-md">{title}</h2>
              </div>
            </div>
            
            {/* Popup Content */}
            <div className="p-6">
              <p className="text-primary-700 leading-relaxed mb-4">{content}</p>
              
              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                <button 
                  onClick={closePopup}
                  className="px-5 py-2.5 border border-primary-200 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                >
                  Close
                </button>
                <button className="px-5 py-2.5 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors flex items-center font-medium group">
                  Read Full Article
                  <ArrowRightIcon className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

const Home = () => {
  // Get data and functions from context
  const { 
    fetchHomepageData, 
    heroSlides,
    energySolutions,
    products,
    projects,
    testimonials,
    teamMembers,
    blogPosts,
    faqs,
    settings,
    loading 
  } = useAppContext();
  
  // Pan India Presence state
  const [panIndiaData, setPanIndiaData] = useState(null);
  const [panIndiaLoading, setPanIndiaLoading] = useState(true);
  
  // Green Future Section state
  const [greenFutureData, setGreenFutureData] = useState(null);
  const [newsCards, setNewsCards] = useState([]);
  const [greenFutureLoading, setGreenFutureLoading] = useState(true);
  
  // Industry Recognition state
  const [industryRecognition, setIndustryRecognition] = useState([]);
  const [industryRecognitionLoading, setIndustryRecognitionLoading] = useState(true);
  
  // Fetch Pan India Presence data
  const fetchPanIndiaData = async () => {
    try {
      setPanIndiaLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
      const response = await fetch(`${API_BASE_URL}/pan-india-presence/active`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPanIndiaData(result.data);
        }
      }
    } catch (error) {
      // Error handling without console.error
    } finally {
      setPanIndiaLoading(false);
    }
  };
  
  // Fetch Green Future data
  const fetchGreenFutureData = async () => {
    try {
      setGreenFutureLoading(true);
      // Fetch Green Future data
      
      // Use the service to fetch both green future and news cards data
      const result = await getGreenFutureAndNewsCards();
      // Process result from getGreenFutureAndNewsCards
      
      const { greenFutureData: greenFutureResult, newsCardsData: newsCardsResult } = result;
      
      // Process Green Future and News Cards results
      
      if (greenFutureResult) {
        // Set Green Future Data
        setGreenFutureData(greenFutureResult);
      } else {
        // No Green Future Data received
      }
      
      if (newsCardsResult && Array.isArray(newsCardsResult) && newsCardsResult.length > 0) {
        // Set News Cards data
        setNewsCards(newsCardsResult);
      } else {
        // No News Cards received or empty array
        // Set default news cards for testing
        setNewsCards([
          {
            _id: 'test1',
            title: 'Test News Card 1',
            image: '/newsimage.png',
            logo: '/logo.png',
            date: 'Today',
            excerpt: 'This is a test news card',
            content: 'This is test content for debugging purposes.'
          },
          {
            _id: 'test2',
            title: 'Test News Card 2',
            image: '/newsimage.png',
            logo: '/logo.png',
            date: 'Yesterday',
            excerpt: 'This is another test news card',
            content: 'This is more test content for debugging purposes.'
          }
        ]);
      }
    } catch (error) {
      // Error handling without console.log
    } finally {
      setGreenFutureLoading(false);
    }
  };
  
  // Fetch Industry Recognition data
  const fetchIndustryRecognitionData = async () => {
    try {
      setIndustryRecognitionLoading(true);
      const data = await getIndustryRecognition();
      setIndustryRecognition(data);
    } catch (error) {
      // Error handling without console.error
    } finally {
      setIndustryRecognitionLoading(false);
    }
  };

  // Fetch homepage data when component mounts
  useEffect(() => {
    fetchHomepageData();
    fetchPanIndiaData();
    fetchGreenFutureData();
    fetchIndustryRecognitionData();
  }, []);

  useEffect(() => {
    // Effect runs when panIndiaData updates
  }, [panIndiaData]);
  
  // Fallback solutions data if API fails
  const fallbackSolutions = [
    {
      title: "Residential",
      description: "Perfect for homes and small properties",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      link: "/products/solar-panels",
    },
    {
      title: "Commercial",
      description: "Ideal for businesses and organizations",
      image:
        "https://images.unsplash.com/photo-1566093097221-ac2335b09e70?auto=format&fit=crop&w=800&q=80",
      link: "/solutions",
    },
    {
      title: "Industrial",
      description: "Large-scale solar power plants",
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      link: "/solutions",
    },
  ];
  
  // Use API data or fallback to static data
  const solutions = energySolutions && energySolutions.length > 0 ? energySolutions : fallbackSolutions;

  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-[-1]"
        style={{
          backgroundImage: 'url("/back_Image.avif")',
          opacity: 0.5,
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div className="flex flex-col w-full">
        {/* ---------- Hero ---------- */}
        <Hero />

        {/* ---------- India Map Section ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <section className="w-full bg-white py-12 sm:py-16 md:py-20 relative overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003e63] mb-4 font-space-grotesk"
                >
                  {panIndiaData?.title || 'Pan India Presence'}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-lg text-gray-600 max-w-3xl mx-auto"
                >
                  {panIndiaData?.description || 'Our growing network spans across India, providing reliable solar solutions to homes and businesses nationwide.'}
                </motion.p>
  
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Map Image */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <img 
                      src={panIndiaData?.mapImage ? 
                        (panIndiaData.mapImage.startsWith('/uploads') ? 
                          `${SERVER_URL}${panIndiaData.mapImage}` : 
                          panIndiaData.mapImage) : 
                        "/mapindea.png"} 
                      alt="Cosmic Energy India Presence Map" 
                      className="w-full h-auto max-w-lg mx-auto shadow-lg rounded-lg"
                    />
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#9fc22f] rounded-full opacity-20 blur-xl"></div>
                    <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#003e63] rounded-full opacity-10 blur-xl"></div>
                  </div>
                </motion.div>
                
                {/* Stats and Info */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  {/* Dynamic Statistics */}
                  {panIndiaData?.stats && panIndiaData.stats.length > 0 ? (
                    panIndiaData.stats
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((stat, index) => (
                        <div 
                          key={index}
                          className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 hover:shadow-lg transition-shadow duration-300"
                          style={{ borderLeftColor: stat.borderColor || '#003e63' }}
                        >
                          <h3 className="text-xl font-bold text-[#003e63] mb-2 font-space-grotesk">{stat.title}</h3>
                          <p className="text-gray-600">{stat.description}</p>
                        </div>
                      ))
                  ) : (
                    // Fallback static data
                    <>
                      <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-[#003e63] hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-[#003e63] mb-2 font-space-grotesk">25+ States</h3>
                        <p className="text-gray-600">Serving customers across more than 25 states with dedicated local support teams.</p>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-[#9fc22f] hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-[#003e63] mb-2 font-space-grotesk">100+ Cities</h3>
                        <p className="text-gray-600">Operating in over 100 cities with installation and maintenance capabilities.</p>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-[#003e63] hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-[#003e63] mb-2 font-space-grotesk">1000+ Projects</h3>
                        <p className="text-gray-600">Successfully completed over 1000 solar installations of various scales nationwide.</p>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </section>
        </div>

        {/* Smart Energy Solutions section removed */}

        {/* ---------- CompanyIntro ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <CompanyIntro />
        </div>

        {/* ---------- Portfolio ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <Portfolio />
        </div>

        {/* ---------- VideoHero ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <VideoHero />
        </div>
        {/* ---------- Timeline ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <TimelineSection />
        </div>
        
        {/* ---------- TestimonialVideo ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <TestimonialVideo />
        </div>

       

        {/* ---------- Green Future Section ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <section className="w-full bg-gray-800 py-12 sm:py-16 md:py-20 relative overflow-hidden">
            {/* Background overlay with gradient and solar panels */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-80"></div>
            <div className="absolute inset-0 z-0">
              <img 
                src={greenFutureData?.backgroundImage || "/solar-panels.jpg"} 
                alt="Green Future Background" 
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            
            <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 items-center px-4 sm:px-6 md:px-6 relative z-10">
              {/* Left Content Column */}
              <div className="order-2 md:order-1 col-span-12 md:col-span-5 px-4 md:px-0 mb-8 md:mb-0">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-[1.8rem] sm:text-[2.2rem] md:text-[3.5rem] font-bold text-white leading-tight sm:leading-snug mb-4 sm:mb-5 font-space-grotesk">
                  {greenFutureData?.title || 'ENABLING A GREEN FUTURE'}
                </motion.h2>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] leading-relaxed text-gray-300 mb-6 sm:mb-8">
                  {greenFutureData?.description || 'Creating climate for change through thought leadership and raising awareness towards solar industry, aiding in realization of Aatmanirbhar and energy-rich India.'}
                </motion.p>

                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = greenFutureData?.buttonLink || '/about'}
                  className="inline-flex items-center gap-1 sm:gap-2 px-6 py-3 sm:px-8 md:px-10 sm:py-3.5 rounded-full bg-white hover:bg-gray-200 text-black font-semibold text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] transition-all duration-300 shadow-lg">
                  {greenFutureData?.buttonText || 'LEARN MORE'}
                </motion.button>
              </div>
              
              {/* Right News Cards Column */}
              <div className="order-1 md:order-2 col-span-12 md:col-span-7 flex justify-center md:justify-end overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative w-full h-full"
                >
                  <div className="flex flex-col space-y-4 w-full py-2" style={{ width: "100%" }}>
                    {greenFutureLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        <p className="text-white mt-2">Loading news...</p>
                      </div>
                    ) : newsCards.length > 0 ? (
                      newsCards.map((card, index) => (
                        <NewsCard 
                          key={card._id || index}
                          title={card.title}
                          image={card.image}
                          logo={card.logo}
                          date={card.date}
                          excerpt={card.excerpt}
                          content={card.content}
                        />
                      ))
                    ) : (
                      // Default news cards if no data from API
                      <>
                        <NewsCard 
                          title="Solar Energy Breakthrough" 
                          image="/newsimage.png"
                          logo="/logo.png"
                          date="June 15, 2023"
                          excerpt="New solar panel technology increases efficiency by 25%, making renewable energy more accessible."
                          content="Researchers have developed a groundbreaking new solar panel technology that increases efficiency by 25% while reducing manufacturing costs. This innovation uses a novel material composition that captures a broader spectrum of light, even in low-light conditions. The development is expected to accelerate the adoption of solar energy across residential and commercial sectors, making renewable energy more accessible and affordable. Industry experts predict this could be a game-changer for regions with less consistent sunlight."
                        />
                        
                        <NewsCard 
                          title="Government Solar Subsidies" 
                          image="/newsimage.jpeg"
                          logo="/logo.png"
                          date="May 28, 2023"
                          excerpt="New government initiative offers substantial subsidies for residential solar installations."
                          content="The Indian government has announced a comprehensive new subsidy program aimed at boosting residential solar adoption. The initiative will cover up to 40% of installation costs for households that switch to solar power. This program is part of the country's broader commitment to increasing renewable energy capacity and achieving energy independence. Officials stated that the subsidies will be available starting next month, with a streamlined application process designed to minimize bureaucratic hurdles. The program aims to add 5GW of residential solar capacity within the next three years."
                        />
                        
                        <NewsCard 
                          title="Corporate Solar Rises" 
                          image="/solar-panels.jpg"
                          logo="/logo.png"
                          date="April 10, 2023"
                          excerpt="Major corporations pledge to power operations with 100% renewable energy by 2025."
                          content="Several major Indian corporations have announced ambitious plans to transition to 100% renewable energy by 2025. The coalition, which includes leaders from manufacturing, technology, and service sectors, will collectively invest over ₹15,000 crores in solar infrastructure. This corporate initiative is expected to create thousands of green jobs while significantly reducing carbon emissions. The companies will implement a combination of rooftop solar installations, solar parks, and power purchase agreements with renewable energy providers to achieve their targets."
                        />
                        
                        <NewsCard 
                          title="Solar Storage Solutions " 
                          image="/quality.jpg"
                          logo="/logo.png"
                          date="March 5, 2023"
                          excerpt="New battery technology extends solar energy storage capacity, solving intermittency challenges."
                          content="A breakthrough in battery technology promises to solve one of solar energy's biggest challenges: storage. The new lithium-silicon batteries offer twice the energy density of conventional lithium-ion batteries at a projected 30% lower cost when mass-produced. This development allows solar energy systems to store excess power more efficiently for use during nighttime or cloudy periods. Early tests show the batteries maintain 90% of their capacity even after 5,000 charge cycles, representing a significant improvement in longevity and reliability for solar storage solutions."
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
        
              {/* ---------- SolarJourney ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <SolarJourney />
        </div>


        {/* ---------- FAQ Section ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <FaqSection />
        </div>

        

        {/* ---------- Solar Solutions ---------- */}
      
        
        {/* ---------- Industry Recognition Section ---------- */}
        <section className="w-full bg-white py-12 mt-8 sm:mt-12 md:mt-16 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003e63] mb-4 font-space-grotesk">Industry Recognition</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">We are recognized by industry leaders for our excellence in solar solutions.</p>
            </div>
            
            <div className="py-4">
              {industryRecognitionLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003e63]"></div>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center">
                  <div className="w-full overflow-hidden">
                    {/* Industry Recognition section */}
                    {industryRecognition && industryRecognition.length > 0 ? (
                      <Marquee className="py-6" pauseOnHover={true}>
                        {industryRecognition.map((recognition, index) => {
                          // Process recognition data to ensure it has the expected structure
                          const logoUrl = recognition.logo || recognition.image;
                          // The logo URL is already formatted in getIndustryRecognition
                          const processedLogoUrl = logoUrl;
                          
                          const processedRecognition = {
                            title: recognition.title || recognition.name || 'Award Title',
                            organization: recognition.organization || recognition.description || 'Organization',
                            logo: processedLogoUrl
                          };
                          
                          // Process recognition item
                          
                          return (
                            <div 
                              key={index}
                              className="flex flex-col items-center justify-center p-6 mx-4 bg-white rounded-xl border border-gray-200 hover:border-[#003e63] transition-all duration-300 shadow-md hover:shadow-lg min-w-[200px]"
                            >
                              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <img 
                                  src={processedRecognition.logo || "/award-icon.svg"} 
                                  alt={processedRecognition.title} 
                                  className="w-10 h-10 object-contain"
                                  onError={(e) => {
                                    // Prevent infinite error loop by checking if already using fallback
                                    if (e.target.src !== window.location.origin + "/award-icon.svg") {
                                      e.target.src = "/award-icon.svg";
                                    }
                                  }}
                                />
                              </div>
                              <h3 className="text-[#003e63] font-semibold text-lg text-center mb-2">{processedRecognition.title}</h3>
                              <p className="text-gray-600 text-center text-sm">{processedRecognition.organization}</p>
                            </div>
                          );
                        })}
                      </Marquee>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No industry recognition data available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
