// Set a cookie with expiry date
export const setCookie = (name, value, days) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  const cookie = `${name}=${value}; expires=${expiryDate.toUTCString()}; path=/`;
  document.cookie = cookie;
};

// Get a cookie by name
export const getCookie = (name) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
};

// Delete a cookie by name
export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Set authentication token in cookie
export const setAuthToken = (token, days = 7) => {
  setCookie('token', token, days);
};

// Get authentication token from cookie
export const getAuthToken = () => {
  return getCookie('token');
};

// Remove authentication token from cookie
export const removeAuthToken = () => {
  deleteCookie('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Check if user has accepted cookies
export const hasAcceptedCookies = () => {
  return localStorage.getItem('cookieConsent') === 'accepted';
};

// Set all cookies when user accepts
export const setAllCookies = () => {
  if (hasAcceptedCookies()) {
    // Set your cookies here with 30 days expiry
    setCookie('analyticsCookie', 'true', 30);
    setCookie('marketingCookie', 'true', 30);
    setCookie('preferenceCookie', 'true', 30);
  }
};