import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

// Import environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');
const DEV_SERVER_URL = 'https://api.cosmicpowertech.com';

const VideoHero = () => {
  const videoRef = useRef(null);
  const buttonRef = useRef(null);
  const sectionRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoHeroData, setVideoHeroData] = useState({
    videoSource: '/videos/zolar.mp4',
    heights: {
      mobile: '300px',
      tablet: '400px',
      desktop: '500px'
    },
    buttonSettings: {
      backgroundColor: '#cae28e',
      mobileSize: '64px',
      desktopSize: '80px',
      boxShadow: {
        mobile: '0 0 20px 5px rgba(202, 226, 142, 0.3)',
        desktop: '0 0 30px 10px rgba(202, 226, 142, 0.4)'
      }
    },
    videoSettings: {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true
    },
    interactionSettings: {
      hideButtonDelay: 2000,
      animationSpeed: 0.25
    },
    isActive: true
  });
  const [currentHeight, setCurrentHeight] = useState('300px');

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const timeoutRef = useRef(null);

  // Fetch video hero data from API
  const fetchVideoHeroData = async () => {
    try {
      console.log('Fetching video hero data from:', `${API_BASE_URL}/cms/video-hero`);
      const response = await axios.get(`${API_BASE_URL}/cms/video-hero`);
      if (response.data.success && response.data.data) {
        console.log('Video hero data received:', response.data.data);
        setVideoHeroData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching video hero data:', error);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchVideoHeroData();
  }, []);

  // Check if device is mobile and set responsive height
  useEffect(() => {
    const updateResponsiveSettings = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      // Set height based on screen size
      if (width < 768) {
        setCurrentHeight(videoHeroData.heights.mobile);
      } else if (width < 1024) {
        setCurrentHeight(videoHeroData.heights.tablet);
      } else {
        setCurrentHeight(videoHeroData.heights.desktop);
      }
    };
    
    updateResponsiveSettings();
    window.addEventListener('resize', updateResponsiveSettings);
    
    return () => window.removeEventListener('resize', updateResponsiveSettings);
  }, [videoHeroData.heights]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (video) {
      paused ? video.play() : video.pause();
      setPaused(!paused);
    }
  };

  const handleMouseMove = (e) => {
    if (!sectionRef.current || isMobile) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Keep cursor inside section bounds
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      mouse.current = { x, y };
      setShowButton(true);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowButton(false);
      }, videoHeroData.interactionSettings.hideButtonDelay);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    if (isMobile) return;
    
    const animate = () => {
      const speed = videoHeroData.interactionSettings.animationSpeed;
      pos.current.x += (mouse.current.x - pos.current.x) * speed;
      pos.current.y += (mouse.current.y - pos.current.y) * speed;

      if (buttonRef.current) {
        buttonRef.current.style.left = `${pos.current.x}px`;
        buttonRef.current.style.top = `${pos.current.y}px`;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [isMobile]);

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ cursor: isMobile ? 'auto' : 'none' }}
      onMouseMove={handleMouseMove}
      onClick={isMobile ? toggleVideo : undefined}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="w-full object-cover"
        style={{
          height: currentHeight
        }}
        autoPlay={videoHeroData.videoSettings.autoPlay}
        loop={videoHeroData.videoSettings.loop}
        muted={videoHeroData.videoSettings.muted}
        playsInline={videoHeroData.videoSettings.playsInline}
      >
        <source 
          src={videoHeroData.videoSource.startsWith('/uploads') 
            ? (import.meta.env.DEV ? `${DEV_SERVER_URL}${videoHeroData.videoSource}` : `${SERVER_URL}${videoHeroData.videoSource}`) 
            : videoHeroData.videoSource} 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>

      {/* Mobile Play/Pause Button */}
      {isMobile && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={toggleVideo}
            className={`rounded-full flex items-center justify-center transition-opacity duration-300 pointer-events-auto ${paused ? 'opacity-80' : 'opacity-0'}`}
            style={{
              width: typeof videoHeroData.buttonSettings.mobileSize === 'object' ? 
                videoHeroData.buttonSettings.mobileSize.width : 
                videoHeroData.buttonSettings.mobileSize,
              height: typeof videoHeroData.buttonSettings.mobileSize === 'object' ? 
                videoHeroData.buttonSettings.mobileSize.height : 
                videoHeroData.buttonSettings.mobileSize,
              backgroundColor: videoHeroData.buttonSettings.backgroundColor,
              boxShadow: videoHeroData.buttonSettings.boxShadow.mobile,
            }}
          >
            <span className="text-black text-xl font-bold">
              {paused ? '▶' : '❚❚'}
            </span>
          </button>
        </div>
      )}

      {/* Desktop Cursor-replacing Button */}
      {!isMobile && (
        <button
          ref={buttonRef}
          onClick={toggleVideo}
          className={`absolute z-50 rounded-full flex items-center justify-center transition-opacity duration-300 ${showButton ? 'opacity-100' : 'opacity-0'}`}
          style={{
            width: typeof videoHeroData.buttonSettings.desktopSize === 'object' ? 
              videoHeroData.buttonSettings.desktopSize.width : 
              videoHeroData.buttonSettings.desktopSize,
            height: typeof videoHeroData.buttonSettings.desktopSize === 'object' ? 
              videoHeroData.buttonSettings.desktopSize.height : 
              videoHeroData.buttonSettings.desktopSize,
            backgroundColor: videoHeroData.buttonSettings.backgroundColor,
            boxShadow: videoHeroData.buttonSettings.boxShadow.desktop,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'auto',
          }}
        >
          <span className="text-black text-2xl font-bold pointer-events-none">
            {paused ? '▶' : '❚❚'}
          </span>
        </button>
      )}
    </div>
  );
};

export default VideoHero;
