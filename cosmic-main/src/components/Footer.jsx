import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight
} from 'react-icons/fa'

const Footer = () => {
  const [footerConfig, setFooterConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('')

  useEffect(() => {
    fetchFooterConfiguration()
  }, [])

  const fetchFooterConfiguration = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/footer-config')
      if (!response.ok) {
        throw new Error('Failed to fetch footer configuration')
      }
      const data = await response.json()
      setFooterConfig(data)
    } catch (err) {
      console.error('Error fetching footer configuration:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!newsletterEmail) return

    try {
      setNewsletterStatus('subscribing')
      // Here you can add newsletter subscription logic
      // For now, just simulate success
      setTimeout(() => {
        setNewsletterStatus('success')
        setNewsletterEmail('')
        setTimeout(() => setNewsletterStatus(''), 3000)
      }, 1000)
    } catch (err) {
      setNewsletterStatus('error')
      setTimeout(() => setNewsletterStatus(''), 3000)
    }
  }

  const getSocialIcon = (platform) => {
    const iconMap = {
      facebook: FaFacebookF,
      twitter: FaTwitter,
      linkedin: FaLinkedinIn,
      instagram: FaInstagram,
      youtube: FaYoutube,
      whatsapp: FaWhatsapp
    }
    return iconMap[platform] || FaFacebookF
  }

  if (loading) {
    return (
      <footer className="bg-gradient-to-b from-primary-800 to-primary-900 text-white py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
            <span className="ml-3 text-gray-300">Loading footer...</span>
          </div>
        </div>
      </footer>
    )
  }

  if (error || !footerConfig) {
    return (
      <footer className="bg-gradient-to-b from-primary-800 to-primary-900 text-white py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-300">
            <p>Error loading footer content. Please try again later.</p>
          </div>
        </div>
      </footer>
    )
  }

  const activeSections = footerConfig.footerSections
    .filter(section => section.isActive)
    .sort((a, b) => a.order - b.order)

  const activeSocialLinks = footerConfig.socialLinks
    .filter(link => link.isActive)
    .sort((a, b) => a.order - b.order)
  return (
    <footer
      className="bg-gradient-to-b from-primary-800 to-primary-900 text-white py-16 px-6 md:px-20 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `url("${footerConfig.backgroundImage}")`,
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 via-accent-400 to-accent-500"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-accent-500/10 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-accent-500/10 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Top Section with Logo and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16 pb-16 border-b border-white/10">
          {/* Logo and Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6 hover-pulse">
              <img src={footerConfig.companyInfo.logo} alt={footerConfig.companyInfo.name} className="h-12" />
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              {footerConfig.companyInfo.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 hover:text-accent-500 transition-colors hover-pulse">
                <FaMapMarkerAlt className="mr-3 text-accent-500" />
                <span>{footerConfig.contactInfo.address}</span>
              </div>
              <div className="flex items-center text-gray-300 hover:text-accent-500 transition-colors hover-pulse">
                <FaPhoneAlt className="mr-3 text-accent-500" />
                <span>{footerConfig.contactInfo.phone}</span>
              </div>
              <div className="flex items-center text-gray-300 hover:text-accent-500 transition-colors hover-pulse">
                <FaEnvelope className="mr-3 text-accent-500" />
                <span>{footerConfig.contactInfo.email}</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
            {activeSections.map((section) => (
              <div key={section._id}>
                <h3 className="text-lg font-semibold mb-4 relative inline-block">
                  <span className="relative z-10">{section.title}</span>
                  <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-accent-500"></span>
                </h3>
                <ul className="space-y-3 text-gray-300">
                  {section.links
                    .sort((a, b) => a.order - b.order)
                    .map((link) => (
                    <li key={link._id}>
                      {link.isExternal ? (
                        <a
                          href={link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-accent-500 transition-colors flex items-center group hover-pulse"
                        >
                          <span className="w-0 h-0.5 bg-accent-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="hover:text-accent-500 transition-colors flex items-center group hover-pulse"
                        >
                          <span className="w-0 h-0.5 bg-accent-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Newsletter Section */}
        {footerConfig.newsletter.isActive && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 pb-16 border-b border-white/10">
            <div>
              <h3 className="text-xl font-semibold mb-4 relative inline-block">
                <span className="relative z-10">{footerConfig.newsletter.title}</span>
                <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-accent-500"></span>
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                {footerConfig.newsletter.description}
              </p>
            </div>
            <div>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={footerConfig.newsletter.placeholder} 
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 flex-grow focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                  required
                  disabled={newsletterStatus === 'subscribing'}
                />
                <button 
                  type="submit" 
                  disabled={newsletterStatus === 'subscribing'}
                  className="group relative overflow-hidden bg-accent-500 text-black font-medium px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center border-2 border-transparent hover:border-accent-500 hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    {newsletterStatus === 'subscribing' ? 'Subscribing...' : 
                     newsletterStatus === 'success' ? 'Subscribed!' : 
                     newsletterStatus === 'error' ? 'Error!' : 
                     footerConfig.newsletter.buttonText}
                  </span>
                  <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform relative z-10 group-hover:text-white" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Bottom Section with Copyright and Social */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {footerConfig.companyInfo.name}. {footerConfig.companyInfo.copyrightText}
          </p>

          <div className="flex gap-4">
            {activeSocialLinks.map((socialLink) => {
              const IconComponent = getSocialIcon(socialLink.platform)
              return (
                <a 
                  key={socialLink._id}
                  href={socialLink.url} 
                  aria-label={socialLink.platform.charAt(0).toUpperCase() + socialLink.platform.slice(1)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent-500 flex items-center justify-center text-white hover:text-primary-600 transition-colors duration-300 hover-pulse"
                >
                  <IconComponent />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer