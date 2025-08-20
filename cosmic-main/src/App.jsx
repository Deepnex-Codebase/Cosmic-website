import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'


// Components 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import CustomerSupportChat from './components/CustomerSupportChat';
import OfferPopup from './components/OfferPopup';
import ScrollToTop from './components/ScrollToTop';
import AdminLayout from './components/AdminLayout';

// Pages
import Home from './pages/home'
import About from './pages/about'
import Services from './pages/services'
import Projects from './pages/projects'
import Calculator from './pages/calculator'
import AdvancedCalculator from './pages/advanced-calculator'
import Contact from './pages/contact'
import Blog from './pages/blog'
import BlogDetail from './pages/blogDetail'
import Careers from './pages/careers'

import Products from './pages/products/Products';
import ProductDetail from './pages/products/product-detail';
import ProjectDetail from './pages/project-detail';
import PressRelease from './pages/pr'
import PressReleaseDetail from './pages/pressReleaseDetail'
import TeamCelebration from './pages/team-celebration'
import DirectorDesk from './pages/director-desk'
import CompanyCulture from './pages/company-culture'
import AchievementsAwards from './pages/achievements-awards'

// Admin Pages
import Login from './pages/admin/Login';
import DirectorAdmin from './pages/admin/directors'
import TeamAdmin from './pages/admin/team'
import AboutAdmin from './pages/admin/about'
import CompanyCultureAdmin from './pages/admin/company-culture'
import AdminServices from './pages/admin/services'
import AdminProjects from './pages/admin/projects'
import AdminProcesses from './pages/admin/AdminProcesses'
import BlogCMS from './pages/admin/BlogCMS'
import HomeCMS from './pages/admin/HomeCMS'
import AchievementCMS from './pages/admin/AchievementCMS'
import PressReleaseCMS from './pages/admin/PressReleaseCMS'
import ProductCMS from './pages/admin/ProductCMS'
import FormCMS from './pages/admin/FormCMS';
import FooterCMS from './pages/admin/FooterCMS';

import NavbarCMS from './components/NavbarCMS';


// AppContent component to handle transitions
function AppContent() {
  const location = useLocation();
  
  // Scroll to top when location changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <div className="min-h-screen bg-white w-full flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow">
        <TransitionGroup component={null}>
          <CSSTransition 
            key={location.key} 
            timeout={400} 
            classNames="page"
            unmountOnExit
          >
            <div className="page-container">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />

                <Route path="/products/product-detail/:id" element={<ProductDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/advanced-calculator" element={<AdvancedCalculator />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/pr" element={<PressRelease />} />
                <Route path="/pr/:id" element={<PressReleaseDetail />} />
                <Route path="/achievements-awards" element={<AchievementsAwards />} />
                <Route path="/team-celebration" element={<TeamCelebration />} />
                <Route path="/director-desk" element={<DirectorDesk />} />
                <Route path="/company-culture" element={<CompanyCulture />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </main>

      <Footer />
      <CookieConsent />
      <OfferPopup />
      <ScrollToTop />
      <CustomerSupportChat />
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
}

import { getAuthToken, isAuthenticated } from './utils/cookies';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated using the utility function
  if (!isAuthenticated()) {
    // Redirect to login if token is not present
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

// Admin Routes Component
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/admin/home" replace />} />
              <Route path="/home" element={<HomeCMS />} />
              <Route path="/directors" element={<DirectorAdmin />} />
              <Route path="/team" element={<TeamAdmin />} />
              <Route path="/services" element={<AdminServices />} />
              <Route path="/projects" element={<AdminProjects />} />
              <Route path="/processes" element={<AdminProcesses />} />
              <Route path="/about" element={<AboutAdmin />} />
              <Route path="/company-culture" element={<CompanyCultureAdmin />} />
              <Route path="/achievements" element={<AchievementCMS />} />
              <Route path="/products" element={<ProductCMS />} />
              <Route path="/blogs" element={<BlogCMS />} />
              <Route path="/press-releases" element={<PressReleaseCMS />} />
              <Route path="/forms" element={<FormCMS />} />
              <Route path="/footer" element={<FooterCMS />} />
              <Route path="/navbar" element={<NavbarCMS />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  )
}

export default App
