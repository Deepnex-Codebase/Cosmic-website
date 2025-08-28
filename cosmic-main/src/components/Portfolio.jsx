/* src/components/Portfolio.jsx */
import React, { useState, useEffect } from "react";
import { FiArrowRight, FiFilter, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getFeaturedProjects } from "../services/projectService";

// API_BASE_URL is already defined in projectService.js, no need to redefine it here

/* ------------------------- fallback data ------------------------- */
const fallbackProjectImages = [
  "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529861262172-f38517de9ec3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526481280690-9c06f8f9d5b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1566832512884-a1770ad0993b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
];

const galleryImages = [
  "https://images.unsplash.com/photo-1526481280690-9c06f8f9d5b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1609743521648-3c52bfeae409?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1532394971762-3ec2f35b95fa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
];

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'Utility Scale'];

  useEffect(() => {
    fetchProjectsData();
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
      const response = await getFeaturedProjects();
      
      // Check if we have valid data from the API
      // Handle different API response formats
      let data = [];
      
      if (response && response.data && Array.isArray(response.data)) {
        // If response has data property with array
        data = response.data;
      } else if (response && Array.isArray(response)) {
        // If response itself is an array
        data = response;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        // If response has nested data.data property with array
        data = response.data.data;
      }
      
      if (data && data.length > 0) {
        setProjectData(data);
        setFilteredProjects(data);
      
        // Extract gallery images from projects
        const extractedImages = [];
        data.forEach(project => {
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
      } else {
        // If no projects from API or empty array, use fallback
        console.log('No projects found from API, using fallback data');
        setFallbackData();
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16">
      {/* topo pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://raw.githubusercontent.com/stevenlei/design-bg-samples/master/topography.svg')] bg-cover opacity-5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* heading */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <p className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 font-space-grotesk">
            <span className="h-px w-8 bg-gray-400" />
            ✷ Diverse Solar Expertise ✷
            <span className="h-px w-8 bg-gray-400" />
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl font-space-grotesk">
            Solar Solutions For Every Need
          </h2>
        </motion.header>

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

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects && filteredProjects.length > 0 ? (
              // Actual project data
              filteredProjects.map((project, idx) => (
                <div key={project._id || idx} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-10 bg-accent-400 text-accent-950 text-xs font-medium px-2.5 py-1 rounded-full">
                      {project.category || (idx % 2 === 0 ? 'Residential' : 'Commercial')}
                    </div>
                    <img
                      src={project.featuredImage ? 
                        (project.featuredImage.startsWith('http') ? project.featuredImage : `https://api.cosmicpowertech.com${project.featuredImage.startsWith('/') ? '' : '/'}${project.featuredImage.replace(/^\/api\//, '/')}`) : 
                        (project.image ? (project.image.startsWith('http') ? project.image : `https://api.cosmicpowertech.com${project.image.startsWith('/') ? '' : '/'}${project.image.replace(/^\/api\//, '/')}`) : '')}
                      alt={project.title || `Project ${idx + 1}`}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
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
        )}
        
        <div className="text-center mt-12">
          <Link to="/projects" className="bg-accent-400 hover:bg-accent-500 text-accent-950 px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md inline-block">View All Projects</Link>
        </div>
      </div>
    </section>
  );
}
