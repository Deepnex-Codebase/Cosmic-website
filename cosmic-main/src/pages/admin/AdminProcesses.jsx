import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMove, FiSave, FiX } from 'react-icons/fi';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'react-toastify';
import {
  getAllProcesses,
  createProcess,
  updateProcess,
  deleteProcess,
  updateProcessOrder
} from '../../services/processService';

const ItemType = 'PROCESS';

const DraggableProcessItem = ({ process, index, moveProcess, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveProcess(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FiMove className="text-gray-400" />
          <div className="bg-accent-100 w-10 h-10 rounded-full flex items-center justify-center text-accent-600">
            {process.order}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{process.title}</h3>
            <p className="text-sm text-gray-600">{process.description}</p>
            <span className="text-xs text-gray-500">Icon: {process.icon}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(process)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(process._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProcessForm = ({ process, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: process?.title || '',
    description: process?.description || '',
    icon: process?.icon || 'mappin',
    category: process?.category || 'delivery',
    isActive: process?.isActive ?? true
  });

  const iconOptions = [
    { value: 'mappin', label: 'Map Pin' },
    { value: 'mail', label: 'Mail' },
    { value: 'truck', label: 'Truck' },
    { value: 'checkcircle', label: 'Check Circle' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {process ? 'Edit Process' : 'Add New Process'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <select
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              {iconOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="delivery">Delivery</option>
              <option value="installation">Installation</option>
              <option value="maintenance">Maintenance</option>
              <option value="consultation">Consultation</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-accent-600 text-white py-2 px-4 rounded-md hover:bg-accent-700 transition-colors flex items-center justify-center"
            >
              <FiSave className="mr-2 h-4 w-4" />
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminProcesses = () => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProcess, setEditingProcess] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('delivery');

  useEffect(() => {
    fetchProcesses();
  }, [selectedCategory]);

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      const response = await getAllProcesses({ category: selectedCategory });
      if (response.success) {
        setProcesses(response.data);
      }
    } catch (error) {
      console.error('Error fetching processes:', error);
      toast.error('Failed to fetch processes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingProcess) {
        await updateProcess(editingProcess._id, formData);
        toast.success('Process updated successfully');
      } else {
        await createProcess(formData);
        toast.success('Process created successfully');
      }
      setShowForm(false);
      setEditingProcess(null);
      fetchProcesses();
    } catch (error) {
      console.error('Error saving process:', error);
      toast.error('Failed to save process');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this process?')) {
      try {
        await deleteProcess(id);
        toast.success('Process deleted successfully');
        fetchProcesses();
      } catch (error) {
        console.error('Error deleting process:', error);
        toast.error('Failed to delete process');
      }
    }
  };

  const moveProcess = (fromIndex, toIndex) => {
    const updatedProcesses = [...processes];
    const [movedProcess] = updatedProcesses.splice(fromIndex, 1);
    updatedProcesses.splice(toIndex, 0, movedProcess);
    
    // Update order numbers
    const processesWithNewOrder = updatedProcesses.map((process, index) => ({
      ...process,
      order: index + 1
    }));
    
    setProcesses(processesWithNewOrder);
  };

  const saveOrder = async () => {
    try {
      const orderData = processes.map((process, index) => ({
        id: process._id,
        order: index + 1
      }));
      
      await updateProcessOrder(orderData);
      toast.success('Process order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update process order');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Process Management</h1>
            <p className="text-gray-600">Manage delivery and other process steps</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors flex items-center"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Process
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="delivery">Delivery</option>
            <option value="installation">Installation</option>
            <option value="maintenance">Maintenance</option>
            <option value="consultation">Consultation</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading processes...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {processes.map((process, index) => (
                <DraggableProcessItem
                  key={process._id}
                  process={process}
                  index={index}
                  moveProcess={moveProcess}
                  onEdit={(process) => {
                    setEditingProcess(process);
                    setShowForm(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {processes.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={saveOrder}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  Save Order
                </button>
              </div>
            )}

            {processes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No processes found for this category.</p>
              </div>
            )}
          </>
        )}

        {showForm && (
          <ProcessForm
            process={editingProcess}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingProcess(null);
            }}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default AdminProcesses;