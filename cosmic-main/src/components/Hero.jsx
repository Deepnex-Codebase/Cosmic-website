import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as FiIcons from 'react-icons/fi';
import * as HiIcons from 'react-icons/hi';
import * as IoIcons from 'react-icons/io5';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import * as TbIcons from 'react-icons/tb';
import * as GiIcons from 'react-icons/gi';
import * as GoIcons from 'react-icons/go';

// Icon mapping function
const getIconComponent = (iconName) => {
  if (!iconName) return null;
  
  const iconLibraries = {
    Fa: FaIcons,
    Ai: AiIcons,
    Bi: BiIcons,
    Bs: BsIcons,
    Fi: FiIcons,
    Hi: HiIcons,
    Io: IoIcons,
    Md: MdIcons,
    Ri: RiIcons,
    Tb: TbIcons,
    Gi: GiIcons,
    Go: GoIcons,
  };
  
  // Extract library prefix (e.g., "Fa" from "FaSun")
  const libraryPrefix = iconName.substring(0, 2);
  const library = iconLibraries[libraryPrefix];
  
  if (library && library[iconName]) {
    return library[iconName];
  }
  
  return null;
};

// Fallback slides if API fails
const FALLBACK_SLIDES = [
  {
    key: 'smart',
    num: '01',
    railTitle: 'What Is Cosmic\nPowertech',
    subtitle: 'Eco-Friendly Energy',
    title: ['Powering A Greener', 'Future With Solar'],
    body: 'Elit himenaeos risus blandit; sociosqu nulla suspendisse. Dignissim urna dapibus mollis efficitur pharetra varius congue.',
    img: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/zolar-h1-slider-img-alt.jpg',
    icon: 'FaSolarPanel',
  },
  {
    key: 'advanced',
    num: '02',
    railTitle: 'Projects\nOverviews',
    subtitle: 'Intelligent Solution',
    title: ['Next-Gen Solar', 'For Your Home!'],
    body: 'Ante orci diam semper cursus magna sem scelerisque. Amet ligula maximus nam ad class vulputate felis enim.',
    img: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/home1-1-01.jpg',
    icon: 'FaBolt',
  },
  {
    key: 'unlimited',
    num: '03',
    railTitle: 'Customise\nSolutions',
    subtitle: 'Cleaner Future',
    title: ['Powering A Greener', 'Future With Solar'],
    body: 'Hendrerit volutpat sectetur metus volutpat memmasse.',
    img: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/home1-1-02.jpg',
    icon: 'FaSun',
  },
];

// —— Animation variants ——
const bgVariant = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.8 } },
}

const textVariant = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.6, ease: 'easeIn' } },
}

