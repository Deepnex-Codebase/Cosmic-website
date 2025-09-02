// src/pages/faq.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Helmet } from 'react-helmet';
import { useAppContext } from '../context/AppContext';

// Fallback FAQs if API fails
const fallbackFaqs = [
  {
    question: "What is solar energy?",
    answer: "Solar energy is radiant light and heat from the Sun that is harnessed using a range of technologies such as solar panels. It's a renewable energy source that can be used for electricity generation, water heating, and more."
  },
  {
    question: "How do solar panels work?",
    answer: "Solar panels work by allowing photons, or particles of light, to knock electrons free from atoms, generating a flow of electricity. They consist of many small photovoltaic cells linked together, which convert sunlight into electricity."
  },
  {
    question: "What are the benefits of solar energy?",
    answer: "Solar energy offers numerous benefits including reduced electricity bills, lower carbon footprint, energy independence, increased property value, and low maintenance costs. It's also a renewable resource that doesn't produce harmful emissions."
  },
  {
    question: 'How Long Does A Solar Panel Last?',
    answer:
      'Solar panels typically last 25-30 years with proper maintenance. Their efficiency may decrease slightly over time, but most manufacturers guarantee at least 80% efficiency after 25 years.',
  },
  {
    question: 'Can I Store Solar Power For Later Use?',
    answer:
      'Yes, you can store solar power using battery systems. Modern solar batteries allow you to store excess energy generated during the day for use at night or during power outages.',
  },
  {
    question: "How much does a solar system cost?",
    answer: "The cost of a solar system depends on various factors including system size, quality of components, installation complexity, and location. Residential systems typically start at ₹80,000 per kW, while commercial systems may start at ₹60,000 per kW. Government subsidies can significantly reduce these costs."
  },
  {
    question: 'Are There Any Government Incentives Available For Solar Installation?',
    answer:
      'Yes, there are various government incentives available including tax credits, rebates, and solar renewable energy certificates (SRECs). Our team stays updated on all available incentives and will help you maximize your savings through these programs.',
  }
];

const FAQ = () => {
  const { faqs: apiFaqs, loading, errors } = useAppContext();
  const [expanded, setExpanded] = useState(null);
  const [useBackup, setUseBackup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  
  // Set a timeout to use fallback data if loading takes too long
  useEffect(() => {
    let timeoutId;
    if (loading.faqs) {
      timeoutId = setTimeout(() => {
        setUseBackup(true);
      }, 5000); // 5 seconds timeout
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading.faqs]);
  
  // Use API data or fallback to static data
  const allFaqs = useBackup || !loading.faqs ? 
    (apiFaqs && apiFaqs.length > 0 && apiFaqs[0]?.question && apiFaqs[0]?.answer
      ? apiFaqs.map(faq => {
          return {
            question: faq.title || faq.question,
            answer: faq.content || faq.answer
          };
        })
      : fallbackFaqs) 
    : fallbackFaqs;
    
  // Calculate pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = allFaqs.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(allFaqs.length / questionsPerPage);
  
  // Change page
  const paginate = (pageNumber) => {
    setExpanded(null); // Reset expanded state when changing page
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };
  
  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const toggleFaq = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Frequently Asked Questions | Cosmic Energy Solutions</title>
        <meta name="description" content="Find answers to common questions about solar energy, installation, maintenance, and our services at Cosmic Energy Solutions." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-primary-800 py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/solar-panels.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
          >
            <span className="inline-block bg-white bg-opacity-90 text-primary-800 text-sm font-medium px-4 py-1 rounded-full mb-4">Solar Solutions</span>
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Frequently Asked Questions
            </h1>
            <div className="w-24 h-1 bg-accent-500 mx-auto mb-6"></div>
            <p 
              className="text-lg text-white text-opacity-90 max-w-2xl mx-auto"
            >
              Find answers to common questions about our solar solutions and services.
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100">
          {loading.faqs && !useBackup ? (
            <div className="flex flex-col justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-gray-600">Loading FAQs...</p>
            </div>
          ) : (
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              key={currentPage} // This key ensures animation reruns when page changes
            >
              {currentQuestions.map((faq, index) => (
                <motion.div 
                  key={index}
                  className={`border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${expanded === index ? 'bg-primary-50 border-primary-200' : 'bg-white'}`}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUpVariant}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    className="flex justify-between items-center w-full p-5 text-left"
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="flex items-start">
                      <span className="flex items-center justify-center bg-primary-600 text-white rounded-full w-8 h-8 mr-4 flex-shrink-0 font-semibold">{indexOfFirstQuestion + index + 1}</span>
                      <h3 className="text-lg md:text-xl font-semibold text-primary-800">{faq.question}</h3>
                    </div>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-primary-600 transition-transform ${expanded === index ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-5 pt-0 text-gray-700 border-t border-gray-100">
                      <div className="pl-12">  {/* Align with question text */}
                        <p className="leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <motion.div 
                  className="flex flex-wrap justify-center items-center mt-10 space-x-2 space-y-2 sm:space-y-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button 
                    onClick={goToPreviousPage} 
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md flex items-center ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-300'}`}
                    whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                    whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </motion.button>
                  
                  <div className="flex space-x-1">
                    {/* Show limited page numbers with ellipsis for better UX */}
                    {Array.from({ length: totalPages }, (_, i) => {
                      // Always show first page, last page, current page and pages around current page
                      const pageNum = i + 1;
                      const showPageNumber = pageNum === 1 || 
                                           pageNum === totalPages || 
                                           (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                      
                      // Show ellipsis instead of all page numbers
                      if (!showPageNumber) {
                        if (pageNum === 2 || pageNum === totalPages - 1) {
                          return (
                            <span key={i} className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
                          );
                        }
                        return null;
                      }
                      
                      return (
                        <motion.button
                          key={i}
                          onClick={() => paginate(pageNum)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${currentPage === pageNum ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          initial={pageNum === currentPage ? { scale: 0.9 } : { scale: 1 }}
                          animate={pageNum === currentPage ? { scale: 1 } : { scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    }).filter(Boolean)}
                  </div>
                  
                  <motion.button 
                    onClick={goToNextPage} 
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md flex items-center ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-300'}`}
                    whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                    whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Contact Section */}
        <motion.div 
          className="text-center py-12 mt-8 bg-primary-50 rounded-xl border border-primary-100 shadow-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Our team is here to help you with any questions you may have about our solar solutions.</p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;