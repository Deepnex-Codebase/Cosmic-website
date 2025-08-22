/* src/components/Portfolio.jsx */
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeaturedProjects } from "../services/projectService";

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getFeaturedProjects();
        setProjects(data.projects || data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Fallback items if API fails
  const fallbackItems = [
    {
      title: "EPC",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-1-01.jpg",
      span: "lg:col-span-3",
    },
    {
      title: "Retailer",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-2-01.jpg",
      span: "lg:col-span-3",
    },
    {
      title: "Solar Installer",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-2-02.jpg",
      span: "lg:col-span-3",
    },
    {
      title: "Floating",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-1-02.jpg",
      span: "lg:col-span-3",
    },
    {
      title: "CNI",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-1-01.jpg",
      span: "lg:col-span-3",
    },
    {
      title: "Rooftop",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-2-01.jpg",
      span: "lg:col-span-3",
    },
    {
      title: "Residential Rooftop",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-1-02.jpg",
      span: "lg:col-span-3",
    },
    {
      title: "End User",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-2-02.jpg",
      span: "lg:col-span-3",
    },
  ];
  
  // Define uniform span classes for grid layout
  const spanClasses = [
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3"
  ];
  
  // Use API data or fallback to static data
  const items = projects && projects.length > 0
    ? projects.slice(0, 8).map((project, index) => ({
        id: project._id,
        slug: project.slug,
        tag: project.category || "Project",
        title: project.title,
        img: project.featuredImage || (project.images && project.images.length > 0 ? project.images[0] : fallbackItems[index % fallbackItems.length].img),
        span: spanClasses[index % spanClasses.length],
        location: project.location,
        capacity: project.capacity
      }))
    : fallbackItems;

  const itemVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
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

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
          </div>
        )}

        {/* grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 solar-grid-container">
          {items.map((item, i) => (
            <motion.article
              variants={itemVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              key={item.id || i}
              className="group relative flex overflow-hidden rounded-2xl h-[250px] sm:h-[280px] md:h-[300px] solar-grid-item"
            >
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-70" />

              {/* arrow */}
              <Link to={`/projects/${item.slug || item.id || i}`} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-lime-300/90 text-gray-900 transition-transform group-hover:rotate-45">
                <ArrowUpRightIcon className="h-5 w-5" />
              </Link>

              {/* caption */}
              <Link to={`/projects/${item.slug || item.id || i}`} className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs uppercase tracking-wider text-lime-200 font-space-grotesk">
                  {item.tag}
                </p>
                <h3 className="mt-1 text-lg sm:text-xl md:text-2xl font-bold leading-tight font-space-grotesk line-clamp-2">
                  {item.title}
                </h3>
                {item.location && (
                  <p className="text-xs text-white/80 mt-1">
                    <span className="font-semibold">Location:</span> {item.location}
                  </p>
                )}
                {item.capacity && (
                  <p className="text-xs text-white/80">
                    <span className="font-semibold">Capacity:</span> {item.capacity}
                  </p>
                )}
              </Link>
            </motion.article>
          ))}        </div>
        )}
        
        {/* Add CSS for hover effect */}
        <style>
          {`
            .solar-grid-container:hover .solar-grid-item:not(:hover) {
              filter: brightness(0.6) contrast(1.2) saturate(0.8) blur(1px);
              position: relative;
            }
            
            .solar-grid-container:hover .solar-grid-item:not(:hover)::before {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(135deg, rgba(0, 62, 99, 0.7), rgba(0, 120, 215, 0.7), rgba(0, 80, 170, 0.7));
              z-index: 1;
              pointer-events: none;
              transition: all 0.4s ease;
              border-radius: 1rem;
              backdrop-filter: blur(1px);
              animation: gradientShift 3s infinite alternate;
            }
            
            @keyframes gradientShift {
              0% {
                background-position: 0% 50%;
              }
              100% {
                background-position: 100% 50%;
              }
            }
            
            .solar-grid-item {
              transition: all 0.4s ease;
              position: relative;
              overflow: hidden;
            }
            
            .solar-grid-container:hover .solar-grid-item:hover {
              transform: scale(1.05);
              z-index: 2;
              box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.4);
            }
            
            .solar-grid-container:hover .solar-grid-item:hover img {
              filter: contrast(1.1) brightness(1.05);
            }
          `}
        </style>
      </div>
    </section>
  );
}
