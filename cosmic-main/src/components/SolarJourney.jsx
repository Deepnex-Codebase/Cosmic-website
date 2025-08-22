/*  src/components/SolarJourney.jsx  */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalculatorIcon,
  ClipboardDocumentCheckIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  LightBulbIcon,
  CubeIcon,
  SparklesIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { journeyService } from "../services/api";

// Icon mapping to use with dynamic data
const ICON_MAP = {
  // Font Awesome style icons
  "fa-calculator": CalculatorIcon,
  "calculator": CalculatorIcon,
  "fa-clipboard": ClipboardDocumentCheckIcon,
  "clipboard": ClipboardDocumentCheckIcon,
  "fa-wrench": WrenchScrewdriverIcon,
  "wrench": WrenchScrewdriverIcon,
  "fa-shield": ShieldCheckIcon,
  "shield": ShieldCheckIcon,
  "fa-document": DocumentTextIcon,
  "document": DocumentTextIcon,
  "fa-lightbulb": LightBulbIcon,
  "lightbulb": LightBulbIcon,
  "fa-cube": CubeIcon,
  "cube": CubeIcon,
  "fa-sparkles": SparklesIcon,
  "sparkles": SparklesIcon,
  "fa-globe": GlobeAltIcon,
  "globe": GlobeAltIcon,
  "fa-globe-americas": GlobeAltIcon,
  "globe-americas": GlobeAltIcon,
  "fa-building": CubeIcon,
  "building": CubeIcon,
};

// Fallback data in case API fails
const FALLBACK_STEPS = [
  {
    number: "01",
    title: "Site Assessment",
    desc: "Suspendisse ad tempus aliquam porta montes taciti.",
    img: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-process-img1.jpg",
    icon: CalculatorIcon,
  },
  {
    number: "02",
    title: "Agreement",
    desc: "Neque netus taciti gravida pretium at aptent estetiam.",
    img: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-process-img2.jpg",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    number: "03",
    title: "Installation",
    desc: "Magna suscipit cras ligula purus placerat neque neque.",
    img: "https://zolar.wpengine.com/wp-content/uploads/2024/12/Home1-process-img.jpg",
    icon: WrenchScrewdriverIcon,
  },
  {
    number: "04",
    title: "Quality Assurance",
    desc: "Tortor aliquam sit dignissim aliquet curabitur condimentum.",
    img: "https://zolar.wpengine.com/wp-content/uploads/2025/01/home1-5-01.jpg",
    icon: ShieldCheckIcon,
  },
];

export default function SolarJourney() {
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch journey milestones from API
  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        // Use the updated API service that bypasses cache
        const response = await journeyService.getActiveMilestones();
        console.log('Journey API response:', response);
        console.log('Journey API response status:', response.status);
        console.log('Journey API response headers:', response.headers);
        console.log('Journey API full response data:', JSON.stringify(response.data, null, 2));
        
        // Handle API response
        if (response && response.data) {
          // Initialize milestones array
          let milestones = [];
          
          // Check response structure and extract milestones
          if (response.data.data && Array.isArray(response.data.data)) {
            // Standard API response with data property
            milestones = response.data.data;
            console.log('Found milestones in response.data.data:', milestones);
          } else if (Array.isArray(response.data)) {
            // Direct array response
            milestones = response.data;
            console.log('Found milestones directly in response.data:', milestones);
          } else if (response.data.success && Array.isArray(response.data.data)) {
            // Success format with data property
            milestones = response.data.data;
            console.log('Found milestones in response.data.data (success format):', milestones);
          } else {
            // Try to find any array in the response
            console.log('Searching for milestones in response...');
            const findArrays = (obj) => {
              for (const key in obj) {
                if (Array.isArray(obj[key]) && obj[key].length > 0 && obj[key][0].title) {
                  console.log(`Found potential milestones array in response.data.${key}:`, obj[key]);
                  return obj[key];
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                  const result = findArrays(obj[key]);
                  if (result) return result;
                }
              }
              return null;
            };
            
            const foundArray = findArrays(response.data);
            if (foundArray) {
              milestones = foundArray;
            }
          }
          
          if (milestones.length > 0) {
            console.log('Processing milestones for display:', milestones);
            // Format the data to match our component's needs
            const formattedData = milestones.map((item, index) => {
              console.log(`Processing milestone ${index}:`, item);
              
              // Determine which icon to use - first try exact match
              let IconComponent = FALLBACK_STEPS[index % FALLBACK_STEPS.length].icon;
              
              // Try to find the icon in our map
              if (item.icon) {
                console.log(`Finding icon for: ${item.icon}`);
                // Check for exact match first
                if (ICON_MAP[item.icon]) {
                  IconComponent = ICON_MAP[item.icon];
                  console.log(`Found exact icon match: ${item.icon}`);
                } 
                // If no exact match, try to find a partial match
                else {
                  const iconKey = Object.keys(ICON_MAP).find(key => 
                    item.icon.includes(key) || key.includes(item.icon)
                  );
                  if (iconKey) {
                    IconComponent = ICON_MAP[iconKey];
                    console.log(`Found partial icon match: ${item.icon} -> ${iconKey}`);
                  } else {
                    console.log(`No icon match found for: ${item.icon}, using fallback`);
                  }
                }
              }
              
              const formattedItem = {
                number: String(index + 1).padStart(2, '0'),
                title: item.title,
                desc: item.description,
                img: item.image || FALLBACK_STEPS[index % FALLBACK_STEPS.length].img,
                icon: IconComponent,
                year: item.year
              };
              
              console.log(`Formatted milestone ${index}:`, formattedItem);
              return formattedItem;
            });
            
            console.log('Setting formatted milestones:', formattedData);
            setSteps(formattedData);
          } else {
            // Use fallback data if API returns empty array
            console.log('No journey milestones found, using fallback data');
            setSteps(FALLBACK_STEPS);
          }
        } else {
          // Use fallback data if response structure is unexpected
          console.log('Unexpected API response structure, using fallback data');
          setSteps(FALLBACK_STEPS);
        }
      } catch (err) {
        console.error('Error fetching journey data:', err);
        setError('Failed to load journey data');
        // Use fallback data on error
        setSteps(FALLBACK_STEPS);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneyData();
  }, []);

  // Intersection observer for animation
  useEffect(() => {
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f8f9fa] py-24"
    >
      {/* ───────────────── heading */}
      <div className="mx-auto mb-20 max-w-7xl px-4 text-center">
        <p className="mb-3 text-sm uppercase tracking-wider text-gray-600 font-space-grotesk">
          —⚡ End-To-End Services ⚡—
        </p>
        <h2 className="text-4xl font-extrabold text-black sm:text-5xl font-space-grotesk">
          The Solar Journey
        </h2>
      </div>

      {/* ───────────────── loading and error states */}
      {loading && (
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-lg">Loading journey milestones...</p>
        </div>
      )}

      {error && !loading && (
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      )}

      {/* ───────────────── steps grid */}
      {!loading && !error && (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
          <div
            key={s.number}
            style={{ animationDelay: `${idx * 0.2}s` }}
            className="relative flex flex-col items-center text-center opacity-0 animate-slide-in"
          >
            {/* connector arrow (except last) */}
            {idx < steps.length - 1 && (
              <img
                src="/arrow.svg"
                alt="Arrow"
                style={{ animationDelay: `${idx * 0.2 + 0.3}s` }}
                className="absolute right-[-20%] top-[30%] z-10 hidden h-[60px] w-[60px] -translate-y-1/2 transform-gpu animate-arrow animate-color-gradient sm:block lg:h-[80px] lg:w-[80px] lg:right-[-26%]"
              />
            )}

            {/* image circle */}
            <div className="relative mb-6 h-44 w-44 overflow-hidden rounded-full shadow-lg transition-transform duration-300 hover:scale-105 animate-border-pulse">
              <span
                style={{ animationDelay: `${idx * 0.2 + 0.3}s` }}
                className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-[#e8f5e9] text-[11px] font-semibold text-black animate-pulse-in z-10"
              >
                {s.year ? s.year : s.number}
              </span>
              <img
                src={s.img}
                alt={s.title}
                className="h-full w-full object-cover object-center"
              />
            </div>

            <h3
              style={{ animationDelay: `${idx * 0.2 + 0.45}s` }}
              className="mb-2 text-lg font-semibold opacity-0 animate-fade-up font-space-grotesk"
            >
              {s.title}
            </h3>
            <p
              style={{ animationDelay: `${idx * 0.2 + 0.55}s` }}
              className="mx-auto max-w-xs text-sm text-gray-600 opacity-0 animate-fade-up"
            >
              {s.desc}
            </p>
          </div>
          ))}
        </div>
      )}

      {/* ───────────────── CTA buttons */}
      <div className="mx-auto mt-16 flex max-w-4xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-center">
        <Link
          to="/services"
          style={{ animationDelay: "0.8s" }}
          className="group relative overflow-hidden w-full animate-fade-up rounded-full bg-[#cae28e] px-8 py-3 text-sm font-semibold text-black shadow-md border-2 border-transparent hover:border-[#cae28e] transition-all duration-300 sm:w-auto"
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Explore All Services</span>
          <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
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
        @keyframes border-pulse{0%{box-shadow:0 0 0 0 rgba(202, 226, 142, 0.6)}50%{box-shadow:0 0 0 8px rgba(202, 226, 142, 0.2)}100%{box-shadow:0 0 0 0 rgba(202, 226, 142, 0)}}

        .animate-slide-in{animation:slide-in .6s cubic-bezier(.33,.99,.58,1) forwards}
        .animate-fade-up{animation:fade-up .5s ease-out forwards}
        .animate-pulse-in{animation:pulse-in 1.5s ease-in-out infinite}
        .animate-arrow{animation:arrow-move 1.6s ease-in-out infinite}
        .animate-color-change{animation:color-change 3s linear infinite}
        .animate-border-pulse{animation:border-pulse 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite}
      `}</style>
    </section>
  );
}
