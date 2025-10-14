import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaSave, FaTimes, FaImage, FaVideo } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const IMAGE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8000';

const BlogHeroCMS = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [heroData, setHeroData] = useState({
    title: 'Our Blog',
    backgroundImage: '',
    backgroundVideo: '',
    mediaType: 'image', // 'image' or 'video'
    overlayOpacity: 0.5,
    height: '300px',
    textColor: '#FFFFFF',
    accentColor: '#cae28e'
  });
  const [backgroundMedia, setBackgroundMedia] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);

  // Fetch blog hero data
  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/blog-hero`);
      if (response.data) {
        setHeroData(response.data);
        // Convert opacity from 0-1 to 0-100 for the slider
        if (response.data.overlayOpacity !== undefined) {
          response.data.overlayOpacity = response.data.overlayOpacity * 100;
        }
        
        // Determine media type (image or video)
        const mediaType = response.data.mediaType || 'image';
        
        if (mediaType === 'image' && response.data.backgroundImage) {
          console.log('Original image URL:', response.data.backgroundImage);
          let imageUrl = response.data.backgroundImage;
          if (imageUrl && !imageUrl.startsWith('http')) {
            // Remove /api/ prefix if present
            if (imageUrl.startsWith('/api/')) {
              imageUrl = imageUrl.substring(4); // Remove '/api'
            }
            // Ensure path starts with /
            if (!imageUrl.startsWith('/')) {
              imageUrl = '/' + imageUrl;
            }
            // Use IMAGE_URL for image paths
            imageUrl = `${IMAGE_URL}${imageUrl}`;
          }
          console.log('Processed image URL:', imageUrl);
          setPreviewMedia(imageUrl);
        } 
        else if (mediaType === 'video' && response.data.backgroundVideo) {
          console.log('Original video URL:', response.data.backgroundVideo);
          let videoUrl = response.data.backgroundVideo;
          if (videoUrl && !videoUrl.startsWith('http')) {
            // Remove /api/ prefix if present
            if (videoUrl.startsWith('/api/')) {
              videoUrl = videoUrl.substring(4); // Remove '/api'
            }
            // Ensure path starts with /
            if (!videoUrl.startsWith('/')) {
              videoUrl = '/' + videoUrl;
            }
            // Use IMAGE_URL for video paths as well
            videoUrl = `${IMAGE_URL}${videoUrl}`;
          }
          console.log('Processed video URL:', videoUrl);
          setPreviewMedia(videoUrl);
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching blog hero data:', err);
      setError('Failed to load blog hero data');
      toast.error('Failed to load blog hero data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setHeroData({
      ...heroData,
      [name]: type === 'range' ? parseFloat(value) / 100 : value
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image or video
      const fileType = file.type.split('/')[0];
      const mediaType = fileType === 'video' ? 'video' : 'image';
      
      // Update state
      setBackgroundMedia(file);
      setPreviewMedia(URL.createObjectURL(file));
      setHeroData({
        ...heroData,
        mediaType
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Create FormData object for file upload
      const formData = new FormData();
      
      // Add all text fields
      formData.append('title', heroData.title);
      formData.append('overlayOpacity', heroData.overlayOpacity);
      formData.append('height', heroData.height);
      formData.append('textColor', heroData.textColor);
      formData.append('accentColor', heroData.accentColor);
      formData.append('mediaType', heroData.mediaType);
      
      // Add media file if selected
      if (backgroundMedia) {
        if (heroData.mediaType === 'image') {
          formData.append('backgroundImage', backgroundMedia);
        } else if (heroData.mediaType === 'video') {
          formData.append('backgroundVideo', backgroundMedia);
        }
      }
      
      // Send update request
      const response = await axios.put(`${API_URL}/blog-hero`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      if (response.data) {
        toast.success('Blog hero updated successfully');
        fetchHeroData();
        setEditing(false);
      }
    } catch (err) {
      console.error('Error updating blog hero:', err);
      setError('Failed to update blog hero');
      toast.error('Failed to update blog hero');
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditing(false);
    fetchHeroData();
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blog Hero Section Management</h1>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            >
              <FaEdit className="mr-2" /> Edit Hero Section
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
              >
                <FaSave className="mr-2" /> Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Preview Section */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div 
                className="relative rounded-lg overflow-hidden"
                style={{ height: heroData.height }}
              >
                {heroData.mediaType === 'image' ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${previewMedia}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                ) : (
                  <video 
                    className="absolute inset-0 w-full h-full object-cover"
                    src={previewMedia}
                    autoPlay
                    muted
                    loop
                  ></video>
                )}
                <div 
                  className="absolute inset-0 bg-black" 
                  style={{ opacity: heroData.overlayOpacity }}
                ></div>
                <div 
                  className="relative z-10 text-center p-8 flex flex-col items-center justify-center h-full"
                  style={{ color: heroData.textColor }}
                >
                  <h1 className="text-4xl font-bold mb-4">{heroData.title}</h1>
                  <div className="flex items-center space-x-2">
                    <span>Home</span>
                    <span>—</span>
                    <span style={{ color: heroData.accentColor }}>Blog</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {editing && (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={heroData.title}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Height (e.g., 300px, 30vh)
                    </label>
                    <input
                      type="text"
                      name="height"
                      value={heroData.height}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Media Type Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Media Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="mediaType"
                          value="image"
                          checked={heroData.mediaType === 'image'}
                          onChange={handleChange}
                          className="form-radio h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 flex items-center"><FaImage className="mr-1" /> Image</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="mediaType"
                          value="video"
                          checked={heroData.mediaType === 'video'}
                          onChange={handleChange}
                          className="form-radio h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 flex items-center"><FaVideo className="mr-1" /> Video</span>
                      </label>
                    </div>
                  </div>

                  {/* Background Media (Image or Video) */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">
                      {heroData.mediaType === 'image' ? 'Background Image' : 'Background Video'} 
                      <span className="text-sm text-gray-500 ml-2">(Max size: 100MB)</span>
                    </label>
                    <input
                      type="file"
                      name="backgroundMedia"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept={heroData.mediaType === 'image' ? "image/*" : "video/*"}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {heroData.mediaType === 'image' 
                        ? 'Recommended size: 1920x1080px or larger' 
                        : 'Recommended format: MP4, WebM (16:9 aspect ratio)'}
                    </p>
                  </div>

                  {/* Current Media Info */}
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mt-1">
                      Current {heroData.mediaType === 'image' ? 'image' : 'video'}: 
                      {heroData.mediaType === 'image' 
                        ? (heroData.backgroundImage || 'Default image')
                        : (heroData.backgroundVideo || 'No video set')}
                    </p>
                  </div>

                  {/* Overlay Opacity */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Overlay Opacity: {heroData.overlayOpacity}
                    </label>
                    <input
                      type="range"
                      name="overlayOpacity"
                      min="0"
                      max="100"
                      value={heroData.overlayOpacity * 100}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        name="textColor"
                        value={heroData.textColor}
                        onChange={handleChange}
                        className="h-10 w-10 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        name="textColor"
                        value={heroData.textColor}
                        onChange={handleChange}
                        className="ml-2 flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Accent Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        name="accentColor"
                        value={heroData.accentColor}
                        onChange={handleChange}
                        className="h-10 w-10 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        name="accentColor"
                        value={heroData.accentColor}
                        onChange={handleChange}
                        className="ml-2 flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogHeroCMS;