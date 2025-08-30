import React from 'react';

const Solutions = () => {
  return (
    <div className="min-h-screen bg-yellow-green-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-yellow-green-900 sm:text-5xl md:text-6xl">
            Solar Solutions & EPC Services
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-yellow-green-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            End-to-end solar power solutions for residential, commercial, and industrial needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Residential Solutions */}
            <div className="bg-yellow-green-50 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-yellow-green-900">Residential Solutions</h3>
                <p className="mt-2 text-sm text-yellow-green-600">
                  Custom solar solutions for homes and apartments
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Rooftop installations
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Battery backup systems
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Smart home integration
                  </li>
                </ul>
              </div>
            </div>

            {/* Commercial Solutions */}
            <div className="bg-yellow-green-50 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-yellow-green-900">Commercial Solutions</h3>
                <p className="mt-2 text-sm text-yellow-green-600">
                  Power solutions for businesses and organizations
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Large-scale installations
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Energy management systems
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    ROI optimization
                  </li>
                </ul>
              </div>
            </div>

            {/* Industrial Solutions */}
            <div className="bg-yellow-green-50 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-yellow-green-900">Industrial Solutions</h3>
                <p className="mt-2 text-sm text-yellow-green-600">
                  Mega-scale solar installations for industries
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    MW-scale projects
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Custom power solutions
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    24/7 monitoring
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* EPC Services */}
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-yellow-green-900 text-center">Our EPC Services</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Engineering */}
            <div className="bg-yellow-green-50 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-yellow-green-900">Engineering</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Site assessment and analysis
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    System design and optimization
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Technical documentation
                  </li>
                </ul>
              </div>
            </div>

            {/* Procurement */}
            <div className="bg-yellow-green-50 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-yellow-green-900">Procurement</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Quality equipment sourcing
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Supply chain management
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Inventory management
                  </li>
                </ul>
              </div>
            </div>

            {/* Construction */}
            <div className="bg-yellow-green-50 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-yellow-green-900">Construction</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Professional installation
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Project management
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Quality assurance
                  </li>
                </ul>
              </div>
            </div>

            {/* Maintenance */}
            <div className="bg-yellow-green-50 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-yellow-green-900">Maintenance</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Regular inspections
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Performance monitoring
                  </li>
                  <li className="flex items-center text-sm text-yellow-green-600">
                    <svg className="h-5 w-5 text-yellow-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Emergency support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-green-600 hover:bg-yellow-green-700"
          >
            Schedule a Consultation
          </a>
        </div>
      </div>
    </div>
  );
};

export default Solutions;