import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaUpload, FaSave, FaEye } from 'react-icons/fa';
import { getTeamCelebration, updateTeamCelebration, uploadTeamCelebrationImage } from '../../services/teamCelebrationService';

const AdminTeamCelebration = () => {
  const [teamCelebrationData, setTeamCelebrationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTeamCelebration();
      setTeamCelebrationData(data);
    } catch (error) {
      console.error('Error fetching team celebration data:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateTeamCelebration(teamCelebrationData);
      setMessage('Team celebration data updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating team celebration data:', error);
      setMessage('Error updating data');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file, section, field) => {
    try {
      setUploading(true);
      const imageUrl = await uploadTeamCelebrationImage(file);
      setTeamCelebrationData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: imageUrl
        }
      }));
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setTeamCelebrationData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setTeamCelebrationData(prev => ({
      ...prev,
      [section]: (prev[section] || []).map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, defaultItem) => {
    setTeamCelebrationData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), defaultItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    setTeamCelebrationData(prev => ({
      ...prev,
      [section]: (prev[section] || []).filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    setTeamCelebrationData(prev => ({
      ...prev,
      teamCulture: {
        ...prev.teamCulture,
        features: [...(prev.teamCulture.features || []), '']
      }
    }));
  };

  const updateFeature = (index, value) => {
    setTeamCelebrationData(prev => ({
      ...prev,
      teamCulture: {
        ...prev.teamCulture,
        features: prev.teamCulture.features.map((feature, i) => 
          i === index ? value : feature
        )
      }
    }));
  };

  const removeFeature = (index) => {
    setTeamCelebrationData(prev => ({
      ...prev,
      teamCulture: {
        ...prev.teamCulture,
        features: prev.teamCulture.features.filter((_, i) => i !== index)
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team celebration data...</p>
        </div>
      </div>
    );
  }

  if (!teamCelebrationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading team celebration data</p>
          <button 
            onClick={fetchData} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'teamCulture', label: 'Team Culture' },
    { id: 'eventsSection', label: 'Events' },
    { id: 'achievementsSection', label: 'Achievements' },
    { id: 'joinTeamCTA', label: 'Call to Action' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Team Celebration CMS</h1>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <a
              href="/team-celebration"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FaEye /> Preview Page
            </a>
          </div>
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Hero Section */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Hero Section</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={teamCelebrationData.hero?.title || ''}
                  onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hero title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <textarea
                  value={teamCelebrationData.hero?.subtitle || ''}
                  onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hero subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={teamCelebrationData.hero?.backgroundImage || ''}
                    onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image URL or upload"
                  />
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer">
                    <FaUpload /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'hero', 'backgroundImage')}
                      className="hidden"
                    />
                  </label>
                </div>
                {teamCelebrationData.hero?.backgroundImage && (
                  <img
                    src={teamCelebrationData.hero.backgroundImage}
                    alt="Hero background"
                    className="mt-2 w-full h-48 object-cover rounded-md"
                  />
                )}
              </div>
            </div>
          )}

          {/* Team Culture Section */}
          {activeTab === 'teamCulture' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Team Culture Section</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={teamCelebrationData.teamCulture?.title || ''}
                  onChange={(e) => handleInputChange('teamCulture', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter section title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={teamCelebrationData.teamCulture?.description || ''}
                  onChange={(e) => handleInputChange('teamCulture', 'description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter section description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={teamCelebrationData.teamCulture?.image || ''}
                    onChange={(e) => handleInputChange('teamCulture', 'image', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image URL or upload"
                  />
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer">
                    <FaUpload /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'teamCulture', 'image')}
                      className="hidden"
                    />
                  </label>
                </div>
                {teamCelebrationData.teamCulture?.image && (
                  <img
                    src={teamCelebrationData.teamCulture.image}
                    alt="Team culture"
                    className="mt-2 w-full h-48 object-cover rounded-md"
                  />
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    onClick={addFeature}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <FaPlus /> Add Feature
                  </button>
                </div>
                {teamCelebrationData.teamCulture?.features?.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter feature"
                    />
                    <button
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Section */}
          {activeTab === 'eventsSection' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Events Section</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={teamCelebrationData.eventsSection?.title || ''}
                  onChange={(e) => handleInputChange('eventsSection', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter events section title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                <textarea
                  value={teamCelebrationData.eventsSection?.subtitle || ''}
                  onChange={(e) => handleInputChange('eventsSection', 'subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter events section subtitle"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Events</h3>
                <button
                  onClick={() => {
                    const newEvent = {
                      id: Date.now(),
                      title: '',
                      date: '',
                      location: '',
                      image: '',
                      description: ''
                    };
                    setTeamCelebrationData(prev => ({
                      ...prev,
                      eventsSection: {
                        ...prev.eventsSection,
                        events: [...(prev.eventsSection?.events || []), newEvent]
                      }
                    }));
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaPlus /> Add Event
                </button>
              </div>
              
              {teamCelebrationData.eventsSection?.events?.map((event, index) => (
                <div key={event.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Event {index + 1}</h3>
                    <button
                      onClick={() => {
                        setTeamCelebrationData(prev => ({
                          ...prev,
                          eventsSection: {
                            ...prev.eventsSection,
                            events: (prev.eventsSection?.events || []).filter((_, i) => i !== index)
                          }
                        }));
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={event.title || ''}
                        onChange={(e) => {
                          setTeamCelebrationData(prev => ({
                            ...prev,
                            eventsSection: {
                              ...prev.eventsSection,
                              events: (prev.eventsSection?.events || []).map((item, i) => 
                                i === index ? { ...item, title: e.target.value } : item
                              )
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter event title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="text"
                        value={event.date || ''}
                        onChange={(e) => {
                          setTeamCelebrationData(prev => ({
                            ...prev,
                            eventsSection: {
                              ...prev.eventsSection,
                              events: (prev.eventsSection?.events || []).map((item, i) => 
                                i === index ? { ...item, date: e.target.value } : item
                              )
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter event date"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={event.location || ''}
                        onChange={(e) => {
                          setTeamCelebrationData(prev => ({
                            ...prev,
                            eventsSection: {
                              ...prev.eventsSection,
                              events: (prev.eventsSection?.events || []).map((item, i) => 
                                i === index ? { ...item, location: e.target.value } : item
                              )
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter event location"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={event.image || ''}
                          onChange={(e) => {
                            setTeamCelebrationData(prev => ({
                              ...prev,
                              eventsSection: {
                                ...prev.eventsSection,
                                events: (prev.eventsSection?.events || []).map((item, i) => 
                                  i === index ? { ...item, image: e.target.value } : item
                                )
                              }
                            }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter image URL"
                        />
                        <label className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer">
                          <FaUpload />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              if (e.target.files[0]) {
                                try {
                                  setUploading(true);
                                  const imageUrl = await uploadTeamCelebrationImage(e.target.files[0]);
                                  setTeamCelebrationData(prev => ({
                                    ...prev,
                                    eventsSection: {
                                      ...prev.eventsSection,
                                      events: (prev.eventsSection?.events || []).map((item, i) => 
                                        i === index ? { ...item, image: imageUrl } : item
                                      )
                                    }
                                  }));
                                  setMessage('Image uploaded successfully!');
                                  setTimeout(() => setMessage(''), 3000);
                                } catch (error) {
                                  console.error('Error uploading image:', error);
                                  setMessage('Error uploading image');
                                } finally {
                                  setUploading(false);
                                }
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {event.image && (
                        <img
                          src={event.image}
                          alt="Event"
                          className="mt-2 w-full h-32 object-cover rounded-md"
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={event.description || ''}
                      onChange={(e) => {
                        setTeamCelebrationData(prev => ({
                          ...prev,
                          eventsSection: {
                            ...prev.eventsSection,
                            events: (prev.eventsSection?.events || []).map((item, i) => 
                              i === index ? { ...item, description: e.target.value } : item
                            )
                          }
                        }));
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter event description"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements Section */}
          {activeTab === 'achievementsSection' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Achievements</h2>
                <button
                  onClick={() => {
                    const newAchievement = {
                      year: '',
                      title: '',
                      description: '',
                      image: ''
                    };
                    setTeamCelebrationData(prev => ({
                      ...prev,
                      achievementsSection: {
                        ...prev.achievementsSection,
                        achievements: [...(prev.achievementsSection?.achievements || []), newAchievement]
                      }
                    }));
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaPlus /> Add Achievement
                </button>
              </div>
              
              {teamCelebrationData.achievementsSection?.achievements?.map((achievement, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Achievement {index + 1}</h3>
                    <button
                      onClick={() => {
                        setTeamCelebrationData(prev => ({
                          ...prev,
                          achievementsSection: {
                            ...prev.achievementsSection,
                            achievements: (prev.achievementsSection?.achievements || []).filter((_, i) => i !== index)
                          }
                        }));
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <input
                        type="text"
                        value={achievement.year || ''}
                        onChange={(e) => {
                          setTeamCelebrationData(prev => ({
                            ...prev,
                            achievementsSection: {
                              ...prev.achievementsSection,
                              achievements: (prev.achievementsSection?.achievements || []).map((item, i) => 
                                i === index ? { ...item, year: e.target.value } : item
                              )
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter year"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={achievement.title || ''}
                        onChange={(e) => {
                          setTeamCelebrationData(prev => ({
                            ...prev,
                            achievementsSection: {
                              ...prev.achievementsSection,
                              achievements: (prev.achievementsSection?.achievements || []).map((item, i) => 
                                i === index ? { ...item, title: e.target.value } : item
                              )
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter achievement title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                      <input
                        type="text"
                        value={achievement.organization || ''}
                        onChange={(e) => {
                          setTeamCelebrationData(prev => ({
                            ...prev,
                            achievementsSection: {
                              ...prev.achievementsSection,
                              achievements: (prev.achievementsSection?.achievements || []).map((item, i) => 
                                i === index ? { ...item, organization: e.target.value } : item
                              )
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter organization name"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={achievement.description || ''}
                      onChange={(e) => {
                        setTeamCelebrationData(prev => ({
                          ...prev,
                          achievementsSection: {
                            ...prev.achievementsSection,
                            achievements: (prev.achievementsSection?.achievements || []).map((item, i) => 
                              i === index ? { ...item, description: e.target.value } : item
                            )
                          }
                        }));
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter achievement description"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          {activeTab === 'cta' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Call to Action Section</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={teamCelebrationData.cta?.title || ''}
                  onChange={(e) => handleInputChange('cta', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter CTA title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={teamCelebrationData.cta?.description || ''}
                  onChange={(e) => handleInputChange('cta', 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter CTA description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={teamCelebrationData.cta?.buttonText || ''}
                  onChange={(e) => handleInputChange('cta', 'buttonText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter button text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                <input
                  type="text"
                  value={teamCelebrationData.cta?.buttonLink || ''}
                  onChange={(e) => handleInputChange('cta', 'buttonLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter button link (e.g., /careers)"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTeamCelebration;