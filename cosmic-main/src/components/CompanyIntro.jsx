// src/components/CompanyIntro.jsx
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

export default function CompanyIntro() {
  const [companyIntroData, setCompanyIntroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyIntroData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/company-intro/active`);
        const result = await response.json();
        console.log('Company Intro API Response:', result);
        if (result.success && result.data) {
          setCompanyIntroData(result.data);
          console.log('Company Intro Data Set:', result.data);
        }
      } catch (error) {
        console.error('Error fetching company intro data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyIntroData();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full h-[600px] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source 
          src={
            companyIntroData?.backgroundVideo 
              ? (companyIntroData.backgroundVideo.startsWith('http') 
                ? companyIntroData.backgroundVideo 
                : companyIntroData.backgroundVideo.startsWith('/uploads/') 
                  ? `${API_BASE_URL.replace(/\/api$/, '')}${companyIntroData.backgroundVideo}` 
                  : `${API_BASE_URL.replace(/\/api$/, '')}/uploads/${companyIntroData.backgroundVideo.replace(/^\//, '')}`
                )
              : "/videos/about.mp4"
          } 
          type="video/mp4" 
        />
        {/* Adding console log for debugging */}
        {companyIntroData?.backgroundVideo && console.log('Final video path:', 
          companyIntroData.backgroundVideo.startsWith('http') 
            ? companyIntroData.backgroundVideo 
            : companyIntroData.backgroundVideo.startsWith('/uploads/') 
              ? `${API_BASE_URL.replace(/\/api$/, '')}${companyIntroData.backgroundVideo}` 
              : `${API_BASE_URL.replace(/\/api$/, '')}/uploads/${companyIntroData.backgroundVideo.replace(/^\//, '')}`
        )}
        
        
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center h-full px-6 max-w-4xl text-left">
        <p className="text-[#cae28e] text-base md:text-lg font-semibold border-l-4 border-[#cae28e] pl-3 mb-4 font-space-grotesk">
          {companyIntroData?.subtitle || "The Cosmic Powertech"}
        </p>

        <h1 className="text-white text-3xl md:text-5xl font-bold leading-snug md:leading-snug mb-4 font-space-grotesk">
          {companyIntroData?.title ? (
            <div 
              dangerouslySetInnerHTML={{ __html: companyIntroData.title }}
              className="text-white [&_span.highlight]:text-[#cae28e] [&_span]:text-[#cae28e]"
            />
          ) : (
            <>
              Leader in the production of <span className="text-[#cae28e]">High-tech</span> and{' '}
              <span className="text-[#cae28e]">High-performance</span> solar panels
            </>
          )}
        </h1>

        <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">
          {companyIntroData?.description || "We are committed to delivering cutting-edge solar solutions that transform how businesses and homes harness energy. Our expertise in high-performance solar technology sets new industry standards for efficiency and reliability."}
        </p>
      </div>
    </section>
  );
}
