import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaPlus, FaEdit, FaTrash, FaLeaf, FaImage, FaEye, FaTimes } from 'react-icons/fa';

const GreenFutureCMS = () => {
  const [greenFutureData, setGreenFutureData] = useState(null);
  const [newsCards, setNewsCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: 'ENABLING A GREEN FUTURE',
    description: '',
    backgroundImage: '',
    buttonText: 'LEARN MORE',
    buttonLink: '/about'
  });

  const [cardFormData, setCardFormData] = useState({
    title: '',
    image: '',
    logo: '',
    date: '',
    excerpt: '',
    content: '',
    order: 0
  });

  // File handling states
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [cardImageFile, setCardImageFile] = useState(null);
  const [cardLogoFile, setCardLogoFile] = useState(null);

  // Fetch Green Future data
  const fetchGreenFutureData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/cms/green-future');
      if (response.data?.success) {
        const data = response.data.data;
        setGreenFutureData(data);
        setFormData({
          title: data.title || 'ENABLING A GREEN FUTURE',
          description: data.description || '',
          backgroundImage: data.backgroundImage || '',
          buttonText: data.buttonText || 'LEARN MORE',
          buttonLink: data.buttonLink || '/about'
        });
      }
    } catch (error) {
      console.error('Error fetching green future data:', error);
      toast.error('Failed to fetch green future data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch News Cards
  const fetchNewsCards = async () => {
    try {
      setNewsLoading(true);
      const response = await axios.get('http://localhost:8000/api/cms/news-cards');
      setNewsCards(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching news cards:', error);
      toast.error('Failed to fetch news cards');
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    fetchGreenFutureData();
    fetchNewsCards();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle card form input changes
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  // Handle file changes
  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundImageFile(file);
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          backgroundImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCardImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCardImageFile(file);
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCardLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCardLogoFile(file);
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardFormData(prev => ({
          ...prev,
          logo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Green Future section
  const saveGreenFuture = async () => {
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('buttonText', formData.buttonText);
      formDataToSend.append('buttonLink', formData.buttonLink);
      
      if (backgroundImageFile) {
        formDataToSend.append('backgroundImage', backgroundImageFile);
      }
      
      const response = await axios.put('http://localhost:8000/api/cms/green-future', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data?.success) {
        setGreenFutureData(response.data.data);
        setBackgroundImageFile(null);
        toast.success('Green Future section updated successfully!');
        fetchGreenFutureData(); // Refresh data
      }
    } catch (error) {
      console.error('Error saving green future data:', error);
      toast.error('Failed to save green future data');
    } finally {
      setLoading(false);
    }
  };

  // Save or update news card
  const saveNewsCard = async () => {
    try {
      setNewsLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', cardFormData.title);
      formDataToSend.append('date', cardFormData.date);
      formDataToSend.append('excerpt', cardFormData.excerpt);
      formDataToSend.append('content', cardFormData.content);
      formDataToSend.append('order', cardFormData.order);
      
      if (cardImageFile) {
        formDataToSend.append('image', cardImageFile);
      }
      
      if (cardLogoFile) {
        formDataToSend.append('logo', cardLogoFile);
      }
      
      if (editingCard) {
        const response = await axios.put(`http://localhost:8000/api/cms/news-cards/${editingCard._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.data?.success) {
          toast.success('News card updated successfully!');
        }
      } else {
        const response = await axios.post('http://localhost:8000/api/cms/news-cards', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.data?.success) {
          toast.success('News card created successfully!');
        }
      }
      
      fetchNewsCards();
      resetCardForm();
    } catch (error) {
      console.error('Error saving news card:', error);
      toast.error('Failed to save news card');
    } finally {
      setNewsLoading(false);
    }
  };

  // Delete news card
  const deleteNewsCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this news card?')) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/cms/news-cards/${cardId}`);
        if (response.data?.success) {
          toast.success('News card deleted successfully!');
          fetchNewsCards();
        }
      } catch (error) {
        console.error('Error deleting news card:', error);
        toast.error('Failed to delete news card');
      }
    }
  };

  // Edit news card
  const editNewsCard = (card) => {
    setEditingCard(card);
    setCardFormData({
      title: card.title,
      image: card.image,
      logo: card.logo,
      date: card.date,
      excerpt: card.excerpt,
      content: card.content,
      order: card.order
    });
    setShowCardForm(true);
  };

  // Reset card form
  const resetCardForm = () => {
    setEditingCard(null);
    setCardFormData({
      title: '',
      image: '',
      logo: '',
      date: '',
      excerpt: '',
      content: '',
      order: 0
    });
    setCardImageFile(null);
    setCardLogoFile(null);
    setShowCardForm(false);
  };

  // Reset to default
  const resetToDefault = async () => {
    if (window.confirm('Are you sure you want to reset to default values?')) {
      try {
        setLoading(true);
        setNewsLoading(true);
        
        // Reset green future section
        const greenFutureResponse = await axios.post('http://localhost:8000/api/cms/green-future/reset');
        
        // Reset news cards
        const newsCardsResponse = await axios.post('http://localhost:8000/api/cms/news-cards/reset');
        
        if (greenFutureResponse.data?.success && newsCardsResponse.data?.success) {
          toast.success('Reset to default successfully!');
          fetchGreenFutureData();
          fetchNewsCards();
        }
      } catch (error) {
        console.error('Error resetting to default:', error);
        toast.error('Failed to reset to default');
      } finally {
        setLoading(false);
        setNewsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Green Future Section Management</h2>
          <p className="text-gray-600 mt-1">Manage the green future section content and news cards</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetToDefault}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>

      {/* Green Future Section Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaLeaf className="text-green-600" />
          Green Future Section
        </h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="ENABLING A GREEN FUTURE"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Description about green future..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {formData.backgroundImage && (
              <div className="mt-2">
                <img 
                  src={formData.backgroundImage} 
                  alt="Background preview" 
                  className="w-32 h-20 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              name="buttonText"
              value={formData.buttonText}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="LEARN MORE"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Link
          </label>
          <input
            type="text"
            name="buttonLink"
            value={formData.buttonLink}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="/about"
          />
        </div>

        <button
          onClick={saveGreenFuture}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <FaSave />
          {loading ? 'Saving...' : 'Save Green Future Section'}
        </button>
      </div>

      {/* News Cards Management */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaImage className="text-blue-600" />
            News Cards Management
          </h3>
          <button
            onClick={() => setShowCardForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Add News Card
          </button>
        </div>

        {/* Card Form */}
        {showCardForm && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">
                {editingCard ? 'Edit News Card' : 'Add New News Card'}
              </h4>
              <button
                onClick={resetCardForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={cardFormData.title}
                  onChange={handleCardInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="News card title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={cardFormData.image}
                  onChange={handleCardInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/images/news-image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="text"
                  name="logo"
                  value={cardFormData.logo}
                  onChange={handleCardInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/images/logo.png"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  name="date"
                  value={cardFormData.date}
                  onChange={handleCardInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="March 15, 2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={cardFormData.order}
                  onChange={handleCardInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={cardFormData.excerpt}
                onChange={handleCardInputChange}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Short excerpt for the news card..."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={cardFormData.content}
                onChange={handleCardInputChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Full content for the news card..."
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={saveNewsCard}
                disabled={newsLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <FaSave />
                {newsLoading ? 'Saving...' : (editingCard ? 'Update Card' : 'Add Card')}
              </button>
              <button
                onClick={resetCardForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* News Cards List */}
        <div className="space-y-4">
          {newsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading news cards...</p>
            </div>
          ) : newsCards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No news cards found. Add your first news card above.</p>
            </div>
          ) : (
            newsCards.map((card, index) => (
              <div key={card._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      {card.image && (
                        <img 
                          src={card.image} 
                          alt={card.title}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">{card.title}</h4>
                        <p className="text-sm text-gray-500">{card.date}</p>
                        <p className="text-xs text-gray-400">Order: {card.order}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{card.excerpt}</p>
                    {card.content && (
                      <p className="text-gray-600 text-xs line-clamp-2">{card.content}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => editNewsCard(card)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteNewsCard(card._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaEye className="text-gray-600" /> Preview
        </h3>
        <div className="text-sm text-gray-600">
          The Green Future section will display the title, description, and news cards in the specified order.
          Only active news cards will be shown on the website.
        </div>
      </div>
    </div>
  );
};

export default GreenFutureCMS;