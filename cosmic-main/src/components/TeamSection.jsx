import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaLinkedinIn, FaChevronDown, FaChevronUp, FaTwitter, FaEnvelope, FaFacebook, FaInstagram } from "react-icons/fa6";
import { teamService } from "../services/api";





const TeamSection = () => {
  const [expandedMember, setExpandedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await teamService.getAllTeamMembers(`?t=${timestamp}`);
        setMembers(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team members');
        setLoading(false);
      }
    };
    
    fetchTeamMembers();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(() => {
      fetchTeamMembers();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const toggleBio = (name) => {
    if (expandedMember === name) {
      setExpandedMember(null);
    } else {
      setExpandedMember(name);
    }
  };
  
  // Get social icon based on platform
  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'LinkedIn':
        return <FaLinkedinIn size={14} />;
      case 'Twitter':
        return <FaTwitter size={14} />;
      case 'Email':
        return <FaEnvelope size={14} />;
      case 'Facebook':
        return <FaFacebook size={14} />;
      case 'Instagram':
        return <FaInstagram size={14} />;
      default:
        return <FaLinkedinIn size={14} />;
    }
  };
  
  return (
    <>
  <section className="relative bg-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* heading */}
      <header className="mb-12">
        <div className="border-l-4 border-primary-600 pl-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Team Cosmic</h2>
        </div>
        <p className="text-gray-600 max-w-3xl mt-6">
          The management team of Cosmic incorporates innovators and problem-solvers with a passion for making the world a better place. They bring out the best in our employees and believe in 'growing together'.
        </p>
      </header>

      <div className="mt-10">
        <p className="text-sm font-medium text-primary-600 uppercase mb-6 flex items-center">
          <span className="inline-block w-6 h-0.5 bg-primary-600 mr-2"></span>
          OUR PEOPLE
        </p>
        
        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading team members...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {/* Team Member Cards */}
        {!loading && !error && (
          <div className="grid gap-12 sm:gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-3 justify-items-center mx-auto">
            {members.map((member) => {
              const isExpanded = expandedMember === member.name;
              return (
                <div key={member._id} className="flex flex-col group border border-gray-200 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100 transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto">
                  <div className="relative overflow-hidden">
                    {/* Expandable Bio Section - Positioned over image */}
                    {isExpanded && (
                      <div className="absolute inset-0 bg-primary-900 bg-opacity-90 z-10 p-4 flex flex-col transition-all duration-300 ease-in-out">
                        <div className="flex items-start mb-3">
                          <h4 className="text-md font-bold text-white">{member.title}</h4>
                          <div className="ml-auto flex space-x-2">
                            {member.socialLinks && member.socialLinks.map((link, i) => (
                              <a 
                                key={i}
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                              >
                                {getSocialIcon(link.platform)}
                              </a>
                            ))}
                          </div>
                        </div>
                        <p className="text-white text-sm leading-relaxed flex-grow overflow-y-auto">{member.bio}</p>
                        <div className="h-1 w-12 bg-accent-500 mt-3"></div>
                      </div>
                    )}
                    <div className="w-full h-80 relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-accent-600 text-sm font-medium mb-3">{member.role}</p>
                    <button 
                      onClick={() => toggleBio(member.name)}
                      className="flex items-center text-sm text-primary-600 hover:text-primary-800 font-medium bg-transparent border-none cursor-pointer p-0"
                    >
                      {isExpanded ? (
                        <>
                          HIDE BIO <FaChevronUp className="ml-1" />
                        </>
                      ) : (
                        <>
                          SHOW BIO <FaChevronDown className="ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* No Team Members Message */}
        {!loading && !error && members.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">No team members found.</p>
          </div>
        )}
      </div>
    </div>
  </section>
  

  </>
  );
};

export default TeamSection;
