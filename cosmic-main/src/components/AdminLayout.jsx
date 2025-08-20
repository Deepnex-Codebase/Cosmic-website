import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { FaUsers, FaNewspaper, FaBriefcase, FaCog, FaSignOutAlt, FaTachometerAlt, FaCogs, FaRoute, FaBullhorn, FaTrophy, FaHome, FaBox, FaWpforms, FaBars, FaWindowMaximize, FaChevronDown, FaChevronRight, FaSolarPanel, FaHandshake, FaImages, FaInfoCircle, FaBuilding, FaAward, FaRegNewspaper, FaRegFileAlt, FaRegEdit, FaStream } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { BiSolidNavigation } from 'react-icons/bi';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [openCategories, setOpenCategories] = useState({
    dashboard: true,
    company: true,
    content: true,
    configuration: true
  });
  
  // Check if the current path is active
  const isActive = (path) => {
    if (path === '/admin') {
      // For dashboard, only match exact path
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    // For other paths, match exact path or sub-paths
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Toggle category open/close state
  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Menu items organized by categories
  const menuCategories = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: MdDashboard,
      items: [
        { path: '/admin/home', icon: FaHome, label: 'Home Dashboard' },
      ]
    },
    {
      id: 'company',
      label: 'Company',
      icon: FaBuilding,
      items: [
        { path: '/admin/directors', icon: FaUsers, label: 'Directors' },
        { path: '/admin/team', icon: FaUsers, label: 'Team Members' },
        { path: '/admin/about', icon: FaInfoCircle, label: 'About Page' },
        { path: '/admin/company-culture', icon: FaHandshake, label: 'Company Culture' },
        { path: '/admin/achievements', icon: FaAward, label: 'Achievements' },
      ]
    },
    {
      id: 'content',
      label: 'Content',
      icon: FaRegEdit,
      items: [
        { path: '/admin/services', icon: FaCogs, label: 'Services' },
        { path: '/admin/projects', icon: FaBriefcase, label: 'Projects' },
        { path: '/admin/processes', icon: FaRoute, label: 'Processes' },
        { path: '/admin/products', icon: FaSolarPanel, label: 'Products' },
        { path: '/admin/blogs', icon: FaRegNewspaper, label: 'Blog Posts' },
        { path: '/admin/press-releases', icon: FaRegFileAlt, label: 'Press Releases' },
        { path: '/admin/forms', icon: FaWpforms, label: 'Form Management' },
      ]
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: IoSettingsSharp,
      items: [
        { path: '/admin/navbar', icon: BiSolidNavigation, label: 'Navigation Bar' },
        { path: '/admin/footer', icon: FaStream, label: 'Footer Management' },
        { path: '/admin/settings', icon: FaCog, label: 'Settings' },
      ]
    }
  ];
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-gradient-to-b from-primary-900 to-primary-800 text-white z-50 shadow-xl">
        <div className="p-4 border-b border-primary-700 bg-primary-900">
          <Link to="/" className="flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="h-12" />
          </Link>
        </div>
        
        <nav className="mt-4 h-full overflow-y-auto pb-20 px-2">
          {menuCategories.map((category) => (
            <div key={category.id} className="mb-2">
              <button 
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <category.icon className="mr-2 text-accent-400 text-lg" />
                  <span>{category.label}</span>
                </div>
                {openCategories[category.id] ? 
                  <FaChevronDown className="text-xs text-gray-400" /> : 
                  <FaChevronRight className="text-xs text-gray-400" />
                }
              </button>
              
              {openCategories[category.id] && (
                <ul className="mt-1 ml-2 space-y-1">
                  {category.items.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive(item.path) 
                          ? 'bg-primary-700 text-accent-400 font-medium shadow-inner' 
                          : 'text-gray-300 hover:bg-primary-700/50 hover:text-white transition-colors'}`}
                      >
                        <item.icon className="mr-2 text-lg" />
                        <span>{item.label}</span>
                        {isActive(item.path) && (
                          <div className="ml-auto w-1 h-4 bg-accent-400 rounded-full"></div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 w-64 border-t border-primary-700 p-4 bg-primary-900">
          <div className="flex flex-col space-y-3">
            <LogoutButton />
            <Link to="/" className="flex items-center text-sm font-medium hover:text-accent-400 transition-colors group">
              <FaSignOutAlt className="mr-3 group-hover:translate-x-1 transition-transform" />
              <span>Back to Website</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-x-hidden overflow-y-auto bg-gray-50">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {location.pathname === '/admin' || location.pathname === '/admin/' ? 'Dashboard' : 
                 menuCategories.flatMap(cat => cat.items).find(item => isActive(item.path))?.label || 'Admin Panel'}
              </h1>
              <p className="text-sm text-gray-500">Welcome to Cosmic Solar Admin</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <img 
                  src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" 
                  alt="Admin" 
                  className="h-10 w-10 rounded-full border-2 border-accent-400"
                />
              </div>
            </div>
          </div>
        </header>
        
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200 px-6 py-2">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-accent-500">
                  <MdDashboard className="mr-2 text-gray-500" />
                  Dashboard
                </Link>
              </li>
              {location.pathname !== '/admin' && location.pathname !== '/admin/' && (
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-700">
                      {menuCategories.flatMap(cat => cat.items).find(item => isActive(item.path))?.label || 'Page'}
                    </span>
                  </div>
                </li>
              )}
            </ol>
          </nav>
        </div>
        
        {/* Page Content */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-180px)]">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="px-6 py-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Cosmic Solar Admin Panel. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;