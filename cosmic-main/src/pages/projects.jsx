import React, { useState, useEffect } from "react";
import { FiArrowRight, FiMapPin, FiMail, FiTruck, FiCheckCircle, FiChevronDown, FiPhone, FiFilter, FiSearch } from "react-icons/fi";

import { Link } from "react-router-dom";
import axios from "axios";
import { getDeliveryProcesses } from '../services/processService';

// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';


/* ------------------------- fallback data ------------------------- */
const fallbackProjectImages = [
  "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529861262172-f38517de9ec3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526481280690-9c06f8f9d5b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1566832512884-a1770ad0993b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
];

const processSteps = [
  {
    icon: <FiMapPin className="h-5 w-5" />,
    title: "Order Placement",
    desc: "Place an order by phone or online &amp; select the service you need."
  },
  {
    icon: <FiMail className="h-5 w-5" />,
    title: "Order Processing",
    desc: "We confirm your order &amp; assign a veteran technician to handle it."
  },
  {
    icon: <FiTruck className="h-5 w-5" />,
    title: "Last‑Mile Delivery",
    desc: "Panels arrive perfectly packed; our installers position everything."
  },
  {
    icon: <FiCheckCircle className="h-5 w-5" />,
    title: "Delivery Confirmation",
    desc: "Once commissioned, you’ll receive photos, videos &amp; a performance brief."
  }
];

const galleryImages = [
  "https://images.unsplash.com/photo-1526481280690-9c06f8f9d5b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1609743521648-3c52bfeae409?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1532394971762-3ec2f35b95fa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
];

