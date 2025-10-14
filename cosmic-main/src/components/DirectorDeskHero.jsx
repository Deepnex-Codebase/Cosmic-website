import React, { useEffect, useState } from 'react';
import { getActiveDirectorDeskHero } from '../services/directorDeskHeroService';

const DirectorDeskHero = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const response = await getActiveDirectorDeskHero();
        if (response.success && response.data) {
          setHeroData(response.data);
        } else {
          setError('No hero content available');
        }
      } catch (err) {
        console.error('Error fetching director desk hero:', err);
        setError('Failed to load hero content');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !heroData) {
    return null; // Don't show anything if there's an error or no data
  }

  return (
    <div className="relative w-full overflow-hidden">
      {heroData.mediaType === 'video' ? (
        <div className="relative w-full h-[70vh] md:h-[80vh]">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={heroData.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{heroData.title}</h1>
            {heroData.subtitle && (
              <h2 className="text-xl md:text-2xl text-white mb-6">{heroData.subtitle}</h2>
            )}
            {heroData.description && (
              <p className="text-white max-w-3xl mx-auto">{heroData.description}</p>
            )}
          </div>
        </div>
      ) : (
        <div 
          className="relative w-full h-[70vh] md:h-[80vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${heroData.mediaUrl})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{heroData.title}</h1>
            {heroData.subtitle && (
              <h2 className="text-xl md:text-2xl text-white mb-6">{heroData.subtitle}</h2>
            )}
            {heroData.description && (
              <p className="text-white max-w-3xl mx-auto">{heroData.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorDeskHero;