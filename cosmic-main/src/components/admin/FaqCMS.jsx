import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config/constants';

const FaqCMS = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editFaq, setEditFaq] = useState({ question: '', answer: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch FAQs from the server
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/config/section/faq`);
      // Check if response.data.data exists (API returns {success: true, data: [...]})
      if (response.data && response.data.data) {
        setFaqs(response.data.data || []);
      } else {
        // Fallback to direct response if structure is different
        setFaqs(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  // Update FAQs on the server
  const updateFaqs = async (updatedFaqs) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/config/section/faq`, updatedFaqs);
      toast.success('FAQs updated successfully');
      fetchFaqs(); // Refresh the data
    } catch (error) {
      console.error('Error updating FAQs:', error);
      toast.error('Failed to update FAQs');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new FAQ
  const handleAddFaq = async () => {
    if (!newFaq.question || !newFaq.answer) {
      toast.error('Question and answer are required');
      return;
    }

    try {
      const updatedFaqs = [...faqs, newFaq];
      await updateFaqs(updatedFaqs);
      setNewFaq({ question: '', answer: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding FAQ:', error);
    }
  };

  // Handle updating an existing FAQ
  const handleUpdateFaq = async (id) => {
    if (!editFaq.question || !editFaq.answer) {
      toast.error('Question and answer are required');
      return;
    }

    try {
      const updatedFaqs = faqs.map((faq, index) => 
        index === id ? editFaq : faq
      );
      await updateFaqs(updatedFaqs);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating FAQ:', error);
    }
  };

  // Handle deleting an FAQ
  const handleDeleteFaq = async (id) => {
    try {
      const updatedFaqs = faqs.filter((_, index) => index !== id);
      await updateFaqs(updatedFaqs);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  // Start editing an FAQ
  const startEditing = (id) => {
    setEditingId(id);
    setEditFaq(faqs[id]);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Load FAQs when component mounts
  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Manage FAQs</h2>
        <p className="text-sm text-gray-500">
          Add, edit, or remove frequently asked questions that appear on your website.
        </p>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">Frequently Asked Questions</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-blue-700 transition-colors"
            disabled={showAddForm}
          >
            <FaPlus size={12} />
            <span>Add FAQ</span>
          </button>
        </div>

        {/* Add FAQ Form */}
        {showAddForm && (
          <div className="p-4 border-b bg-blue-50">
            <h4 className="font-medium mb-3">Add New FAQ</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter question"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Enter answer"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewFaq({ question: '', answer: '' });
                  }}
                  className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFaq}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add FAQ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Items */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No FAQs found. Click "Add FAQ" to create your first FAQ.
          </div>
        ) : (
          <ul className="divide-y">
            {faqs.map((faq, index) => (
              <li key={index} className="p-4 hover:bg-gray-50">
                {editingId === index ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={editFaq.question}
                        onChange={(e) =>
                          setEditFaq({ ...editFaq, question: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answer
                      </label>
                      <textarea
                        value={editFaq.answer}
                        onChange={(e) =>
                          setEditFaq({ ...editFaq, answer: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEditing}
                        className="flex items-center gap-1 px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FaTimes size={12} />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={() => handleUpdateFaq(index)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <FaSave size={12} />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900">{faq.question}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(index)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Tips for Great FAQs</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
          <li>Keep questions concise and clear</li>
          <li>Answer directly and thoroughly</li>
          <li>Address common customer concerns</li>
          <li>Use simple language and avoid jargon</li>
          <li>Update FAQs regularly based on customer feedback</li>
        </ul>
      </div>
    </div>
  );
};

export default FaqCMS;