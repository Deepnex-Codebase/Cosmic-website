import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

const FormCMS = () => {
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingFormType, setEditingFormType] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [showAddFormType, setShowAddFormType] = useState(false);
  const [showAddField, setShowAddField] = useState(null);

  useEffect(() => {
    fetchFormConfiguration();
  }, []);

  const fetchFormConfiguration = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/form-config');
      const result = await response.json();
      
      if (result.success) {
        setFormConfig(result.data);
      } else {
        // Failed to fetch form configuration
      }
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const updateFormConfiguration = async (updatedConfig) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/form-config/${formConfig._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig)
      });

      const result = await response.json();
      
      if (result.success) {
        setFormConfig(result.data);
        return true;
      } else {
        // Failed to update form configuration
        return false;
      }
    } catch (error) {
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleGlobalSettingsUpdate = async (field, value) => {
    const updatedConfig = {
      ...formConfig,
      [field]: value
    };
    
    const success = await updateFormConfiguration(updatedConfig);
    if (!success) {
      // Revert on failure
      fetchFormConfiguration();
    }
  };

  const addFormType = () => {
    const newFormType = {
      name: '',
      label: '',
      description: '',
      isActive: true,
      order: formConfig.formTypes.length,
      fields: [],
      successMessage: 'Thank you for your submission. We will get back to you shortly.'
    };
    
    setEditingFormType(newFormType);
    setShowAddFormType(true);
  };

  const saveFormType = async (formType, isNew = false) => {
    if (!formType.name || !formType.label) {
      alert('Name and Label are required');
      return;
    }

    try {
      if (isNew) {
        const response = await fetch(`/api/form-config/${formConfig._id}/form-types`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formType)
        });
        
        const result = await response.json();
        if (result.success) {
          setFormConfig(result.data);
          setShowAddFormType(false);
          setEditingFormType(null);
        }
      } else {
        const response = await fetch(`/api/form-config/${formConfig._id}/form-types/${formType._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formType)
        });
        
        const result = await response.json();
        if (result.success) {
          setFormConfig(result.data);
          setEditingFormType(null);
        }
      }
    } catch (error) {
      console.error('Error saving form type:', error);
    }
  };

  const deleteFormType = async (formTypeId) => {
    if (!confirm('Are you sure you want to delete this form type?')) return;
    
    try {
      const response = await fetch(`/api/form-config/${formConfig._id}/form-types/${formTypeId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        setFormConfig(result.data);
      }
    } catch (error) {
      console.error('Error deleting form type:', error);
    }
  };

  const addField = (formTypeIndex) => {
    const newField = {
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      helpText: '',
      order: 0,
      validation: {},
      options: []
    };
    
    setEditingField({ ...newField, formTypeIndex, isNew: true });
    setShowAddField(formTypeIndex);
  };

  const saveField = (field, formTypeIndex) => {
    if (!field.name || !field.label) {
      alert('Name and Label are required');
      return;
    }

    const updatedConfig = { ...formConfig };
    const formType = updatedConfig.formTypes[formTypeIndex];
    
    if (field.isNew) {
      field.order = formType.fields.length;
      delete field.isNew;
      delete field.formTypeIndex;
      formType.fields.push(field);
    } else {
      const fieldIndex = formType.fields.findIndex(f => f.name === field.name);
      if (fieldIndex !== -1) {
        delete field.formTypeIndex;
        formType.fields[fieldIndex] = field;
      }
    }
    
    updateFormConfiguration(updatedConfig);
    setEditingField(null);
    setShowAddField(null);
  };

  const deleteField = (formTypeIndex, fieldIndex) => {
    if (!confirm('Are you sure you want to delete this field?')) return;
    
    const updatedConfig = { ...formConfig };
    updatedConfig.formTypes[formTypeIndex].fields.splice(fieldIndex, 1);
    
    updateFormConfiguration(updatedConfig);
  };

  const moveField = (formTypeIndex, fieldIndex, direction) => {
    const updatedConfig = { ...formConfig };
    const fields = updatedConfig.formTypes[formTypeIndex].fields;
    const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    
    if (newIndex >= 0 && newIndex < fields.length) {
      [fields[fieldIndex], fields[newIndex]] = [fields[newIndex], fields[fieldIndex]];
      fields[fieldIndex].order = fieldIndex;
      fields[newIndex].order = newIndex;
      
      updateFormConfiguration(updatedConfig);
    }
  };

  const toggleFormTypeActive = (formTypeIndex) => {
    const updatedConfig = { ...formConfig };
    updatedConfig.formTypes[formTypeIndex].isActive = !updatedConfig.formTypes[formTypeIndex].isActive;
    
    updateFormConfiguration(updatedConfig);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading form configuration...</div>
      </div>
    );
  }

  if (!formConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Failed to load form configuration</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Configuration Management</h1>
        <p className="text-gray-600">Manage dynamic contact form types and fields</p>
      </div>

      {/* Global Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Global Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Name</label>
            <input
              type="text"
              value={formConfig.formName || ''}
              onChange={(e) => handleGlobalSettingsUpdate('formName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contact Us"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Description</label>
            <input
              type="text"
              value={formConfig.formDescription || ''}
              onChange={(e) => handleGlobalSettingsUpdate('formDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contact Us For Any Queries?"
            />
          </div>
        </div>
      </div>

      {/* Form Types */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Form Types</h2>
          <button
            onClick={addFormType}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Plus size={16} />
            {saving ? 'Saving...' : 'Add Form Type'}
          </button>
        </div>

        {formConfig.formTypes.map((formType, formTypeIndex) => (
          <div key={formType._id || formTypeIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium">{formType.label}</h3>
                  <button
                    onClick={() => toggleFormTypeActive(formTypeIndex)}
                    className={`p-1 rounded ${formType.isActive ? 'text-green-600' : 'text-gray-400'}`}
                    title={formType.isActive ? 'Active' : 'Inactive'}
                  >
                    {formType.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                <p className="text-sm text-gray-600">{formType.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingFormType(formType)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteFormType(formType._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="ml-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Fields ({formType.fields.length})</h4>
                <button
                  onClick={() => addField(formTypeIndex)}
                  disabled={saving}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={14} />
                  Add Field
                </button>
              </div>
              
              {formType.fields.map((field, fieldIndex) => (
                <div key={field.name} className="bg-gray-50 rounded p-3 mb-2 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{field.label}</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">{field.type}</span>
                      {field.required && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Required</span>}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Name: {field.name}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveField(formTypeIndex, fieldIndex, 'up')}
                      disabled={fieldIndex === 0}
                      className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveField(formTypeIndex, fieldIndex, 'down')}
                      disabled={fieldIndex === formType.fields.length - 1}
                      className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => setEditingField({ ...field, formTypeIndex })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => deleteField(formTypeIndex, fieldIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Form Type Edit Modal */}
      {(editingFormType || showAddFormType) && (
        <FormTypeModal
          formType={editingFormType}
          isNew={showAddFormType}
          onSave={(formType) => saveFormType(formType, showAddFormType)}
          onCancel={() => {
            setEditingFormType(null);
            setShowAddFormType(false);
          }}
        />
      )}

      {/* Field Edit Modal */}
      {(editingField || showAddField !== null) && (
        <FieldModal
          field={editingField}
          onSave={(field) => saveField(field, editingField?.formTypeIndex || showAddField)}
          onCancel={() => {
            setEditingField(null);
            setShowAddField(null);
          }}
        />
      )}
    </div>
  );
};

// Form Type Modal Component
const FormTypeModal = ({ formType, isNew, onSave, onCancel }) => {
  const [localFormType, setLocalFormType] = useState(formType || {
    name: '',
    label: '',
    description: '',
    isActive: true,
    order: 0,
    successMessage: 'Thank you for your submission. We will get back to you shortly.'
  });

  const handleSave = () => {
    onSave(localFormType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {isNew ? 'Add New Form Type' : 'Edit Form Type'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (ID)</label>
            <input
              type="text"
              value={localFormType.name}
              onChange={(e) => setLocalFormType({ ...localFormType, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="residential"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={localFormType.label}
              onChange={(e) => setLocalFormType({ ...localFormType, label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Residential"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={localFormType.description}
              onChange={(e) => setLocalFormType({ ...localFormType, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Form for residential customers"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Success Message</label>
            <textarea
              value={localFormType.successMessage}
              onChange={(e) => setLocalFormType({ ...localFormType, successMessage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Thank you for your submission..."
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={localFormType.isActive}
              onChange={(e) => setLocalFormType({ ...localFormType, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Field Modal Component
const FieldModal = ({ field, onSave, onCancel }) => {
  const [localField, setLocalField] = useState(field || {
    name: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    helpText: '',
    validation: {},
    options: []
  });

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'radio', label: 'Radio' },
    { value: 'checkbox', label: 'Checkbox' }
  ];

  const needsOptions = ['select', 'radio', 'checkbox'].includes(localField.type);

  const addOption = () => {
    setLocalField({
      ...localField,
      options: [...localField.options, { label: '', value: '' }]
    });
  };

  const updateOption = (index, key, value) => {
    const newOptions = [...localField.options];
    newOptions[index][key] = value;
    setLocalField({ ...localField, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = localField.options.filter((_, i) => i !== index);
    setLocalField({ ...localField, options: newOptions });
  };

  const handleSave = () => {
    onSave(localField);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {field.isNew ? 'Add New Field' : 'Edit Field'}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (ID)</label>
              <input
                type="text"
                value={localField.name}
                onChange={(e) => setLocalField({ ...localField, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="fullName"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={localField.label}
                onChange={(e) => setLocalField({ ...localField, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full Name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={localField.type}
              onChange={(e) => setLocalField({ ...localField, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
              <input
                type="text"
                value={localField.placeholder}
                onChange={(e) => setLocalField({ ...localField, placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="required"
                checked={localField.required}
                onChange={(e) => setLocalField({ ...localField, required: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="required" className="text-sm font-medium text-gray-700">Required</label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Help Text</label>
            <input
              type="text"
              value={localField.helpText}
              onChange={(e) => setLocalField({ ...localField, helpText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional help text"
            />
          </div>
          
          {/* Validation */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Validation</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Length</label>
                <input
                  type="number"
                  value={localField.validation?.minLength || ''}
                  onChange={(e) => setLocalField({
                    ...localField,
                    validation: { ...localField.validation, minLength: parseInt(e.target.value) || undefined }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
                <input
                  type="number"
                  value={localField.validation?.maxLength || ''}
                  onChange={(e) => setLocalField({
                    ...localField,
                    validation: { ...localField.validation, maxLength: parseInt(e.target.value) || undefined }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Options for select, radio, checkbox */}
          {needsOptions && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Options</h4>
                <button
                  onClick={addOption}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Option
                </button>
              </div>
              
              {localField.options.map((option, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => updateOption(index, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => updateOption(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormCMS;