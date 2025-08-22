import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSignOutAlt } from 'react-icons/fa';
import { removeAuthToken } from '../utils/cookies';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove token from cookies
    removeAuthToken();
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to login page
    navigate('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors duration-200"
      title="Logout"
    >
      <FaSignOutAlt />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;