// src/pages/About.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AwardsTimeline from "../components/AwardsTimeline";
import ServicesSection from "../components/ServicesSection";
import SolarDesignSection from "../components/SolarDesignSection";
import TeamSection from "../components/TeamSection";
import Testimonials from "../components/Testimonials";
import { FaCheck } from "react-icons/fa";
import { Helmet } from "react-helmet";
import { getAboutPage } from "../services/aboutService";
import { toast } from "react-toastify";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await getAboutPage();
        setAboutData(data);
      } catch (error) {
        console.error('Error fetching about page data:', error);
        toast.error('Failed to load about page content');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Space_Grotesk']">
      {/* HERO SECTION */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="relative h-100 sm:h-80 md:h-[500px] flex items-center justify-center overflow-hidden"
      >
        <video 
          className="absolute inset-0 w-full h-full object-cover" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src={aboutData?.hero?.videoUrl || "/aboutvideo.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{aboutData?.hero?.title || "About"}</h1>
          <p className="text-lg mb-4">{aboutData?.hero?.subtitle || ""}</p>
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-accent-500 transition">
              Home
            </Link>
            <span>—</span>
            <span className="text-accent-500">About</span>
          </nav>
        </div>
      </motion.header>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="bg-white py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4">
              {aboutData?.aboutUs?.title || "About Us :"}
            </h2>
            {aboutData?.aboutUs?.content ? (
              aboutData.aboutUs.content.map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))
            ) : (
              <>
                <p>
                  Cosmic Powertech is a Surat-based solar energy company founded in
                  2018 by brothers Chaitanya Shah and Charchil Shah. Established
                  with the vision of making clean energy accessible and affordable
                  across India, the company has rapidly emerged as a trusted
                  provider of end-to-end renewable energy solutions for both
                  residential and commercial sectors.
                </p>
                <p>
                  Specializing in a diverse portfolio that includes rooftop solar
                  installations, ongrid and off-grid power plants, solar water
                  heaters, and custom solutions for industries such as textiles,
                  hospitality, pharmaceuticals, petroleum, FMCG, PACKAGING. Cosmic
                  Powertech offers comprehensive services from initial consultation
                  to installation and long-term maintenance. Their in-house team of
                  skilled engineers and sales professionals ensure high- quality
                  execution and unmatched responsiveness, positioning the company to
                  meet the evolving demands of India's growing solar market.{" "}
                </p>
                <div className="h-1 w-24 bg-accent-500 mx-auto rounded-full mt-4"></div>
              </>
            )}
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4">
              {aboutData?.whoWeAre?.title || "Who we are ?"}
            </h2>
            <p>
              {aboutData?.whoWeAre?.content || "Cosmic Powertech is a Surat-based solar energy company transforming the way India powers its future. Founded by Chaitanya and Charchil Shah, we specialize in end-to-end renewable energy solutions—rooftop systems, solar water heaters, and on/off-grid power plants—designed for homes, industries, and commercial spaces. With a focus on quality, affordability, and long-term service, we make clean energy reliable and accessible across India."}
            </p>
            <div className="h-1 w-24 bg-accent-500 mx-auto rounded-full mt-4"></div>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4">
              {aboutData?.expertise?.title || "Our Expertise"}
            </h2>
            <p>
              {aboutData?.expertise?.description || "We are hands down our expertise in product distributorship."}
            </p>
            <div className="h-1 w-24 bg-accent-500 mx-auto rounded-full mt-4"></div>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {aboutData?.expertise?.items && aboutData.expertise.items.length > 0 ? (
                aboutData.expertise.items.map((item, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-52">
                    <div className="relative h-full w-full overflow-hidden group">
                      <img
                        src={item.image || "/back_Image.avif"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h4 className="text-white font-bold text-lg">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {/* Default cards when no items are available */}
                  {/* Card 1 - Textiles */}
                  <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-52">
                    <div className="relative h-full w-full overflow-hidden group">
                      <img
                        src="/back_Image.avif"
                        alt="Textiles Industry"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h4 className="text-white font-bold text-lg">
                          Textiles  
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - Paper Packaging */}
                  <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group h-52">
                    <div className="relative h-full w-full overflow-hidden">
                      <img
                        src="/back_Image.avif"
                        alt="Paper Packaging Industry"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h4 className="text-white font-bold text-sm">
                          Paper Packaging
                        </h4>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Cosmic? Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-700">
              {aboutData?.whyChooseUs?.title || 'Why Choose '}<span className="text-accent-500">Cosmic</span>?
            </h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              {aboutData?.whyChooseUs?.description || 'We offer unparalleled service and expertise across multiple industries.'}
            </p>
            <div className="h-1 w-24 bg-accent-500 mx-auto rounded-full mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-center">
            {aboutData?.whyChooseUs?.items && aboutData.whyChooseUs.items.length > 0 ? (
              // Render dynamic items from API
              aboutData.whyChooseUs.items.map((item, index) => (
                <div key={index} className="flex flex-col items-center p-4">
                  <div className="bg-white p-4 rounded-full shadow-md mb-4 w-20 h-20 flex items-center justify-center text-accent-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-primary-700 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))
            ) : (
              // Fallback to hardcoded items if no data available
              <>
                {/* Nationwide Reach */}
                <div className="flex flex-col items-center p-4">
                  <div className="bg-white p-4 rounded-full shadow-md mb-4 w-20 h-20 flex items-center justify-center text-accent-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-primary-700 mb-2">Nationwide Reach</h3>
                  <p className="text-gray-600 text-sm">A vast network across 100+ cities.</p>
                </div>
                
                {/* Diverse Portfolio */}
                <div className="flex flex-col items-center p-4">
                  <div className="bg-white p-4 rounded-full shadow-md mb-4 w-20 h-20 flex items-center justify-center text-accent-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-primary-700 mb-2">Diverse Portfolio</h3>
                  <p className="text-gray-600 text-sm">Products spanning 40+ categories.</p>
                </div>
                
                {/* Expert Team */}
                <div className="flex flex-col items-center p-4">
                  <div className="bg-white p-4 rounded-full shadow-md mb-4 w-20 h-20 flex items-center justify-center text-accent-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-primary-700 mb-2">Expert Team</h3>
                  <p className="text-gray-600 text-sm">A workforce of 1,000+ professionals dedicated to your success.</p>
                </div>
              </>
            )}
            
            {/* Customer Focus */}
            <div className="flex flex-col items-center p-4">
              <div className="bg-white p-4 rounded-full shadow-md mb-4 w-20 h-20 flex items-center justify-center text-accent-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary-700 mb-2">Customer Focus</h3>
              <p className="text-gray-600 text-sm">Tailored solutions for every industry segment.</p>
            </div>
            
            {/* Quality Assurance */}
            <div className="flex flex-col items-center p-4">
              <div className="bg-white p-4 rounded-full shadow-md mb-4 w-20 h-20 flex items-center justify-center text-accent-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary-700 mb-2">Quality Assurance</h3>
              <p className="text-gray-600 text-sm">We never compromise on the quality of products and services we offer.</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <SolarDesignSection />
      </motion.div>

      

      {/* vision mission section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="bg-white py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4">
              {aboutData?.visionMissionValues?.title || 'Our Core Principles'}
            </h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              {aboutData?.visionMissionValues?.description || 'The foundation of our approach to sustainable energy solutions.'}
            </p>
            <div className="h-1 w-24 bg-accent-500 mx-auto rounded-full mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Vision */}
            <motion.div variants={fadeUpVariant} className="text-left bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{aboutData?.visionMissionValues?.vision?.title || 'Vision'}</h3>
              
                {aboutData?.visionMissionValues?.vision?.content ? (
                  // Map through paragraphs if available
                  aboutData.visionMissionValues.vision.content.map((paragraph, index) => (
                    <p key={index} className="text-gray-600 text-sm mb-4">{paragraph}</p>
                  ))
                ) : (
                  // Fallback to hardcoded content
                  <>
                    <p className="text-gray-600 text-sm mb-4">
                      Cosmic Powertech envisions a world where sustainable living is second nature, driven by the widespread adoption of clean, abundant renewable energy. We dedicate ourselves to crafting tailored solar solutions that precisely address the distinctive requirements of every household, business, and industry we serve, while simultaneously advancing a healthier planet.
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      Our pledge reaches far beyond routine operations; it infuses each consultation, installation, and maintenance visit with purpose, ensuring measurable, long-term impact. Guided by an unwavering belief in a future powered exclusively by renewable resources, we continually innovate, educate, and collaborate to accelerate India's transition toward carbon-free prosperity and global clean-energy leadership.
                    </p>
                  </>
                )}
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div variants={fadeUpVariant} className="text-left bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{aboutData?.visionMissionValues?.mission?.title || 'Mission'}</h3>
                
                {aboutData?.visionMissionValues?.mission?.content ? (
                  // Map through paragraphs if available
                  aboutData.visionMissionValues.mission.content.map((paragraph, index) => (
                    <p key={index} className="text-gray-600 text-sm mb-4">{paragraph}</p>
                  ))
                ) : (
                  // Fallback to hardcoded content
                  <>
                    <p className="text-gray-600 text-sm mb-4">
                      The dedication to achieve our vision is a reflected in our mission
                      to make solar power accessible and affordable, thereby enabling
                      individuals and businesses to participate actively in the global shift
                      towards sustainability. 
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      By integrating advanced technology with personalized service, we aim to
                      empower communities to harness solar energy effectively, reducing reliance on
                      fossil fuels and promoting environmental stewardship. Our efforts are aligned
                      with broader initiatives to mitigate climate change and support India's green
                      energy goals, including the ambitious target of achieving 500 GW of renewable
                      energy capacity by 2030.
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      Through our unwavering focus on quality, innovation, and customer
                      satisfaction, Cosmic Powertech aspires to be a leading force in the renewable
                      energy, driving positive change and contributing to a sustainable future for all. 
                    </p>
                  </>
                )}
              </div>
            </motion.div>

            {/* Values */}
            <motion.div variants={fadeUpVariant} className="text-left bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{aboutData?.visionMissionValues?.values?.title || 'Values'}</h3>
                
                {aboutData?.visionMissionValues?.values?.content ? (
                  // Map through paragraphs if available
                  aboutData.visionMissionValues.values.content.map((paragraph, index) => (
                    <p key={index} className="text-gray-600 text-sm mb-4">{paragraph}</p>
                  ))
                ) : (
                  // Fallback to hardcoded content
                  <>
                    <p className="text-gray-600 text-sm mb-4">
                      At Cosmic Powertech, our values are rooted in sustainability, innovation, and people-first service. We are committed to making solar energy accessible and affordable, empowering individuals and businesses to join India's green revolution. By integrating advanced technology with customized solutions, we help reduce dependence on fossil fuels and contribute to the nation's goal of 500 GW renewable energy by 2030.
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      Every project reflects our dedication to climate action, engineering excellence, and long-term reliability. With a team driven by integrity and purpose, we deliver clean energy solutions that not only power homes and industries but also inspire a sustainable, greener future.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-26 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="container mx-auto w-1000">
          <Testimonials testimonialsData={aboutData?.clientTestimonials} />
        </div>
      </motion.section>


    </div>
  );
};

export default About;
