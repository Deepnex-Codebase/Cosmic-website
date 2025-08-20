import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import solarCalc from '../utils/solarCalc';

const AdvancedCalculator = () => {
  const [formData, setFormData] = useState({
    pincode: '',
    monthlyBill: '',
    roofArea: '',
    financeOption: 'cash',
    downPaymentPercent: 20,
    tenureYears: 5
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

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

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleCalculate = () => {
    try {
      setError(null);
      
      // Convert string inputs to appropriate types
      const inputs = {
        pincode: formData.pincode,
        monthlyBill: parseFloat(formData.monthlyBill),
        roofArea: parseFloat(formData.roofArea),
        financeOption: formData.financeOption,
        downPaymentPercent: parseFloat(formData.downPaymentPercent) / 100,
        tenureYears: parseInt(formData.tenureYears)
      };
      
      const calculationResults = solarCalc(inputs);
      setResults(calculationResults);
      setShowResult(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStartNew = () => {
    setFormData({
      pincode: '',
      monthlyBill: '',
      roofArea: '',
      financeOption: 'cash',
      downPaymentPercent: 20,
      tenureYears: 5
    });
    setResults(null);
    setShowResult(false);
    setStep(1);
    setError(null);
  };

  // Generate year-by-year breakdown data if results are available
  const generateBreakdownData = () => {
    if (!results) return [];
    
    const { systemKw, annualSavingsYr1, capexNet } = results;
    const { tariff, yield: yieldValue } = results.details;
    
    // Create the data array incrementally to avoid circular reference
    const data = [];
    
    for (let i = 0; i < 25; i++) {
      const year = i + 1;
      const degradationFactor = Math.pow(1 - 0.005, i); // 0.5% annual degradation
      const tariffFactor = Math.pow(1 + 0.05, i); // 5% annual tariff increase
      
      const annualGeneration = systemKw * yieldValue * degradationFactor;
      const annualSavings = annualGeneration * tariff * tariffFactor;
      const cumulativeSavings = year === 1 ? annualSavings : data[i-1].cumulativeSavings + annualSavings;
      const netSavings = cumulativeSavings - capexNet;
      const co2Saved = annualGeneration * 0.9; // 0.9 kg CO2 per kWh
      const treesEquivalent = co2Saved / 22; // 22 kg CO2 per tree per year
      
      data.push({
        year: `Year ${year}`,
        yearNum: year,
        annualGeneration: Math.round(annualGeneration),
        annualSavings: Math.round(annualSavings),
        cumulativeSavings: Math.round(cumulativeSavings),
        netSavings: Math.round(netSavings),
        co2Saved: Math.round(co2Saved),
        treesEquivalent: Math.round(treesEquivalent)
      });
    }
    
    return data;
  };

  const breakdownData = results ? generateBreakdownData() : [];

  // Environmental impact data for pie chart
  const environmentalImpactData = results ? [
    { name: 'CO₂ Saved', value: results.co2SavedKg },
    { name: 'Trees Equivalent', value: Math.round(results.co2SavedKg / 22) * 22 }
  ] : [];

  const COLORS = ['var(--color-accent-500)', 'var(--color-accent-700)', 'var(--color-accent-950)', 'var(--color-accent-400)'];

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Validate pincode
  const isPincodeValid = (pincode) => {
    return /^\d{6}$/.test(pincode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white p-4 md:p-8 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-accent-950 font-space-grotesk">Advanced Solar Calculator</h1>
      <p className="text-center text-md text-gray-600 mb-6 md:mb-10">
        Calculate your solar panel requirements, potential savings, and return on investment with our advanced calculator
      </p>

      {!showResult ? (
        <div className="max-w-3xl mx-auto bg-white border border-accent-500/30 rounded-xl p-4 md:p-8 shadow-lg">
          {step === 1 ? (
            <>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-accent-950 border-b border-accent-500/30 pb-2 font-space-grotesk">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">PIN Code</label>
                  <input 
                    type="text" 
                    name="pincode" 
                    value={formData.pincode} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base" 
                    required
                    maxLength="6"
                    pattern="\d{6}"
                  />
                  {formData.pincode && !isPincodeValid(formData.pincode) && (
                    <p className="text-red-500 text-xs mt-1">Please enter a valid 6-digit PIN code</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Monthly Electricity Bill (₹)</label>
                  <input 
                    type="number" 
                    name="monthlyBill" 
                    value={formData.monthlyBill} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base" 
                    required
                    min="300"
                  />
                  {formData.monthlyBill && parseFloat(formData.monthlyBill) < 300 && (
                    <p className="text-red-500 text-xs mt-1">Monthly bill must be at least ₹300</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Available Roof Area (sq ft)</label>
                  <input 
                    type="number" 
                    name="roofArea" 
                    value={formData.roofArea} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base" 
                    required
                    min="50"
                  />
                  {formData.roofArea && parseFloat(formData.roofArea) < 50 && (
                    <p className="text-red-500 text-xs mt-1">Roof area must be at least 50 sq ft</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Finance Option</label>
                  <select 
                    name="financeOption" 
                    value={formData.financeOption} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base"
                  >
                    <option value="cash">Cash Purchase</option>
                    <option value="loan">Bank Loan</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleNextStep} 
                className="w-full bg-accent-500 hover:bg-accent-400 text-accent-950 font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg mt-6 md:mt-8 transition-all transform hover:scale-[1.02] flex items-center justify-center text-sm md:text-base"
                disabled={!formData.pincode || !isPincodeValid(formData.pincode) || !formData.monthlyBill || parseFloat(formData.monthlyBill) < 300 || !formData.roofArea || parseFloat(formData.roofArea) < 50}
              >
                Next Step <span className="ml-2">→</span>
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-accent-950 border-b border-accent-500/30 pb-2 font-space-grotesk">Financing Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {formData.financeOption === 'loan' && (
                  <>
                    <div>
                      <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Down Payment (%)</label>
                      <input 
                        type="number" 
                        name="downPaymentPercent" 
                        value={formData.downPaymentPercent} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base" 
                        min="10"
                        max="90"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 md:mb-2 text-xs md:text-sm font-medium text-gray-700">Loan Tenure (years)</label>
                      <input 
                        type="number" 
                        name="tenureYears" 
                        value={formData.tenureYears} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 px-3 md:px-4 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm md:text-base" 
                        min="1"
                        max="7"
                      />
                    </div>
                  </>
                )}

                {formData.financeOption === 'cash' && (
                  <div className="col-span-2">
                    <div className="bg-accent-50 p-4 rounded-lg">
                      <p className="text-accent-950 font-medium">Cash Purchase Selected</p>
                      <p className="text-sm text-gray-600 mt-1">You've selected to purchase the solar system with cash. This typically provides the best long-term returns.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-8">
                <button 
                  onClick={handlePrevStep} 
                  className="md:w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center text-sm md:text-base"
                >
                  <span className="mr-2">←</span> Previous
                </button>
                
                <button 
                  onClick={handleCalculate} 
                  className="md:w-1/2 bg-accent-500 hover:bg-accent-400 text-accent-950 font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center text-sm md:text-base"
                >
                  Calculate Results
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                  {error === 'ERR_BILL_RANGE' && 'Monthly bill must be at least ₹300'}
                  {error === 'ERR_ROOF_RANGE' && 'Roof area must be at least 50 sq ft'}
                  {error !== 'ERR_BILL_RANGE' && error !== 'ERR_ROOF_RANGE' && `Error: ${error}`}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className={`transition-all duration-1000 ${animationComplete ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
            <div className="bg-white border border-accent-500/30 rounded-xl p-4 md:p-8 shadow-lg mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-accent-950 font-space-grotesk">Your Solar System Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-accent-50 p-4 rounded-lg text-center">
                  <h3 className="text-sm text-gray-600 mb-1">Recommended System Size</h3>
                  <p className="text-2xl md:text-3xl font-bold text-accent-950">{results.systemKw} kW</p>
                </div>
                
                <div className="bg-accent-50 p-4 rounded-lg text-center">
                  <h3 className="text-sm text-gray-600 mb-1">Estimated Investment</h3>
                  <p className="text-2xl md:text-3xl font-bold text-accent-950">{formatCurrency(results.capexNet)}</p>
                  {results.capexSubsidy > 0 && (
                    <p className="text-xs text-green-600 mt-1">Includes subsidy of {formatCurrency(results.capexSubsidy)}</p>
                  )}
                </div>
                
                <div className="bg-accent-50 p-4 rounded-lg text-center">
                  <h3 className="text-sm text-gray-600 mb-1">Payback Period</h3>
                  <p className="text-2xl md:text-3xl font-bold text-accent-950">{results.paybackYears} years</p>
                </div>
                
                <div className="bg-accent-50 p-4 rounded-lg text-center">
                  <h3 className="text-sm text-gray-600 mb-1">CO₂ Savings (25 years)</h3>
                  <p className="text-2xl md:text-3xl font-bold text-accent-950">{(results.co2SavedKg / 1000).toFixed(1)} tons</p>
                </div>
              </div>

              {formData.financeOption === 'loan' && results.emi > 0 && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Loan Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Monthly EMI</p>
                      <p className="text-xl font-bold text-blue-800">{formatCurrency(results.emi)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Loan Amount</p>
                      <p className="text-xl font-bold text-blue-800">{formatCurrency(results.details.loanPrincipal)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Down Payment</p>
                      <p className="text-xl font-bold text-blue-800">{formatCurrency(results.capexNet - results.details.loanPrincipal)}</p>
                    </div>
                  </div>
                </div>
              )}

              {results.flags.insufficientRoof && (
                <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Roof Area Warning</h3>
                  <p className="text-yellow-800">Your available roof area is insufficient for the optimal system size. We've adjusted the calculation to fit your roof, but you may not achieve maximum savings.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-accent-500/30 rounded-xl p-4 md:p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-accent-950 border-b border-accent-500/30 pb-2">System Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Required Roof Area</p>
                    <p className="text-lg font-semibold">{results.requiredRoofArea} sq ft</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Space Feasibility</p>
                    <p className={`text-lg font-semibold ${results.flags.insufficientRoof ? 'text-yellow-600' : 'text-green-600'}`}>
                      {results.flags.insufficientRoof ? 'Limited by roof size' : 'Adequate space'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Annual Savings (Year 1)</p>
                    <p className="text-lg font-semibold">{formatCurrency(results.annualSavingsYr1)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Total Returns (25 years)</p>
                    <p className="text-lg font-semibold">{formatCurrency(results.lifetimeSavings25)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Total Trees Equivalent</p>
                    <p className="text-lg font-semibold">{Math.round(results.co2SavedKg / 22)} trees</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">State</p>
                    <p className="text-lg font-semibold">{results.details.state}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-accent-500/30 rounded-xl p-4 md:p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-accent-950 border-b border-accent-500/30 pb-2">Environmental Impact</h3>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={environmentalImpactData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {environmentalImpactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Your solar system will save approximately</p>
                  <p className="text-lg font-semibold text-green-600">{(results.co2SavedKg / 1000).toFixed(1)} tons of CO₂ over 25 years</p>
                  <p className="text-sm text-gray-600 mt-1">Equivalent to planting {Math.round(results.co2SavedKg / 22)} trees</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-accent-500/30 rounded-xl p-4 md:p-6 shadow-lg mb-8">
              <h3 className="text-xl font-semibold mb-4 text-accent-950 border-b border-accent-500/30 pb-2">Financial Growth</h3>
              
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={breakdownData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Area type="monotone" dataKey="cumulativeSavings" name="Cumulative Savings" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="netSavings" name="Net Savings" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-accent-500/30 rounded-xl p-4 md:p-6 shadow-lg mb-8">
              <h3 className="text-xl font-semibold mb-4 text-accent-950 border-b border-accent-500/30 pb-2">Year-by-Year Breakdown</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Generation (kWh)</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Savings</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cumulative Savings</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Savings</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CO₂ Saved (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {breakdownData.slice(0, 10).map((item) => (
                      <tr key={item.year} className={item.yearNum === results.paybackYears.toFixed(0) ? 'bg-green-50' : ''}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.year}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.annualGeneration.toLocaleString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.annualSavings)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.cumulativeSavings)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          <span className={item.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(item.netSavings)}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.co2Saved.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Showing first 10 years. Full 25-year data available in detailed report.</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <button 
                onClick={handleStartNew} 
                className="inline-block bg-accent-500 hover:bg-accent-400 text-accent-950 font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-[1.02]"
              >
                Start New Calculation
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-accent-950 font-space-grotesk">About Our Advanced Solar Calculator</h2>
        
        <div className="bg-white border border-accent-500/30 rounded-xl p-4 md:p-6 shadow-lg mb-6">
          <h3 className="text-lg font-semibold mb-2 text-accent-950">How It Works</h3>
          <p className="text-gray-700 mb-4">
            Our advanced calculator uses precise location data from your PIN code to determine solar irradiance levels and applicable electricity tariffs in your region. It then calculates the optimal system size based on your electricity consumption and available roof area.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-accent-50 p-3 rounded-lg">
              <h4 className="font-medium text-accent-950 mb-1">1. Input Details</h4>
              <p className="text-sm text-gray-600">Enter your PIN code, monthly bill, and roof area to get started.</p>
            </div>
            
            <div className="bg-accent-50 p-3 rounded-lg">
              <h4 className="font-medium text-accent-950 mb-1">2. Advanced Calculations</h4>
              <p className="text-sm text-gray-600">Our algorithm calculates system size, costs, and benefits specific to your location.</p>
            </div>
            
            <div className="bg-accent-50 p-3 rounded-lg">
              <h4 className="font-medium text-accent-950 mb-1">3. Comprehensive Results</h4>
              <p className="text-sm text-gray-600">Get detailed financial projections and environmental impact analysis.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-accent-500/30 rounded-xl p-4 md:p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-accent-950">Key Features</h3>
          
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Location-specific solar yield calculations based on PIN code</li>
            <li>Accurate financial projections including applicable subsidies</li>
            <li>Detailed year-by-year breakdown of savings and returns</li>
            <li>Environmental impact analysis with CO₂ savings and tree equivalents</li>
            <li>Loan calculator with EMI estimation for financing options</li>
            <li>System feasibility check based on your available roof area</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCalculator;