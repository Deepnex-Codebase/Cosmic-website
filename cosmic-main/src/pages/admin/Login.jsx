import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/api';
import { setAuthToken, getAuthToken } from '../../utils/cookies';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSolarPanel } from 'react-icons/fa';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      navigate('/admin/home');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(credentials);
      const { token, user } = response.data;

      // Store token in localStorage and cookie
      localStorage.setItem('token', token);
      setAuthToken(token, 7); // Store token for 7 days

      // Store user info if needed
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Login successful!');
      navigate('/admin/home');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-green-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mb-4">
            <FaSolarPanel className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Cosmic Solar</h2>
          <h3 className="mt-2 text-center text-xl font-bold text-gray-800">Admin Portal</h3>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-5 mt-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Enter your password"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Signing in...
                </>
              ) : 'Sign in to Dashboard'}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Cosmic Solar. All rights reserved.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;