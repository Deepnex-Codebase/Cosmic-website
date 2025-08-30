import React, { useState } from 'react';

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'sales', name: 'Sales & Marketing' },
    { id: 'operations', name: 'Operations' },
    { id: 'support', name: 'Customer Support' }
  ];

  const jobs = [
    {
      title: 'Solar Design Engineer',
      department: 'engineering',
      location: 'Mumbai',
      type: 'Full-time',
      experience: '3-5 years',
      description: 'Design and optimize solar PV systems for residential and commercial projects.',
      requirements: [
        'B.Tech in Electrical/Mechanical Engineering',
        'Experience with solar design software',
        'Knowledge of Indian solar regulations',
        'Strong analytical skills'
      ]
    },
    {
      title: 'Sales Manager',
      department: 'sales',
      location: 'Delhi',
      type: 'Full-time',
      experience: '5-7 years',
      description: 'Lead sales team and develop strategies to increase market penetration.',
      requirements: [
        'MBA in Sales/Marketing',
        'Proven track record in B2B sales',
        'Experience in renewable energy sector',
        'Team management skills'
      ]
    },
    {
      title: 'Project Manager',
      department: 'operations',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '4-6 years',
      description: 'Manage solar installation projects from inception to completion.',
      requirements: [
        'PMP Certification preferred',
        'Experience in solar project management',
        'Strong coordination skills',
        'Knowledge of project management tools'
      ]
    },
    {
      title: 'Technical Support Specialist',
      department: 'support',
      location: 'Hybrid',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Provide technical support for solar monitoring systems and equipment.',
      requirements: [
        'Technical degree in relevant field',
        'Experience in customer support',
        'Knowledge of solar technology',
        'Good communication skills'
      ]
    }
  ];

  const filteredJobs = selectedDepartment === 'all'
    ? jobs
    : jobs.filter(job => job.department === selectedDepartment);

  const benefits = [
    {
      title: 'Health & Wellness',
      items: [
        'Comprehensive health insurance',
        'Life insurance coverage',
        'Annual health checkups',
        'Mental wellness programs'
      ]
    },
    {
      title: 'Learning & Growth',
      items: [
        'Professional development budget',
        'Training programs',
        'Conference attendance',
        'Certification support'
      ]
    },
    {
      title: 'Work-Life Balance',
      items: [
        'Flexible working hours',
        'Work from home options',
        'Paid time off',
        'Parental leave'
      ]
    },
    {
      title: 'Additional Perks',
      items: [
        'Performance bonuses',
        'Stock options',
        'Team events',
        'Festival celebrations'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Join Our Team
          </h1>
          <p className="mt-3 max-w-md mx-auto text-xl text-blue-100 sm:text-2xl md:mt-5 md:max-w-3xl">
            Build a sustainable future with SS Tech
          </p>
        </div>
      </div>

      {/* Culture Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Our Culture
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              We're building a team of passionate individuals committed to making clean energy accessible to all
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">We encourage creative thinking and new ideas to solve energy challenges.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collaboration</h3>
              <p className="text-gray-600">We work together across teams to achieve our common goals.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Impact</h3>
              <p className="text-gray-600">Every team member contributes to our mission of sustainable energy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Benefits & Perks
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <ul className="space-y-2">
                  {benefit.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Open Positions
          </h2>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium
                  ${selectedDepartment === dept.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                {dept.name}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          <div className="space-y-6">
            {filteredJobs.map((job, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow">
                <div className="flex flex-wrap items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <div className="mt-2 space-x-4">
                      <span className="text-gray-600">{job.location}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-600">{job.type}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-600">{job.experience}</span>
                    </div>
                  </div>
                  <button className="mt-4 sm:mt-0 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </div>
                <p className="mt-4 text-gray-600">{job.description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900">Requirements:</h4>
                  <ul className="mt-2 space-y-2">
                    {job.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start text-gray-600">
                        <span className="text-blue-500 mr-2">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't see the right position?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Send us your resume and we'll keep you in mind for future opportunities
          </p>
          <a
            href="mailto:careers@sstech.com"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
          >
            Send Your Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default Careers;