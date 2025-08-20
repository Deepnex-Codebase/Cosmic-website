import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {FaCalendarAlt, FaTrophy, FaUsers, FaGlassCheers } from 'react-icons/fa';
import { getTeamCelebration } from '../services/teamCelebrationService';

// Sample team celebration events data
const celebrationEvents = [
  {
    id: 1,
    title: "Annual Team Retreat 2025",
    date: "15-18 March 2025",
    location: "Himalayan Eco Resort, Shimla",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
    description: "Our annual team retreat combines strategic planning with team-building activities in the beautiful Himalayan mountains. Join us for workshops, adventure activities, and celebration of our achievements.",
  },
  {
    id: 2,
    title: "Quarterly Awards Ceremony",
    date: "30 April 2025",
    location: "SS Tech Headquarters, Mumbai",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    description: "Recognizing excellence across all departments with our quarterly awards ceremony. Categories include Innovation Champion, Customer Service Star, and Sustainability Leader.",
  },
  {
    id: 3,
    title: "Green Energy Hackathon",
    date: "12-13 May 2025",
    location: "Tech Innovation Hub, Bangalore",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    description: "A 48-hour hackathon where our teams collaborate to develop innovative solar energy solutions. Past winners have seen their ideas implemented in our product roadmap.",
  },
  {
    id: 4,
    title: "Company Foundation Day",
    date: "5 June 2025",
    location: "Grand Hyatt, Delhi",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    description: "Celebrating another year of growth and success with all employees and their families. The event includes dinner, entertainment, and special recognition for long-serving team members.",
  },
];

// Team achievements data
const achievements = [
  {
    year: "2024",
    title: "Renewable Energy Excellence Award",
    organization: "Indian Green Energy Association",
    description: "Recognized for outstanding contribution to renewable energy adoption in India."
  },
  {
    year: "2023",
    title: "Best Place to Work",
    organization: "National HR Excellence Forum",
    description: "Ranked among top 10 companies for employee satisfaction and workplace culture."
  },
  {
    year: "2022",
    title: "Innovation in Solar Technology",
    organization: "Tech Innovators Summit",
    description: "Award for our proprietary solar panel efficiency enhancement technology."
  },
  {
    year: "2021",
    title: "Sustainability Champion",
    organization: "Environmental Action Coalition",
    description: "Recognized for carbon footprint reduction initiatives and sustainable business practices."
  },
];

// Event card component
function EventCard({ event }) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 bg-[#cae28e] text-black px-4 py-2 font-medium">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="h-4 w-4" />
            <span>{event.date}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
        <p className="text-gray-600 text-sm flex items-center gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.828 0L6.343 16.657A8 8 0 1 1 17.657 16.657Z" strokeWidth={1.5} />
            <circle cx="12" cy="11" r="3" strokeWidth={1.5} />
          </svg>
          {event.location}
        </p>
        <p className="text-gray-700 flex-grow">{event.description}</p>
        <Link 
          to="#" 
          className="group relative overflow-hidden inline-flex items-center px-3 py-1 rounded-full bg-transparent text-[#13181f] font-medium border-2 border-transparent hover:border-[#cae28e] transition-all duration-300"
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Learn more</span>
          <span className="absolute inset-0 bg-[#13181f] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
          <svg 
            className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1 relative z-10 stroke-current group-hover:stroke-white transition-all duration-300" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}

// Achievement item component
function AchievementItem({ achievement, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex items-start gap-4 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex-shrink-0 bg-[#cae28e] text-[#13181f] p-3 rounded-full">
        <FaTrophy className="h-6 w-6" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold bg-gray-100 px-2 py-0.5 rounded">{achievement.year}</span>
          <h3 className="text-lg font-bold text-gray-900">{achievement.title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-2">Awarded by: {achievement.organization}</p>
        <p className="text-gray-700">{achievement.description}</p>
      </div>
    </motion.div>
  );
}

const TeamCelebration = () => {
  const [teamCelebrationData, setTeamCelebrationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTeamCelebration();
        setTeamCelebrationData(data);
      } catch (err) {
        console.error('Error fetching team celebration data:', err);
        setError(err.message);
        // Use default data as fallback
        setTeamCelebrationData({
          hero: {
            title: "Team Celebrations & Achievements",
            subtitle: "At SS Tech, we believe in celebrating our successes, recognizing excellence, and building a strong team culture.",
            backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
          },
          teamCulture: {
            title: "Our Team Culture",
            description: "We foster an environment where innovation thrives, collaboration is valued, and every team member feels empowered to contribute their best work.",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
            features: [
              "Collaborative work environment",
              "Professional development opportunities",
              "Work-life balance initiatives",
              "Recognition and rewards programs"
            ]
          },
          events: celebrationEvents,
          achievements: achievements,
          cta: {
            title: "Join Our Team",
            description: "Be part of a company that values growth, innovation, and celebration of success.",
            buttonText: "View Careers",
            buttonLink: "/careers"
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#cae28e] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team celebration data...</p>
        </div>
      </div>
    );
  }

  if (error && !teamCelebrationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#cae28e] text-black rounded hover:bg-green-400"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const data = teamCelebrationData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-24 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${data?.hero?.backgroundImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80'}')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">{data?.hero?.title || 'Team Celebrations & Achievements'}</h1>
            <p className="text-xl text-gray-200 mb-8">
              {data?.hero?.subtitle || 'At SS Tech, we believe in celebrating our successes, recognizing excellence, and building a strong team culture.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#events" 
                className="group relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-[#cae28e] text-black font-semibold hover:bg-white transition-colors duration-300 border-2 border-transparent hover:border-[#cae28e] transition-all duration-300"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white"><FaGlassCheers className="mr-2 inline" /> Upcoming Events</span>
                <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              </a>
              <a 
                href="#achievements" 
                className="group relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition-colors duration-300 hover:border-[#cae28e] transition-all duration-300"
              >
                <span className="relative z-10 transition-colors duration-300"><FaTrophy className="mr-2 inline" /> Our Achievements</span>
                <span className="absolute inset-0 bg-[#cae28e] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Culture Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">{data?.teamCulture?.title || 'Our Team Culture'}</h2>
              <p className="text-gray-700 mb-6">
                {data?.teamCulture?.description || 'At SS Tech, we foster a culture of innovation, collaboration, and celebration. We believe that recognizing achievements and creating opportunities for team bonding are essential for maintaining a motivated and engaged workforce.'}
              </p>
              {data?.teamCulture?.features && (
                <ul className="text-gray-700 mb-6 space-y-2">
                  {data.teamCulture.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-[#cae28e] rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#cae28e]">15+</div>
                  <div className="text-sm text-gray-600">Annual Events</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#cae28e]">90%</div>
                  <div className="text-sm text-gray-600">Employee Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#cae28e]">12+</div>
                  <div className="text-sm text-gray-600">Industry Awards</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src={data?.teamCulture?.image || "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80"} 
                alt="Team culture" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#cae28e] p-4 rounded-lg shadow-lg">
                <FaUsers className="h-12 w-12 text-[#13181f]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{data?.eventsSection?.title || 'Upcoming Team Events'}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {data?.eventsSection?.subtitle || 'Join us for these exciting team events and celebrations. These gatherings are designed to recognize achievements, foster team bonding, and create memorable experiences.'}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {(data?.eventsSection?.events || celebrationEvents).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{data?.achievementsSection?.title || 'Our Achievements'}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {data?.achievementsSection?.subtitle || 'We take pride in the recognition our team has received for excellence in innovation, sustainability, and workplace culture.'}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {(data?.achievementsSection?.achievements || achievements).map((achievement, index) => (
              <AchievementItem key={achievement.title} achievement={achievement} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-16 bg-[#13181f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">{data?.joinTeamCTA?.title || 'Join Our Award-Winning Team'}</h2>
            <p className="text-xl text-gray-300 mb-8">
              {data?.joinTeamCTA?.subtitle || 'Be part of a culture that celebrates success, fosters innovation, and values every team member\'s contribution.'}
            </p>
            <Link 
              to={data?.joinTeamCTA?.buttonLink || "/careers"} 
              className="group relative overflow-hidden inline-flex items-center px-8 py-4 rounded-full bg-[#cae28e] text-black font-semibold shadow-lg border-2 border-transparent hover:border-[#cae28e] transition-all duration-300"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{data?.joinTeamCTA?.buttonText || 'View Open Positions'}</span>
              <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              <span className="ml-3 flex items-center justify-center h-7 w-7 rounded-full bg-black group-hover:bg-[#cae28e] transition-all duration-300 relative z-10">
                <svg 
                  className="h-4 w-4 stroke-white group-hover:stroke-black transition-all duration-300" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  strokeWidth={2} 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TeamCelebration;