/* -------------------------------------------------------------- */
const AccordionItem = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-700">
      <button
        type="button"
        className="w-full flex justify-between items-center py-4 text-left text-gray-300 hover:text-white"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <FiChevronDown className={`transform transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open && <div className="pb-6 text-sm text-gray-400">{children}</div>}
    </div>
  );
};

const ProjectsPage = () => {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [processStepsData, setProcessStepsData] = useState(processSteps);
  
  const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'Utility Scale'];


  useEffect(() => {
    fetchProjectsData();
    fetchProcessSteps();
  }, []);

  const setFallbackData = () => {
    const fallbackData = fallbackProjectImages.map((src, idx) => ({
      _id: `fallback-${idx}`,
      title: `Solar Project ${idx + 1}`,
      description: `A ${idx % 2 === 0 ? 'residential' : 'commercial'} solar installation with ${(idx + 1) * 5} kW capacity.`,
      category: idx % 2 === 0 ? 'Residential' : 'Commercial',
      featuredImage: src,
      location: "Gujarat, India",
      capacity: `${(idx + 1) * 5} kW`,
      status: 'Completed',
      completionDate: new Date(2020 + idx, idx % 12, 15).toISOString()
    }));
    
    setProjectData(fallbackData);
    setFilteredProjects(fallbackData);
    
    const fallbackGallery = galleryImages.map((image, idx) => ({
      image: image,
      title: `Project ${idx + 1}`,
      category: idx % 2 === 0 ? 'Residential' : 'Commercial',
      _id: `fallback-${idx}`
    }));
    
    setGalleryData(fallbackGallery);
  };

  // Filter projects based on search and category
  useEffect(() => {
    let filtered = [...projectData];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }
    
    setFilteredProjects(filtered);
  }, [projectData, searchTerm, selectedCategory]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const fetchProjectsData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      const response = await axios.get(`${API_BASE_URL}/projects?limit=50`);
      
      if (response.data && response.data.success && response.data.data) {
          const apiProjects = response.data.data;
          setProjectData(apiProjects);
          setFilteredProjects(apiProjects);
        
        // Extract gallery images from projects
        const extractedImages = [];
        apiProjects.forEach(project => {
          if (project.images && Array.isArray(project.images)) {
            project.images.slice(0, 2).forEach(img => {
              extractedImages.push({
                image: img,
                title: project.title,
                category: project.category,
                _id: project._id
              });
            });
          }
          if (project.featuredImage) {
            extractedImages.push({
              image: project.featuredImage,
              title: project.title,
              category: project.category,
              _id: project._id
            });
          }
        });
        
        setGalleryData(extractedImages.slice(0, 8));
        
        if (apiProjects.length === 0) {
           // If no projects from API, use fallback
           setFallbackData();
         }
       } else {
         setFallbackData();
       }
     } catch (error) {
       console.error('Error fetching projects:', error);
       setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const fetchProcessSteps = async () => {
    try {
      const response = await getDeliveryProcesses();
      if (response.success && response.data && response.data.length > 0) {
        // Map API data to component format
        const mappedSteps = response.data.map((step) => {
          // Map icon names to actual icon components
          let iconComponent;
          switch (step.icon.toLowerCase()) {
            case 'mappin':
            case 'map-pin':
              iconComponent = <FiMapPin className="h-5 w-5" />;
              break;
            case 'mail':
              iconComponent = <FiMail className="h-5 w-5" />;
              break;
            case 'truck':
              iconComponent = <FiTruck className="h-5 w-5" />;
              break;
            case 'checkcircle':
            case 'check-circle':
              iconComponent = <FiCheckCircle className="h-5 w-5" />;
              break;
            default:
              iconComponent = <FiMapPin className="h-5 w-5" />;
          }
          
          return {
            icon: iconComponent,
            title: step.title,
            desc: step.description
          };
        });
        setProcessStepsData(mappedSteps);
      }
    } catch (error) {
      console.error('Error fetching process steps:', error);
      // Keep fallback data if API fails
    }
  };

  return (
    <div className="font-sans text-gray-700 bg-gray-50">

      {/* ───────────── Hero ───────────── */}
      <section className="relative h-64 md:h-80 lg:h-96">
        <img
          src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1200&q=80"
          alt="solar panels"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#13181f]/80 via-[#13181f]/70 to-[#13181f]/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4">Our Projects</h1>
          <p className="text-sm md:text-base max-w-xl mx-auto">Discover our innovative solar solutions transforming homes and businesses</p>
          <div className="mt-6 md:mt-8">
            <button className="bg-accent-400 hover:bg-accent-500 text-accent-950 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">Explore Now</button>
          </div>
        </div>
      </section>

      {/* ───────────── Projects Grid ───────────── */}
      <section className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="bg-accent-100 text-accent-800 text-sm font-medium px-4 py-1.5 rounded-full mb-4 inline-block">Our Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our portfolio of completed solar installations showcases our commitment to quality and innovation</p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500 h-5 w-5" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-accent-400 text-accent-950'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : filteredProjects && filteredProjects.length > 0 ? (
            // Actual project data
            filteredProjects.map((project, idx) => (
              <div key={project._id || idx} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="relative overflow-hidden">
                  <div className="absolute top-4 right-4 z-10 bg-accent-400 text-accent-950 text-xs font-medium px-2.5 py-1 rounded-full">
                    {project.category || (idx % 2 === 0 ? 'Residential' : 'Commercial')}
                  </div>
                  <img
                    src={project.featuredImage || project.image}
                    alt={project.title || `Project ${idx + 1}`}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{project.title || `Solar Project ${idx + 1}`}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description || "A state-of-the-art solar installation providing clean, renewable energy."}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{project.location || "Gujarat, India"}</span>
                    <Link to={`/projects/${project._id || idx}`} className="text-accent-600 hover:text-accent-800 font-medium flex items-center gap-1 text-sm">
                      View Details <FiArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback to sample images
            fallbackProjectImages.map((src, idx) => (
              <div key={idx} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="relative overflow-hidden">
                  <div className="absolute top-4 right-4 z-10 bg-accent-400 text-accent-950 text-xs font-medium px-2.5 py-1 rounded-full">
                    {idx % 2 === 0 ? 'Residential' : 'Commercial'}
                  </div>
                  <img
                  src={src}
                  alt={`project-${idx}`}
                  className="w-full h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13181f]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <Link to={`/projects/${idx}`} className="bg-accent-400 hover:bg-accent-500 text-accent-950 px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-300">View Details</Link>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">Solar Project {idx + 1}</h3>
                <p className="text-gray-600 text-sm mb-3">A {idx % 2 === 0 ? 'residential' : 'commercial'} solar installation with {(idx + 1) * 5} kW capacity.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-3">{2020 + idx} • </span>
                    <span>{idx % 2 === 0 ? 'Residential' : 'Commercial'}</span>
                  </div>
                  <Link to={`/projects/${idx}`} className="text-accent-600 hover:text-accent-700 cursor-pointer text-sm font-medium flex items-center">
                    View Details <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/projects" className="border-2 border-accent-400 text-accent-600 hover:bg-accent-400 hover:text-accent-950 px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md inline-block">View All Projects</Link>
        </div>
      </section>

      {/* ───────────── Delivery Process ───────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="bg-accent-100 text-accent-800 text-sm font-medium px-4 py-1.5 rounded-full mb-4 inline-block">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Delivery Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We follow a streamlined process to ensure your solar installation is completed efficiently and to the highest standards</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processStepsData.map((step, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-accent-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-accent-600 text-xl">
                  {step.icon}
                </div>
                <div className="flex items-center mb-3">
                  <span className="bg-accent-400 text-accent-950 text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2">{idx + 1}</span>
                  <h3 className="font-bold text-xl">{step.title}</h3>
                </div>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/services" className="bg-accent-400 hover:bg-accent-500 text-accent-950 px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md inline-block">Learn More About Our Process</Link>
          </div>
        </div>
      </section>

      {/* ───────────── Banner Section ───────────── */}
      <section className="py-16 bg-[#13181f] text-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#13181f] to-[#1c280b] rounded-2xl overflow-hidden shadow-xl">
            <div className="md:flex items-center">
              <div className="md:w-1/2 p-8 md:p-12">
                <span className="bg-accent-800/50 text-accent-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4 inline-block">Get Started</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Solar Journey?</h2>
                <p className="text-accent-100 mb-8">Contact us today for a free consultation and quote. Our team of experts is ready to help you transition to clean, renewable energy.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-accent-400 hover:bg-accent-500 text-accent-950 px-6 py-3 rounded-full font-medium transition-colors duration-300 flex items-center shadow-lg">
                    <FiPhone className="mr-2" /> Call Us
                  </button>
                  <button className="bg-white text-[#13181f] hover:bg-accent-50 px-6 py-3 rounded-full font-medium transition-colors duration-300 flex items-center shadow-lg">
                    <FiMail className="mr-2" /> Email Us
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
                  alt="Solar panels on a sunny day" 
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#13181f]/90 md:bg-gradient-to-r"></div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ───────────── Gallery Section ───────────── */}
      <section className="py-16 bg-accent-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="bg-accent-100 text-accent-800 text-sm font-medium px-4 py-1.5 rounded-full mb-4 inline-block">Gallery</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Project Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Browse through our collection of completed solar installations across various residential and commercial properties</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              // Loading skeleton for gallery
              [...Array(6)].map((_, idx) => (
                <div key={idx} className="rounded-lg h-48 md:h-64 bg-gray-200 animate-pulse"></div>
              ))
            ) : galleryData && galleryData.length > 0 ? (
              // Dynamic gallery from backend data
              galleryData.map((item, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-lg h-48 md:h-64 shadow-md hover:shadow-xl transition-all duration-300">
                  <img 
                    src={item.image} 
                    alt={item.title || `Gallery image ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = galleryImages[idx % galleryImages.length]; // Fallback to static image
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13181f]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium text-lg">{item.title || `Project ${idx + 1}`}</h3>
                    <p className="text-gray-200 text-sm">{item.category || (idx % 2 === 0 ? 'Residential' : 'Commercial')} Installation</p>
                    <Link to={`/projects/${item._id || idx}`} className="mt-2 bg-accent-400 hover:bg-accent-500 text-accent-950 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg transition-all duration-300 w-max">View Details</Link>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to static gallery images
              galleryImages.map((image, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-lg h-48 md:h-64 shadow-md hover:shadow-xl transition-all duration-300">
                  <img 
                    src={image} 
                    alt={`Gallery image ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13181f]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium text-lg">Project {idx + 1}</h3>
                    <p className="text-gray-200 text-sm">{idx % 2 === 0 ? 'Residential' : 'Commercial'} Installation</p>
                    <Link to={`/projects/${idx}`} className="mt-2 bg-accent-400 hover:bg-accent-500 text-accent-950 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg transition-all duration-300 w-max">View Details</Link>
                  </div>
                </div>
              ))
            )}
          </div>
          

        </div>
      </section>


    </div>
  );
};

export default ProjectsPage;
