import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaLeaf, FaSolarPanel, FaHandshake, FaLightbulb, FaUsers, FaHeart, 
  FaShieldAlt, FaRecycle, FaGlobe, FaStar, FaRocket, FaTree, 
  FaSun, FaWind, FaBolt, FaEye, 
  FaCog 
} from 'react-icons/fa';
import { getCompanyCulture } from '../services/companyCultureService';

const CompanyCulture = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // Fetch data from CMS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCompanyCulture();
        // Extract data from API response
        setAboutData(response.data || response);
      } catch (error) {
        console.error('Error fetching company culture data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Icon mapping for dynamic icons
  const iconMap = {
    FaLeaf: <FaLeaf className="h-10 w-10 text-[#9fc22f]" />,
    FaSolarPanel: <FaSolarPanel className="h-10 w-10 text-[#9fc22f]" />,
    FaHandshake: <FaHandshake className="h-10 w-10 text-[#9fc22f]" />,
    FaLightbulb: <FaLightbulb className="h-10 w-10 text-[#9fc22f]" />,
    FaUsers: <FaUsers className="h-10 w-10 text-[#9fc22f]" />,
    FaHeart: <FaHeart className="h-10 w-10 text-[#9fc22f]" />,
    FaShieldAlt: <FaShieldAlt className="h-10 w-10 text-[#9fc22f]" />,
    FaRecycle: <FaRecycle className="h-10 w-10 text-[#9fc22f]" />,
    FaGlobe: <FaGlobe className="h-10 w-10 text-[#9fc22f]" />,
    FaStar: <FaStar className="h-10 w-10 text-[#9fc22f]" />,
    FaRocket: <FaRocket className="h-10 w-10 text-[#9fc22f]" />,
    FaTree: <FaTree className="h-10 w-10 text-[#9fc22f]" />,
    FaSun: <FaSun className="h-10 w-10 text-[#9fc22f]" />,
    FaWind: <FaWind className="h-10 w-10 text-[#9fc22f]" />,
    FaBolt: <FaBolt className="h-10 w-10 text-[#9fc22f]" />,
    FaEye: <FaEye className="h-10 w-10 text-[#9fc22f]" />,
    FaCog: <FaCog className="h-10 w-10 text-[#9fc22f]" />
  };

  // Fallback data if CMS data is not available
  const fallbackData = {
    companyCulture: {
      hero: {
        title: "Company Culture",
        subtitle: "Building a Sustainable Future Together",
        backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
      },
      brandVision: {
        title: "Brand Vision & Strategy",
        subtitle: "Our commitment to excellence drives everything we do",
        description: "We are dedicated to creating innovative renewable energy solutions that not only meet today's needs but also pave the way for a sustainable future. Our comprehensive approach combines cutting-edge technology with environmental responsibility.",
        coreValues: [
          {
            icon: "FaLeaf",
            title: "Sustainability",
            description: "We are committed to environmental stewardship and promoting sustainable practices in everything we do."
          },
          {
            icon: "FaSolarPanel",
            title: "Innovation",
            description: "We continuously seek new technologies and approaches to improve our solar solutions and services."
          },
          {
            icon: "FaHandshake",
            title: "Integrity",
            description: "We operate with honesty, transparency, and ethical standards in all our business relationships."
          },
          {
            icon: "FaLightbulb",
            title: "Excellence",
            description: "We strive for the highest quality in our products, services, and customer interactions."
          }
        ],
        buttonText: "Join Our Mission",
        buttonLink: "/contact"
      },
        principlesThatGuideUs: {
          title: "The Principles That Guide Us",
          subtitle: "Our Core Values",
          principles: [
            {
              icon: "FaLeaf",
              title: "Sustainability",
              description: "We are committed to environmental stewardship and promoting sustainable practices in everything we do."
            },
            {
              icon: "FaSolarPanel",
              title: "Innovation",
              description: "We continuously seek new technologies and approaches to improve our solar solutions and services."
            },
            {
              icon: "FaHandshake",
              title: "Integrity",
              description: "We operate with honesty, transparency, and ethical standards in all our business relationships."
            },
            {
              icon: "FaLightbulb",
              title: "Excellence",
              description: "We strive for the highest quality in our products, services, and customer interactions."
            }
          ]
        },
      workEnvironment: {
        title: "Our Work Environment",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
        content: [
          "We foster a collaborative and innovative work environment where every team member is valued and empowered to contribute to our mission.",
          "Our open-door policy encourages communication and idea sharing across all levels of the organization.",
          "We believe in work-life balance and provide flexible working arrangements to support our team's well-being."
        ]
      },
      sustainabilityManagement: {
        title: "SUSTAINABILITY MANAGEMENT",
        cards: [
          {
            title: "Environmental",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80",
            description: "We implement comprehensive environmental management systems to minimize our ecological footprint and promote sustainable practices."
          },
          {
            title: "Society",
            image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=400&q=80",
            description: "Our commitment to social responsibility drives us to create positive impacts in the communities where we operate."
          },
          {
            title: "Governance",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
            description: "We maintain the highest standards of corporate governance, ensuring transparency, accountability, and ethical business practices."
          }
        ]
      },
      sustainabilityCommitment: {
        title: "Our Commitment to Sustainability",
        subtitle: "Beyond our products, we're committed to sustainable operations in every aspect of our business.",
        commitments: [
          {
            title: "Carbon-Neutral Operations",
            description: "We're working towards achieving carbon neutrality in all our operations by 2030."
          },
          {
            title: "Waste Reduction",
            description: "Implementing circular economy principles to minimize waste and maximize resource efficiency."
          },
          {
            title: "Community Initiatives",
            description: "Supporting local communities through education and renewable energy access programs."
          }
        ]
      },
      joinTeam: {
        title: "Join Our Team",
        description: "We're always looking for talented individuals who share our passion for renewable energy and sustainability. Explore our current openings and become part of our mission to create a greener future.",
        buttonText: "View Career Opportunities",
        buttonLink: "/careers"
      }
    }
  };

  const data = aboutData && Object.keys(aboutData).length > 0 ? { companyCulture: aboutData } : fallbackData;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Space_Grotesk']">
      {/* Hero Section */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="relative bg-cover bg-center h-64 sm:h-80 md:h-[300px] flex items-center justify-center"
        style={{
          backgroundImage:
            `url('${data.companyCulture.hero.backgroundImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {data.companyCulture.hero.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6">
            {data.companyCulture.hero.subtitle}
          </p>
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-[#9fc22f] transition">
              Home
            </Link>
            <span>—</span>
            <Link to="/about" className="hover:text-[#9fc22f] transition">
              About
            </Link>
            <span>—</span>
            <span className="text-[#9fc22f]">{data.companyCulture.hero.title}</span>
          </nav>
        </div>
      </motion.header>

      {/* Brand Vision & Strategy Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#003e63]">
                <span className="text-[#9fc22f]">{data.companyCulture.brandVision.title}</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                {data.companyCulture.brandVision.subtitle}
              </p>
              
              <p className="text-gray-700 mb-6">
                {data.companyCulture.brandVision.description}
              </p>
              
              <Link 
                to={data.companyCulture.brandVision.buttonLink} 
                className="group relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-[#9fc22f] text-black font-semibold shadow-lg border-2 border-transparent hover:border-[#9fc22f] transition-all duration-300 mt-4"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{data.companyCulture.brandVision.buttonText}</span>
                <span className="absolute inset-0 bg-[#003e63] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              </Link>
            </div>
            
            <div className="relative">
              <video 
                src="/company-culture.mp4" 
                alt="Company Culture Video" 
                className="rounded-lg shadow-lg w-full h-auto"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* The Principles That Guide Us Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-600 mb-3 inline-block relative before:content-['—'] before:mr-2 after:content-['—'] after:ml-2">
              {data.companyCulture.principlesThatGuideUs?.subtitle || 'Our Core Values'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#003e63]">
              {data.companyCulture.principlesThatGuideUs?.title || 'The Principles That Guide Us'}
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {(data.companyCulture.principlesThatGuideUs?.principles || data.companyCulture.brandVision?.coreValues || []).map((principle, index) => (
              <motion.div
                key={principle.title || principle}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="flex justify-center mb-4">
                  {iconMap[principle.icon] || iconMap['FaLeaf']}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003e63]">{principle.title || principle}</h3>
                <p className="text-gray-600">{principle.description || ''}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Work Environment Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src={data.companyCulture.workEnvironment.image} 
                alt="Collaborative work environment" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6 text-[#003e63]">
                {data.companyCulture.workEnvironment.title}
              </h2>
              
              {data.companyCulture.workEnvironment.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Sustainability Management Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#003e63]">
              {data.companyCulture.sustainabilityManagement.title}
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {data.companyCulture.sustainabilityManagement.cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-xl overflow-hidden border-t-4 border-[#9fc22f] transition-transform duration-300 hover:scale-105"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-[#003e63]">{card.title}</h3>
                  <p className="text-gray-700 text-sm">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Sustainability Commitment Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-[#003e63] text-white"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            {data.companyCulture.sustainabilityCommitment.title}
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            {data.companyCulture.sustainabilityCommitment.subtitle}
          </p>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.companyCulture.sustainabilityCommitment.commitments.map((commitment, index) => (
              <motion.div
                key={commitment.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border-l-4 border-[#9fc22f]"
              >
                <h3 className="text-xl font-bold mb-4 text-[#9fc22f]">{commitment.title}</h3>
                <p className="text-white">
                  {commitment.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Join Our Team CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#13181f]">
            {data.companyCulture.joinTeam.title}
          </h2>
          
          <p className="text-gray-700 mb-8">
            {data.companyCulture.joinTeam.description}
          </p>
          
          <Link 
            to={data.companyCulture.joinTeam.buttonLink} 
            className="group relative overflow-hidden inline-flex items-center px-8 py-4 rounded-full bg-[#9fc22f] text-black font-semibold shadow-lg border-2 border-transparent hover:border-[#9fc22f] transition-all duration-300"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{data.companyCulture.joinTeam.buttonText}</span>
            <span className="absolute inset-0 bg-[#003e63] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}


export default CompanyCulture;