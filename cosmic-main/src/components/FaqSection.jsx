// src/components/FaqSection.jsx
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useAppContext } from '../context/AppContext'

// Fallback FAQs if API fails
const fallbackFaqs = [
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
    question: "What Happens If There's A Problem?",
    answer:
      'Our dedicated support team is available 24/7 to address any issues. We provide comprehensive warranty coverage and maintenance services to ensure your system runs smoothly.',
  },
  {
    question: 'How Do I Monitor My Solar Energy System?',
    answer:
      'We provide a user-friendly monitoring app that shows real-time energy production, consumption, and savings. You can track performance, get maintenance alerts, and view historical data.',
  },
  {
    question: 'What Makes Cosmic Energy Solutions Different From Other Solar Providers?',
    answer:
      'Cosmic Energy Solutions stands out with our cutting-edge technology, comprehensive end-to-end service, and commitment to sustainability. We offer customized solutions tailored to your specific energy needs and provide industry-leading warranties and after-sales support.',
  },
  {
    question: 'Are There Any Government Incentives Available For Solar Installation?',
    answer:
      'Yes, there are various government incentives available including tax credits, rebates, and solar renewable energy certificates (SRECs). Our team stays updated on all available incentives and will help you maximize your savings through these programs.',
  },
  {
    question: 'How Much Maintenance Do Solar Panels Require?',
    answer:
      'Solar panels require minimal maintenance. Occasional cleaning to remove dust and debris is typically sufficient. We recommend a professional inspection once a year to ensure optimal performance. Our maintenance packages include regular check-ups and cleaning services.',
  },
  {
    question: 'What Happens To Solar Panels During Extreme Weather?',
    answer:
      'Our solar panels are designed to withstand extreme weather conditions including heavy rain, snow, and high winds. They undergo rigorous testing to ensure durability and performance in various environmental conditions. In case of severe weather events, our systems include protective measures to prevent damage.',
  },
]

export default function FaqSection() {
  const { faqs: apiFaqs, loading } = useAppContext();
  const [expanded, setExpanded] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [leftImageTranslate, setLeftImageTranslate] = useState(0)
  const [rightImageTranslate, setRightImageTranslate] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [faqsPerPage] = useState(4)
  const lastScrollY = useRef(0)
  const requestRef = useRef()
  const spinnerRef = useRef(null)
  const leftImageRef = useRef(null)
  const rightImageRef = useRef(null)
  
  // Use API data or fallback to static data
  console.log('FaqSection: apiFaqs from context:', apiFaqs);
  const allFaqs = apiFaqs && apiFaqs.length > 0 
    ? apiFaqs.map(faq => {
        console.log('Processing FAQ item:', faq);
        return {
          question: faq.title || faq.question,
          answer: faq.content || faq.answer
        };
      })
    : fallbackFaqs
  
  console.log('FaqSection: Using FAQs:', allFaqs.length > 0 ? 'API data' : 'fallback data');
  console.log('FaqSection: allFaqs:', allFaqs);
    
  // Get current FAQs for pagination
  const indexOfLastFaq = currentPage * faqsPerPage
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage
  const currentFaqs = allFaqs.slice(indexOfFirstFaq, indexOfLastFaq)
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < Math.ceil(allFaqs.length / faqsPerPage)) {
      setCurrentPage(currentPage + 1)
      setExpanded(null) // Reset expanded state when changing page
    }
  }
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setExpanded(null) // Reset expanded state when changing page
    }
  }

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  }

  const animate = () => {
    const currentScrollY = window.scrollY
    const scrollDiff = currentScrollY - lastScrollY.current
    
    // Rotate the circle
    const rotationSpeed = 0.3
    setRotation(prev => prev + scrollDiff * rotationSpeed)
    
    // Pulse the circle
    const maxScale = 1.05
    const pulseSpeed = 0.001
    const newScale = 1 + (Math.sin(currentScrollY * pulseSpeed) + 1) * (maxScale - 1) / 2
    setScale(newScale)
    
    // Move the images based on scroll
    const imageScrollSpeed = 0.1
    // Left image moves down on scroll
    setLeftImageTranslate(prev => {
      const newValue = prev + scrollDiff * imageScrollSpeed
      // Limit the movement range
      return Math.max(-30, Math.min(30, newValue))
    })
    
    // Right image moves up on scroll
    setRightImageTranslate(prev => {
      const newValue = prev - scrollDiff * imageScrollSpeed
      // Limit the movement range
      return Math.max(-30, Math.min(30, newValue))
    })
    
    lastScrollY.current = currentScrollY
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  return (
    <section className="bg-white py-20 px-4 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* FAQ Column */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-black mb-4 font-space-grotesk">Inquiries We Receive</h2>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[2px] w-10 bg-green-600" />
            <p className="text-sm text-gray-600 uppercase font-space-grotesk">FAQ</p>
            <div className="h-[2px] w-10 bg-green-600" />
          </div>
          <div className="space-y-4">
            {currentFaqs.map((faq, index) => (
              <div
                key={index}
                onClick={() => setExpanded(index === expanded ? null : index)}
                className="border border-gray-200 rounded-xl p-5 cursor-pointer bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-black text-base font-space-grotesk">
                    {faq.question}
                  </h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      expanded === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {expanded === index && (
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
            
            {/* Pagination Controls */}
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg flex items-center ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(allFaqs.length / faqsPerPage) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentPage === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === Math.ceil(allFaqs.length / faqsPerPage)}
                className={`px-4 py-2 rounded-lg flex items-center ${currentPage === Math.ceil(allFaqs.length / faqsPerPage) ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-700'}`}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Image Column with Rotating Circle */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative w-full"
        >
          <div className="grid grid-cols-2 gap-4 w-full relative">
            <div 
              className="left-image-container overflow-hidden rounded-xl h-[350px]"
              ref={leftImageRef}
              style={{ transform: `translateY(${leftImageTranslate}px)` }}
            >
              <img
                src="https://zolar.wpengine.com/wp-content/uploads/2025/02/home-4-img-1.jpg"
                alt="Solar Worker"
                className="rounded-xl w-full h-full object-cover left-scroll-image"
              />
            </div>
            <div 
              className="right-image-container overflow-hidden rounded-xl h-[350px]"
              ref={rightImageRef}
              style={{ transform: `translateY(${rightImageTranslate}px)` }}
            >
              <img
                src="https://zolar.wpengine.com/wp-content/uploads/2025/02/home-4-img-2.jpg"
                alt="Engineer"
                className="rounded-xl w-full h-full object-cover right-scroll-image"
              />
            </div>

            {/* Scroll-based rotating circle */}
            <motion.div
              ref={spinnerRef}
              animate={{ rotate: rotation, scale: scale }}
              transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
              className="w-[160px] h-[160px] bg-[#C5E1A5] rounded-full flex items-center z-10 shadow-lg border-4 border-white"
              style={{position:'absolute', transform:'translateX(-50%) translateY(-50%)', top:'50%', left:'38%'}} 
            >
              <motion.img
                src="https://zolar.wpengine.com/wp-content/uploads/2025/01/Home2-Rotate-img-new.png"
                alt="Rotating Badge"
                className="w-[100%] h-[100%] object-contain p-1"
                animate={{ rotate: -rotation * 2 }}
                transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
