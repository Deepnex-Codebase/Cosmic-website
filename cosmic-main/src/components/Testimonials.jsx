import React, { useState, useEffect, useRef } from 'react';
import { FaQuoteLeft, FaQuoteRight, FaStar } from 'react-icons/fa';

/* ---------------- TESTIMONIALS DATA ---------------- */
const testimonials = [
  {
    id: 1,
    name: "Rajesh Sharma",
    role: "Factory Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "encompasses information about harnessing the sun's power,\nprimarily through photovoltaic (PV) and\nsolar thermal technologies",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "Homeowner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "The solar installation has significantly reduced\nour monthly electricity bills.\nThe service was professional and efficient.",
    rating: 5
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "School Principal",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "Our school's decision to install solar panels\nhas been both educational and economical.\nStudents now learn about renewable energy firsthand.",
    rating: 4
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Farm Owner',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'My agricultural farm has benefited greatly\nfrom the solar installation. The energy costs\nhave reduced by 60% in the first year alone.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Meera Kapoor',
    role: 'School Principal',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'Our school has transformed its energy usage\nwith the solar panel installation. We now save\non electricity and teach sustainability to our students.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Arjun Mehta',
    role: 'IT Professional',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'The smart home integration with the solar system\nis impressive. I can monitor energy production\nand consumption from my phone anytime.',
    rating: 5,
  },
  {
    id: 7,
    name: 'Neha Gupta',
    role: 'Environmental Consultant',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'As someone passionate about sustainability,\nI am impressed with the quality and efficiency\nof the solar installation provided.',
    rating: 5,
  },
  {
    id: 8,
    name: 'Sanjay Malhotra',
    role: 'Retired Government Officer',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'At my age, I was hesitant about investing in solar,\nbut the returns have been remarkable.\nThe system will pay for itself in just 4 years.',
    rating: 4,
  },
  {
    id: 9,
    name: 'Lakshmi Nair',
    role: 'Restaurant Owner',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'Our restaurant\'s energy costs have decreased significantly\nsince installing solar panels. The investment\nhas been one of our best business decisions.',
    rating: 5,
  },
  {
    id: 10,
    name: 'Rahul Verma',
    role: 'Architect',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'I appreciate the aesthetic integration of solar panels\ninto our building design. They complement\nthe architecture while providing clean energy.',
    rating: 5,
  },
];

const Testimonials = ({ testimonialsData }) => {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Use testimonialsData if provided, otherwise fallback to hardcoded testimonials
  const displayTestimonials = testimonialsData?.testimonials?.length > 0 
    ? testimonialsData.testimonials 
    : testimonials;

  // Calculate dynamic animation distance based on number of testimonials
  const cardWidth = 300;
  const gap = 20;
  const animationDistance = (cardWidth + gap) * displayTestimonials.length;
  const animationDuration = displayTestimonials.length * 3; // 3 seconds per testimonial

  /* ---------------- RENDER STARS ---------------- */
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={`${i < rating ? 'text-[#a3c267]' : 'text-gray-300'} h-4 w-4`} 
      />
    ));
  };
  
  // Manual scrolling function removed as scroll buttons were removed

  return (
    <div className="mt-16 mb-10">
      {/* ---------- title block ---------- */}
      <div className="py-8 pb-0 px-4 text-center">
        <p className="text-gray-600 mb-2 inline-block relative before:content-['—'] before:mr-2 after:content-['—'] after:ml-2 font-['Space_Grotesk'] font-[700]">
          {testimonialsData?.subtitle || 'Client Testimonials'}
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Space_Grotesk']">
          {testimonialsData?.title || 'What Our Clients Say'}
        </h2>
      </div>

      {/* Testimonials Slider */}
      <div className="mt-10 md:mt-16 px-4 md:px-8 lg:px-16">
        <style>
          {`
            .testimonials-slider-container {
              width: 100%;
              overflow-x: auto;
              padding: 20px 0 40px;
              margin: 0 auto;
              scrollbar-width: none; /* Firefox */
              position: relative;
              background-image: radial-gradient(rgba(202, 226, 142, 0.1) 1px, transparent 1px);
              background-size: 20px 20px;
              border-radius: 16px;
            }
            
            /* Add a stylish label to the left side */
            .testimonials-slider-container::before {
              content: 'REVIEWS';
              position: absolute;
              left: 5%;
              top: 50%;
              transform: translateY(-50%);
              writing-mode: vertical-lr;
              transform: translateY(-50%) rotate(180deg);
              font-size: 2.5rem;
              font-weight: 800;
              color: rgba(202, 226, 142, 0.5);
              letter-spacing: 0.5rem;
              pointer-events: none;
              text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
            }
            
            .testimonials-slider-container::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Edge */
            }
            
            .testimonials-slider {
               display: flex;
               gap: 20px;
               padding: 20px 10px;
               animation: testimonialSlideAnimation ${animationDuration}s linear infinite;
               will-change: transform;
               width: fit-content;
             }
             
             /* Add smooth transition when pausing */
             .testimonials-slider.paused {
               animation-play-state: paused;
               transition: transform 0.3s ease;
             }
             
             /* Scroll buttons CSS removed as requested */
            
            @keyframes testimonialSlideAnimation {
               0% {
                transform: translateX(0);
               }
               100% {
                transform: translateX(-${animationDistance}px);
               }
             }
            
            .testimonial-card {
               min-width: 300px;
               flex: 0 0 auto;
               background: white;
               border-radius: 8px;
               box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
               overflow: hidden;
               transition: all 0.4s ease;
               border: 1px solid rgba(202, 226, 142, 0.3);
               position: relative;
               margin-top: 10px;
               margin-bottom: 10px;
               padding: 25px;
               display: flex;
               flex-direction: column;
               justify-content: space-between;
               height: 300px;
             }
             
             .testimonial-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              border-color: rgba(163, 194, 103, 0.5);
            }
            
            .testimonial-card::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 4px;
              background: linear-gradient(90deg, #cae28e, #a3c267);
              transform: scaleX(0);
              transform-origin: right;
              transition: transform 0.4s ease;
            }
            
            .testimonial-card:hover::after {
              transform: scaleX(1);
              transform-origin: left;
            }
          `}
        </style>
        
        <div 
          className="testimonials-slider-container" 
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Scroll buttons removed as requested */}
          
          <div className={`testimonials-slider ${isHovered ? 'paused' : ''}`}>
            {/* Original testimonials */}
            {displayTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="flex items-center mb-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#a3c267] shadow-md mr-3">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="mb-3 flex-grow">
                  <div className="flex">
                    <FaQuoteLeft className="text-[#a3c267] opacity-70 h-4 w-4 mr-2" />
                    <p className="text-gray-700 text-sm italic flex-grow whitespace-pre-line">
                      {testimonial.quote.length > 150 ? `${testimonial.quote.substring(0, 150)}...` : testimonial.quote}
                    </p>
                    <FaQuoteRight className="text-[#a3c267] opacity-70 h-4 w-4 ml-2 self-end" />
                  </div>
                </div>
                
                <div className="flex items-center mt-auto justify-between">
                  <div className="flex">
                    {renderStars(testimonial.rating)}
                  </div>
                  <span className="text-gray-600 text-xs">{testimonial.rating}.0</span>
                </div>
              </div>
            ))}
            

          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/testimonials" 
            className="inline-flex items-center px-5 py-2 bg-[#a3c267] text-black font-semibold rounded-full hover:bg-[#8db327] transition-colors shadow-md hover:shadow-lg group text-sm"
          >
            <span>View All Testimonials</span>
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
        </div>
      </div>
    </div>
  );
};

export default Testimonials;