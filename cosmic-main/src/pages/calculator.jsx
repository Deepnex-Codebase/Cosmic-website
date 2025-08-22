// Required installation:
// npm install recharts

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Calculator = () => {
  const [formData, setFormData] = useState({
    state: '',
    category: 'residential',
    electricityBill: '',
    roofArea: '',
    sunlightHours: 5,
    shadingLevel: 'none',
    panelsType: 'standard', // Added panels type field with default value
  });

  const [showResult, setShowResult] = useState(false);
  const [step, setStep] = useState(1);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Fixed years value instead of user input
  const years = 10;

  // Animation effect for results
  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setAnimationComplete(false);
    }
  }, [showResult]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCalculate = () => {
    setShowResult(true);
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const monthlyBill = parseFloat(formData.electricityBill) || 0;
  const roofArea = parseFloat(formData.roofArea) || 0;
  const sunlightHours = parseFloat(formData.sunlightHours) || 5;

  const costPerWatt = 70;
  const shadingEfficiency = {
    'none': 1,
    'partial': 0.8,
    'significant': 0.6,
  }[formData.shadingLevel];

  // Simplified calculation for system size based on monthly bill
  // Calculate a range by dividing the bill by 1100 and 1000
  const systemSizeKw_lower = monthlyBill / 1100;
  const systemSizeKw_upper = monthlyBill / 1000;

  // Round to 1 decimal place for cleaner display
  const roundedSystemSizeKw_lower = Math.round(systemSizeKw_lower * 10) / 10;
  const roundedSystemSizeKw_upper = Math.round(systemSizeKw_upper * 10) / 10;

  // Use the average of the range for subsequent calculations
  const averageSystemSizeKw = (roundedSystemSizeKw_lower + roundedSystemSizeKw_upper) / 2;

  // For backward compatibility, still calculate monthlyKwh
  const monthlyKwh = monthlyBill / 8.7;
  const panels = Math.floor((averageSystemSizeKw * 1000) / 350);
  const areaNeeded = averageSystemSizeKw * 10;
  
  // Calculate investment range based on system size range
  const investment_lower = systemSizeKw_lower * 55000;
  const investment_upper = systemSizeKw_upper * 55000;
  // Use average investment for calculations that need a single value
  const investment = (investment_lower + investment_upper) / 2;
  
  const annualReturn = monthlyBill * 12 * 0.9;
  const totalReturns = annualReturn * years;
  const totalValue = investment + totalReturns;
  const paybackPeriod = investment / annualReturn;
  const feasible = roofArea >= areaNeeded;

  // Calculate CO2 savings
  const annualKwh = monthlyKwh * 12;
  const co2PerKwh = 0.82; // kg of CO2 per kWh for coal-based electricity
  const annualCo2Savings = annualKwh * co2PerKwh;
  const totalCo2Savings = annualCo2Savings * years;
  
  // Calculate tree equivalent
  const co2PerTree = 22; // kg of CO2 absorbed by one tree per year
  const treesEquivalentPerYear = Math.round(annualCo2Savings / co2PerTree);
  const totalTreesEquivalent = treesEquivalentPerYear * years;

  // Define the environmentalImpactData and COLORS arrays after all calculations
  const environmentalImpactData = [
    { name: 'CO₂ Saved', value: Math.round(totalCo2Savings) },
    { name: 'Trees Equivalent', value: totalTreesEquivalent * co2PerTree }
  ];

  const COLORS = ['var(--color-accent-500)', 'var(--color-accent-700)', 'var(--color-accent-950)', 'var(--color-accent-400)'];

  const breakdown = Array.from({ length: years }, (_, i) => {
    const yr = i + 1;
    // Use average investment for year-by-year breakdown
    const invest = (investment / years) * yr;
    const ret = annualReturn * yr;
    const co2Saved = annualCo2Savings * yr;
    const treesEquiv = treesEquivalentPerYear * yr;
    return {
      year: `Year ${yr}`,
      yearNum: yr,
      invest: Math.round(invest),
      returns: Math.round(ret),
      total: Math.round(invest + ret),
      co2Saved: Math.round(co2Saved),
      treesEquiv: Math.round(treesEquiv)
    };
  });

  // List of Indian states
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", 
    "Chandigarh"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white p-4 md:p-8 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-accent-950 font-space-grotesk">Solar Calculator</h1>
      <p className="text-center text-md text-gray-600 mb-6 md:mb-10">
        Calculate your solar panel requirements, potential savings, and return on investment
      </p>

      {!showResult ? (
        <div className="max-w-3xl mx-auto bg-white border border-accent-500/30 rounded-xl p-4 md:p-8 shadow-lg">
          {step === 1 ? (
            <>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-accent-950 border-b border-accent-500/30 pb-2 font-space-grotesk">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Your State</label>
                  <select 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base"
                    required
                  >
                    <option value="">Select Your State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Your Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Your Average Monthly Bill (₹)</label>
                  <input 
                    type="number" 
                    name="electricityBill" 
                    value={formData.electricityBill} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Panels Type</label>
                  <select 
                    name="panelsType" 
                    value={formData.panelsType} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base"
                  >
                    <option value="standard">Standard Panels</option>
                    <option value="premium">Premium Panels</option>
                    <option value="highEfficiency">High Efficiency Panels</option>
                    <option value="bifacial">Bifacial Panels</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleNextStep} 
                className="w-full bg-accent-500 hover:bg-accent-400 text-accent-950 font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg mt-6 md:mt-8 transition-all transform hover:scale-[1.02] flex items-center justify-center text-sm md:text-base"
                disabled={!formData.state || !formData.electricityBill}
              >
                Next Step <span className="ml-2">→</span>
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-accent-950 border-b border-accent-500/30 pb-2 font-space-grotesk">Additional Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Available Roof Area (sq.ft)</label>
                  <input 
                    type="number" 
                    name="roofArea" 
                    value={formData.roofArea} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base" 
                  />
                </div>
                <div>
                  <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Average Sunlight Hours</label>
                  <input 
                    type="number" 
                    name="sunlightHours" 
                    value={formData.sunlightHours} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base" 
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Shading Level</label>
                  <select 
                    name="shadingLevel" 
                    value={formData.shadingLevel} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base"
                  >
                    <option value="none">No Shading</option>
                    <option value="partial">Partial Shading</option>
                    <option value="significant">Significant Shading</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mt-6 md:mt-8">
                <button 
                  onClick={() => setStep(1)} 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all flex items-center justify-center text-sm md:text-base"
                >
                  <span className="mr-2">←</span> Back
                </button>
                <button 
                  onClick={handleCalculate} 
                  className="bg-accent-500 hover:bg-accent-400 text-accent-950 font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center text-sm md:text-base"
                >
                  Calculate Savings <span className="ml-2">📊</span>
                </button>
              </div>
            </>
          )}
          
          {/* Additional content below the form */}
          <div className="mt-8 md:mt-10 pt-4 md:pt-6 border-t border-accent-500/30">
            <h3 className="text-lg md:text-xl font-semibold text-accent-950 mb-3 md:mb-4">Why Calculate Your Solar Potential?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-accent-50 p-3 md:p-5 rounded-xl border border-accent-500/30">
                <div className="flex items-center mb-2 md:mb-3">
                  <div className="bg-accent-500 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-accent-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base md:text-lg font-medium text-accent-950">Financial Benefits</h4>
                </div>
                <p className="text-xs md:text-sm text-gray-700">Understand your potential savings and return on investment when switching to solar energy. Calculate payback period and long-term financial benefits.</p>
              </div>
              
              <div className="bg-accent-50 p-3 md:p-5 rounded-xl border border-accent-500/30">
                <div className="flex items-center mb-2 md:mb-3">
                  <div className="bg-accent-500 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-accent-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base md:text-lg font-medium text-accent-950">Environmental Impact</h4>
                </div>
                <p className="text-xs md:text-sm text-gray-700">See how your switch to solar energy can reduce carbon emissions and contribute to a greener planet. Visualize your impact in terms of CO₂ reduction and equivalent trees planted.</p>
              </div>
              
              <div className="bg-accent-50 p-3 md:p-5 rounded-xl border border-accent-500/30">
                <div className="flex items-center mb-2 md:mb-3">
                  <div className="bg-accent-500 p-1.5 md:p-2 rounded-full mr-2 md:mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-accent-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-base md:text-lg font-medium text-accent-950">System Requirements</h4>
                </div>
                <p className="text-xs md:text-sm text-gray-700">Get accurate estimates of the solar system size you need based on your energy consumption, location, and roof specifications. Plan your installation with confidence.</p>
              </div>
            </div>
            
            <div className="bg-white p-3 md:p-6 rounded-xl border border-accent-500/30 mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-accent-950 mb-3 md:mb-4">How Our Calculator Works</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 h-6 w-6 md:h-8 md:w-8 bg-accent-500 rounded-full flex items-center justify-center text-accent-950 font-bold mr-3 md:mr-4 text-xs md:text-base">1</div>
                  <div>
                    <h4 className="text-base md:text-lg font-medium text-accent-950 mb-0.5 md:mb-1">Input Your Details</h4>
                    <p className="text-xs md:text-sm text-gray-700">Enter your location, electricity consumption, and property details to get started.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-6 w-6 md:h-8 md:w-8 bg-accent-500 rounded-full flex items-center justify-center text-accent-950 font-bold mr-3 md:mr-4 text-xs md:text-base">2</div>
                  <div>
                    <h4 className="text-base md:text-lg font-medium text-accent-950 mb-0.5 md:mb-1">Advanced Calculations</h4>
                    <p className="text-xs md:text-sm text-gray-700">Our algorithm considers sunlight hours, shading, roof area, and local electricity rates to provide accurate estimates.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-6 w-6 md:h-8 md:w-8 bg-accent-500 rounded-full flex items-center justify-center text-accent-950 font-bold mr-3 md:mr-4 text-xs md:text-base">3</div>
                  <div>
                    <h4 className="text-base md:text-lg font-medium text-accent-950 mb-0.5 md:mb-1">Comprehensive Results</h4>
                    <p className="text-xs md:text-sm text-gray-700">Receive detailed information about system size, costs, savings, payback period, and environmental impact.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-accent-950 text-white p-3 md:p-6 rounded-xl">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Ready to Harness Solar Power?</h3>
              <p className="text-xs md:text-base text-gray-700 mb-2 md:mb-4">By installing a {averageSystemSizeKw.toFixed(2)} kW solar system, over {years} years you will:</p>
              <ul className="space-y-1 md:space-y-3">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-5 md:w-5 text-accent-500 mr-1 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs md:text-base">Save ₹{Math.round(totalReturns).toLocaleString()} on electricity bills</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-5 md:w-5 text-accent-500 mr-1 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs md:text-base">Prevent {Math.round(totalCo2Savings).toLocaleString()} kg of CO₂ emissions</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-5 md:w-5 text-accent-500 mr-1 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs md:text-base">Have the same environmental impact as planting {totalTreesEquivalent} trees</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto mt-3 md:mt-8">
          <div className="bg-white border border-accent-500/30 rounded-xl shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-accent-950 to-accent-900 text-white p-3 md:p-6">
              <h2 className="text-lg md:text-3xl font-bold mb-1 md:mb-2 font-space-grotesk">Your Solar Solution</h2>
              <p className="text-xs md:text-base opacity-80">Based on your inputs, here's your personalized solar solution</p>
            </div>
            
            {/* Main Content */}
            <div className="p-3 md:p-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
                <div className={`bg-accent-50 p-2 md:p-6 rounded-xl border border-accent-500/30 flex flex-col items-center text-center transform transition-all duration-700 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '100ms'}}>
                  <div className="text-accent-950 text-lg md:text-4xl font-bold mb-0.5 md:mb-2">{`${roundedSystemSizeKw_lower} - ${roundedSystemSizeKw_upper}`} kW</div>
                  <div className="text-gray-600 text-xs md:text-sm">Recommended System Size</div>
                </div>
                
                <div className={`bg-accent-50 p-2 md:p-6 rounded-xl border border-accent-500/30 flex flex-col items-center text-center transform transition-all duration-700 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '200ms'}}>
                  <div className="text-accent-950 text-lg md:text-4xl font-bold mb-0.5 md:mb-2">₹{Math.round(investment_lower).toLocaleString()} - ₹{Math.round(investment_upper).toLocaleString()}</div>
                  <div className="text-gray-600 text-xs md:text-sm">Estimated Investment</div>
                </div>
                
                <div className={`bg-accent-50 p-2 md:p-6 rounded-xl border border-accent-500/30 flex flex-col items-center text-center transform transition-all duration-700 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '300ms'}}>
                  <div className="text-accent-950 text-lg md:text-4xl font-bold mb-0.5 md:mb-2">{paybackPeriod.toFixed(1)} Years</div>
                  <div className="text-gray-600 text-xs md:text-sm">Payback Period</div>
                </div>

                <div className={`bg-accent-50 p-2 md:p-6 rounded-xl border border-accent-500/30 flex flex-col items-center text-center transform transition-all duration-700 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '400ms'}}>
                  <div className="text-accent-950 text-lg md:text-4xl font-bold mb-0.5 md:mb-2">{Math.round(totalCo2Savings).toLocaleString()} kg</div>
                  <div className="text-gray-600 text-xs md:text-sm">CO₂ Savings in {years} Years</div>
                </div>
              </div>

              {/* Environmental Impact Section */}
              <div className={`mb-4 md:mb-8 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-3 md:p-6 border border-accent-500/30 transform transition-all duration-700 ${animationComplete ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} style={{transitionDelay: '500ms'}}>
                <h3 className="text-base md:text-xl font-semibold text-accent-950 mb-3 md:mb-4 font-space-grotesk">Environmental Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                  <div className="flex items-center md:col-span-1">
                    <div className="flex-shrink-0 bg-white p-2 md:p-4 rounded-full mr-2 md:mr-4 border border-accent-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-12 md:w-12 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base md:text-2xl font-bold text-accent-950">{Math.round(annualCo2Savings).toLocaleString()} kg</div>
                      <div className="text-xs md:text-sm text-gray-600">CO₂ Saved Per Year</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center md:col-span-1">
                    <div className="flex-shrink-0 bg-white p-2 md:p-4 rounded-full mr-2 md:mr-4 border border-accent-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-12 md:w-12 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base md:text-2xl font-bold text-accent-950">{treesEquivalentPerYear} Trees</div>
                      <div className="text-xs md:text-sm text-gray-600">Equivalent Trees Planted Per Year</div>
                    </div>
                  </div>
                  
                  {/* Pie Chart for Environmental Impact */}
                  <div className="md:col-span-1 h-32 md:h-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={environmentalImpactData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={45}
                          fill="var(--color-accent-500)"
                          dataKey="value"
                          isAnimationActive={true}
                          animationDuration={1500}
                          animationBegin={600}
                        >
                          {environmentalImpactData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toLocaleString()} kg`} />
                        <Legend wrapperStyle={{fontSize: '10px', marginTop: '5px'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Two Column Layout - Make it single column on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {/* Left Column */}
                <div className={`transform transition-all duration-700 ${animationComplete ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} style={{transitionDelay: '600ms'}}>
                  <h3 className="text-lg md:text-xl font-semibold text-accent-950 mb-2 md:mb-4 pb-2 border-b border-accent-500/30 font-space-grotesk">System Details</h3>
                  
                  <div className="space-y-2 md:space-y-4 mb-4 md:mb-6">
                    <div className="flex justify-between p-2 md:p-3 bg-accent-50 rounded-lg border border-accent-500/20">
                      <span className="text-xs md:text-base text-gray-600">Required Roof Area</span>
                      <span className="text-xs md:text-base font-semibold text-accent-950">{areaNeeded.toFixed(2)} sq meters</span>
                    </div>
                    
                    <div className="flex justify-between p-2 md:p-3 bg-accent-50 rounded-lg border border-accent-500/20">
                      <span className="text-xs md:text-base text-gray-600">Space Feasibility</span>
                      <span className={`text-xs md:text-base font-semibold ${feasible ? 'text-accent-700' : 'text-red-600'}`}>
                        {feasible ? 'Sufficient Space Available' : 'Insufficient Roof Space'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between p-2 md:p-3 bg-accent-50 rounded-lg border border-accent-500/20">
                      <span className="text-xs md:text-base text-gray-600">Annual Savings</span>
                      <span className="text-xs md:text-base font-semibold text-accent-700">₹{Math.round(annualReturn).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between p-2 md:p-3 bg-accent-50 rounded-lg border border-accent-500/20">
                      <span className="text-xs md:text-base text-gray-600">{years}-Year Returns</span>
                      <span className="text-xs md:text-base font-semibold text-accent-700">₹{Math.round(totalReturns).toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between p-2 md:p-3 bg-accent-50 rounded-lg border border-accent-500/20">
                      <span className="text-xs md:text-base text-gray-600">Total Trees Equivalent</span>
                      <span className="text-xs md:text-base font-semibold text-accent-700">{totalTreesEquivalent} Trees</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-semibold text-accent-950 mb-2 md:mb-4 pb-2 border-b border-accent-500/30 font-space-grotesk">Financial Growth</h3>
                  <div className="h-40 md:h-64 bg-accent-50 p-2 md:p-3 rounded-lg border border-accent-500/20">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={breakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="yearNum" stroke="#6b7280" tick={{fontSize: 10}} />
                        <YAxis stroke="#6b7280" tick={{fontSize: 10}} />
                        <Tooltip contentStyle={{ borderRadius: '8px' }} />
                        <Legend wrapperStyle={{fontSize: '10px', marginTop: '5px'}} />
                        <Area 
                          type="monotone" 
                          dataKey="invest" 
                          name="Investment" 
                          stroke="var(--color-accent-950)" 
                          fill="var(--color-accent-500)" 
                          strokeWidth={2} 
                          activeDot={{ r: 4 }} 
                          isAnimationActive={true}
                          animationDuration={1500}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="returns" 
                          name="Returns" 
                          stroke="var(--color-accent-700)" 
                          fill="var(--color-accent-400)" 
                          strokeWidth={2} 
                          activeDot={{ r: 4 }} 
                          isAnimationActive={true}
                          animationDuration={1500}
                          animationBegin={300}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold text-accent-950 mt-3 md:mt-6 mb-2 md:mb-4 pb-2 border-b border-accent-500/30 font-space-grotesk">Environmental Impact</h3>
                  <div className="h-40 md:h-64 bg-accent-50 p-2 md:p-3 rounded-lg border border-accent-500/20">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={breakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="yearNum" stroke="#6b7280" tick={{fontSize: 10}} />
                        <YAxis stroke="#6b7280" tick={{fontSize: 10}} />
                        <Tooltip contentStyle={{ borderRadius: '8px' }} />
                        <Legend wrapperStyle={{fontSize: '10px', marginTop: '5px'}} />
                        <Bar 
                          dataKey="co2Saved" 
                          name="CO₂ Saved (kg)" 
                          fill="var(--color-accent-500)" 
                          radius={[4, 4, 0, 0]}
                          isAnimationActive={true}
                          animationDuration={1500}
                        />
                        <Bar 
                          dataKey="treesEquiv" 
                          name="Trees Equivalent" 
                          fill="var(--color-accent-700)" 
                          radius={[4, 4, 0, 0]}
                          isAnimationActive={true}
                          animationDuration={1500}
                          animationBegin={300}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className={`transform transition-all duration-700 ${animationComplete ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`} style={{transitionDelay: '700ms'}}>
                  <h3 className="text-lg md:text-xl font-semibold text-accent-950 mb-2 md:mb-4 pb-2 border-b border-accent-500/30 font-space-grotesk">Year-by-Year Breakdown</h3>
                  <div className="overflow-auto max-h-[300px] md:max-h-none rounded-xl border border-accent-500/20 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-accent-50 sticky top-0">
                        <tr>
                          <th className="px-1 md:px-4 py-1 md:py-3 text-left text-xs font-medium text-accent-950 uppercase tracking-wider">Year</th>
                          <th className="px-1 md:px-4 py-1 md:py-3 text-right text-xs font-medium text-accent-950 uppercase tracking-wider">Investment</th>
                          <th className="px-1 md:px-4 py-1 md:py-3 text-right text-xs font-medium text-accent-950 uppercase tracking-wider">Returns</th>
                          <th className="px-1 md:px-4 py-1 md:py-3 text-right text-xs font-medium text-accent-950 uppercase tracking-wider">CO₂ Saved</th>
                          <th className="px-1 md:px-4 py-1 md:py-3 text-right text-xs font-medium text-accent-950 uppercase tracking-wider">Trees</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {breakdown.map((row, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-accent-50'}>
                            <td className="px-1 md:px-4 py-1 md:py-3 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">{row.year}</td>
                            <td className="px-1 md:px-4 py-1 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-700 text-right">₹{row.invest.toLocaleString()}</td>
                            <td className="px-1 md:px-4 py-1 md:py-3 whitespace-nowrap text-xs md:text-sm text-accent-700 text-right">₹{row.returns.toLocaleString()}</td>
                            <td className="px-1 md:px-4 py-1 md:py-3 whitespace-nowrap text-xs md:text-sm text-accent-700 text-right">{row.co2Saved.toLocaleString()} kg</td>
                            <td className="px-1 md:px-4 py-1 md:py-3 whitespace-nowrap text-xs md:text-sm text-accent-700 text-right">{row.treesEquiv}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3 md:mt-8 p-3 md:p-6 bg-accent-50 rounded-xl border border-accent-500/30">
                    <h3 className="text-lg md:text-xl font-semibold text-accent-950 mb-3 md:mb-4 font-space-grotesk">Your Impact Summary</h3>
                    <p className="text-xs md:text-base text-gray-700 mb-2 md:mb-4">By installing a {averageSystemSizeKw.toFixed(2)} kW solar system, over {years} years you will:</p>
                    <ul className="space-y-1 md:space-y-3">
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-5 md:w-5 text-accent-500 mr-1 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-base">Save ₹{Math.round(totalReturns).toLocaleString()} on electricity bills</span>
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-5 md:w-5 text-accent-500 mr-1 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-base">Prevent {Math.round(totalCo2Savings).toLocaleString()} kg of CO₂ emissions</span>
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-5 md:w-5 text-accent-500 mr-1 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-base">Have the same environmental impact as planting {totalTreesEquivalent} trees</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-3 md:mt-8 flex justify-center">
                    <button
                      onClick={() => {
                        setShowResult(false);
                        setStep(1);
                      }}
                      className="bg-accent-500 hover:bg-accent-400 text-accent-950 font-medium py-1.5 md:py-3 px-4 md:px-8 rounded-lg transition-all flex items-center text-xs md:text-base"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-5 md:w-5 mr-1 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Start New Calculation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;