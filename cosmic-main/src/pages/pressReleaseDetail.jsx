import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, User2, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import axios from 'axios';

// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

// Import the fallback press releases data
import { samplePressReleases } from './pr';

const PressReleaseDetail = () => {
  const { id } = useParams();
  const [pressRelease, setPressRelease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPressReleases, setRelatedPressReleases] = useState([]);

  useEffect(() => {
    const fetchPressRelease = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        const response = await axios.get(`${API_BASE_URL}/press-releases/${id}`);
        if (response.data) {
          const prData = response.data.data || response.data;
          setPressRelease(prData);
          
          // Fetch related press releases
          try {
            // Get all press releases
            const allPRResponse = await axios.get(`${API_BASE_URL}/press-releases`);
            const allPRs = allPRResponse.data.data || allPRResponse.data;
            
            // Filter related press releases (excluding current one)
            const related = allPRs
              .filter(pr => pr._id !== prData._id)
              .slice(0, 3); // Limit to 3 related press releases
            
            setRelatedPressReleases(related);
          } catch (error) {
            console.error('Error fetching related press releases:', error);
            // Use sample data as fallback for related press releases
            const related = samplePressReleases
              .filter(pr => pr._id !== prData._id || pr.id !== prData.id)
              .slice(0, 3);
            setRelatedPressReleases(related);
          }
          
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching press release from API:', error);
      }

      // If API fails, try to find in sample data
      const foundPR = samplePressReleases.find(pr => 
        pr._id?.toString() === id || pr.id?.toString() === id
      );
      
      if (foundPR) {
        setPressRelease(foundPR);
        // Set related press releases from sample data
        const related = samplePressReleases
          .filter(pr => pr._id !== foundPR._id || pr.id !== foundPR.id)
          .slice(0, 3);
        setRelatedPressReleases(related);
      }
      
      setLoading(false);
    };

    if (id) {
      fetchPressRelease();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pressRelease) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Press Release Not Found</h1>
        <p className="text-gray-600 mb-6">The press release you're looking for doesn't exist or has been removed.</p>
        <Link to="/pr" className="flex items-center text-primary hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Back to Press Releases
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-cover bg-center h-[300px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://zolar.wpengine.com/wp-content/uploads/2025/01/zolar-breadcrumb-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl font-bold mb-4">{pressRelease.title}</h1>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-[#cae28e] transition-colors">Home</Link>
            <span>—</span>
            <Link to="/pr" className="hover:text-[#cae28e] transition-colors">Press Releases</Link>
            <span>—</span>
            <span className="text-[#cae28e]">{pressRelease.title}</span>
          </div>
        </div>
      </div>

      {/* Press Release Content */}
      <div className="bg-[#f8faf9] py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Back to Press Releases Link */}
          <Link to="/pr" className="flex items-center text-primary hover:underline mb-6 sm:mb-8">
            <ArrowLeft size={16} className="mr-2" /> Back to Press Releases
          </Link>
          
          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden mb-6 sm:mb-8 shadow-md">
            <img 
              src={pressRelease.featuredImage || pressRelease.image} 
              alt={pressRelease.title} 
              className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover"
            />
          </div>
          
          {/* Press Release Meta */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} strokeWidth={1.5} /> {pressRelease.date || new Date(pressRelease.publishDate || pressRelease.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <User2 size={16} strokeWidth={1.5} /> Author: {pressRelease.author?.name || 'Admin'}
            </div>
          </div>
          
          {/* Press Release Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">{pressRelease.title}</h1>
          
          {/* Press Release Content */}
          <div className="prose prose-base sm:prose-lg max-w-none mb-8 sm:mb-10">
            <p className="mb-3 sm:mb-4 text-base sm:text-lg font-medium">{pressRelease.excerpt}</p>
            
            {/* Render the actual content from CMS */}
            <div 
              className="press-release-content"
              dangerouslySetInnerHTML={{ __html: pressRelease.content || 'Content not available.' }}
            />
          </div>
          
          {/* Tags */}
          {pressRelease.tags && pressRelease.tags.length > 0 && (
            <div className="border-t border-b border-gray-200 py-4 sm:py-6 mb-6 sm:mb-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="flex items-center text-gray-700 font-medium mb-2 sm:mb-0">
                  <Tag size={16} className="mr-2" /> Tags:
                </span>
                {pressRelease.tags.map((tag, index) => (
                  <span key={index} className="bg-[#e9f7d3] text-gray-800 px-3 py-1 rounded-full text-sm mb-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Social Share */}
          <div className="mb-8 sm:mb-12">
            <h3 className="flex items-center text-gray-700 font-medium mb-3">
              <Share2 size={16} className="mr-2" /> Share this press release:
            </h3>
            <div className="flex gap-3">
              <button className="bg-[#3b5998] text-white p-2 rounded-full hover:opacity-90 transition-opacity">
                <Facebook size={18} />
              </button>
              <button className="bg-[#1da1f2] text-white p-2 rounded-full hover:opacity-90 transition-opacity">
                <Twitter size={18} />
              </button>
              <button className="bg-[#0077b5] text-white p-2 rounded-full hover:opacity-90 transition-opacity">
                <Linkedin size={18} />
              </button>
            </div>
          </div>
          
          {/* Related Press Releases */}
          <div className="border-t border-gray-200 pt-6 sm:pt-10">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Related Press Releases</h3>
            {relatedPressReleases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {relatedPressReleases.map(relatedPR => (
                  <div 
                    key={relatedPR._id || relatedPR.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <img 
                      src={relatedPR.featuredImage || relatedPR.image || '/placeholder-pr.jpg'} 
                      alt={relatedPR.title} 
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedPR.title}</h4>
                      <p className="text-sm text-gray-500 mb-3">
                        {relatedPR.date || new Date(relatedPR.publishDate || relatedPR.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <Link 
                        to={`/pr/${relatedPR._id || relatedPR.id}`} 
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No related press releases found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressReleaseDetail;