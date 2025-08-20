import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CompanyIntro = () => {
  const [companyIntroData, setCompanyIntroData] = useState({
    subtitle: '',
    title: '',
    description: '',
    backgroundVideo: null,
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState('');
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    fetchCompanyIntroData();
  }, []);

  const fetchCompanyIntroData = async () => {
    try {
      const response = await fetch('/api/company-intro/active');
      const result = await response.json();
      if (result.success && result.data) {
        setCompanyIntroData({
          subtitle: result.data.subtitle || '',
          title: result.data.title || '',
          description: result.data.description || '',
          backgroundVideo: null,
          isActive: result.data.isActive
        });
        setVideoPreview(result.data.backgroundVideo || '');
        setExistingData(result.data);
      }
    } catch (error) {
      console.error('Error fetching company intro data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCompanyIntroData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyIntroData(prev => ({ ...prev, backgroundVideo: file }));
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('subtitle', companyIntroData.subtitle);
      formData.append('title', companyIntroData.title);
      formData.append('description', companyIntroData.description);
      formData.append('isActive', companyIntroData.isActive);
      
      if (companyIntroData.backgroundVideo) {
        formData.append('backgroundVideo', companyIntroData.backgroundVideo);
      }

      const url = existingData 
        ? `/api/company-intro/${existingData._id}`
        : '/api/company-intro';
      
      const method = existingData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Company Intro updated successfully!');
        fetchCompanyIntroData();
      } else {
        toast.error(result.message || 'Failed to update Company Intro');
      }
    } catch (error) {
      console.error('Error updating company intro:', error);
      toast.error('Failed to update Company Intro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Intro Management</h2>
        
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

          {/* Background Video */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {videoPreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Video Preview:</p>
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-w-md h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>

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