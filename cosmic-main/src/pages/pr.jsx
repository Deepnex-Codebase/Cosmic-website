import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

// Sample press releases data for fallback
export const samplePressReleases = [
  {
    _id: 1,
    title: "SS Tech Announces New Solar Panel Technology",
    publishDate: "2025-03-15",
    featuredImage: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-05.jpg",
    excerpt: "SS Tech unveils revolutionary solar panel technology with 30% higher efficiency than current market standards.",
    content: "<p>SS Tech is proud to announce the launch of our revolutionary new solar panel technology that delivers 30% higher efficiency than current market standards. This breakthrough represents years of research and development in photovoltaic technology.</p><p>The new panels feature advanced silicon cell technology and improved light absorption capabilities, making them ideal for both residential and commercial installations. With this innovation, customers can expect significantly higher energy output from smaller roof spaces.</p><p>This technology will be available starting Q2 2025 and represents our commitment to pushing the boundaries of renewable energy solutions.</p>",
    tags: ["Technology", "Innovation", "Solar Panels"]
  },
  {
    _id: 2,
    title: "SS Tech Expands Operations to Three New States",
    publishDate: "2025-02-28",
    featuredImage: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-01.jpg",
    excerpt: "Company announces major expansion into Gujarat, Maharashtra, and Karnataka with new offices and installation teams.",
    content: "<p>SS Tech is excited to announce our expansion into three new states: Gujarat, Maharashtra, and Karnataka. This strategic expansion will allow us to serve more customers across India with our premium solar solutions.</p><p>We are establishing new regional offices in Ahmedabad, Mumbai, and Bangalore, each equipped with dedicated installation teams and customer service centers. This expansion represents a significant investment in our growth and commitment to making solar energy accessible to more Indian families and businesses.</p><p>The new offices will be operational by April 2025, and we are actively hiring local talent to support our expansion efforts.</p>",
    tags: ["Expansion", "Business Growth", "New Markets"]
  },
  {
    _id: 3,
    title: "SS Tech Partners with Government for Rural Solar Initiative",
    publishDate: "2025-01-10",
    featuredImage: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-05.jpg",
    excerpt: "New partnership aims to bring solar power to 500 villages across India within the next two years.",
    content: "<p>SS Tech has entered into a landmark partnership with the Government of India to bring solar power to 500 rural villages across the country over the next two years. This initiative is part of the government's commitment to achieving universal electrification through renewable energy.</p><p>Under this partnership, SS Tech will provide solar panel installations, maintenance services, and training programs for local technicians. The project will benefit over 100,000 rural households and contribute significantly to India's renewable energy goals.</p><p>This initiative demonstrates our commitment to social responsibility and our belief that clean energy should be accessible to all communities, regardless of their location or economic status.</p>",
    tags: ["Government Partnership", "Rural Development", "Social Impact"]
  },
  {
    _id: 4,
    title: "SS Tech Receives Industry Award for Sustainability",
    publishDate: "2024-12-05",
    featuredImage: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-01.jpg",
    excerpt: "Company recognized for its commitment to environmental sustainability and carbon-neutral operations.",
    content: "<p>SS Tech has been honored with the prestigious 'Green Energy Excellence Award' for our outstanding commitment to environmental sustainability and carbon-neutral operations. This recognition comes from the Indian Renewable Energy Association (IREA).</p><p>The award recognizes our comprehensive approach to sustainability, including our carbon-neutral manufacturing processes, waste reduction initiatives, and community environmental programs. SS Tech has successfully offset 100% of our operational carbon footprint through renewable energy use and verified carbon offset programs.</p><p>We are proud to receive this recognition and remain committed to leading by example in the renewable energy industry's sustainability efforts.</p>",
    tags: ["Awards", "Sustainability", "Environmental Impact"]
  }
];

// Main PR Page Component
export default function PressReleasePage() {
  const [pressReleases, setPressReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define API_BASE_URL using environment variable
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

  // Fetch press releases from API
  useEffect(() => {
    const fetchPressReleases = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/press-releases?status=published&limit=20`);
        const data = await response.json();
        
        if (data.success) {
          setPressReleases(data.data);
        } else {
          setError('Failed to fetch press releases');
        }
      } catch (error) {
        console.error('Error fetching press releases:', error);
        setError('Failed to fetch press releases');
        // Fallback to sample data if API fails
        setPressReleases(samplePressReleases);
      } finally {
        setLoading(false);
      }
    };

    fetchPressReleases();
  }, []);

// Press Release Card Component
function PressReleaseCard({ release }) {
  return (
    <article className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-full sm:w-56 h-48 sm:h-40 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={release.featuredImage || release.image || "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-05.jpg"}
          alt={release.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-05.jpg";
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between">
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={14} strokeWidth={1.5} /> {new Date(release.publishDate || release.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <h3 className="font-semibold text-lg text-gray-900">
            {release.title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
            {release.excerpt}
          </p>
        </div>
        <Link
          to={`/pr/${release._id || release.id}`}
          className="mt-4 text-sm font-semibold text-primary hover:underline"
        >
          Read Full Release
        </Link>
      </div>
    </article>
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
          <h1 className="text-5xl font-bold mb-4">Press Releases</h1>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-[#cae28e] transition-colors">Home</Link>
            <span>—</span>
            <Link to="/blog" className="hover:text-[#cae28e] transition-colors">Blog</Link>
            <span>—</span>
            <span className="text-[#cae28e]">Press Releases</span>
          </div>
        </div>
      </div>

      {/* Press Releases Section */}
      <section className="relative bg-[#f8faf9] py-20 overflow-hidden">
        {/* faint wavy pattern (optional) */}
        <div className="absolute inset-0 pointer-events-none select-none bg-[url('/img/pattern-waves.svg')] opacity-10" />

        <div className="relative z-[1] max-w-6xl mx-auto px-4 sm:px-5">
          {/* Introduction */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Company Announcements & News</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Stay updated with the latest announcements, partnerships, and milestones from SS Tech as we continue to innovate in the solar energy industry.
            </p>
          </div>
          
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <span className="ml-4 text-gray-600">Loading press releases...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-gray-600">Showing sample press releases</p>
            </div>
          ) : pressReleases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No press releases available at the moment.</p>
            </div>
          ) : null}
          
          {/* GRID */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {pressReleases.map((release) => (
              <PressReleaseCard key={release._id || release.id} release={release} />
            ))}
          </div>

          {/* Contact Press Team */}
          <div className="mt-16 p-8 bg-white rounded-xl shadow-sm text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Media Inquiries</h3>
            <p className="text-gray-600 mb-6">
              For press inquiries, interview requests, or additional information, please contact our media relations team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:press@sstech.com" 
                className="inline-flex items-center justify-center px-6 py-3 bg-[#cae28e] text-gray-900 font-medium rounded-full hover:bg-[#b8d07c] transition-colors"
              >
                Email Press Team
              </a>
              <a 
                href="tel:+919876543210" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-full hover:bg-gray-200 transition-colors"
              >
                Call Media Relations
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}