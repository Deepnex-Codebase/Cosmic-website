import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://api.cosmicpowertech.com';
console.log('DEBUG: Using API_BASE_URL:', API_BASE_URL);
console.log('DEBUG: Using IMAGE_BASE_URL:', IMAGE_BASE_URL);

// Icon mapping for dynamic icon selection
const ICON_MAP = {
  calculator: ChevronRightIcon,
  // Add more icons as needed
};

// Fallback steps in case API call fails
const FALLBACK_STEPS = [
  {
    _id: '1',
    title: 'Site Assessment',
    description: 'We evaluate your property to determine the optimal solar panel placement and system design.',
    image: '/Assessment.jpg',
    order: 1,
    showArrow: true,
    isActive: true
  },
  {
    _id: '2',
    title: 'Agreement',
    description: 'We finalize the agreement with transparent terms and conditions for your solar installation.',
    image: '/Agreement.jpg',
    order: 2,
    showArrow: true,
    isActive: true
  },
  {
    _id: '3',
    title: 'Installation',
    description: 'Our expert team installs your solar system with precision and care for optimal performance.',
    image: '/Installation.jpg',
    order: 3,
    showArrow: true,
    isActive: true
  },
  {
    _id: '4',
    title: 'Activation',
    description: 'We activate your solar system and ensure everything is working perfectly for maximum efficiency.',
    image: '/Activation.jpg',
    order: 4,
    showArrow: false,
    isActive: true
  }
];

const SolarJourney = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stepsRef = useRef([]);

  // Fetch journey data from API
  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        setLoading(true);
        console.log('DEBUG: Fetching solar journey data');
        console.log('DEBUG: API_BASE_URL value:', API_BASE_URL);
        console.log('DEBUG: Full API URL:', `${API_BASE_URL}/cms/solar-journey/active`);
        
        // Add a timeout to ensure we don't hang indefinitely
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        try {
          const response = await axios.get(`${API_BASE_URL}/cms/solar-journey/active`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          console.log('DEBUG: Solar Journey API Response received');
          console.log('DEBUG: Response status:', response.status);
          console.log('DEBUG: Response data:', JSON.stringify(response.data, null, 2));
          
          if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
            console.log('DEBUG: Valid data received, processing steps');
            console.log('DEBUG: Number of steps from API:', response.data.data.length);
            
            // Check if showArrow field exists in the response
            const processedData = response.data.data.map((step, index) => {
              console.log(`DEBUG: Processing step ${index + 1} (${step.title})`);
              // Ensure showArrow is defined (default to true if not specified)
              if (step.showArrow === undefined) {
                console.log(`DEBUG: Setting default showArrow=true for step ${index + 1}`);
                return { ...step, showArrow: true };
              }
              return step;
            });
            
            console.log('DEBUG: Setting steps with processed data');
            setSteps(processedData);
          } else {
            // Fallback to static data if API returns error or empty data
            console.log('DEBUG: API returned error or empty data, using fallback steps');
            console.log('DEBUG: Response data:', response.data);
            setSteps(FALLBACK_STEPS);
            setError('Could not load journey data from server');
          }
        } catch (axiosError) {
          clearTimeout(timeoutId);
          console.error('DEBUG: Axios error:', axiosError.message);
          if (axiosError.response) {
            console.error('DEBUG: Error response:', axiosError.response.data);
            console.error('DEBUG: Error status:', axiosError.response.status);
          }
          throw axiosError;
        }
      } catch (error) {
        console.error('DEBUG: Error fetching solar journey data:', error);
        // Fallback to static data if API call fails
        console.log('DEBUG: Using fallback steps due to error');
        setSteps(FALLBACK_STEPS);
        setError('Could not load journey data from server');
      } finally {
        setLoading(false);
      }
    };

    fetchJourneyData();
  }, []);

  // Setup intersection observer for animation
  useEffect(() => {
    if (!loading && steps.length > 0) {
      // Initialize refs array with the correct length
      stepsRef.current = new Array(steps.length);
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Instead of adding class, we'll make sure the element is visible
              entry.target.style.opacity = '1';
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      // Small delay to ensure refs are populated
      setTimeout(() => {
        stepsRef.current.forEach((el) => {
          if (el) {
            observer.observe(el);
          }
        });
      }, 100);

      return () => {
        stepsRef.current.forEach((el) => {
          if (el) {
            observer.unobserve(el);
          }
        });
      };
    }
  }, [loading, steps]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9fc22f]"></div>
      </div>
    );
  }

  return (
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
        {steps.map((step, index) => {
          // Dynamically select icon based on step.icon or default to ChevronRightIcon
          const IconComponent = step.icon ? ICON_MAP[step.icon] || ChevronRightIcon : ChevronRightIcon;
          
          return (
            <div
              key={step._id}
              ref={(el) => (stepsRef.current[index] = el)}
              className="relative flex flex-col items-center text-center opacity-0 animate-slide-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Display connector arrows between steps based on CMS uploads */}
              {index < steps.length - 1 && steps[index].showArrow !== false && (
                <img
                  src="/arrow.svg"
                  alt="Arrow"
                  style={{ animationDelay: `${(index + 1) * 0.2 + 0.1}s` }}
                  className="absolute right-[-100px] top-[30%] z-10 hidden h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 transform-gpu animate-arrow animate-color-change sm:block lg:h-[80px] lg:w-[80px]"
                />
              )}

              {/* image circle */}
              <div className="relative mb-6 h-44 w-44 overflow-hidden rounded-full shadow-lg transition-transform duration-300 hover:scale-105 animate-border-pulse">
                <span
                  style={{ animationDelay: `${index * 0.2 + 0.1}s` }}
                  className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-[#9fc22f]/20 text-[11px] font-semibold text-black animate-pulse-in z-10"
                >
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <img
                  src={step.image ? (step.image.startsWith('http') ? step.image : `${IMAGE_BASE_URL}${step.image}`) : `/placeholder-step-${index + 1}.jpg`}
                  alt={step.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <h3
                style={{ animationDelay: `${index * 0.2 + 0.25}s` }}
                className="mb-2 text-lg font-semibold opacity-0 animate-fade-up animate-slide-in font-space-grotesk"
              >
                {step.title}
              </h3>
              <p
                style={{ animationDelay: `${index * 0.2 + 0.35}s` }}
                className="mx-auto max-w-xs text-sm text-gray-600 opacity-0 animate-fade-up animate-slide-in"
              >
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA buttons */}
      <div className="mx-auto mt-16 flex max-w-md flex-col items-center justify-center gap-4 px-4 sm:flex-row">
        <Link
          to="/contact"
          className="w-full rounded-md bg-[#9fc22f] px-6 py-3 text-center font-medium text-white shadow-md transition-all hover:bg-[#8aaa28] sm:w-auto"
        >
          Get Started
        </Link>
        <Link
          to="/services"
          className="w-full rounded-md border border-gray-300 bg-white px-6 py-3 text-center font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 sm:w-auto"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default SolarJourney;