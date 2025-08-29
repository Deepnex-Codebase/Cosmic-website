const mongoose = require('mongoose');

// Field schema for dynamic form fields
const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'email', 'tel', 'number', 'textarea', 'select', 'radio', 'checkbox']
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  validation: {
    minLength: { type: Number },
    maxLength: { type: Number },
    pattern: { type: String },
    min: { type: Number },
    max: { type: Number }
  },
  options: [{
    label: String,
    value: String
  }], // For select, radio, checkbox fields
  order: {
    type: Number,
    default: 0
  },
  className: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  }
});

// Form type schema
const formTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  fields: [fieldSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  emailTemplate: {
    subject: {
      type: String,
      default: 'New Contact Form Submission'
    },
    body: {
      type: String,
      default: 'You have received a new contact form submission.'
    }
  },
  successMessage: {
    type: String,
    default: 'Thank you for contacting us. We will get back to you soon.'
  }
}, {
  timestamps: true
});

// Main form configuration schema
const formConfigurationSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: true,
    default: 'Contact Form'
  },
  formDescription: {
    type: String,
    default: 'Get in touch with us'
  },
  formTypes: [formTypeSchema],
  globalSettings: {
    enableCaptcha: {
      type: Boolean,
      default: false
    },
    enableEmailNotification: {
      type: Boolean,
      default: true
    },
    notificationEmail: {
      type: String,
      default: 'admin@company.com'
    },
    enableAutoResponse: {
      type: Boolean,
      default: true
    },
    autoResponseTemplate: {
      subject: {
        type: String,
        default: 'Thank you for contacting us'
      },
      body: {
        type: String,
        default: 'We have received your message and will get back to you soon.'
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
formConfigurationSchema.index({ 'formTypes.name': 1 });
formConfigurationSchema.index({ 'formTypes.isActive': 1 });
formConfigurationSchema.index({ isActive: 1 });

module.exports = mongoose.model('FormConfiguration', formConfigurationSchema);