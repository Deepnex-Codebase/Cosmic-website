import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, User2, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

// Define API_BASE_URL using environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com';

// Import the fallback blog posts data
import { fallbackBlogPosts } from './blog';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { blogPosts } = useAppContext();
  const [relatedPosts, setRelatedPosts] = useState([]);
  
  // Add hero data state
  const [heroData, setHeroData] = useState({
    backgroundImage: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/zolar-breadcrumb-bg.jpg',
    backgroundVideo: '',
    mediaType: 'image',
    overlayOpacity: 0.5,
    height: '300px',
    textColor: '#FFFFFF',
    accentColor: '#cae28e'
  });

  // Fetch hero data
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/blog-hero`);
        if (response.ok) {
          const data = await response.json();
          
          // Process background image URL if it exists
          if (data.backgroundImage && data.mediaType === 'image') {
            // If it's not an absolute URL (doesn't start with http)
            if (!data.backgroundImage.startsWith('http')) {
              // Remove /api/ prefix if present
              let processedImageUrl = data.backgroundImage;
              if (processedImageUrl.startsWith('/api/')) {
                processedImageUrl = processedImageUrl.substring(4);
              }
              
              // Ensure path starts with /
              if (!processedImageUrl.startsWith('/')) {
                processedImageUrl = '/' + processedImageUrl;
              }
              
              // Set the full image URL
              data.backgroundImage = `${imageUrl}${processedImageUrl}`;
            }
          }
          
          // Process background video URL if it exists
          if (data.backgroundVideo && data.mediaType === 'video') {
            // If it's not an absolute URL (doesn't start with http)
            if (!data.backgroundVideo.startsWith('http')) {
              // Remove /api/ prefix if present
              let processedVideoUrl = data.backgroundVideo;
              if (processedVideoUrl.startsWith('/api/')) {
                processedVideoUrl = processedVideoUrl.substring(4);
              }
              
              // Ensure path starts with /
              if (!processedVideoUrl.startsWith('/')) {
                processedVideoUrl = '/' + processedVideoUrl;
              }
              
              // Set the full video URL
              data.backgroundVideo = `${imageUrl}${processedVideoUrl}`;
            }
          }
          
          setHeroData(data);
        }
      } catch (error) {
        console.error('Error fetching blog hero data:', error);
      }
    };

    fetchHeroData();
  }, []);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
        if (response.data) {
          const blogData = response.data.data || response.data;
          setPost(blogData);
          
          // Fetch related posts (posts with similar category or tags)
          try {
            // Get all blog posts
            const allPostsResponse = await axios.get(`${API_BASE_URL}/blogs`);
            const allPosts = allPostsResponse.data.data || allPostsResponse.data;
            
            // Filter related posts (excluding current post)
            // Ideally, you would match by category or tags
            const related = allPosts
              .filter(p => p._id !== blogData._id)
              .slice(0, 3); // Limit to 3 related posts
            
            setRelatedPosts(related);
          } catch (error) {
            console.error('Error fetching related posts:', error);
            // Use posts from context as fallback for related posts
            const related = blogPosts
              .filter(p => p._id !== blogData._id || p.id !== blogData.id)
              .slice(0, 3);
            setRelatedPosts(related);
          }
          
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching blog post from API:', error);
        // If API fails, try to find in context
      }

      // If API fails or post not found, try to find in context
      const foundPost = blogPosts.find(post => 
        post._id?.toString() === id || post.id?.toString() === id
      );
      
      if (foundPost) {
        setPost(foundPost);
        // Set related posts from context
        const related = blogPosts
          .filter(p => p._id !== foundPost._id || p.id !== foundPost.id)
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        // Last resort: check fallback data
        const fallbackPost = fallbackBlogPosts.find(post => 
          post._id?.toString() === id || post.id?.toString() === id
        );
        if (fallbackPost) {
          setPost(fallbackPost);
          // Set related posts from fallback
          const related = fallbackBlogPosts
            .filter(p => p._id !== fallbackPost._id || p.id !== fallbackPost.id)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      }
      
      setLoading(false);
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id, blogPosts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="flex items-center text-primary hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image or Video */}
      <div 
        className="relative bg-cover bg-center flex items-center justify-center"
        style={{
          height: heroData?.height || '300px'
        }}
      >
        {/* Background Media - Image or Video */}
        {heroData.mediaType === 'video' && heroData.backgroundVideo ? (
          <video 
            className="absolute inset-0 w-full h-full object-cover"
            src={heroData.backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${heroData?.backgroundImage}')` }}
          ></div>
        )}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black" style={{ opacity: heroData?.overlayOpacity || 0.5 }}></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4" style={{ color: heroData?.textColor || '#FFFFFF' }}>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="transition-colors" style={{ color: heroData?.textColor || '#FFFFFF', ':hover': { color: heroData?.accentColor || '#cae28e' } }}>Home</Link>
            <span>—</span>
            <Link to="/blog" className="transition-colors" style={{ color: heroData?.textColor || '#FFFFFF', ':hover': { color: heroData?.accentColor || '#cae28e' } }}>Blog</Link>
            <span>—</span>
            <span style={{ color: heroData?.accentColor || '#cae28e' }}>{post.title}</span>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="bg-[#f8faf9] py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Back to Blog Link */}
          <Link to="/blog" className="flex items-center text-primary hover:underline mb-6 sm:mb-8">
            <ArrowLeft size={16} className="mr-2" /> Back to Blog
          </Link>
          
          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden mb-6 sm:mb-8 shadow-md">
            <img 
              src={
                (post.featuredImage || post.image)
                  ? ((post.featuredImage || post.image).startsWith('http')
                    ? (post.featuredImage || post.image)
                    : `https://api.cosmicpowertech.com${post.featuredImage || post.image}`)
                  : '/placeholder-image.jpg'
              } 
              alt={post.title} 
              className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
          
       
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} strokeWidth={1.5} /> {post.date || new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <User2 size={16} strokeWidth={1.5} /> Author: {post.author?.name || 'Admin'}
            </div>
          </div>
          
          {/* Post Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">{post.title}</h1>
          
          {/* Post Content - Now comes from CMS */}
          <div className="prose prose-base sm:prose-lg max-w-none mb-8 sm:mb-10">
            <p className="mb-3 sm:mb-4 text-base sm:text-lg font-medium">{post.excerpt}</p>
            
            {/* Render the actual content from CMS */}
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content || 'Content not available.' }}
            />
          </div>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="border-t border-b border-gray-200 py-4 sm:py-6 mb-6 sm:mb-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="flex items-center text-gray-700 font-medium mb-2 sm:mb-0">
                  <Tag size={16} className="mr-2" /> Tags:
                </span>
                {post.tags.map((tag, index) => (
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
              <Share2 size={16} className="mr-2" /> Share this article:
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
          
          {/* Related Posts */}
          <div className="border-t border-gray-200 pt-6 sm:pt-10">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Related Articles</h3>
            {relatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {relatedPosts.map(relatedPost => (
                  <div 
                    key={relatedPost._id || relatedPost.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <img 
                      src={
                        (relatedPost.featuredImage || relatedPost.image)
                          ? ((relatedPost.featuredImage || relatedPost.image).startsWith('http')
                            ? (relatedPost.featuredImage || relatedPost.image)
                            : `https://api.cosmicpowertech.com${relatedPost.featuredImage || relatedPost.image}`)
                          : '/placeholder-image.jpg'
                      } 
                      alt={relatedPost.title} 
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedPost.title}</h4>
                      <p className="text-sm text-gray-500 mb-3">
                        {relatedPost.date || new Date(relatedPost.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <Link 
                        to={`/blog/${relatedPost._id || relatedPost.id}`} 
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
                <p className="text-gray-500">No related articles found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
