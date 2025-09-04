import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import axios from 'axios';
import { FaMapMarkerAlt, FaClock, FaUserTie, FaCheckCircle, FaBriefcase, FaGraduationCap, FaUsers, FaBolt, FaLeaf, FaLightbulb, FaSolarPanel, FaHandshake } from "react-icons/fa";
import { API_URL } from '../config/constants';

// Icon mapping for dynamic rendering
const iconMap = {
  FaCheckCircle: FaCheckCircle,
  FaBriefcase: FaBriefcase,
  FaGraduationCap: FaGraduationCap,
  FaUsers: FaUsers,
  FaBolt: FaBolt,
  FaLeaf: FaLeaf,
  FaLightbulb: FaLightbulb,
  FaSolarPanel: FaSolarPanel,
  FaHandshake: FaHandshake
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [careerData, setCareerData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch career data from CMS
  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/cms/careers?t=${new Date().getTime()}`);
        setCareerData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching career data:', err);
        setError('Failed to load career information. Please try again later.');
        setLoading(false);
      }
    };

    fetchCareerData();
    
    // Set up a refresh interval to check for updates every 30 seconds
    const refreshInterval = setInterval(fetchCareerData, 30000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(refreshInterval);
  }, []);

  // If data is loading, show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // If there's an error, show error message
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  // If no data is available yet, return null
  if (!careerData) return null;

  const { hero, culture, benefits, openPositions, cta } = careerData;
  
  const departments = openPositions?.departments || [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'sales', name: 'Sales & Marketing' },
    { id: 'operations', name: 'Operations' },
    { id: 'support', name: 'Customer Support' }
  ];

  const jobs = openPositions?.jobs || [];

  const filteredJobs = selectedDepartment === 'all'
    ? jobs
    : jobs.filter(job => job.department === selectedDepartment);

  return (
    <div className="min-h-screen font-['Space_Grotesk']">
      <Helmet>
        <title>Careers at Cosmic Power Tech - Join Our Team</title>
        <meta name="description" content="Join Cosmic Power Tech and build a sustainable future with India's leading solar energy company. Explore career opportunities across engineering, sales, operations, and more." />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-700 to-primary-900 py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className={`absolute inset-0 bg-[url('${hero?.backgroundImage || "/solar-panels.jpg"}')] opacity-20 bg-cover bg-center mix-blend-overlay`}></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <h1 className="text-5xl font-bold text-white sm:text-6xl md:text-7xl mb-6">
            {hero?.title || "Join Our Team"}
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-white sm:text-2xl md:mt-5">
            {hero?.subtitle || "Build a sustainable future with Cosmic Power Tech"}
          </p>
          <div className="mt-10">
            <a 
              href={hero?.buttonLink || "#open-positions"} 
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-100 md:text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              {hero?.buttonText || "View Open Positions"}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Culture Section */}
      <div className="py-24 bg-white">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 relative inline-block">
              {culture?.title || "Our Culture"}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary-500"></span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              {culture?.subtitle || "We're building a team of passionate individuals committed to making clean energy accessible to all"}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {culture?.values && culture.values.length > 0 ? (
              culture.values.map((value, index) => {
                const IconComponent = iconMap[value.icon] || FaBolt;
                return (
                  <motion.div 
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
                    }}
                    className="bg-white p-10 rounded-xl shadow-xl border-t-4 border-primary-500 hover:shadow-2xl transition-shadow duration-300 group"
                  >
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                      <IconComponent className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">{value.title}</h3>
                    <p className="text-gray-600 text-lg">{value.description}</p>
                  </motion.div>
                );
              })
            ) : (
              // Fallback values if no data from CMS
              <>
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
                  }}
                  className="bg-white p-10 rounded-xl shadow-xl border-t-4 border-primary-500 hover:shadow-2xl transition-shadow duration-300 group"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                    <FaBolt className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">Innovation</h3>
                  <p className="text-gray-600 text-lg">We encourage creative thinking and new ideas to solve energy challenges, pushing the boundaries of what's possible in solar technology.</p>
                </motion.div>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
                  }}
                  className="bg-white p-10 rounded-xl shadow-xl border-t-4 border-primary-500 hover:shadow-2xl transition-shadow duration-300 group"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                    <FaUsers className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">Collaboration</h3>
                  <p className="text-gray-600 text-lg">We work together across teams to achieve our common goals, leveraging diverse perspectives to create comprehensive energy solutions.</p>
                </motion.div>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }
                  }}
                  className="bg-white p-10 rounded-xl shadow-xl border-t-4 border-primary-500 hover:shadow-2xl transition-shadow duration-300 group"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                    <FaCheckCircle className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">Impact</h3>
                  <p className="text-gray-600 text-lg">Every team member contributes to our mission of sustainable energy, making a real difference in India's transition to clean power.</p>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 relative inline-block">
              {benefits?.title || "Benefits & Perks"}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary-500"></span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              {benefits?.subtitle || "We value our team members and offer competitive benefits to support your professional and personal growth"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 mt-16">
            {benefits?.categories && benefits.categories.length > 0 ? (
              benefits.categories.map((benefit, index) => {
                const IconComponent = iconMap[benefit.icon] || FaCheckCircle;
                return (
                  <motion.div 
                    key={index} 
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
                    }}
                    className="bg-white p-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-primary-500 group"
                  >
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                      <IconComponent className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-primary-600 transition-colors duration-300">{benefit.title}</h3>
                    <ul className="space-y-4">
                      {benefit.items && benefit.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <FaCheckCircle className="text-primary-500 mr-3 mt-1.5 flex-shrink-0" />
                          <span className="text-gray-600 text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })
            ) : (
              // Fallback benefits if no data from CMS
              [
                {
                  title: 'Health & Wellness',
                  icon: <FaCheckCircle className="h-8 w-8 text-primary-600" />,
                  items: [
                    'Comprehensive health insurance',
                    'Life insurance coverage',
                    'Annual health checkups',
                    'Mental wellness programs'
                  ]
                },
                {
                  title: 'Learning & Growth',
                  icon: <FaGraduationCap className="h-8 w-8 text-primary-600" />,
                  items: [
                    'Professional development budget',
                    'Training programs',
                    'Conference attendance',
                    'Certification support'
                  ]
                },
                {
                  title: 'Work-Life Balance',
                  icon: <FaUsers className="h-8 w-8 text-primary-600" />,
                  items: [
                    'Flexible working hours',
                    'Work from home options',
                    'Paid time off',
                    'Parental leave'
                  ]
                },
                {
                  title: 'Additional Perks',
                  icon: <FaBriefcase className="h-8 w-8 text-primary-600" />,
                  items: [
                    'Performance bonuses',
                    'Stock options',
                    'Team events',
                    'Festival celebrations'
                  ]
                }
              ].map((benefit, index) => (
                <motion.div 
                  key={index} 
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
                  }}
                  className="bg-white p-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-primary-500 group"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-primary-600 transition-colors duration-300">{benefit.title}</h3>
                  <ul className="space-y-4">
                    {benefit.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <FaCheckCircle className="text-primary-500 mr-3 mt-1.5 flex-shrink-0" />
                        <span className="text-gray-600 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Open Positions Section */}
      <div id="open-positions" className="py-24 bg-white">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 relative inline-block">
              {openPositions?.title || "Open Positions"}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary-500"></span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              {openPositions?.subtitle || "Join our team and help us revolutionize India's energy landscape"}
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-8 py-4 rounded-full text-base font-medium transition-all duration-300 shadow-md
                  ${selectedDepartment === dept.id
                    ? 'bg-primary-600 text-white shadow-lg transform -translate-y-1'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:-translate-y-1'}
                `}
              >
                {dept.name}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          <div className="space-y-10">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-primary-500 group"
                >
                  <div className="flex flex-wrap items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{job.title}</h3>
                      <div className="mt-4 flex flex-wrap gap-6">
                        <span className="flex items-center text-gray-600 text-lg">
                          <FaMapMarkerAlt className="mr-2 text-primary-500" />
                          {job.location}
                        </span>
                        <span className="flex items-center text-gray-600 text-lg">
                          <FaClock className="mr-2 text-primary-500" />
                          {job.type}
                        </span>
                        <span className="flex items-center text-gray-600 text-lg">
                          <FaUserTie className="mr-2 text-primary-500" />
                          {job.experience}
                        </span>
                      </div>
                    </div>
                    <button className="mt-4 sm:mt-0 px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-medium">
                      Apply Now
                    </button>
                  </div>
                  <p className="mt-6 text-gray-600 leading-relaxed text-lg">{job.description}</p>
                  <div className="mt-8">
                    <h4 className="font-semibold text-gray-900 text-xl mb-4">Requirements:</h4>
                    <ul className="mt-3 space-y-4 pl-4">
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start text-gray-600 text-lg">
                          <FaCheckCircle className="text-primary-500 mr-3 mt-1.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl shadow-md">
                <p className="text-gray-600 text-xl">No positions available in this department at the moment.</p>
                <p className="mt-4 text-gray-500">Please check back later or explore other departments.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-primary-700 to-primary-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/solar-panels.jpg')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-900/80"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            {cta?.title || "Don't see the right position?"}
          </h2>
          <p className="text-xl text-white mb-10 max-w-2xl mx-auto opacity-90">
            {cta?.description || "Send us your resume and we'll keep you in mind for future opportunities at Cosmic Power Tech"}
          </p>
          <a
            href={cta?.buttonLink || "mailto:careers@cosmicpowertech.com"}
            className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white bg-transparent hover:bg-white hover:text-primary-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
          >
            {cta?.buttonText || "Send Your Resume"}
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Careers;