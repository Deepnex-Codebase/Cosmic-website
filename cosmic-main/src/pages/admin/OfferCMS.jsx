import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Calendar, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import { format } from 'date-fns';
import { SketchPicker } from 'react-color';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isAuthenticated } from '../../utils/cookies';

const OfferCMS = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState({
    background: false,
    button: false
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast.error('You must be logged in to access this page');
      navigate('/admin/login');
      return;
    }
    
    fetchOffers();
  }, [navigate]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cms/offers');
      if (response.data.success) {
        setOffers(response.data.data);
      } else {
        console.error('Failed to fetch offers:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingOffer({
      ...editingOffer,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleColorChange = (color, type) => {
    setEditingOffer({
      ...editingOffer,
      [type]: color.hex
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingOffer.title || !editingOffer.subtitle || !editingOffer.description || 
        !editingOffer.discountPercentage || !editingOffer.discountCode || 
        !editingOffer.expiryDays || !editingOffer.startDate || 
        !editingOffer.endDate || !editingOffer.termsAndConditions) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      if (editingOffer._id) {
        // Update existing offer
        const response = await api.put(`/cms/offers/${editingOffer._id}`, editingOffer);
        if (response.data.success) {
          setOffers(offers.map(offer => 
            offer._id === editingOffer._id ? response.data.data : offer
          ));
          resetForm();
        } else {
          console.error('Failed to update offer:', response.data.message);
        }
      } else {
        // Create new offer
        const response = await api.post('/cms/offers', editingOffer);
        if (response.data.success) {
          setOffers([...offers, response.data.data]);
          resetForm();
        } else {
          console.error('Failed to create offer:', response.data.message);
        }
      }
    } catch (error) {
      console.error('Error saving offer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer({
      ...offer,
      startDate: offer.startDate.substring(0, 10),
      endDate: offer.endDate.substring(0, 10)
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) {
      return;
    }

    try {
      const response = await api.delete(`/cms/offers/${id}`);
      if (response.data.success) {
        setOffers(offers.filter(offer => offer._id !== id));
      } else {
        console.error('Failed to delete offer:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  const resetForm = () => {
    setEditingOffer(null);
    setShowForm(false);
    setShowColorPicker({
      background: false,
      button: false
    });
  };

  const addNewOffer = () => {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 7); // Default 7 days from now

    setEditingOffer({
      title: 'Special Offer!',
      subtitle: 'Limited Time Offer',
      description: 'Get discount on all our premium solar panel installations when you book this month!',
      discountPercentage: 20,
      discountCode: 'COSMIC20',
      expiryDays: 7,
      startDate: today.toISOString().substring(0, 10),
      endDate: endDate.toISOString().substring(0, 10),
      isActive: true,
      backgroundColor: '#cae28e',
      buttonColor: '#4CAF50',
      termsAndConditions: 'Terms and conditions apply. Offer valid until limited stock lasts.'
    });
    setShowForm(true);
  };

  const toggleOfferStatus = async (id, currentStatus) => {
    try {
      const response = await api.put(`/cms/offers/${id}`, { isActive: !currentStatus });
      if (response.data.success) {
        setOffers(offers.map(offer => 
          offer._id === id ? response.data.data : offer
        ));
      } else {
        console.error('Failed to update offer status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating offer status:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Offer Management</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offer Management</h1>
        <button
          onClick={addNewOffer}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          disabled={saving}
        >
          <Plus size={18} className="mr-1" />
          Add New Offer
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingOffer._id ? 'Edit Offer' : 'Create New Offer'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingOffer.title || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle *
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={editingOffer.subtitle || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={editingOffer.description || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage *
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={editingOffer.discountPercentage || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Code *
                </label>
                <input
                  type="text"
                  name="discountCode"
                  value={editingOffer.discountCode || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Days *
                </label>
                <input
                  type="number"
                  name="expiryDays"
                  value={editingOffer.expiryDays || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={editingOffer.isActive || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {editingOffer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={editingOffer.startDate || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={editingOffer.endDate || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-md mr-2 cursor-pointer border border-gray-300"
                    style={{ backgroundColor: editingOffer.backgroundColor || '#cae28e' }}
                    onClick={() => setShowColorPicker({
                      ...showColorPicker,
                      background: !showColorPicker.background
                    })}
                  ></div>
                  <input
                    type="text"
                    name="backgroundColor"
                    value={editingOffer.backgroundColor || '#cae28e'}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                {showColorPicker.background && (
                  <div className="absolute z-10 mt-2">
                    <div 
                      className="fixed inset-0" 
                      onClick={() => setShowColorPicker({...showColorPicker, background: false})}
                    ></div>
                    <div className="relative">
                      <SketchPicker
                        color={editingOffer.backgroundColor || '#cae28e'}
                        onChange={(color) => handleColorChange(color, 'backgroundColor')}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Color
                </label>
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-md mr-2 cursor-pointer border border-gray-300"
                    style={{ backgroundColor: editingOffer.buttonColor || '#4CAF50' }}
                    onClick={() => setShowColorPicker({
                      ...showColorPicker,
                      button: !showColorPicker.button
                    })}
                  ></div>
                  <input
                    type="text"
                    name="buttonColor"
                    value={editingOffer.buttonColor || '#4CAF50'}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                {showColorPicker.button && (
                  <div className="absolute z-10 mt-2">
                    <div 
                      className="fixed inset-0" 
                      onClick={() => setShowColorPicker({...showColorPicker, button: false})}
                    ></div>
                    <div className="relative">
                      <SketchPicker
                        color={editingOffer.buttonColor || '#4CAF50'}
                        onChange={(color) => handleColorChange(color, 'buttonColor')}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terms and Conditions *
                </label>
                <textarea
                  name="termsAndConditions"
                  value={editingOffer.termsAndConditions || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-1" />
                    Save
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {offers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No offers found. Create your first offer!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                    <div className="text-sm text-gray-500">{offer.subtitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{offer.discountPercentage}%</div>
                    <div className="text-sm text-gray-500">Code: {offer.discountCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar size={16} className="mr-1" />
                      {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                    </div>
                    <div className="text-sm text-gray-500">{offer.expiryDays} days</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleOfferStatus(offer._id, offer.isActive)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {offer.isActive ? (
                        <>
                          <CheckCircle size={14} className="mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle size={14} className="mr-1" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
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
  );
};

export default OfferCMS;