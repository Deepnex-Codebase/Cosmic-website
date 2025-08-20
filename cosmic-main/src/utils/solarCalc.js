/**
 * Solar Savings Logic Engine v1.0
 * Calculates solar system specifications, costs, and benefits based on user inputs
 */

import solarConfig from '../config/solarConfig.json';

// Helper function to determine state from pincode
const stateLookup = (pincode) => {
  // This is a simplified implementation
  // In a real application, this would use a comprehensive pincode database
  const firstDigit = pincode.charAt(0);
  
  // Very simplified mapping based on first digit of pincode
  const stateMap = {
    '1': 'Delhi',
    '2': 'Rajasthan',
    '3': 'Gujarat',
    '4': 'Maharashtra',
    '5': 'Maharashtra',
    '6': 'Gujarat',
    '7': 'Maharashtra',
    '8': 'Gujarat',
    '9': 'Rajasthan',
    '0': 'Delhi'
  };
  
  return stateMap[firstDigit] || 'Default';
};

// PMT function for loan calculation (similar to Excel's PMT function)
const PMT = (rate, nper, pv) => {
  if (rate === 0) return -pv / nper;
  
  const pvif = Math.pow(1 + rate, nper);
  return rate * pv * pvif / (pvif - 1);
};

/**
 * Main solar calculator function
 * @param {Object} inputs - User inputs
 * @param {string} inputs.pincode - 6-digit Indian PIN code
 * @param {number} inputs.monthlyBill - Average monthly electricity bill in ₹
 * @param {number} inputs.roofArea - Available roof area in sq ft
 * @param {string} inputs.financeOption - 'cash' or 'loan'
 * @param {number} [inputs.downPaymentPercent=0.2] - Down payment percentage if loan option selected
 * @param {number} [inputs.tenureYears=5] - Loan tenure in years if loan option selected
 * @returns {Object} Calculation results
 */
const solarCalc = (inputs) => {
  const { pincode, monthlyBill, roofArea, financeOption } = inputs;
  const downPaymentPercent = inputs.downPaymentPercent || 0.2;
  const tenureYears = inputs.tenureYears || 5;
  
  // Input validation
  if (monthlyBill < 300) {
    throw new Error('ERR_BILL_RANGE');
  }
  
  if (roofArea < 50) {
    throw new Error('ERR_ROOF_RANGE');
  }
  
  // Determine state from pincode
  const state = stateLookup(pincode);
  
  // Get configuration values
  const cfg = solarConfig.configuration;
  const tariff = cfg.tariff[state] || cfg.tariff['Default'];
  const yield_value = cfg.yield[state] || cfg.yield['Default'];
  
  // Basic calculations
  const unitsMonth = monthlyBill / tariff;
  const unitsYear = unitsMonth * 12;
  
  const kW_demand = unitsYear / yield_value;
  const kW_roof = roofArea / cfg.roofAreaPerKW;
  const systemKw = Math.max(1, Math.min(kW_demand, kW_roof));
  
  // Flag for insufficient roof area
  const insufficientRoof = (systemKw === 1 && kW_roof < 1);
  
  // Determine price slab and subsidy
  let slabPrice, slabSubsidy;
  
  if (systemKw <= 3) {
    slabPrice = cfg.costPerKW['≤3'];
    slabSubsidy = cfg.subsidy['≤3'];
  } else if (systemKw <= 10) {
    slabPrice = cfg.costPerKW['4‑10'];
    slabSubsidy = cfg.subsidy['4‑10'];
  } else {
    slabPrice = cfg.costPerKW['>10'];
    slabSubsidy = cfg.subsidy['>10'];
  }
  
  // Cost calculations
  const capexGross = systemKw * slabPrice;
  const capexSubsidy = systemKw * slabSubsidy;
  const capexNet = capexGross - capexSubsidy;
  
  // Generation and savings calculations
  const annualGenerationYr1 = systemKw * yield_value;
  const annualSavingsYr1 = annualGenerationYr1 * tariff;
  
  // Payback period
  const paybackYears = capexNet / annualSavingsYr1;
  
  // Calculate lifetime savings (25 years)
  let lifetimeSavings25 = 0;
  let co2SavedKg = 0;
  
  for (let n = 0; n < 25; n++) {
    const generationFactor = Math.pow(1 - cfg.panelDegradationRate, n);
    const tariffFactor = Math.pow(1 + cfg.tariffEscalationRate, n);
    
    const yearlyGeneration = annualGenerationYr1 * generationFactor;
    lifetimeSavings25 += yearlyGeneration * tariff * tariffFactor;
    co2SavedKg += yearlyGeneration * cfg.co2FactorKgPerKWh;
  }
  
  // Loan calculations
  let loanPrincipal = 0;
  let emi = 0;
  
  if (financeOption === 'loan') {
    loanPrincipal = capexNet * (1 - downPaymentPercent);
    emi = PMT(cfg.loan.interestRate / 12, tenureYears * 12, -loanPrincipal);
  }
  
  // Prepare results
  return {
    systemKw: parseFloat(systemKw.toFixed(1)),
    requiredRoofArea: Math.round(systemKw * cfg.roofAreaPerKW),
    capexGross: Math.round(capexGross),
    capexSubsidy: Math.round(capexSubsidy),
    capexNet: Math.round(capexNet),
    paybackYears: parseFloat(paybackYears.toFixed(1)),
    annualSavingsYr1: Math.round(annualSavingsYr1),
    lifetimeSavings25: Math.round(lifetimeSavings25),
    co2SavedKg: Math.round(co2SavedKg),
    emi: Math.round(emi),
    flags: {
      insufficientRoof
    },
    // Additional data for detailed analysis
    details: {
      state,
      tariff,
      yield: yield_value,
      unitsMonth,
      unitsYear,
      kW_demand,
      kW_roof,
      slabPrice,
      slabSubsidy,
      annualGenerationYr1,
      loanPrincipal,
      tenureYears,
      downPaymentPercent
    }
  };
};

export default solarCalc;