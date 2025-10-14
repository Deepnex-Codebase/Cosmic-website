import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

const CompanyIntro = () => {
  const [companyIntroData, setCompanyIntroData] = useState({
    subtitle: '',
    title: '',
    description: '',
    backgroundVideo: null,
    backgroundImage: null,
    mediaType: 'video',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState('');
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    fetchCompanyIntroData();
  }, []);

  const fetchCompanyIntroData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-intro/active`);
      const result = await response.json();
      if (result.success && result.data) {
        setCompanyIntroData({
          subtitle: result.data.subtitle || '',
          title: result.data.title || '',
          description: result.data.description || '',
          backgroundVideo: null,
          backgroundImage: null,
          mediaType: result.data.mediaType || 'video',
          isActive: result.data.isActive
        });
        
        // Determine which media to display based on mediaType
        if (result.data.mediaType === 'image' && result.data.backgroundImage) {
          // Format image URL
          let imageUrl = result.data.backgroundImage || '';
          if (imageUrl) {
            if (imageUrl.startsWith('http')) {
              // Already a full URL, keep as is
              imageUrl = imageUrl;
            } else if (imageUrl.startsWith('/uploads/')) {
              // Path starts with /uploads/, append to API base
              imageUrl = `${API_BASE_URL.replace(/\/api$/, '')}${imageUrl}`;
            } else {
              // Assume it's a filename or relative path
              imageUrl = `${API_BASE_URL.replace(/\/api$/, '')}/uploads/company-intro/${imageUrl.replace(/^\//, '')}`;
            }
          }
          setMediaPreview(imageUrl);
        } else {
          // Format video URL if it exists
          let videoUrl = result.data.backgroundVideo || '';
          if (videoUrl) {
            if (videoUrl.startsWith('http')) {
              // Already a full URL, keep as is
              videoUrl = videoUrl;
            } else if (videoUrl.startsWith('/uploads/')) {
              // Path starts with /uploads/, append to API base
              videoUrl = `${API_BASE_URL.replace(/\/api$/, '')}${videoUrl}`;
            } else if (videoUrl.startsWith('/videos/')) {
              // Path starts with /videos/, append to API base
              videoUrl = `${API_BASE_URL.replace(/\/api$/, '')}${videoUrl}`;
            } else {
              // Assume it's a filename or relative path
              videoUrl = `${API_BASE_URL.replace(/\/api$/, '')}/uploads/company-intro/${videoUrl.replace(/^\//, '')}`;
            }
          }
          setMediaPreview(videoUrl);
        }
        
        setExistingData(result.data);
      }
    } catch (error) {
      // Error handling
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCompanyIntroData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMediaTypeChange = (e) => {
    const mediaType = e.target.value;
    setCompanyIntroData(prev => ({
      ...prev,
      mediaType
    }));
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (200MB limit)
    if (file.size > 200 * 1024 * 1024) {
      toast.error('Video size exceeds 200MB limit. Please upload a smaller file.');
      return;
    }
    
    // Check file type
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, AVI, MOV, WMV, FLV, WEBM)');
      return;
    }

    try {
      setLoading(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('backgroundVideo', file);

      // Upload video directly
      const response = await fetch(`${API_BASE_URL}/company-intro/upload-video`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Use the videoPath directly from the server response
        const { relativePath } = result.data;
        
        // Update local state with the new video source
        setCompanyIntroData(prev => ({
          ...prev,
          backgroundVideo: relativePath,
          mediaType: 'video'
        }));
        
        // Set media preview URL
        const videoUrl = `${API_BASE_URL.replace(/\/api$/, '')}${relativePath}`;
        setMediaPreview(videoUrl);
        
        toast.success('Video uploaded successfully');
        
        // Refresh data to ensure we have the latest from the server
        fetchCompanyIntroData();
      } else {
        toast.error(result.message || 'Failed to upload video');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, JPG, WEBP, GIF)');
      return;
    }

    try {
      setLoading(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('backgroundImage', file);

      // Upload image directly
      const response = await fetch(`${API_BASE_URL}/company-intro/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Use the imagePath directly from the server response
        const { relativePath } = result.data;
        
        // Update local state with the new image source
        setCompanyIntroData(prev => ({
          ...prev,
          backgroundImage: relativePath,
          mediaType: 'image'
        }));
        
        // Set media preview URL
        const imageUrl = `${API_BASE_URL.replace(/\/api$/, '')}${relativePath}`;
        setMediaPreview(imageUrl);
        
        toast.success('Image uploaded successfully');
        
        // Refresh data to ensure we have the latest from the server
        fetchCompanyIntroData();
      } else {
        toast.error(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create data object instead of FormData since media is uploaded separately
      const data = {
        subtitle: companyIntroData.subtitle,
        title: companyIntroData.title,
        description: companyIntroData.description,
        mediaType: companyIntroData.mediaType,
        isActive: companyIntroData.isActive
      };
      
      // Include the appropriate media path based on mediaType
      if (companyIntroData.mediaType === 'video' && companyIntroData.backgroundVideo && typeof companyIntroData.backgroundVideo === 'string') {
        data.backgroundVideo = companyIntroData.backgroundVideo;
      } else if (companyIntroData.mediaType === 'image' && companyIntroData.backgroundImage && typeof companyIntroData.backgroundImage === 'string') {
        data.backgroundImage = companyIntroData.backgroundImage;
      }

      const url = existingData 
        ? `${API_BASE_URL}/company-intro/${existingData._id}`
        : `${API_BASE_URL}/company-intro`;
      
      const method = existingData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include' // Include cookies if needed
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Company Intro updated successfully!');
        fetchCompanyIntroData();
      } else {
        toast.error(result.message || 'Failed to update Company Intro');
      }
    } catch (error) {
      toast.error('Failed to update Company Intro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Intro Management</h2>
        
        {/* File Upload Information */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Video Upload Guidelines:</h4>
          <ul className="text-xs text-blue-700 list-disc pl-4">
            <li>Maximum file size: 200MB</li>
            <li>Supported formats: MP4, AVI, MOV, WMV, FLV, WEBM</li>
            <li>Recommended resolution: 1920x1080 (16:9 ratio)</li>
            <li>For best performance, use compressed MP4 files</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={companyIntroData.subtitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subtitle (e.g., The Cosmic Powertech)"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (HTML supported for highlighting)
            </label>
            <textarea
              name="title"
              value={companyIntroData.title}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='Enter title with HTML tags for highlighting (e.g., Leader in <span class="highlight">High-tech</span> solar panels)'
            />
            <p className="text-sm text-gray-500 mt-1">
              Use <code>&lt;span class="highlight"&gt;text&lt;/span&gt;</code> or <code>&lt;span&gt;text&lt;/span&gt;</code> to highlight words in green color. Rest of the text will remain white.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={companyIntroData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
          </div>

          {/* Media Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Media Type
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="mediaType"
                  value="video"
                  checked={companyIntroData.mediaType === 'video'}
                  onChange={handleMediaTypeChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Video</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="mediaType"
                  value="image"
                  checked={companyIntroData.mediaType === 'image'}
                  onChange={handleMediaTypeChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Image</span>
              </label>
            </div>
          </div>

          {/* Background Media Upload */}
          {companyIntroData.mediaType === 'video' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Video
              </label>
              <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <ul className="text-xs text-blue-700 list-disc pl-4">
                  <li>Maximum file size: 200MB</li>
                  <li>Supported formats: MP4, AVI, MOV, WMV, FLV, WEBM</li>
                  <li>Recommended resolution: 1920x1080 (16:9 ratio)</li>
                </ul>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {mediaPreview && companyIntroData.mediaType === 'video' && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Video Preview:</p>
                  <video
                    src={mediaPreview}
                    controls
                    className="w-full max-w-md h-48 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image
              </label>
              <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <ul className="text-xs text-blue-700 list-disc pl-4">
                  <li>Maximum file size: 10MB</li>
                  <li>Supported formats: JPEG, PNG, JPG, WEBP, GIF</li>
                  <li>Recommended resolution: 1920x1080 (16:9 ratio)</li>
                </ul>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {mediaPreview && companyIntroData.mediaType === 'image' && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                  <img
                    src={mediaPreview}
                    alt="Background preview"
                    className="w-full max-w-md h-48 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={companyIntroData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Company Intro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyIntro;