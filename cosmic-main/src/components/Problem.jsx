const Problem = () => {
  const problems = [
    {
      icon: (
        <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Frequent Power Outages',
      description: 'Disrupt daily life and operations, causing inconvenience and financial losses.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Hidden Fees',
      description: 'Project delays and unexpected costs plague many solar providers.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Complex Financing',
      description: 'Confusing financing options make ROI hard to predict and understand.'
    }
  ];

  return (
    <section className="py-20 bg-yellow-green-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-yellow-green-900">
          Why Traditional Energy Isn't Enough
        </h2>
        <p className="text-xl text-yellow-green-600 text-center mb-16 max-w-3xl mx-auto">
          The current energy landscape presents significant challenges for both homeowners and businesses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-yellow-green-50 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-6">
                {problem.icon}
              </div>
              <h3 className="text-2xl font-semibold text-center mb-4 text-yellow-green-800">
                {problem.title}
              </h3>
              <p className="text-yellow-green-600 text-center">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;