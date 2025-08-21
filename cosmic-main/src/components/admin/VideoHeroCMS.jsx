import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaUpload, FaVideo, FaPlay, FaPause, FaCog } from 'react-icons/fa';
import { API_BASE_URL } from '../../config/constants';

const VideoHeroCMS = () => {
  const [videoHeroData, setVideoHeroData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    videoSource: '/videos/zolar.mp4',
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
    },
    isActive: true
  });

  // Fetch video hero data
  const fetchVideoHeroData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cms/video-hero`);
      if (response.data.success) {
        const data = response.data.data;
        setVideoHeroData(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching video hero data:', error);
      toast.error('Failed to fetch video hero data');
    } finally {
      setLoading(false);
    }
  };

  // Update video hero data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/cms/video-hero`, formData);
      if (response.data.success) {
        setVideoHeroData(response.data.data);
        toast.success('Video hero settings updated successfully!');
      }
    } catch (error) {
      console.error('Error updating video hero data:', error);
      toast.error('Failed to update video hero settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('video', file);

    try {
      setUploading(true);
      const response = await axios.post(`${API_BASE_URL}/cms/video-hero/upload`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          videoSource: response.data.data.videoPath
        }));
        toast.success('Video uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  useEffect(() => {
    fetchVideoHeroData();
  }, []);

  if (loading && !videoHeroData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaVideo className="text-2xl text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-800">Video Hero Section</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaUpload className="text-primary-600" />
              Video Upload
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Video Source
                </label>
                <input
                  type="text"
                  value={formData.videoSource}
                  onChange={(e) => handleInputChange('videoSource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="/videos/zolar.mp4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload New Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {uploading && (
                  <p className="text-sm text-blue-600 mt-1">Uploading video...</p>
                )}
              </div>
            </div>
          </div>

          {/* Height Settings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Height Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Height
                </label>
                <input
                  type="text"
                  value={formData.heights.mobile}
                  onChange={(e) => handleInputChange('heights.mobile', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="300px"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tablet Height
                </label>
                <input
                  type="text"
                  value={formData.heights.tablet}
                  onChange={(e) => handleInputChange('heights.tablet', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="400px"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desktop Height
                </label>
                <input
                  type="text"
                  value={formData.heights.desktop}
                  onChange={(e) => handleInputChange('heights.desktop', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="500px"
                />
              </div>
            </div>
          </div>

          {/* Button Settings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Button Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Background Color
                </label>
                <input
                  type="color"
                  value={formData.buttonSettings.backgroundColor}
                  onChange={(e) => handleInputChange('buttonSettings.backgroundColor', e.target.value)}
                  className="w-20 h-10 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={formData.buttonSettings.backgroundColor}
                  onChange={(e) => handleInputChange('buttonSettings.backgroundColor', e.target.value)}
                  className="ml-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="#cae28e"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Mobile Button Size</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Width</label>
                      <input
                        type="text"
                        value={formData.buttonSettings.mobileSize.width}
                        onChange={(e) => handleInputChange('buttonSettings.mobileSize.width', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="64px"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Height</label>
                      <input
                        type="text"
                        value={formData.buttonSettings.mobileSize.height}
                        onChange={(e) => handleInputChange('buttonSettings.mobileSize.height', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="64px"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Desktop Button Size</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Width</label>
                      <input
                        type="text"
                        value={formData.buttonSettings.desktopSize.width}
                        onChange={(e) => handleInputChange('buttonSettings.desktopSize.width', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="80px"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Height</label>
                      <input
                        type="text"
                        value={formData.buttonSettings.desktopSize.height}
                        onChange={(e) => handleInputChange('buttonSettings.desktopSize.height', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="80px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Settings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaCog className="text-primary-600" />
              Video Settings
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoPlay"
                  checked={formData.videoSettings.autoPlay}
                  onChange={(e) => handleInputChange('videoSettings.autoPlay', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="autoPlay" className="text-sm font-medium text-gray-700">
                  Auto Play
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="loop"
                  checked={formData.videoSettings.loop}
                  onChange={(e) => handleInputChange('videoSettings.loop', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="loop" className="text-sm font-medium text-gray-700">
                  Loop
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="muted"
                  checked={formData.videoSettings.muted}
                  onChange={(e) => handleInputChange('videoSettings.muted', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="muted" className="text-sm font-medium text-gray-700">
                  Muted
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="playsInline"
                  checked={formData.videoSettings.playsInline}
                  onChange={(e) => handleInputChange('videoSettings.playsInline', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="playsInline" className="text-sm font-medium text-gray-700">
                  Plays Inline
                </label>
              </div>
            </div>
          </div>

          {/* Interaction Settings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Interaction Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hide Button Delay (ms)
                </label>
                <input
                  type="number"
                  value={formData.interactionSettings.hideButtonDelay}
                  onChange={(e) => handleInputChange('interactionSettings.hideButtonDelay', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="2000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animation Speed
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.interactionSettings.animationSpeed}
                  onChange={(e) => handleInputChange('interactionSettings.animationSpeed', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.25"
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (Show on website)
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 flex items-center gap-2"
            >
              <FaSave />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      {formData.videoSource && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="relative w-full overflow-hidden rounded-lg">
            <video
              src={formData.videoSource.startsWith('http') ? formData.videoSource : `${window.location.origin}${formData.videoSource}`}
              className="w-full object-cover"
              style={{ height: formData.heights.desktop }}
              autoPlay={formData.videoSettings.autoPlay}
              loop={formData.videoSettings.loop}
              muted={formData.videoSettings.muted}
              playsInline={formData.videoSettings.playsInline}
              controls
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoHeroCMS;