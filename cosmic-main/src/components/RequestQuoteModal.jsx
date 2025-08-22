import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, User, MessageSquare, Check } from 'lucide-react';

const RequestQuoteModal = ({ isOpen, onClose, productName }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Create refs for OTP inputs
  const otpRefs = Array(6).fill(0).map(() => React.createRef());

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setStep(1);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      setOtpExpiry(null);
      setTimeLeft(0);
    }
  }, [isOpen]);
  
  // OTP expiry timer
  useEffect(() => {
    let timer;
    if (otpExpiry) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = otpExpiry - now;
        
        if (distance <= 0) {
          clearInterval(timer);
          setTimeLeft(0);
          // OTP expired
          if (step === 2) {
            setOtpError('OTP has expired. Please request a new one.');
            setGeneratedOtp(''); // Invalidate the OTP
          }
        } else {
          setTimeLeft(Math.floor(distance / 1000));
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpExpiry, step]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Generate a random 6-digit OTP
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    
    try {
      // Try to send OTP via backend API using Nodemailer
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cosmicpowertech.com';
      try {
        // Make sure the port matches the one in server.js
        const response = await fetch(`${API_BASE_URL}/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            otp: randomOtp
          }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to send OTP');
        }
        
        console.log(`OTP sent to ${formData.email}: ${randomOtp}`);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // For development/demo purposes, we'll proceed with the locally generated OTP
        console.log(`[DEV MODE] Using locally generated OTP: ${randomOtp}`);
      }
      
      // Set OTP expiry time (5 minutes from now)
      const expiryTime = new Date().getTime() + 5 * 60 * 1000;
      setOtpExpiry(expiryTime);
      
      setLoading(false);
      setStep(2);
    } catch (error) {
      console.error('Error in form submission:', error);
      setLoading(false);
      alert('An error occurred. Please try again.');
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  // Handle OTP keydown for backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  // Handle OTP verification
  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    setLoading(true);
    
    try {
      // Here you would typically verify the OTP with your backend
      // For this implementation, we're comparing with the locally generated OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (enteredOtp === generatedOtp) {
        // Store data in "dummy database" (localStorage)
        const storedQuotes = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
        storedQuotes.push({
          ...formData,
          productName,
          timestamp: new Date().toISOString(),
          verified: true
        });
        localStorage.setItem('quoteRequests', JSON.stringify(storedQuotes));
        
        setLoading(false);
        setStep(3);
      } else {
        setLoading(false);
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setLoading(false);
      setOtpError('Verification failed. Please try again.');
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Request a Quote</h2>
              <p className="text-gray-600 mb-6">
                {productName ? `For ${productName}` : 'Fill out the form below to get a personalized quote'}
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                        <MessageSquare size={16} className="text-gray-400" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Tell us about your requirements"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-primary-white text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      'Request Quote'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
          
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Verify Your Email</h2>
              <p className="text-gray-600 mb-2">
                We've sent a 6-digit OTP to <span className="font-medium">{formData.email}</span>. Please enter it below to verify your email address.
              </p>
              
              {timeLeft > 0 && (
                <p className="text-sm text-gray-500 mb-4">
                  OTP expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </p>
              )}
              
              <div className="mb-6">
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ))}
                </div>
                
                {otpError && (
                  <p className="text-red-500 text-sm mt-2 text-center">{otpError}</p>
                )}
                
                <p className="text-gray-500 text-sm mt-4 text-center">
                  Didn't receive the code? <button 
                    type="button" 
                    onClick={async () => {
                      setLoading(true);
                      try {
                        // Generate a new OTP
                        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                        setGeneratedOtp(newOtp);
                        
                        // Try to send new OTP via backend API using Nodemailer
                        try {
                          // Make sure the port matches the one in server.js
                          const response = await fetch(`${API_BASE_URL}/send-otp`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              email: formData.email,
                              name: formData.name,
                              otp: newOtp
                            }),
                          });
                          
                          const data = await response.json();
                          
                          if (!data.success) {
                            throw new Error(data.message || 'Failed to send OTP');
                          }
                          
                          console.log(`New OTP sent to ${formData.email}: ${newOtp}`);
                        } catch (apiError) {
                          console.error('API Error on resend:', apiError);
                          // For development/demo purposes, we'll proceed with the locally generated OTP
                          console.log(`[DEV MODE] Using locally generated OTP on resend: ${newOtp}`);
                        }
                        
                        // Reset OTP expiry time (5 minutes from now)
                        const expiryTime = new Date().getTime() + 5 * 60 * 1000;
                        setOtpExpiry(expiryTime);
                         
                        setLoading(false);
                        setOtpError('');
                        // Reset OTP input fields
                        setOtp(['', '', '', '', '', '']);
                        // Focus on first input
                        otpRefs[0].current.focus();
                      } catch (error) {
                        console.error('Error in resend process:', error);
                        setLoading(false);
                        alert('An error occurred. Please try again.');
                      }
                    }}
                    disabled={loading}
                    className="text-primary font-medium hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    Resend
                  </button>
                </p>
              </div>
              
              <button
                onClick={verifyOtp}
                disabled={loading || otp.some(digit => !digit)}
                className="w-full bg-black hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300 "
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </>
          )}
          
          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Request Successful!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in our products. Our team will review your request and get back to you within 24 hours.
              </p>
              <button
                onClick={onClose}
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestQuoteModal;