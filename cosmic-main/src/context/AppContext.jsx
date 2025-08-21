import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// API base URL - using relative URL for proxy to work correctly
const API_BASE_URL = '/api';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // State for different data types
  const [blogPosts, setBlogPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [energySolutions, setEnergySolutions] = useState([]);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [settings, setSettings] = useState({});
  const [co2Reductions, setCo2Reductions] = useState([]);
  const [intelligentSolutions, setIntelligentSolutions] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    blog: false,
    projects: false,
    hero: false,
    solutions: false,
    products: false,
    testimonials: false,
    team: false,
    faqs: false,
    settings: false,
    co2Reductions: false,
    intelligentSolutions: false
  });
  
  // Error states
  const [errors, setErrors] = useState({
    blog: null,
    projects: null,
    hero: null,
    solutions: null,
    products: null,
    testimonials: null,
    team: null,
    faqs: null,
    settings: null,
    co2Reductions: null,
    intelligentSolutions: null
  });

  // API calls
  // Fetch homepage data (hero slides, blog posts, projects, products, testimonials, team members)
  const fetchHomepageData = async () => {
    setLoading(true);
    try {
      console.log('Fetching homepage data...');
      
      // Fetch hero slides
      console.log('Fetching hero slides...');
      const heroRes = await axios.get('/api/heroes/active');
      console.log('Hero slides API response:', heroRes.data);
      console.log('Hero slides API response data:', JSON.stringify(heroRes.data.data, null, 2));
      
      if (heroRes.data.success && heroRes.data.data.length > 0) {
        console.log(`Setting ${heroRes.data.data.length} hero slides`);
        console.log('Hero slides data being set:', heroRes.data.data);
        setHeroSlides(heroRes.data.data);
        
        // Verify after setting
        setTimeout(() => {
          console.log('Current heroSlides state after setting:', heroSlides);
        }, 100);
        
        // Additional verification after a longer delay
        setTimeout(() => {
          console.log('Verifying heroSlides state after 1 second:', heroSlides);
          console.log('Number of hero slides available:', heroSlides ? heroSlides.length : 0);
          console.log('Are hero slides an array?', Array.isArray(heroSlides));
        }, 1000);
      } else {
        console.warn('No hero slides found or API returned error');
        setHeroSlides([]);
      }
      
      // Fetch blog posts
      try {
        const blogRes = await axios.get('/api/blogs?status=published');
        if (blogRes.data && blogRes.data.data) {
          setBlogPosts(blogRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setBlogPosts([]);
      }
      
      const response = await axios.get(`${API_BASE_URL}/homepage`);
      const data = response.data;
      
      // Update all states with homepage data except hero slides which we already fetched
      setEnergySolutions(data.energySolutions || []);
      setProducts(data.products || []);
      setProjects(data.projects || []);
      setTestimonials(data.testimonials || []);
      setTeamMembers(data.teamMembers || []);
      setBlogPosts(data.blogPosts || []);
      setFaqs(data.faqs || []);
      setSettings(data.settings || {});
      
      setErrors(prev => ({ ...prev, blog: null, projects: null, hero: null, solutions: null, products: null, testimonials: null, team: null, faqs: null }));
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      setErrors(prev => ({ 
        ...prev, 
        blog: error.message,
        projects: error.message,
        hero: error.message,
        solutions: error.message,
        products: error.message,
        testimonials: error.message,
        team: error.message,
        faqs: error.message
      }));
    } finally {
      setLoading(prev => ({ ...prev, blog: false, projects: false, hero: false, solutions: false, products: false, testimonials: false, team: false, faqs: false }));
    }
  };

  const fetchAboutPageData = async () => {
    setLoading(prev => ({ ...prev, team: true, testimonials: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/about`);
      const data = response.data;
      
      // Update states with about page data
      setTeamMembers(data.teamMembers || []);
      setTestimonials(data.testimonials || []);
      setSettings(data.settings || {});
      
      setErrors(prev => ({ ...prev, team: null, testimonials: null }));
    } catch (error) {
      console.error('Error fetching about page data:', error);
      setErrors(prev => ({ ...prev, team: error.message, testimonials: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, team: false, testimonials: false }));
    }
  };

  // Fetch blog posts
  const fetchBlogPosts = async (params = {}) => {
    setLoading(prev => ({ ...prev, blog: true }));
    try {
      // Use the new blog API endpoint
      const response = await axios.get(`${API_BASE_URL}/blogs`, { params });
      // Ensure blogPosts is always an array
      const posts = Array.isArray(response.data.data) ? response.data.data : [];
      setBlogPosts(posts);
      setErrors(prev => ({ ...prev, blog: null }));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setErrors(prev => ({ ...prev, blog: error.message }));
      // Set empty array as fallback
      setBlogPosts([]);
    } finally {
      setLoading(prev => ({ ...prev, blog: false }));
    }
  };

  // Fetch projects
  const fetchProjects = async (params = {}) => {
    setLoading(prev => ({ ...prev, projects: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`, { params });
      // Check if response.data.data is an array before setting it
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setProjects(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        // If response.data is directly an array (possible API format difference in production)
        setProjects(response.data);
      } else {
        console.error('Projects data is not in expected format:', response.data);
        // Set projects to empty array if data is not in expected format
        setProjects([]);
      }
      setErrors(prev => ({ ...prev, projects: null }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      setErrors(prev => ({ ...prev, projects: error.message }));
      // Set projects to empty array on error
      setProjects([]);
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }
  };

  // Fetch products
  const fetchProducts = async (params = {}) => {
    setLoading(prev => ({ ...prev, products: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { params });
      setProducts(response.data.data);
      setErrors(prev => ({ ...prev, products: null }));
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrors(prev => ({ ...prev, products: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const fetchContactMessages = async () => {
    setLoading(prev => ({ ...prev, contacts: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/contacts`);
      setContactMessages(response.data.data || []);
      setErrors(prev => ({ ...prev, contacts: null }));
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      setErrors(prev => ({ ...prev, contacts: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  };
  
  // Fetch testimonials
  const fetchTestimonials = async () => {
    setLoading(prev => ({ ...prev, testimonials: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/testimonials`);
      setTestimonials(response.data.data || []);
      setErrors(prev => ({ ...prev, testimonials: null }));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setErrors(prev => ({ ...prev, testimonials: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, testimonials: false }));
    }
  };
  
  // Fetch team members
  const fetchTeamMembers = async () => {
    setLoading(prev => ({ ...prev, team: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/team`);
      setTeamMembers(response.data.data || []);
      setErrors(prev => ({ ...prev, team: null }));
    } catch (error) {
      console.error('Error fetching team members:', error);
      setErrors(prev => ({ ...prev, team: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, team: false }));
    }
  };
  
  // Fetch FAQs
  const fetchFaqs = async () => {
    setLoading(prev => ({ ...prev, faqs: true }));
    try {
      // Use the config service endpoint to fetch FAQs from solar_company_profile.json
      const response = await axios.get(`${API_BASE_URL}/config/section/faq`);
      // Check if response.data.data exists, otherwise use response.data directly
      const faqData = response.data.data || response.data || [];
      console.log('FAQ data fetched:', faqData);
      setFaqs(faqData);
      setErrors(prev => ({ ...prev, faqs: null }));
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setErrors(prev => ({ ...prev, faqs: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, faqs: false }));
    }
  };
  
  // Submit contact form
  const submitContactForm = async (formData) => {
    setLoading(prev => ({ ...prev, contactForm: true }));
    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, formData);
      setErrors(prev => ({ ...prev, contactForm: null }));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrors(prev => ({ ...prev, contactForm: error.message }));
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, contactForm: false }));
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    setLoading(prev => ({ ...prev, settings: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/settings/public`);
      setSettings(response.data.data || {});
      setErrors(prev => ({ ...prev, settings: null }));
    } catch (error) {
      console.error('Error fetching settings:', error);
      setErrors(prev => ({ ...prev, settings: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, settings: false }));
    }
  };

  // Fetch CO2 Emission Reductions
  const fetchCO2Reductions = async () => {
    setLoading(prev => ({ ...prev, co2Reductions: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/co2-emission-reduction/active`);
      setCo2Reductions(response.data.data || []);
      setErrors(prev => ({ ...prev, co2Reductions: null }));
    } catch (error) {
      console.error('Error fetching CO2 emission reductions:', error);
      setErrors(prev => ({ ...prev, co2Reductions: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, co2Reductions: false }));
    }
  };

  // Fetch Intelligent Solutions
  const fetchIntelligentSolutions = async () => {
    setLoading(prev => ({ ...prev, intelligentSolutions: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/intelligent-solution/active`);
      setIntelligentSolutions(response.data.data || []);
      setErrors(prev => ({ ...prev, intelligentSolutions: null }));
    } catch (error) {
      console.error('Error fetching intelligent solutions:', error);
      setErrors(prev => ({ ...prev, intelligentSolutions: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, intelligentSolutions: false }));
    }
  };

  // Load initial data
  useEffect(() => {
    // Fetch homepage data on initial load
    fetchHomepageData();
    // Fetch settings on initial load
    fetchSettings();
    // Fetch CO2 emission reductions and intelligent solutions
    fetchCO2Reductions();
    fetchIntelligentSolutions();
  }, []);

  const value = {
    // Data states
    blogPosts,
    projects,
    products,
    heroSlides,
    energySolutions,
    testimonials,
    teamMembers,
    faqs,
    contactMessages,
    settings,
    co2Reductions,
    intelligentSolutions,
    
    // Status states
    loading,
    errors,
    
    // Fetch functions
    fetchHomepageData,
    fetchAboutPageData,
    fetchBlogPosts,
    fetchProjects,
    fetchProducts,
    fetchContactMessages,
    fetchTestimonials,
    fetchTeamMembers,
    fetchFaqs,
    fetchSettings,
    fetchCO2Reductions,
    fetchIntelligentSolutions,
    
    // Action functions
    submitContactForm
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};