import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash, 
  FaSave, 
  FaTimes, 
  FaGift,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaPercent,
  FaCode,
  FaPalette
} from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com/api';

const OfferCardCMS = () => {
  const [offerCards, setOfferCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    discountPercentage: '',
    discountCode: '',
    validUntil: '',
    buttonText: 'Get Offer',
    buttonLink: '',
    backgroundColor: '#cae28e',
    textColor: '#000000',
    buttonColor: '#4CAF50',
    image: '',
    isActive: true,
    displayOrder: 0,
    showOnBrochures: true,
    termsAndConditions: ''
  });

  useEffect(() => {
    fetchOfferCards();
  }, []);

  const fetchOfferCards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/offer-cards`);
      if (response.data.success) {
        setOfferCards(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching offer cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingId 
        ? `${API_BASE_URL}/offer-cards/${editingId}`
        : `${API_BASE_URL}/offer-cards`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await axios({
        method,
        url,
        data: formData
      });

      if (response.data.success) {
        await fetchOfferCards();
        resetForm();
        alert(editingId ? 'Offer card updated successfully!' : 'Offer card created successfully!');
      }
    } catch (error) {
      console.error('Error saving offer card:', error);
      alert('Error saving offer card. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (offerCard) => {
    setFormData({
      title: offerCard.title,
      subtitle: offerCard.subtitle,
      description: offerCard.description,
      discountPercentage: offerCard.discountPercentage,
      discountCode: offerCard.discountCode,
      validUntil: offerCard.validUntil ? new Date(offerCard.validUntil).toISOString().split('T')[0] : '',
      buttonText: offerCard.buttonText,
      buttonLink: offerCard.buttonLink,
      backgroundColor: offerCard.backgroundColor,
      textColor: offerCard.textColor,
      buttonColor: offerCard.buttonColor,
      image: offerCard.image || '',
      isActive: offerCard.isActive,
      displayOrder: offerCard.displayOrder,
      showOnBrochures: offerCard.showOnBrochures,
      termsAndConditions: offerCard.termsAndConditions
    });
    setEditingId(offerCard._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer card?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/offer-cards/${id}`);
        if (response.data.success) {
          await fetchOfferCards();
          alert('Offer card deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting offer card:', error);
        alert('Error deleting offer card. Please try again.');
      }
    }
  };

  const toggleActive = async (id) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/offer-cards/${id}/toggle-active`);
      if (response.data.success) {
        await fetchOfferCards();
      }
    } catch (error) {
      console.error('Error toggling offer card status:', error);
      alert('Error updating offer card status. Please try again.');
    }
  };

  const updateOrder = async (id, direction) => {
    try {
      const currentCard = offerCards.find(card => card._id === id);
      const newOrder = direction === 'up' ? currentCard.displayOrder - 1 : currentCard.displayOrder + 1;
      
      const response = await axios.patch(`${API_BASE_URL}/offer-cards/${id}/order`, {
        displayOrder: newOrder
      });
      
      if (response.data.success) {
        await fetchOfferCards();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      discountPercentage: '',
      discountCode: '',
      validUntil: '',
      buttonText: 'Get Offer',
      buttonLink: '',
      backgroundColor: '#cae28e',
      textColor: '#000000',
      buttonColor: '#4CAF50',
      image: '',
      isActive: true,
      displayOrder: 0,
      showOnBrochures: true,
      termsAndConditions: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaGift className="mr-3 text-[#9fc22f]" />
            Offer Card Management
          </h1>
          <p className="text-gray-600 mt-2">Manage special offers and discount cards for your website</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#9fc22f] text-white px-6 py-3 rounded-lg hover:bg-[#8aaa28] flex items-center gap-2 transition-colors duration-200"
        >
          <FaPlus />
          Add New Offer Card
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit Offer Card' : 'Create New Offer Card'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fc22f] focus:border-transparent"
                      required
                      maxLength="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle *
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fc22f] focus:border-transparent"
                      required
                      maxLength="200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fc22f] focus:border-transparent"
                      required
                      maxLength="500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fc22f] focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Offer Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Offer Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaPercent className="inline mr-1" />
                        Discount % *
                      </label>
                      <input
                        type="number"
                        name="discountPercentage"
                        value={formData.discountPercentage}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fc22f] focus:border-transparent"
                        required
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCode className="inline mr-1" />
                        Discount Code *
                      </label>
                      <input
                        type="text"
                        name="discountCode"
                        value={formData.discountCode}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fc22f] focus:border-transparent"
                        required
                        maxLength="20"
                        style={{ textTransform: 'uppercase' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-1" />
                      Valid Until *
                    </label>
                    <input
                      type="date"
                      name="validUntil"
                      value={formData.validUntil}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fc22f] focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        name="buttonText"
                        value={formData.buttonText}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fc22f] focus:border-transparent"
                        maxLength="50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link *
                      </label>
                      <input
                        type="url"
                        name="buttonLink"
                        value={formData.buttonLink}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fc22f] focus:border-transparent"
                        required
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Styling Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  <FaPalette className="inline mr-2" />
                  Styling Options
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleInputChange}
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      name="textColor"
                      value={formData.textColor}
                      onChange={handleInputChange}
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Color
                    </label>
                    <input
                      type="color"
                      name="buttonColor"
                      value={formData.buttonColor}
                      onChange={handleInputChange}
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Terms & Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms and Conditions *
                  </label>
                  <textarea
                    name="termsAndConditions"
                    value={formData.termsAndConditions}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fc22f] focus:border-transparent"
                    required
                    maxLength="1000"
                    placeholder="Enter terms and conditions for this offer..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fc22f] focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#9fc22f] focus:ring-[#9fc22f] border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Active
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="showOnBrochures"
                      checked={formData.showOnBrochures}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#9fc22f] focus:ring-[#9fc22f] border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Show on Brochures Page
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#9fc22f] text-white px-6 py-3 rounded-lg hover:bg-[#8aaa28] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <FaSave />
                  {submitting ? 'Saving...' : (editingId ? 'Update Offer Card' : 'Create Offer Card')}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 flex items-center gap-2 transition-colors duration-200"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Cards List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Existing Offer Cards</h2>
          <p className="text-gray-600 mt-1">Manage and organize your offer cards</p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#9fc22f]"></div>
            <p className="mt-4 text-gray-600">Loading offer cards...</p>
          </div>
        ) : offerCards.length === 0 ? (
          <div className="p-12 text-center">
            <FaGift className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No offer cards found.</p>
            <p className="text-gray-500 mt-2">Create your first offer card to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offerCards.map((offerCard) => (
                  <tr key={offerCard._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div 
                            className="h-10 w-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: offerCard.backgroundColor }}
                          >
                            <FaGift className="text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{offerCard.title}</div>
                          <div className="text-sm text-gray-500">{offerCard.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{offerCard.discountPercentage}%</div>
                      <div className="text-sm text-gray-500">Code: {offerCard.discountCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(offerCard.validUntil)}
                      </div>
                      <div className={`text-sm ${
                        new Date(offerCard.validUntil) < new Date() 
                          ? 'text-red-500' 
                          : 'text-green-500'
                      }`}>
                        {new Date(offerCard.validUntil) < new Date() ? 'Expired' : 'Active'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          offerCard.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {offerCard.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {offerCard.showOnBrochures && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Brochures
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">{offerCard.displayOrder}</span>
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => updateOrder(offerCard._id, 'up')}
                            className="text-gray-400 hover:text-[#9fc22f] transition-colors"
                            title="Move up"
                          >
                            <FaArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => updateOrder(offerCard._id, 'down')}
                            className="text-gray-400 hover:text-[#9fc22f] transition-colors"
                            title="Move down"
                          >
                            <FaArrowDown size={12} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(offerCard)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => toggleActive(offerCard._id)}
                          className={`transition-colors ${
                            offerCard.isActive 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={offerCard.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {offerCard.isActive ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <button
                          onClick={() => handleDelete(offerCard._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferCardCMS;