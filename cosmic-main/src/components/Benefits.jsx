const Benefits = () => {
  const benefits = [
    {
      icon: (
        <svg className="w-16 h-16 text-yellow-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Maximum Savings',
      description: 'Typical payback in 3–5 years with significant long-term energy cost reduction.',
      stats: 'Up to 70% reduction in energy costs'
    },
    {
      icon: (
        <svg className="w-16 h-16 text-yellow-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Guaranteed Reliability',
      description: '25-year product warranty with continuous system monitoring for peace of mind.',
      stats: '24/7 system monitoring'
    },
    {
      icon: (
        <svg className="w-16 h-16 text-yellow-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Sustainable Impact',
      description: 'Make a significant contribution to environmental conservation.',
      stats: 'Up to 200 tons CO₂ offset annually'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-yellow-green-100 to-yellow-green-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-yellow-green-900">
          Why Choose Our Solar Solutions?
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          Experience the perfect blend of savings, reliability, and environmental impact.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-8 bg-yellow-green-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-green-800">
                {benefit.title}
              </h3>
              <p className="text-yellow-green-600 text-center mb-6">
                {benefit.description}
              </p>
              <div className="text-center">
                <span className="inline-block bg-yellow-green-100 text-yellow-green-800 text-lg font-semibold px-4 py-2 rounded-full">
                  {benefit.stats}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-8 bg-yellow-green-50 rounded-xl">
            <svg className="w-12 h-12 text-yellow-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div className="text-left">
              <h4 className="text-xl font-semibold mb-1">Ready to Start Saving?</h4>
              <p className="text-gray-600">Schedule a free consultation with our solar experts today.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;