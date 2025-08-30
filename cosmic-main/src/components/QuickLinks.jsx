import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaCalculator, FaSolarPanel, FaFileAlt, FaPhoneAlt } from 'react-icons/fa'

const quickLinks = [
  {
    title: 'Basic Calculator',
    description: 'Estimate your potential savings and system size with our easy-to-use calculator.',
    icon: <FaCalculator className="text-3xl text-[#cae28e]" />,
    href: '/calculator',
  },
  {
    title: 'Advanced Calculator',
    description: 'Get detailed financial projections and environmental impact analysis with our advanced calculator.',
    icon: <FaCalculator className="text-3xl text-[#cae28e]" />,
    href: '/advanced-calculator',
  },
  {
    title: 'Products Catalog',
    description: 'Browse our complete range of solar panels, inverters, batteries, and accessories.',
    icon: <FaSolarPanel className="text-3xl text-[#cae28e]" />,
    href: '/products',
  },
  {
    title: 'Contact Us',
    description: 'Have questions? Our solar experts are ready to help you make the switch to solar.',
    icon: <FaPhoneAlt className="text-3xl text-[#cae28e]" />,
    href: '/contact',
  },
]

const QuickLinks = () => {
  return (
    <section className="py-20 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Quick Links */}
          <div>
            <span className="text-[#cae28e] font-medium mb-2 block">Quick Access</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#142334] mb-8">
              Helpful Resources
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {quickLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.href}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 hover-pulse"
                >
                  <div className="mb-4">
                    {link.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#142334]">{link.title}</h3>
                  <p className="text-gray-600 mb-4">{link.description}</p>
                  <div className="flex items-center text-[#cae28e] font-medium">
                    Learn More
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="bg-[#142334] rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#cae28e]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#cae28e]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <span className="text-[#cae28e] font-medium mb-2 block">Stay Updated</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-white/80 mb-8 max-w-md">
                Get the latest news, tips, and updates on solar technology, industry trends, and exclusive offers delivered to your inbox.
              </p>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-white/80 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Enter your email" 
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#cae28e] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    id="consent" 
                    className="mt-1 mr-3"
                    required
                  />
                  <label htmlFor="consent" className="text-white/80 text-sm">
                    I agree to receive emails from Cosmic Solar and understand I can unsubscribe at any time.
                  </label>
                </div>
                <button 
                  type="submit" 
                  className="bg-[#cae28e] hover:bg-[#a7cb50] text-black font-medium px-6 py-3 rounded-lg transition-colors flex items-center group hover-glow"
                >
                  Subscribe
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuickLinks