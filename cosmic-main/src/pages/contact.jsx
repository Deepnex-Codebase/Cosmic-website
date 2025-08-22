import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Contact = () => {
  const [formConfig, setFormConfig] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { fetchContactMessages } = useAppContext();

  // Fetch form configuration on component mount
  useEffect(() => {
    fetchFormConfiguration();
  }, []);

  // Update selected type when form config loads
  useEffect(() => {
    if (formConfig && formConfig.formTypes && formConfig.formTypes.length > 0) {
      const firstActiveType = formConfig.formTypes
        .filter(type => type.isActive)
        .sort((a, b) => a.order - b.order)[0];
      if (firstActiveType) {
        setSelectedType(firstActiveType.name);
        initializeFormData(firstActiveType);
      }
    }
  }, [formConfig]);

  const fetchFormConfiguration = async () => {
    try {
      setConfigLoading(true);
      const response = await fetch('/api/form-config');
      const result = await response.json();
      
      if (result.success) {
        setFormConfig(result.data);
      } else {
        console.error('Failed to fetch form configuration:', result.message);
      }
    } catch (error) {
      console.error('Error fetching form configuration:', error);
    } finally {
      setConfigLoading(false);
    }
  };

  const initializeFormData = (formType) => {
    const initialData = {};
    formType.fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialData[field.name] = false;
      } else {
        initialData[field.name] = '';
      }
    });
    setFormData(initialData);
  };

  const handleTypeChange = (typeName) => {
    setSelectedType(typeName);
    const selectedFormType = formConfig.formTypes.find(type => type.name === typeName);
    if (selectedFormType) {
      initializeFormData(selectedFormType);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateField = (field, value) => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { minLength, maxLength, pattern, min, max } = field.validation;
      
      if (minLength && value.length < minLength) {
        return `${field.label} must be at least ${minLength} characters`;
      }
      
      if (maxLength && value.length > maxLength) {
        return `${field.label} must not exceed ${maxLength} characters`;
      }
      
      if (pattern && !new RegExp(pattern).test(value)) {
        return `${field.label} format is invalid`;
      }
      
      if (field.type === 'number') {
        const numValue = parseFloat(value);
        if (min !== undefined && numValue < min) {
          return `${field.label} must be at least ${min}`;
        }
        if (max !== undefined && numValue > max) {
          return `${field.label} must not exceed ${max}`;
        }
      }
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    try {
      const selectedFormType = formConfig.formTypes.find(type => type.name === selectedType);
      
      // Validate all fields
      const errors = [];
      selectedFormType.fields.forEach(field => {
        const error = validateField(field, formData[field.name]);
        if (error) {
          errors.push(error);
        }
      });

      if (errors.length > 0) {
        setSubmitStatus('error');
        console.error('Validation errors:', errors);
        return;
      }

      // Submit form
      const response = await fetch('/api/form-config/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: selectedType,
          formData: formData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        initializeFormData(selectedFormType); // Reset form
        fetchContactMessages();
      } else {
        setSubmitStatus('error');
        console.error('Form submission error:', result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const baseClasses = "w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30";
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
            pattern={field.validation?.pattern}
            className={`${baseClasses} ${field.className || ''}`}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            required={field.required}
            rows={3}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
            className={`${baseClasses} ${field.className || ''}`}
          />
        );
      
      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            required={field.required}
            className={`${baseClasses} ${field.className || ''}`}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="flex flex-wrap gap-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={formData[field.name] === option.value}
                  onChange={handleInputChange}
                  required={field.required}
                  className="text-accent-800"
                />
                <span className="text-sm text-accent-800">{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        if (field.options && field.options.length > 0) {
          // Multiple checkboxes
          return (
            <div className="flex flex-wrap gap-3">
              {field.options.map((option, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={`${field.name}_${option.value}`}
                    checked={formData[`${field.name}_${option.value}`] || false}
                    onChange={handleInputChange}
                    className="text-accent-800"
                  />
                  <span className="text-sm text-accent-800">{option.label}</span>
                </label>
              ))}
            </div>
          );
        } else {
          // Single checkbox
          return (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={field.name}
                checked={formData[field.name] || false}
                onChange={handleInputChange}
                required={field.required}
                className="text-accent-800"
              />
              <span className="text-sm text-accent-800">{field.helpText || field.label}</span>
            </label>
          );
        }
      
      default:
        return null;
    }
  };

  if (configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="animate-spin text-accent-600" size={24} />
          <span className="text-accent-600">Loading form configuration...</span>
        </div>
      </div>
    );
  }

  if (!formConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Configuration Error</h2>
          <p className="text-gray-600">Unable to load form configuration. Please try again later.</p>
        </div>
      </div>
    );
  }

  const activeFormTypes = formConfig.formTypes
    .filter(type => type.isActive)
    .sort((a, b) => a.order - b.order);

  const selectedFormType = activeFormTypes.find(type => type.name === selectedType);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-cover bg-center h-[300px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://zolar.wpengine.com/wp-content/uploads/2025/01/zolar-breadcrumb-bg.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">{formConfig.formName || 'Contact Us'}</h1>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-accent-500 transition-colors">Home</Link>
            <span>—</span>
            <span className="text-accent-500">Contact</span>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <section className="w-full bg-accent-50 py-16 flex justify-center">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 justify-center">
          
          {/* --------- MAP ---------- */}
          <div className="w-full lg:w-5/12 mb-8 lg:mb-0 order-last lg:order-first">
            <div className="h-full rounded-lg overflow-hidden shadow-lg">
              <iframe
                title="Company Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.422565099936!2d72.77443167502427!3d21.215085780481296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d5afda3a0e1%3A0x632ce1cca595b896!2sCosmic%20Powertech%20Solution!5e0!3m2!1sen!2sin!4v1750488844475!5m2!1sen!2sin"
                width="100%"
                height="100%"
                className="rounded-lg grayscale-[25%] contrast-125 h-[600px] lg:h-full"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* --------- FORM CARD ---------- */}
          <div className="w-full lg:w-5/12 order-first lg:order-last">
            <div className="rounded-lg p-6 md:p-10 shadow-lg relative overflow-hidden bg-gradient-to-b from-accent-200 to-accent-500">
              {/* Background Image */}
              <div 
                className="absolute inset-0 z-0 opacity-10"
                style={{
                  backgroundImage: "url('/contact-from-bg.jpeg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              ></div>
              
              <div className="relative z-10">
                <p className="text-center text-xs tracking-widest mb-2 text-accent-600">
                  —☘ ASK US ☘—
                </p>

                <h2 className="font-extrabold text-3xl md:text-4xl mb-6 md:mb-8 leading-tight text-center text-accent-800">
                  {formConfig.formDescription || 'Contact Us For Any Queries?'}
                </h2>

                {submitStatus === 'success' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start gap-4">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-green-800 text-lg">Message Sent Successfully!</h3>
                      <p className="text-green-700 mt-1">
                        {selectedFormType?.successMessage || 'Thank you for contacting us. We\'ll get back to you shortly.'}
                      </p>
                      <button 
                        onClick={() => setSubmitStatus(null)} 
                        className="mt-4 text-sm font-medium text-green-700 hover:text-green-900"
                      >
                        Send another message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Form Type Selection */}
                    {activeFormTypes.length > 1 && (
                      <div className="flex flex-wrap gap-3 justify-center mb-2">
                        {activeFormTypes.map((type) => (
                          <label key={type.name} className="relative cursor-pointer">
                            <input 
                              type="radio" 
                              name="formType" 
                              value={type.name}
                              className="peer sr-only"
                              checked={selectedType === type.name}
                              onChange={() => handleTypeChange(type.name)}
                            />
                            <div className="px-6 py-2 rounded-full bg-white/50 text-accent-800 peer-checked:bg-accent-800 peer-checked:text-white transition-all hover:bg-white/70">
                              {type.label}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Dynamic Form Fields */}
                    {selectedFormType && (
                      <>
                        {selectedFormType.description && (
                          <p className="text-sm text-accent-700 text-center mb-4">
                            {selectedFormType.description}
                          </p>
                        )}
                        
                        {selectedFormType.fields
                          .sort((a, b) => a.order - b.order)
                          .map((field) => (
                            <div key={field.name} className="space-y-1">
                              <label className="text-xs font-medium text-accent-800">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              {renderField(field)}
                              {field.helpText && (
                                <p className="text-xs text-accent-600 mt-1">{field.helpText}</p>
                              )}
                            </div>
                          ))
                        }
                      </>
                    )}

                    {submitStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-500" />
                        <p className="text-xs text-red-700">There was an error submitting your message. Please try again.</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !selectedFormType}
                      className={`mt-2 inline-flex items-center gap-2 self-start rounded-full bg-accent-800 text-white px-6 py-3 font-semibold hover:bg-accent-600 transition-all shadow-md hover:shadow-accent-800/20 ${
                        loading || !selectedFormType ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Submitting...' : 'Submit Details'}
                      {!loading && <ArrowRight size={18} strokeWidth={2} />}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
