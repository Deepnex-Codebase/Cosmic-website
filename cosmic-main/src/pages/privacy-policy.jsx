import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserLock, FaCookieBite, FaGlobe, FaChild, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { privacyPolicyService } from '../services/api';

// Default policy data defined outside the component
const defaultPolicyData = {
  lastUpdated: "October 6, 2025",
  introduction: "Cosmic Power Technologies (\"we,\" \"our,\" or \"us\") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website www.cosmicpowertech.com, and how we comply with global privacy standards including Facebook/Meta advertising requirements.",
  informationCollected: {
    description: "We collect information to provide our services, improve user experience, and run advertising campaigns.",
    providedInfo: "Name, Email Address, Phone Number, Company/Job Title, Address (when you contact us or request information).",
    automaticInfo: "IP Address, Browser Type, Device Information, Operating System\nPages visited, time spent, referral sources\nCookies and tracking pixels",
    thirdPartyData: "We may use Meta (Facebook/Instagram) tracking technologies, such as the Facebook Pixel, to understand user interactions, measure ad performance, and create personalized experiences."
  },
  informationUsage: [
    "To operate, maintain, and improve our website and services",
    "To respond to inquiries and provide support",
    "To send updates, newsletters, and promotional offers (only if you opt-in)",
    "To analyze trends and site usage for business insights",
    "To deliver and measure targeted advertisements across platforms (e.g., Facebook/Instagram Ads, Google Ads)",
    "To comply with legal and regulatory obligations"
  ],
  cookiesAndTracking: {
    description: "We use cookies, pixels, and other tracking tools to:",
    purposes: [
      "Improve website performance and user experience",
      "Analyze traffic and user behavior",
      "Deliver personalized ads via Facebook, Instagram, Google, and other networks"
    ],
    managingCookies: "You can manage or disable cookies via your browser settings. For Facebook Ads, you can adjust ad preferences at Facebook Ad Preferences."
  },
  dataSharing: {
    description: "We do not sell your personal information. We may share information only with:",
    sharingEntities: [
      "Service Providers (hosting, analytics, ad platforms, email marketing tools)",
      "Advertising Platforms (Facebook, Instagram, Google) for targeted advertising",
      "Legal Authorities when required by law",
      "Business Transfers in case of merger, acquisition, or restructuring"
    ]
  },
  dataSecurity: {
    description: "We use reasonable security measures such as SSL encryption, access controls, and internal policies to protect your information.",
    disclaimer: "However, please note: no method of electronic transmission or storage is 100% secure."
  },
  userRights: {
    description: "Depending on your location, you may have the following rights:",
    rights: [
      "Access & Correction: Request access to or correction of your personal data",
      "Deletion: Request that we delete your data (subject to legal obligations)",
      "Opt-Out of Marketing: Unsubscribe from emails or adjust your ad preferences"
    ],
    adOptOuts: [
      "Facebook Ad Preferences",
      "Google Ads Settings"
    ],
    contactInfo: "To exercise your rights, contact us at info@cosmicpowertech.com."
  },
  internationalTransfers: "If you are accessing from outside India, your data may be processed in countries where our servers and service providers are located. We ensure safeguards are in place to protect your information.",
  childrenPrivacy: "Our services are not directed at individuals under 13 years of age, and we do not knowingly collect personal information from children.",
  policyChanges: "We may update this Privacy Policy periodically. Any updates will be posted on this page, and material changes will be communicated via website notices or email.",
  contactDetails: {
    email: "COSMICPOWERTECH@GMAIL.COM",
    address: "73 Tapas Nagar Society, Palanpur Canal Rd, Palanpur, Surat, Gujarat 395009",
    website: "www.cosmicpowertech.com"
  }
};

const PrivacyPolicy = () => {
  // All state declarations at the top level
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  // Fetch policy data
  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        
        const response = await privacyPolicyService.getActivePolicy();
        
        if (response.data && response.data.data) {
          if (Object.keys(response.data.data).length > 0) {
            setPolicy(response.data.data);
          } else {
            console.log('Using default policy data - API returned empty object');
            setPolicy(defaultPolicyData);
          }
        } else {
          // If API returns empty data, use default
          setPolicy(defaultPolicyData);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching privacy policy:', err);
        setError('Failed to load privacy policy. Please try again later.');
        // On error, use default policy data
        setPolicy(defaultPolicyData);
        setLoading(false);
      }
    };
    
    fetchPrivacyPolicy();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !policy) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center"
          >
            <FaShieldAlt className="mx-auto text-5xl mb-6 text-blue-300" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-blue-200">Last Updated: {policy.lastUpdated}</p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="prose prose-lg max-w-none"
          >
            <p className="text-gray-700 mb-8">
              {policy.introduction}
            </p>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaUserLock className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">1. Information We Collect</h2>
              </div>
              <p className="text-gray-700 mb-4">{policy.informationCollected.description}</p>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">A. Information You Provide</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>{policy.informationCollected.providedInfo}</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">B. Automatically Collected Information</h3>
              <p className="text-gray-700 mb-2">When you visit our site, we automatically collect technical and usage information, such as:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {policy.informationCollected.automaticInfo.split('\n').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">C. Facebook & Third-Party Data Collection</h3>
              <p className="text-gray-700">{policy.informationCollected.thirdPartyData}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaGlobe className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">2. How We Use Your Information</h2>
              </div>
              <p className="text-gray-700 mb-2">We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-700">
                {policy.informationUsage && policy.informationUsage.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaCookieBite className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">3. Cookies, Pixels & Tracking Technologies</h2>
              </div>
              <p className="text-gray-700 mb-4">{policy.cookiesAndTracking.description}</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {policy.cookiesAndTracking.purposes && policy.cookiesAndTracking.purposes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="text-gray-700">{policy.cookiesAndTracking.managingCookies}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaUserLock className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">4. Sharing & Disclosure of Information</h2>
              </div>
              <p className="text-gray-700 mb-4">{policy.dataSharing.description}</p>
              <ul className="list-disc pl-6 text-gray-700">
                {policy.dataSharing.sharingEntities && policy.dataSharing.sharingEntities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaShieldAlt className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">5. Data Security</h2>
              </div>
              <p className="text-gray-700 mb-4">{policy.dataSecurity.description}</p>
              <p className="text-gray-700">{policy.dataSecurity.disclaimer}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaUserLock className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">6. Your Rights & Choices</h2>
              </div>
              <p className="text-gray-700 mb-4">{policy.userRights.description}</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {policy.userRights.rights && policy.userRights.rights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="text-gray-700 mb-2">Advertising Opt-Outs:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {policy.userRights.adOptOuts && policy.userRights.adOptOuts.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="text-gray-700">{policy.userRights.contactInfo}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaGlobe className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">7. International Data Transfers</h2>
              </div>
              <p className="text-gray-700">{policy.internationalTransfers}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaChild className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">8. Children's Privacy</h2>
              </div>
              <p className="text-gray-700">{policy.childrenPrivacy}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaShieldAlt className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">9. Changes to This Privacy Policy</h2>
              </div>
              <p className="text-gray-700">{policy.policyChanges}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaEnvelope className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">10. Contact Us</h2>
              </div>
              <p className="text-gray-700 mb-4">If you have questions about this Privacy Policy or our data practices, please contact us:</p>
              <ul className="list-none pl-6 text-gray-700">
                <li className="flex items-center mb-2">
                  <FaEnvelope className="text-blue-600 mr-2" />
                  <span>Email: {policy.contactDetails.email}</span>
                </li>
                <li className="flex items-center mb-2">
                  <FaMapMarkerAlt className="text-blue-600 mr-2" />
                  <span>Address: {policy.contactDetails.address}</span>
                </li>
                <li className="flex items-center">
                  <FaGlobe className="text-blue-600 mr-2" />
                  <span>Website: {policy.contactDetails.website}</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center"
          >
            <FaShieldAlt className="mx-auto text-5xl mb-6 text-blue-300" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-blue-200">Last Updated: {policy.lastUpdated}</p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="prose prose-lg max-w-none"
          >
            <p className="text-gray-700 mb-8">
              {policy.introduction}
            </p>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaUserLock className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">1. Information We Collect</h2>
              </div>
              <p className="text-gray-700 mb-4">{policy.informationCollected.description}</p>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">A. Information You Provide</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>{policy.informationCollected.providedInfo}</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">B. Automatically Collected Information</h3>
              <p className="text-gray-700 mb-2">When you visit our site, we automatically collect technical and usage information, such as:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {policy.informationCollected.automaticInfo.split('\n').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">C. Facebook & Third-Party Data Collection</h3>
              <p className="text-gray-700">{policy.informationCollected.thirdPartyData}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaGlobe className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">2. How We Use Your Information</h2>
              </div>
              <p className="text-gray-700 mb-2">We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-700">
                {policy.informationUsage && policy.informationUsage.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaCookieBite className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">3. Cookies, Pixels & Tracking Technologies</h2>
              </div>
              <p className="text-gray-700 mb-4">{policy.cookiesAndTracking.description}</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {policy.cookiesAndTracking.purposes && policy.cookiesAndTracking.purposes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="text-gray-700">{policy.cookiesAndTracking.managingCookies}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaUserLock className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">4. Sharing & Disclosure of Information</h2>
              </div>
              <p className="text-gray-700 mb-4">{policy.dataSharing.description}</p>
              <ul className="list-disc pl-6 text-gray-700">
                {policy.dataSharing.sharingEntities && policy.dataSharing.sharingEntities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaShieldAlt className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">5. Data Security</h2>
              </div>
              <p className="text-gray-700 mb-4">{policy.dataSecurity.description}</p>
              <p className="text-gray-700">{policy.dataSecurity.disclaimer}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaUserLock className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">6. Your Rights & Choices</h2>
              </div>
              <p className="text-gray-700 mb-4">{policy.userRights.description}</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {policy.userRights.rights && policy.userRights.rights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="text-gray-700 mb-2">Advertising Opt-Outs:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {policy.userRights.adOptOuts && policy.userRights.adOptOuts.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="text-gray-700">{policy.userRights.contactInfo}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaGlobe className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">7. International Data Transfers</h2>
              </div>
              <p className="text-gray-700">{policy.internationalTransfers}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaChild className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">8. Children's Privacy</h2>
              </div>
              <p className="text-gray-700">{policy.childrenPrivacy}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaShieldAlt className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">9. Changes to This Privacy Policy</h2>
              </div>
              <p className="text-gray-700">{policy.policyChanges}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaEnvelope className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">10. Contact Us</h2>
              </div>
              <p className="text-gray-700 mb-4">If you have questions about this Privacy Policy or our data practices, please contact us:</p>
              <ul className="list-none pl-6 text-gray-700">
                <li className="flex items-center mb-2">
                  <FaEnvelope className="text-blue-600 mr-2" />
                  <span>Email: {policy.contactDetails.email}</span>
                </li>
                <li className="flex items-center mb-2">
                  <FaMapMarkerAlt className="text-blue-600 mr-2" />
                  <span>Address: {policy.contactDetails.address}</span>
                </li>
                <li className="flex items-center">
                  <FaGlobe className="text-blue-600 mr-2" />
                  <span>Website: {policy.contactDetails.website}</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;