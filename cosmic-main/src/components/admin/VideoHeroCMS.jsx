import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaUpload, FaVideo } from 'react-icons/fa';

// Import environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';
const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

const VideoHeroCMS = () => {
  const [loading, setLoading] = useState(false);
  const [videoHeroData, setVideoHeroData] = useState({
    videoSource: '',
    heights: {
      mobile: '300px',
      tablet: '400px',
      desktop: '500px'
    },
    buttonSettings: {
      backgroundColor: '#cae28e',
      mobileSize: {
        width: '64px',
        height: '64px'
      },
      desktopSize: {
        width: '80px',
        height: '80px'
      },
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
    }
  });

  // Fetch video hero data
  const fetchVideoHeroData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cms/video-hero`);
      
      if (response.data.success && response.data.data) {
        setVideoHeroData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch video hero data');
    } finally {
      setLoading(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (200MB max)
    if (file.size > 200 * 1024 * 1024) {
      toast.error('Video file size must be less than 200MB');
      return;
    }

    // Validate file type
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, AVI, MOV, WMV, FLV, WEBM)');
      return;
    }

    try {
      setLoading(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('video', file);

      // Upload video
      const response = await axios.post(`${API_BASE_URL}/cms/video-hero/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Use the videoPath directly from the server response
        // The server now returns the relative path that we can use
        const { videoPath } = response.data.data;
        
        // Update local state with the new video source
        setVideoHeroData(prev => ({
          ...prev,
          videoSource: videoPath
        }));
        
        toast.success('Video uploaded successfully');
        
        // Refresh data to ensure we have the latest from the server
        fetchVideoHeroData();
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (section, field, value) => {
    setVideoHeroData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (field, value) => {
    setVideoHeroData(prev => ({
      ...prev,
      videoSettings: {
        ...prev.videoSettings,
        [field]: value
      }
    }));
  };

  // Save video hero data
  const saveVideoHeroData = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/cms/video-hero`, videoHeroData);
      
      if (response.data.success) {
        toast.success('Video hero settings saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save video hero settings');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchVideoHeroData();
  }, []);

  // Process video source URL for preview
  const getVideoSrc = () => {
    if (!videoHeroData.videoSource) return '';
    
    let videoSrc = '';
    console.log('Original videoSource:', videoHeroData.videoSource);
    
    // If it's already a full URL with http/https, use it directly
    if (videoHeroData.videoSource.startsWith('http')) {
      videoSrc = videoHeroData.videoSource;
    } 
    // If it starts with /uploads, it's from the server uploads directory
    else if (videoHeroData.videoSource.startsWith('/uploads')) {
      // Format to match the server URL pattern
      const cleanPath = videoHeroData.videoSource.replace(/^\/+/, '');
      videoSrc = `${SERVER_URL}/${cleanPath}`;
    } 
    // If it starts with /videos, it's from the public directory
    else if (videoHeroData.videoSource.startsWith('/videos')) {
      videoSrc = `${window.location.origin}${videoHeroData.videoSource}`;
    } 
    // For any other relative path
    else {
      videoSrc = `${window.location.origin}/${videoHeroData.videoSource.replace(/^\/+/, '')}`;
    }
    
    console.log('Processed videoSrc:', videoSrc);
    return videoSrc;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Video Hero Settings</h2>
      
      {/* Video Upload Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Video</h3>
        
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Supported formats: MP4, AVI, MOV, WMV, FLV, WEBM (max 200MB)
            </p>
          </div>
          
          {videoHeroData.videoSource && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Video Source
              </label>
              <div className="text-sm text-gray-500 mb-2">
                {videoHeroData.videoSource}
              </div>
              
              <div className="aspect-video max-h-[300px] overflow-hidden rounded-lg bg-gray-100">
                <video 
                  src={getVideoSrc()} 
                  controls 
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Height Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Height Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Height
            </label>
            <input
              type="text"
              value={videoHeroData.heights.mobile}
              onChange={(e) => handleInputChange('heights', 'mobile', e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="300px"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tablet Height
            </label>
            <input
              type="text"
              value={videoHeroData.heights.tablet}
              onChange={(e) => handleInputChange('heights', 'tablet', e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="400px"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desktop Height
            </label>
            <input
              type="text"
              value={videoHeroData.heights.desktop}
              onChange={(e) => handleInputChange('heights', 'desktop', e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="500px"
            />
          </div>
        </div>
      </div>
      
      {/* Button Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Button Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={videoHeroData.buttonSettings.backgroundColor}
                onChange={(e) => handleInputChange('buttonSettings', 'backgroundColor', e.target.value)}
                className="h-10 w-10 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={videoHeroData.buttonSettings.backgroundColor}
                onChange={(e) => handleInputChange('buttonSettings', 'backgroundColor', e.target.value)}
                className="flex-1 p-2 border rounded-md"
                placeholder="#cae28e"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Video Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoPlay"
              checked={videoHeroData.videoSettings.autoPlay}
              onChange={(e) => handleCheckboxChange('autoPlay', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="autoPlay" className="ml-2 text-sm text-gray-700">
              Auto Play
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="loop"
              checked={videoHeroData.videoSettings.loop}
              onChange={(e) => handleCheckboxChange('loop', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="loop" className="ml-2 text-sm text-gray-700">
              Loop
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="muted"
              checked={videoHeroData.videoSettings.muted}
              onChange={(e) => handleCheckboxChange('muted', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="muted" className="ml-2 text-sm text-gray-700">
              Muted
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="playsInline"
              checked={videoHeroData.videoSettings.playsInline}
              onChange={(e) => handleCheckboxChange('playsInline', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="playsInline" className="ml-2 text-sm text-gray-700">
              Plays Inline
            </label>
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveVideoHeroData}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Saving...' : (
            <>
              <FaSave className="mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoHeroCMS;