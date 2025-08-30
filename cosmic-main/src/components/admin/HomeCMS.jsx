import React, { useState } from 'react';
import { FaHome, FaVideo, FaClock, FaInfoCircle, FaLeaf, FaSun } from 'react-icons/fa';
import VideoHeroCMS from './VideoHeroCMS';
import TimelineCMS from './TimelineCMS';
import CompanyIntro from './CompanyIntro';
import GreenFutureCMS from './GreenFutureCMS';
import SolarJourneyCMS from './SolarJourneyCMS';

const HomeCMS = () => {
  const [activeTab, setActiveTab] = useState('hero');

  const tabs = [
    {
      id: 'hero',
      name: 'Hero Section',
      icon: <FaVideo />,
      component: <VideoHeroCMS />
    },
    {
      id: 'timeline',
      name: 'Timeline Section',
      icon: <FaClock />,
      component: <TimelineCMS />
    },
    {
      id: 'about',
      name: 'About Section',
      icon: <FaInfoCircle />,
      component: <CompanyIntro />
    },
    {
      id: 'green-future',
      name: 'Green Future',
      icon: <FaLeaf />,
      component: <GreenFutureCMS />
    },
    {
      id: 'solar-journey',
      name: 'Solar Journey',
      icon: <FaSun />,
      component: <SolarJourneyCMS />
    }
  ];

  const renderTabContent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    return activeTabData ? activeTabData.component : null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FaHome className="text-blue-600 text-xl" />
              <h1 className="text-xl font-semibold text-gray-900">Home Page CMS</h1>
            </div>
            <div className="text-sm text-gray-500">
              Manage your home page content
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium text-gray-900">Sections</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select a section to edit
                </p>
              </div>
              <nav className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-lg ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {tab.icon}
                    </span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Sections</span>
                  <span className="font-medium">{tabs.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Section</span>
                  <span className="font-medium capitalize">{activeTab}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Tab Header */}
              <div className="border-b px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 text-xl">
                    {tabs.find(tab => tab.id === activeTab)?.icon}
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {tabs.find(tab => tab.id === activeTab)?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {activeTab === 'hero' && 'Manage your homepage hero video section'}
                      {activeTab === 'timeline' && 'Manage your company timeline and milestones'}
                      {activeTab === 'about' && 'Manage your company introduction and about section'}
                      {activeTab === 'green-future' && 'Manage your green future section and news cards'}
                      {activeTab === 'solar-journey' && 'Manage your solar journey milestones and achievements'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-0">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            Home Page Content Management System - Update your website content easily
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCMS;