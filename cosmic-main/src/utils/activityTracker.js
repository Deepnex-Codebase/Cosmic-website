// Activity tracking utility

// Initialize tracking data
let activityData = {
  pagesVisited: [],
  startTime: null,
  lastPageVisited: null
};

// Start tracking session
export const startTracking = () => {
  activityData.startTime = new Date();
  trackPageVisit(window.location.pathname);
  
  // Add event listeners for page navigation
  window.addEventListener('popstate', handleNavigation);
};

// Stop tracking session
export const stopTracking = () => {
  window.removeEventListener('popstate', handleNavigation);
};

// Handle navigation events
const handleNavigation = () => {
  trackPageVisit(window.location.pathname);
};

// Track a page visit
export const trackPageVisit = (path) => {
  // Don't track duplicate consecutive visits to the same page
  if (activityData.lastPageVisited !== path) {
    activityData.pagesVisited.push({
      path,
      timestamp: new Date().toISOString()
    });
    activityData.lastPageVisited = path;
  }
};

// Get session duration in seconds
export const getSessionDuration = () => {
  if (!activityData.startTime) return 0;
  
  const now = new Date();
  const durationMs = now - activityData.startTime;
  return Math.floor(durationMs / 1000); // Convert to seconds
};

// Get tracking data
export const getTrackingData = () => {
  return {
    pagesVisited: activityData.pagesVisited,
    totalSessionDuration: getSessionDuration(),
    lastVisitedPage: activityData.lastPageVisited
  };
};

// Reset tracking data
export const resetTracking = () => {
  activityData = {
    pagesVisited: [],
    startTime: new Date(),
    lastPageVisited: window.location.pathname
  };
  trackPageVisit(window.location.pathname);
};