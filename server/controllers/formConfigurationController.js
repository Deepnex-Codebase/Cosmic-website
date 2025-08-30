const FormConfiguration = require('../models/FormConfiguration');
const mongoose = require('mongoose');

// Get form configuration
const getFormConfiguration = async (req, res) => {
  try {
    let formConfig = await FormConfiguration.findOne({ isActive: true });
    
    // If no configuration exists, create a default one
    if (!formConfig) {
      formConfig = new FormConfiguration({
        formName: 'Contact Form',
        formDescription: 'Get in touch with us',
        formTypes: [
          {
            name: 'residential',
            label: 'Residential',
            description: 'For residential projects and inquiries',
            fields: [
              {
                name: 'name',
                label: 'Full Name',
                type: 'text',
                placeholder: 'Enter your full name',
                required: true,
                order: 1
              },
              {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                placeholder: 'Enter your email address',
                required: true,
                order: 2
              },
              {
                name: 'phone',
                label: 'Phone Number',
                type: 'tel',
                placeholder: 'Enter your phone number',
                required: true,
                order: 3
              },
              {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                placeholder: 'Tell us about your residential project requirements',
                required: true,
                order: 4
              }
            ],
            order: 1
          },
          {
            name: 'housing-society',
            label: 'Housing Society',
            description: 'For housing society projects and inquiries',
            fields: [
              {
                name: 'name',
                label: 'Full Name',
                type: 'text',
                placeholder: 'Enter your full name',
                required: true,
                order: 1
              },
              {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                placeholder: 'Enter your email address',
                required: true,
                order: 2
              },
              {
                name: 'phone',
                label: 'Phone Number',
                type: 'tel',
                placeholder: 'Enter your phone number',
                required: true,
                order: 3
              },
              {
                name: 'societyName',
                label: 'Society Name',
                type: 'text',
                placeholder: 'Enter housing society name',
                required: true,
                order: 4
              },
              {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                placeholder: 'Tell us about your housing society project requirements',
                required: true,
                order: 5
              }
            ],
            order: 2
          },
          {
            name: 'commercial',
            label: 'Commercial',
            description: 'For commercial projects and inquiries',
            fields: [
              {
                name: 'name',
                label: 'Full Name',
                type: 'text',
                placeholder: 'Enter your full name',
                required: true,
                order: 1
              },
              {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                placeholder: 'Enter your email address',
                required: true,
                order: 2
              },
              {
                name: 'phone',
                label: 'Phone Number',
                type: 'tel',
                placeholder: 'Enter your phone number',
                required: true,
                order: 3
              },
              {
                name: 'companyName',
                label: 'Company Name',
                type: 'text',
                placeholder: 'Enter your company name',
                required: true,
                order: 4
              },
              {
                name: 'projectType',
                label: 'Project Type',
                type: 'select',
                required: true,
                options: [
                  { label: 'Office Building', value: 'office' },
                  { label: 'Retail Space', value: 'retail' },
                  { label: 'Industrial', value: 'industrial' },
                  { label: 'Mixed Use', value: 'mixed-use' },
                  { label: 'Other', value: 'other' }
                ],
                order: 5
              },
              {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                placeholder: 'Tell us about your commercial project requirements',
                required: true,
                order: 6
              }
            ],
            order: 3
          }
        ]
      });
      await formConfig.save();
    }
    
    res.status(200).json({
      success: true,
      data: formConfig
    });
  } catch (error) {
    console.error('Error fetching form configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching form configuration',
      error: error.message
    });
  }
};

// Update form configuration
const updateFormConfiguration = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const formConfig = await FormConfiguration.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!formConfig) {
      return res.status(404).json({
        success: false,
        message: 'Form configuration not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: formConfig,
      message: 'Form configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating form configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating form configuration',
      error: error.message
    });
  }
};

// Add new form type
const addFormType = async (req, res) => {
  try {
    const { configId } = req.params;
    const formTypeData = req.body;
    
    const formConfig = await FormConfiguration.findById(configId);
    if (!formConfig) {
      return res.status(404).json({
        success: false,
        message: 'Form configuration not found'
      });
    }
    
    // Check if form type name already exists
    const existingType = formConfig.formTypes.find(type => type.name === formTypeData.name);
    if (existingType) {
      return res.status(400).json({
        success: false,
        message: 'Form type with this name already exists'
      });
    }
    
    formConfig.formTypes.push(formTypeData);
    await formConfig.save();
    
    res.status(201).json({
      success: true,
      data: formConfig,
      message: 'Form type added successfully'
    });
  } catch (error) {
    console.error('Error adding form type:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding form type',
      error: error.message
    });
  }
};

// Update form type
const updateFormType = async (req, res) => {
  try {
    const { configId, typeId } = req.params;
    const updateData = req.body;
    
    const formConfig = await FormConfiguration.findById(configId);
    if (!formConfig) {
      return res.status(404).json({
        success: false,
        message: 'Form configuration not found'
      });
    }
    
    const formType = formConfig.formTypes.id(typeId);
    if (!formType) {
      return res.status(404).json({
        success: false,
        message: 'Form type not found'
      });
    }
    
    Object.assign(formType, updateData);
    await formConfig.save();
    
    res.status(200).json({
      success: true,
      data: formConfig,
      message: 'Form type updated successfully'
    });
  } catch (error) {
    console.error('Error updating form type:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating form type',
      error: error.message
    });
  }
};

// Delete form type
const deleteFormType = async (req, res) => {
  try {
    const { configId, typeId } = req.params;
    
    const formConfig = await FormConfiguration.findById(configId);
    if (!formConfig) {
      return res.status(404).json({
        success: false,
        message: 'Form configuration not found'
      });
    }
    
    formConfig.formTypes.pull(typeId);
    await formConfig.save();
    
    res.status(200).json({
      success: true,
      data: formConfig,
      message: 'Form type deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting form type:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting form type',
      error: error.message
    });
  }
};

// Submit form data
const submitForm = async (req, res) => {
  try {
    const { formType, formData } = req.body;
    
    // Get form configuration to validate fields
    const formConfig = await FormConfiguration.findOne({ isActive: true });
    if (!formConfig) {
      return res.status(404).json({
        success: false,
        message: 'Form configuration not found'
      });
    }
    
    // Find the specific form type
    const selectedFormType = formConfig.formTypes.find(type => type.name === formType);
    if (!selectedFormType) {
      return res.status(404).json({
        success: false,
        message: 'Form type not found'
      });
    }
    
    // Validate required fields
    const requiredFields = selectedFormType.fields.filter(field => field.required);
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!formData[field.name] || formData[field.name].trim() === '') {
        missingFields.push(field.label);
      }
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Here you can add logic to save form submission to database
    // For now, we'll just return success
    
    res.status(200).json({
      success: true,
      message: selectedFormType.successMessage || 'Form submitted successfully',
      data: {
        formType,
        submittedData: formData,
        submittedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message
    });
  }
};

module.exports = {
  getFormConfiguration,
  updateFormConfiguration,
  addFormType,
  updateFormType,
  deleteFormType,
  submitForm
};