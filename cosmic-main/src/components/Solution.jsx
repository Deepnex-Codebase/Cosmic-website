const Solution = () => {
  const solutions = [
    {
      icon: (
        <svg className="w-16 h-16 text-yellow-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: 'Full-Spectrum Installations',
      description: 'From single-home rooftop systems to multi-megawatt commercial arrays, we handle projects of any scale.',
      features: [
        'Residential rooftop systems',
        'Commercial installations',
        'Industrial solar arrays',
        'Custom system designs'
      ]
    },
    {
      icon: (
        <svg className="w-16 h-16 text-yellow-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Live Solar Calculator',
      description: 'Instantly size your system and forecast savings with our advanced calculation tools.',
      features: [
        'Real-time savings estimation',
        'System size optimization',
        'ROI forecasting',
        'Energy consumption analysis'
      ]
    },
    {
      icon: (
        <svg className="w-16 h-16 text-yellow-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: 'Turn-Key Project Delivery',
      description: 'End-to-end project management from initial survey to ongoing maintenance.',
      features: [
        'Site survey and design',
        'Financing options',
        'Professional installation',
        '24/7 system monitoring'
      ]
    }
  ];

  return (
    <section className="py-20 bg-yellow-green-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-yellow-green-900">
        Our Complete Solar Service
      </h2>
      <p className="text-xl text-yellow-green-600 text-center mb-16 max-w-3xl mx-auto">
        Experience seamless solar adoption with our comprehensive solution suite.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-yellow-green-100 rounded-xl p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-6">
                {solution.icon}
              </div>
              <h3 className="text-2xl font-semibold text-center mb-4 text-yellow-green-800">
                {solution.title}
              </h3>
              <p className="text-yellow-green-700 text-center mb-6">
                {solution.description}
              </p>
              <ul className="space-y-3">
                {solution.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-yellow-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-yellow-green-600 text-white rounded-full text-lg font-semibold hover:bg-yellow-green-700 transition-colors duration-300"
          >
            Start Your Solar Journey
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Solution;