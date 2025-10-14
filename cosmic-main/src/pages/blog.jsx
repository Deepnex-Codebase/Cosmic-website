import React, { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

/* ------------------------------------------------------------------ */
/* Blog Posts Data - Now fetched from API                               */
/* ------------------------------------------------------------------ */
// Fallback data in case API fails
export const fallbackBlogPosts = [
  {
    _id: 1,
    title: "Benefits Of Switching To Solar Energy",
    createdAt: "2025-01-30T00:00:00.000Z",
    featuredImage: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-05.jpg",
    excerpt:
      "Massa penatibus malesuada mauris ad mollis consectetur. Scelerisque potenti quam in, curae nec integer aliquam fames.",
  },
  {
    _id: 2,
    title: "How To Maintain Your Solar Panels",
    createdAt: "2025-01-30T00:00:00.000Z",
    featuredImage: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-01.jpg",
    excerpt:
      "Pulvinar quisque praesent himenaeos vel morbi egestas nisl. Adipiscing nibh augue mus duis elementum parturient felis.",
  },
  {
    _id: 3,
    title: "Design Project For Solar Panels",
    createdAt: "2025-01-30T00:00:00.000Z",
    featuredImage: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-05.jpg",
    excerpt:
      "Massa mi ridiculus suspendisse magnis aliquet donec cursus. Parturient ad ut nullam ad lorem; est elit. Mollis vitae maximus.",
  },
  {
    _id: 4,
    title: "The Various Strategies For Solar Energy",
    createdAt: "2025-01-04T00:00:00.000Z",
    featuredImage: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-01.jpg",
    excerpt:
      "Ligula habitasse donec senectus egestas litora magnis est. Ad mi nulla, fames elementum placerat potenti. Mattis mus fames.",
  },
  {
    _id: 5,
    title: "Most Common Types Of Solar Panels",
    createdAt: "2025-01-04T00:00:00.000Z",
    featuredImage: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-05.jpg",
    excerpt:
      "Leo vivamus et etiam magnis mauris taciti tortor magna et. Nulla maecenas magna dolor lobortis nisi ac, placerat lacinia.",
  },
  {
    _id: 6,
    title: "Renewable Energy Businesses Worldwide",
    createdAt: "2024-07-13T00:00:00.000Z",
    featuredImage: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-01.jpg",
    excerpt:
      "Dis dignissim amet aptent; platea odio sem aenean arcu. Felis tincidunt duis mi a magna ornare efficitur sollicitudin facilisi.",
  },
];

/* ------------------------------------------------------------------ */
/* 2-  CARD COMPONENT                                                 */
/* ------------------------------------------------------------------ */
function BlogCard({ post }) {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <article className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-full sm:w-56 h-48 sm:h-40 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={
            (post.featuredImage || post.image)
              ? ((post.featuredImage || post.image).startsWith('http')
                ? (post.featuredImage || post.image)
                : `https://api.cosmicpowertech.com${post.featuredImage || post.image}`)
              : '/placeholder-image.jpg'
          }
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between">
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={14} strokeWidth={1.5} /> {post.date || formatDate(post.createdAt)}
          </p>
          <h3 className="font-semibold text-lg text-gray-900">
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
            {post.excerpt}
          </p>
        </div>
        <Link
          to={`/blog/${post._id || post.id}`}
          className="mt-4 text-sm font-semibold text-primary hover:underline"
        >
          Read More
        </Link>
      </div>
    </article>
  );}


/* ------------------------------------------------------------------ */
/* 3-  MAIN GRID + PAGINATION                                         */
/* ------------------------------------------------------------------ */
const PAGE_SIZE = 6;        // 6 posts / page = 3 rows × 2 columns

export default function BlogGrid() {
  const [page, setPage] = useState(1);
  const { blogPosts, fetchBlogPosts } = useAppContext();
  const [searchParams] = useSearchParams();
  
  // Get category from URL query parameter
  const categoryParam = searchParams.get('category');
  
  // Fetch blog posts when component mounts or when URL parameters change
  useEffect(() => {
    fetchBlogPosts();
  }, []);
  
  // Reset page to 1 when category changes
  useEffect(() => {
    setPage(1);
  }, [categoryParam]);
  
  // Use fallback data if API fails or while loading
  const allPosts = blogPosts.length > 0 ? blogPosts : fallbackBlogPosts;
  
  // Filter posts by category if category parameter exists
  const posts = categoryParam
    ? allPosts.filter(post => {
        // Check if post has category that matches the parameter
        return post.category?.toLowerCase() === categoryParam.toLowerCase();
      })
    : allPosts.filter(post => post.status === 'published' || !post.status); // Only show published posts
  
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);

  const visible = posts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const [heroData, setHeroData] = useState({
    title: 'Our Blog',
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

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image or Video */}
      <div 
        className="relative bg-cover bg-center flex items-center justify-center"
        style={{
          height: heroData.height
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
            style={{ backgroundImage: `url('${heroData.backgroundImage}')` }}
          ></div>
        )}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black" style={{ opacity: heroData.overlayOpacity }}></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4" style={{ color: heroData.textColor }}>
          <h1 className="text-5xl font-bold mb-4">
            {categoryParam ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Articles` : heroData.title}
          </h1>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-accent-500 transition-colors" style={{ color: heroData.textColor, ':hover': { color: heroData.accentColor } }}>Home</Link>
            <span>—</span>
            <Link to="/blog" 
              className={!categoryParam ? 'transition-colors' : 'hover:text-accent-500 transition-colors'} 
              style={{ color: !categoryParam ? heroData.accentColor : heroData.textColor }}
            >Blog</Link>
            {categoryParam && (
              <>
                <span>—</span>
                <span style={{ color: heroData.accentColor }}>{categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Blog Posts Section */}
      <section className="relative bg-accent-50 py-20 overflow-hidden">

      {/* faint wavy pattern (optional) */}
      <div className="absolute inset-0 pointer-events-none select-none bg-[url('/img/pattern-waves.svg')] opacity-10" />

      <div className="relative z-[1] max-w-6xl mx-auto px-4 sm:px-5">
        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <Link 
            to="/blog" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!categoryParam ? 'bg-accent-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            All Posts
          </Link>
          <Link 
            to="/blog?category=news" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryParam === 'news' ? 'bg-accent-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            News
          </Link>
          <Link 
            to="/pr" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white text-gray-700 hover:bg-gray-100`}
          >
            Press Releases
          </Link>
        </div>
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {visible.map((post) => (
            <BlogCard key={post._id || post.id} post={post} />
          ))}
        </div>

        {/* PAGINATION */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-full border disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                page === idx + 1
                  ? "bg-accent-500 text-white"
                  : "border"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-full border disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
    </div>
  );
}
