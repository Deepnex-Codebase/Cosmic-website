/*  src/pages/Home.jsx  */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Hero from "../components/Hero";
// SmartEnergySolutions component removed
import Portfolio from "../components/Portfolio";
import SolarJourney from "../components/SolarJourney";
import FaqSection from "../components/FaqSection";
// CO2Section and CO2Counter imports removed
import CompanyIntro from "../components/CompanyIntro";
import VideoHero from "../components/VideoHero";
import TimelineSection from "../components/TimelineSection";
import TestimonialVideo from "../components/TestimonialVideo";
import Marquee from "../components/Marquee";
import { useAppContext } from "../context/AppContext";

// Import necessary icons for static SolarJourney component
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
            <img src={logo} alt="Company Logo" className="w-8 h-8" />
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
                src={image} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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
                    <img src={logo} alt="Company Logo" className="w-5 h-5" />
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
  
  // Fetch Pan India Presence data
  const fetchPanIndiaData = async () => {
    try {
      setPanIndiaLoading(true);
      const response = await fetch('/api/pan-india-presence/active');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPanIndiaData(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching Pan India data:', error);
    } finally {
      setPanIndiaLoading(false);
    }
  };
  
  // Fetch Green Future data
  const fetchGreenFutureData = async () => {
    try {
      setGreenFutureLoading(true);
      const [greenFutureResponse, newsCardsResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/cms/green-future'),
        axios.get('http://localhost:8000/api/cms/news-cards/active')
      ]);
      
      if (greenFutureResponse.data) {
        setGreenFutureData(greenFutureResponse.data);
      }
      
      if (newsCardsResponse.data) {
        setNewsCards(newsCardsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching Green Future data:', error);
    } finally {
      setGreenFutureLoading(false);
    }
  };
  
  // Fetch homepage data when component mounts
  useEffect(() => {
    console.log('Home component mounted, fetching data...');
    fetchHomepageData();
    fetchPanIndiaData();
    fetchGreenFutureData();
  }, []);

  useEffect(() => {
    console.log('Pan India Data updated:', panIndiaData);
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
                      src={panIndiaData?.mapImage || "/mapindea.png"} 
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
          {/* Static SolarJourney */}
          <section className="relative overflow-hidden bg-[#f8f9fa] py-24">
            {/* ───────────────── heading */}
            <div className="mx-auto mb-20 max-w-7xl px-4 text-center">
              <p className="mb-3 text-sm uppercase tracking-wider text-gray-600 font-space-grotesk">
                —⚡ End-To-End Services ⚡—
              </p>
              <h2 className="text-4xl font-extrabold text-black sm:text-5xl font-space-grotesk">
                The Solar Journey
              </h2>
            </div>

            {/* ───────────────── steps grid */}
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Step 1 */}
              <div
                className="relative flex flex-col items-center text-center opacity-0 animate-slide-in"
                style={{ animationDelay: '0s' }}
              >
                {/* connector arrow */}
                <img
                  src="/arrow.svg"
                  alt="Arrow"
                  style={{ animationDelay: '0.3s' }}
                  className="absolute left-[87%] top-[20%] z-10 hidden h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 transform-gpu animate-arrow animate-color-gradient sm:block lg:h-[80px] lg:w-[80px]"
                />

                {/* image circle */}
                <div className="relative mb-6 h-44 w-44 overflow-hidden rounded-full shadow-lg transition-transform duration-300 hover:scale-105 animate-border-pulse">
                  <span
                    style={{ animationDelay: '0.3s' }}
                    className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-[#9fc22f]/20 text-[11px] font-semibold text-black animate-pulse-in z-10"
                  >
                    01
                  </span>
                  <img
                    src="/Assessment.jpg"
                    alt="Site Assessment"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <h3
                  style={{ animationDelay: '0.45s' }}
                  className="mb-2 text-lg font-semibold opacity-0 animate-fade-up font-space-grotesk"
                >
                  Site Assessment
                </h3>
                <p
                  style={{ animationDelay: '0.55s' }}
                  className="mx-auto max-w-xs text-sm text-gray-600 opacity-0 animate-fade-up"
                >
                  We evaluate your property to determine the optimal solar panel placement and system design.
                </p>
              </div>

              {/* Step 2 */}
              <div
                className="relative flex flex-col items-center text-center opacity-0 animate-slide-in"
                style={{ animationDelay: '0.2s' }}
              >
                {/* connector arrow */}
                <img
                  src="/arrow.svg"
                  alt="Arrow"
                  style={{ animationDelay: '0.5s' }}
                  className="absolute left-[87%] top-[20%] z-10 hidden h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 transform-gpu animate-arrow animate-color-gradient sm:block lg:h-[80px] lg:w-[80px]"
                />

                {/* image circle */}
                <div className="relative mb-6 h-44 w-44 overflow-hidden rounded-full shadow-lg transition-transform duration-300 hover:scale-105 animate-border-pulse">
                  <span
                    style={{ animationDelay: '0.5s' }}
                    className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-[#9fc22f]/20 text-[11px] font-semibold text-black animate-pulse-in z-10"
                  >
                    02
                  </span>
                  <img
                    src="/Agreement.jpg"
                    alt="Agreement"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <h3
                  style={{ animationDelay: '0.65s' }}
                  className="mb-2 text-lg font-semibold opacity-0 animate-fade-up font-space-grotesk"
                >
                  Agreement
                </h3>
                <p
                  style={{ animationDelay: '0.75s' }}
                  className="mx-auto max-w-xs text-sm text-gray-600 opacity-0 animate-fade-up"
                >
                  We provide a detailed proposal and agreement outlining system specifications and costs.
                </p>
              </div>

              {/* Step 3 */}
              <div
                className="relative flex flex-col items-center text-center opacity-0 animate-slide-in"
                style={{ animationDelay: '0.4s' }}
              >
                {/* connector arrow */}
                <img
                  src="/arrow.svg"
                  alt="Arrow"
                  style={{ animationDelay: '0.7s' }}
                  className="absolute left-[87%] top-[20%] z-10 hidden h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 transform-gpu animate-arrow animate-color-gradient sm:block lg:h-[80px] lg:w-[80px]"
                />

                {/* image circle */}
                <div className="relative mb-6 h-44 w-44 overflow-hidden rounded-full shadow-lg transition-transform duration-300 hover:scale-105 animate-border-pulse">
                  <span
                    style={{ animationDelay: '0.7s' }}
                    className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-[#9fc22f]/20 text-[11px] font-semibold text-black animate-pulse-in z-10"
                  >
                    03
                  </span>
                  <img
                    src="/installation2.jpg"
                    alt="Installation"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <h3
                  style={{ animationDelay: '0.85s' }}
                  className="mb-2 text-lg font-semibold opacity-0 animate-fade-up font-space-grotesk"
                >
                  Installation
                </h3>
                <p
                  style={{ animationDelay: '0.95s' }}
                  className="mx-auto max-w-xs text-sm text-gray-600 opacity-0 animate-fade-up"
                >
                  Our expert team installs your solar system with minimal disruption to your property.
                </p>
              </div>

              {/* Step 4 */}
              <div
                className="relative flex flex-col items-center text-center opacity-0 animate-slide-in"
                style={{ animationDelay: '0.6s' }}
              >
                {/* image circle */}
                <div className="relative mb-6 h-44 w-44 overflow-hidden rounded-full shadow-lg transition-transform duration-300 hover:scale-105 animate-border-pulse">
                  <span
                    style={{ animationDelay: '0.9s' }}
                    className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-[#9fc22f]/20 text-[11px] font-semibold text-black animate-pulse-in z-10"
                  >
                    04
                  </span>
                  <img
                    src="/quality1.jpg"
                    alt="Quality Assurance"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <h3
                  style={{ animationDelay: '1.05s' }}
                  className="mb-2 text-lg font-semibold opacity-0 animate-fade-up font-space-grotesk"
                >
                  Quality Assurance
                </h3>
                <p
                  style={{ animationDelay: '1.15s' }}
                  className="mx-auto max-w-xs text-sm text-gray-600 opacity-0 animate-fade-up"
                >
                  We conduct thorough testing and quality checks to ensure your system performs optimally.
                </p>
              </div>
            </div>

            {/* ───────────────── CTA buttons */}
            <div className="mx-auto mt-16 flex max-w-4xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-center">
              <Link
                 to="/services"
                 style={{ animationDelay: "0.8s" }}
                 className="group relative overflow-hidden w-full animate-fade-up rounded-full bg-[#9fc22f] px-8 py-3 text-sm font-semibold text-black shadow-md border-2 border-transparent hover:border-[#9fc22f] transition-all duration-300 sm:w-auto"
               >
                 <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Explore All Services</span>
                 <span className="absolute inset-0 bg-[#003e63] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
               </Link>
              <a
                href="tel:+652582355889"
                style={{ animationDelay: "1s" }}
                className="group flex w-full animate-fade-up items-center justify-center rounded-full border border-black px-8 py-3 text-sm font-semibold text-black shadow-sm transition hover:-translate-y-0.5 hover:bg-black/5 sm:w-auto"
              >
                Talk To Us
                <span className="ml-2 text-xs font-medium group-hover:underline">
                  (+65) 258 235 5889
                </span>
              </a>
            </div>

            {/* ───────────────── keyframes */}
            <style>{`
              @keyframes slide-in{0%{opacity:0;transform:translateX(-20px)}100%{opacity:1;transform:translateX(0)}}
              @keyframes fade-up{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
              @keyframes pulse-in{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
              @keyframes arrow-move{0%,100%{transform:translateX(0)}50%{transform:translateX(15px)}}
              @keyframes arrow-hue{0%{filter:hue-rotate(0deg)}50%{filter:hue-rotate(-45deg)}100%{filter:hue-rotate(0deg)}}
              @keyframes color-change{0%{filter:brightness(1) sepia(0.3) hue-rotate(70deg) saturate(1.5)}25%{filter:brightness(1.2) sepia(0.4) hue-rotate(80deg) saturate(1.7)}50%{filter:brightness(1.1) sepia(0.5) hue-rotate(90deg) saturate(1.9)}75%{filter:brightness(1.2) sepia(0.4) hue-rotate(80deg) saturate(1.7)}100%{filter:brightness(1) sepia(0.3) hue-rotate(70deg) saturate(1.5)}}
              @keyframes border-pulse{0%{box-shadow:0 0 0 0 rgba(159, 194, 47, 0.6)}50%{box-shadow:0 0 0 8px rgba(159, 194, 47, 0.2)}100%{box-shadow:0 0 0 0 rgba(159, 194, 47, 0)}}

              .animate-slide-in{animation:slide-in .6s cubic-bezier(.33,.99,.58,1) forwards}
              .animate-fade-up{animation:fade-up .5s ease-out forwards}
              .animate-pulse-in{animation:pulse-in 1.5s ease-in-out infinite}
              .animate-arrow{animation:arrow-move 1.6s ease-in-out infinite}
              .animate-color-change{animation:color-change 3s linear infinite}
              .animate-border-pulse{animation:border-pulse 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite}
            `}</style>
          </section>
        </div>


        {/* ---------- FAQ Section ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <FaqSection />
        </div>

        

        {/* ---------- Solar Solutions ---------- */}
      
        
        {/* ---------- Marquee Section ---------- */}
        <section className="w-full bg-white py-12 mt-8 sm:mt-12 md:mt-16 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003e63] mb-4 font-space-grotesk">Our Clients</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">We collaborate with industry leaders to bring you the most advanced solar solutions.</p>
            </div>
            
            <div className="py-4">
              <Marquee className="py-4" pauseOnHover={true}>
                <div className="flex flex-col items-center justify-center mx-4 h-48 w-64 bg-white px-6 py-8 rounded-xl border border-gray-200 hover:border-[#003e63] transition-all duration-300 shadow-md">
                  <img src="/kia.png" alt="Kia Motors Logo" className="h-16 w-auto mb-4" />
                  <span className="text-[#003e63] font-semibold text-lg">Kia Motors</span>
                </div>
                <div className="flex flex-col items-center justify-center mx-4 h-48 w-64 bg-white px-6 py-8 rounded-xl border border-gray-200 hover:border-[#003e63] transition-all duration-300 shadow-md">
                  <img src="/mahavir.webp" alt="Mahavir Hospital Logo" className="h-16 w-auto mb-4" />
                  <span className="text-[#003e63] font-semibold text-lg">Mahavir Hospital</span>
                </div>
                <div className="flex flex-col items-center justify-center mx-4 h-48 w-64 bg-white px-6 py-8 rounded-xl border border-gray-200 hover:border-[#003e63] transition-all duration-300 shadow-md">
                  <img src="/bharatpetrlium1.jpg" alt="Bharat Petroleum Logo" className="h-16 w-auto mb-4" />
                  <span className="text-[#003e63] font-semibold text-lg">Bharat Petroleum</span>
                </div>
                <div className="flex flex-col items-center justify-center mx-4 h-48 w-64 bg-white px-6 py-8 rounded-xl border border-gray-200 hover:border-[#003e63] transition-all duration-300 shadow-md">
                  <img src="/logo.png" alt="Kabeer Taxation Logo" className="h-16 w-auto mb-4" />
                  <span className="text-[#003e63] font-semibold text-lg">Kabeer Taxation</span>
                </div>
                <div className="flex flex-col items-center justify-center mx-4 h-48 w-64 bg-white px-6 py-8 rounded-xl border border-gray-200 hover:border-[#003e63] transition-all duration-300 shadow-md">
                  <img src="/logo.png" alt="Bhageerath Logo" className="h-16 w-auto mb-4" />
                  <span className="text-[#003e63] font-semibold text-lg">Bhageerath</span>
                </div>
              </Marquee>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