export default function Hero() {
  const { heroSlides, loading } = useAppContext();
  const [active, setActive] = useState(0);
  
  // Process slides to construct image URLs
  const slides = useMemo(() => {
    // Debug log for hero slides
    console.log('Hero slides from context:', heroSlides);
    
    if (!heroSlides || heroSlides.length === 0) {
      console.log('Using fallback slides');
      return FALLBACK_SLIDES;
    }
    
    const processedSlides = heroSlides.map((slide, index) => {
      // Check if img is a relative path and needs to be fixed
      let imgUrl = slide.img;
      if (imgUrl && imgUrl.startsWith('/uploads/')) {
        // If it's a relative path from backend, ensure it's properly handled
        // The backend now provides fullUrl for media, but we handle both cases
        imgUrl = slide.fullUrl || `${window.location.origin}${imgUrl}`;
      }
      
      return {
        key: slide.key || `slide-${index}`,
        num: slide.num || `0${index + 1}`,
        railTitle: slide.railTitle || 'Solar Energy',
        subtitle: slide.subtitle || 'Eco-Friendly Energy',
        title: Array.isArray(slide.title) ? slide.title : ['Powering A Greener', 'Future With Solar'],
        body: slide.body || 'Clean energy solutions for a sustainable future.',
        img: imgUrl || 'https://zolar.wpengine.com/wp-content/uploads/2024/08/zolar-h1-slider-img-alt.jpg',
        icon: slide.icon || FALLBACK_SLIDES[index % FALLBACK_SLIDES.length].icon
      };
    });
    
    console.log('Processed slides:', processedSlides);
    console.log('Slides count:', processedSlides.length);
    console.log('Using fallback?', false);
    
    return processedSlides;
  }, [heroSlides]);
    
  // Debug log to check slides data
  console.log('Hero component - slides data:', {
    heroSlidesFromContext: heroSlides,
    processedSlides: slides,
    slidesCount: slides.length,
    usingFallback: !heroSlides || heroSlides.length === 0
  });
  
  // Set active slide to first one when slides change
  useEffect(() => {
    if (slides && slides.length > 0) {
      console.log('Slides changed, setting active to first slide');
      setActive(0);
    }
  }, [slides]);
  
  // Auto slide functionality
  useEffect(() => {
    console.log('Setting up auto slide interval with slides:', slides.length);
    console.log('Current slides data:', slides);
    
    // Only set up interval if we have more than one slide
    if (slides && slides.length > 1) {
      console.log('Starting auto-slide interval');
      const interval = setInterval(() => {
        console.log('Auto slide triggered, current active:', active);
        setActive((current) => {
          // Simplified calculation for next slide index
          const nextIndex = (typeof current === 'number' ? current : slides.findIndex(s => s.key === current)) + 1;
          const nextActive = nextIndex % slides.length;
          console.log('Setting next active slide to:', nextActive);
          return nextActive;
        });
      }, 5000); // Change slide every 5 seconds
      
      return () => {
        console.log('Clearing auto slide interval');
        clearInterval(interval);
      };
    } else {
      console.log('Not setting up auto-slide interval - fewer than 2 slides');
      console.log('IMPORTANT: Check if you have at least 2 active hero slides in the database');
      console.log('If using fallback slides, check FALLBACK_SLIDES array:', FALLBACK_SLIDES.length);
    }
  }, [slides]); // Removed active as dependency to prevent interval recreation on every slide change
  
  // Get current slide
  const slide = typeof active === 'number' 
    ? slides[active] 
    : slides.find((s) => s.key === active) ?? slides[0]

  // Log current slide for debugging
  useEffect(() => {
    console.log('Current active slide:', slide);
  }, [slide]);

  return (
    <section className="relative bg-black h-[650px] sm:h-[750px] lg:h-screen overflow-hidden">
      {/* BACKGROUND CROSS-FADE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.key}
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${slide.img})` }}
          variants={bgVariant}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-[#142334]/80" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center pb-16 md:pb-24">
              {/* left rail ****************************************************** */}
        <aside className="hidden md:flex flex-col w-72">
          {slides.map((s, index) => {
            const activeItem = typeof active === 'number' ? index === active : s.key === active;
            return (
              <button
                key={s.key}
                onClick={() => setActive(index)}
                className="group relative flex items-start py-8 focus:outline-none"
              >
                {/* icon circle */}
                <span
                  className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center transition ms-5 ${activeItem ? 'bg-transparent' : 'bg-transparent'}`}
                >
                  {(() => {
                    if (typeof s.icon === 'string') {
                      // Try to get react-icon component first
                      const IconComponent = getIconComponent(s.icon);
                      if (IconComponent) {
                        return (
                          <IconComponent 
                            className={`h-12 w-12 ${
                              activeItem ? 'text-accent-500' : 'text-white'
                            }`}
                          />
                        );
                      }
                      // Fallback to SVG string
                      return (
                        <span 
                          className={`h-12 w-12 ${
                            activeItem ? 'text-accent-500' : 'text-white'
                          }`}
                          dangerouslySetInnerHTML={{ __html: s.icon }}
                        />
                      );
                    }
                    // Fallback to JSX icon
                    return (
                      <svg
                        className={`h-12 w-12 stroke-current ${
                          activeItem ? 'text-accent-500' : 'text-white'
                        }`}
                        fill="none"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        {s.icon}
                      </svg>
                    );
                  })()}
                </span>


                {/* text */}
                <span className="ml-6">
                  {s.railTitle.split('\n').map(line => (
                    <span
                      key={line}
                      className={`block font-medium leading-snug font-space-grotesk ${
                        activeItem ? 'text-accent-500' : 'text-white'
                      }`}
                    >
                      {line}
                    </span>
                  ))}
                </span>


                {/* divider + number */}
                <span
                  className={`absolute left-0 -bottom-2 w-full h-px ${
                    activeItem ? 'bg-accent-500' : 'bg-white/40'
                  }`}
                />
                <span
                  className={`absolute -right-6 top-1/2 -translate-y-1/2 text-xl font-bold ${
                    activeItem ? 'text-accent-500 scale-125 transition-transform duration-300' : 'text-white/70'
                  }`}
                >
                  {s.num}
                </span>
              </button>
            );
          })}
        </aside>
        {/* MOBILE CONTROLS */}
        <div className="flex md:hidden justify-center w-full absolute bottom-4 z-30 px-4">
          <div className="flex space-x-4 bg-black/30 rounded-full p-2">
            {slides.map((s, index) => {
              const isActive = typeof active === 'number' 
                ? active === index 
                : s.key === active;
              return (
                <motion.button
                  key={s.key}
                  onClick={() => setActive(index)}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`p-2 rounded-full ${
                    isActive
                      ? 'bg-accent-500 text-black'
                      : 'bg-primary-600/50 text-white'
                  }`}
                >
                  <span className="text-xs font-bold">{s.num}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* CENTER TEXT & CTA */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4 max-w-3xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.key}
              variants={textVariant}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <p className="text-accent-500 tracking-wider text-sm md:text-lg mb-4 font-space-grotesk">
                — ✷ {slide.subtitle} ✷ —
              </p>
              <h1 className="font-bold text-white text-4xl md:text-6xl lg:text-[80px] leading-tight mb-6 font-space-grotesk">
                {slide.title[0]}<br />
                {slide.title[1]}
              </h1>
              <p className="text-white/80 text-base md:text-xl mb-8 px-2">
                {slide.body}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">  
                <Link
                  to="/advanced-calculator"
                  className="group relative overflow-hidden inline-flex items-center pl-5 sm:pl-8 md:pl-10 pr-4 sm:pr-5 md:pr-6 py-2 sm:py-3 md:py-3 bg-accent-500 text-gray-900 rounded-full font-semibold shadow-lg text-sm sm:text-base md:text-lg border-2 border-transparent hover:border-accent-500 transition-all duration-300"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Try Advanced Calculator</span>
                  <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                  <span className="ml-3 sm:ml-4 md:ml-5 flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-primary-600 group-hover:bg-accent-500 transition-all duration-300 relative z-10">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 stroke-white group-hover:stroke-black transition-all duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
                
                <Link
                  to="/contact"
                  className="group relative overflow-hidden inline-flex items-center pl-5 sm:pl-8 md:pl-10 pr-4 sm:pr-5 md:pr-6 py-2 sm:py-3 md:py-3 bg-transparent text-white rounded-full font-semibold shadow-lg text-sm sm:text-base md:text-lg border-2 border-white hover:border-accent-500 transition-all duration-300"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Discover More</span>
                  <span className="absolute inset-0 bg-accent-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                  <span className="ml-3 sm:ml-4 md:ml-5 flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-white group-hover:bg-accent-500 transition-all duration-300 relative z-10">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 stroke-primary-600 group-hover:stroke-white transition-all duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
