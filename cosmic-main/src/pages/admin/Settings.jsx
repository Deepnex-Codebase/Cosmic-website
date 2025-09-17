import React from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaExternalLinkAlt } from 'react-icons/fa';

const Settings = () => {
  // Get all routes from App.jsx
  const adminRoutes = [
    { path: '/admin/home', label: 'Dashboard' },
    { path: '/admin/directors', label: 'Directors' },
    { path: '/admin/team', label: 'Team Members' },
    { path: '/admin/services', label: 'Services' },
    { path: '/admin/projects', label: 'Projects' },
    { path: '/admin/processes', label: 'Processes' },
    { path: '/admin/about', label: 'About Page' },
    { path: '/admin/company-culture', label: 'Company Culture' },
    { path: '/admin/team-celebration', label: 'Team Celebrations' },
    { path: '/admin/achievements', label: 'Achievements' },

    { path: '/admin/blogs', label: 'Blog Posts' },
    { path: '/admin/press-releases', label: 'Press Releases' },
    { path: '/admin/careers', label: 'Careers' },
    { path: '/admin/forms', label: 'Form Management' },
    { path: '/admin/footer', label: 'Footer Management' },
    { path: '/admin/navbar', label: 'Navigation Bar' },
    { path: '/admin/solar-config', label: 'Solar Configuration' },
    { path: '/admin/offer-banner', label: 'Offer Banner' },
    { path: '/admin/offer-cards', label: 'Offer Cards' },
    { path: '/admin/cookie-consent', label: 'Cookie Consent' },
    { path: '/admin/rates', label: 'Rates Management' },
  ];

  // Public routes
  const publicRoutes = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/projects', label: 'Projects' },

    { path: '/blogs', label: 'Blogs' },
    { path: '/press-releases', label: 'Press Releases' },
    { path: '/achievements-awards', label: 'Achievements & Awards' },
    { path: '/team-celebration', label: 'Team Celebration' },
    { path: '/director-desk', label: 'Director Desk' },
    { path: '/company-culture', label: 'Company Culture' },
    { path: '/careers', label: 'Careers' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage all website routes and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admin Routes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FaCog className="text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Admin Routes</h2>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <ul className="space-y-2">
              {adminRoutes.map((route, index) => (
                <li key={index} className="hover:bg-gray-50 rounded-md">
                  <Link 
                    to={route.path} 
                    className="flex items-center justify-between p-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <span>{route.label}</span>
                    <FaExternalLinkAlt className="text-gray-400 text-sm" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Public Routes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FaCog className="text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Public Routes</h2>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <ul className="space-y-2">
              {publicRoutes.map((route, index) => (
                <li key={index} className="hover:bg-gray-50 rounded-md">
                  <Link 
                    to={route.path} 
                    className="flex items-center justify-between p-2 text-gray-700 hover:text-primary-600 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{route.label}</span>
                    <FaExternalLinkAlt className="text-gray-400 text-sm" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;