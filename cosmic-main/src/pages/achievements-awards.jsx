import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AwardsTimeline from '../components/AwardsTimeline';
import achievementService from '../services/achievementService';

// Achievement Card Component
function AchievementCard({ achievement }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-accent-200">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={achievement.image} 
          alt={achievement.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-0 right-0 bg-accent-500 text-white px-4 py-2 rounded-bl-lg font-medium">
          {achievement.year}
        </div>
      </div>
      <div className="p-6">
        <div className="text-sm text-gray-500 mb-2">{achievement.organization}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{achievement.title}</h3>
        <p className="text-gray-600">{achievement.description}</p>
      </div>
    </div>
  );
}

// Icon mapping function
function getIconComponent(iconName) {
  const iconMap = {
    shield: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    certificate: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
    award: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228V2.721A48.133 48.133 0 0012 2.25c-2.291 0-4.545.16-6.75.47v1.516M7.73 9.728v-3.228h8.54v3.228m0 0a6.726 6.726 0 01-2.748 1.35m0 0H8.272m2.25 0V9a2.25 2.25 0 012.25-2.25V6.75" />
      </svg>
    ),
    star: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    check: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
    badge: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228V2.721A48.133 48.133 0 0012 2.25c-2.291 0-4.545.16-6.75.47v1.516M7.73 9.728v-3.228h8.54v3.228m0 0a6.726 6.726 0 01-2.748 1.35m0 0H8.272m2.25 0V9a2.25 2.25 0 012.25-2.25V6.75" />
      </svg>
    ),
    medal: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228V2.721A48.133 48.133 0 0012 2.25c-2.291 0-4.545.16-6.75.47v1.516M7.73 9.728v-3.228h8.54v3.228m0 0a6.726 6.726 0 01-2.748 1.35m0 0H8.272m2.25 0V9a2.25 2.25 0 012.25-2.25V6.75" />
      </svg>
    ),
    crown: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228V2.721A48.133 48.133 0 0012 2.25c-2.291 0-4.545.16-6.75.47v1.516M7.73 9.728v-3.228h8.54v3.228m0 0a6.726 6.726 0 01-2.748 1.35m0 0H8.272m2.25 0V9a2.25 2.25 0 012.25-2.25V6.75" />
      </svg>
    ),
    gem: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m-15 0A2.25 2.25 0 002.25 12v6.75A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V12a2.25 2.25 0 00-2.25-2.25M6.75 17.25h-.75m-.75 0h-.75m.75 0v.375c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75v-.375m0 0h.75m-2.25-1.5h.375a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-.75a.75.75 0 01.75-.75zm7.5 0h.75m.75 0h.75m-.75 0v.375c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75v-.375m0 0h.75m-2.25-1.5h.375a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75a.75.75 0 01.75-.75z" />
      </svg>
    ),
    ribbon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228V2.721A48.133 48.133 0 0012 2.25c-2.291 0-4.545.16-6.75.47v1.516M7.73 9.728v-3.228h8.54v3.228m0 0a6.726 6.726 0 01-2.748 1.35m0 0H8.272m2.25 0V9a2.25 2.25 0 012.25-2.25V6.75" />
      </svg>
    )
  };
  
  return iconMap[iconName] || iconMap.shield; // Default to shield if icon not found
}

// Certificate Section Component
function CertificateSection({ certifications }) {
  if (!certifications || !certifications.certificates) {
    return null;
  }

  return (
    <section className="py-16 bg-primary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-800 mb-4">
            {certifications.title || 'Our Certifications'}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {certifications.description || 'We maintain the highest standards of quality and safety through these industry-recognized certifications.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.certificates.map((cert, index) => (
            <div key={cert._id || index} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent-500 hover:shadow-lg transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-accent-100 rounded-full">
                {getIconComponent(cert.icon)}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
              <p className="text-gray-600">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Recognition Section Component
function RecognitionSection({ industryRecognition }) {
  if (!industryRecognition || !industryRecognition.partners) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-800 mb-4">
            {industryRecognition.title || 'Industry Recognition'}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {industryRecognition.description || 'Our commitment to excellence has been recognized by leading organizations in the renewable energy sector.'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {industryRecognition.partners.map((partner, index) => (
            <div key={partner._id || index} className="grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
              <img 
                src={partner.logo} 
                alt={partner.name || `Partner logo ${index + 1}`} 
                className="h-16 object-contain" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Achievements & Awards Page Component
export default function AchievementsAwardsPage() {
  const [achievementData, setAchievementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchAchievementData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        console.log('🔄 [ACHIEVEMENTS] Fetching achievement data... RefreshKey:', refreshKey);
        const response = await achievementService.getAchievementPage();
        console.log('📥 [ACHIEVEMENTS] API Response:', response);
        
        if (response.success) {
          setAchievementData(response.data);
          console.log('✅ [ACHIEVEMENTS] Data successfully set. Hero title:', response.data?.hero?.title);
        } else {
          console.error('❌ [ACHIEVEMENTS] API returned error:', response.error);
          setError(response.error || 'Failed to fetch achievement data');
        }
      } catch (err) {
        console.error('💥 [ACHIEVEMENTS] Exception during fetch:', err);
        setError(err.message || 'Failed to load achievement data');
      } finally {
        setLoading(false);
        console.log('🏁 [ACHIEVEMENTS] Fetch completed');
      }
    };

    fetchAchievementData();
    
    // Listen for storage events to refresh data when CMS updates (cross-tab)
    const handleStorageChange = (e) => {
      console.log('🔔 [ACHIEVEMENTS] Storage event received:', e.key, e.newValue);
      if (e.key === 'achievement_updated') {
        console.log('🔄 [ACHIEVEMENTS] Cross-tab update detected, refreshing data...');
        fetchAchievementData();
        localStorage.removeItem('achievement_updated');
      }
    };
    
    // Listen for custom events to refresh data when CMS updates (same-tab)
    const handleCustomEvent = (e) => {
      console.log('🔔 [ACHIEVEMENTS] Custom event received:', e.detail);
      console.log('🔄 [ACHIEVEMENTS] Same-tab update detected, refreshing data...');
      fetchAchievementData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('achievementDataUpdated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('achievementDataUpdated', handleCustomEvent);
    };
  }, [refreshKey]);

  // Manual refresh function
  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const {
    hero = {},
    awardWinningSolutions = {},
    certifications = {},
    industryRecognition = {},
    callToAction = {}
  } = achievementData || {};

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-cover bg-center h-[300px] flex items-center justify-center"
        style={{
          backgroundImage: `url('${hero.backgroundImage || '/quality1.jpg'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">
            {hero.title || 'Achievements & Awards'}
          </h1>
          {hero.subtitle && (
            <p className="text-xl mb-4">{hero.subtitle}</p>
          )}
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-accent-300 transition-colors">Home</Link>
            <span>—</span>
            <Link to="/blog" className="hover:text-accent-300 transition-colors">Media</Link>
            <span>—</span>
            <span className="text-accent-300">Achievements & Awards</span>
          </div>
        </div>
      </div>

      {/* Award-Winning Solar Solutions Section */}
      <section className="py-16 bg-white">
        <AwardsTimeline 
          sectionData={{
            title: awardWinningSolutions.title || 'Our Award-Winning Solar Solutions',
            subtitle: 'Recognition & Excellence'
          }}
          achievements={awardWinningSolutions.achievements || []}
        />
      </section>



      {/* Certifications Section */}
      <CertificateSection certifications={certifications} />

      {/* Industry Recognition Section */}
      <RecognitionSection industryRecognition={industryRecognition} />

      {/* Call to Action Section */}
      <section className="py-16 bg-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {callToAction.title || 'Join Our Award-Winning Team'}
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            {callToAction.description || 'Experience the difference of working with an industry leader in solar energy solutions.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={callToAction.primaryButtonLink || '/contact'} 
              className="group relative overflow-hidden inline-flex items-center justify-center rounded-full bg-accent-500 px-8 py-3 text-base font-semibold text-black shadow-lg border-2 border-transparent hover:border-accent-500 transition-all duration-300"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                {callToAction.primaryButtonText || 'Contact Us Today'}
              </span>
              <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
            </Link>
            <Link 
              to={callToAction.secondaryButtonLink || '/services'} 
              className="inline-flex items-center justify-center rounded-full bg-transparent px-8 py-3 text-base font-semibold text-white border-2 border-white hover:bg-white hover:text-primary-800 transition-all duration-300"
            >
              {callToAction.secondaryButtonText || 'Explore Our Services'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}