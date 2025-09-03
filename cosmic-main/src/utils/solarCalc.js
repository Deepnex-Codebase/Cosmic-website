/**
 * Solar Savings Logic Engine v1.0
 * Calculates solar system specifications, costs, and benefits based on user inputs
 * Now supports dynamic configuration from CMS
 */

// Default config is imported but will be overridden by CMS config when available
import defaultSolarConfig from '../config/solarConfig.json';

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
 * Calculate solar system details using configuration from CMS
 * @param {Object} params - Input parameters
 * @param {number} params.monthlyBill - Monthly electricity bill in ₹
 * @param {number} params.roofArea - Available roof area in sq ft
 * @param {string} params.state - Indian state name
 * @param {number} params.sunlightHours - Daily sunlight hours
 * @param {string} params.shadingLevel - Shading level (none, partial, significant)
 * @param {string} params.panelsType - Panel type (standard, premium)
 * @param {Object} params.config - Configuration from CMS
 * @returns {Object} Calculation results
 */
export const calculateSolarSystem = (params) => {
  const {
    monthlyBill,
    roofArea,
    state,
    sunlightHours,
    shadingLevel,
    panelsType,
    config
  } = params;
  
  // Use CMS config or fall back to default
  const cfg = config || defaultSolarConfig.configuration;
  
  // Get tariff for the selected state or use default
  const tariff = cfg.tariff[state] || cfg.tariff.Default || 8.7;
  
  // Get shading efficiency
  const shadingEfficiency = {
    'none': 1,
    'partial': 0.8,
    'significant': 0.6,
  }[shadingLevel];
  
  // Get panel efficiency based on type
  const panelEfficiency = {
    'standard': 1,
    'premium': 1.2
  }[panelsType] || 1;
  
  // Calculate monthly kWh consumption
  const monthlyKwh = monthlyBill / tariff;
  
  // Calculate system size based on monthly bill
  const systemSizeKw_lower = monthlyBill / 1100;
  const systemSizeKw_upper = monthlyBill / 1000;
  
  // Calculate average system size
  const systemSizeKw = (systemSizeKw_lower + systemSizeKw_upper) / 2;
  
  // Calculate area needed
  const roofAreaPerKW = cfg.roofAreaPerKW || 100;
  const areaNeeded = systemSizeKw * roofAreaPerKW;
  
  // Check if roof area is sufficient
  const feasible = roofArea >= areaNeeded;
  
  // Calculate number of panels
  const panelWattage = 350; // Standard panel wattage
  const panels = Math.floor((systemSizeKw * 1000) / panelWattage);
  
  // Calculate investment cost
  let costPerKW;
  if (typeof cfg.costPerKW === 'object') {
    // Use slab-based pricing
    if (systemSizeKw <= 3) {
      costPerKW = cfg.costPerKW['≤3'];
    } else if (systemSizeKw <= 10) {
      costPerKW = cfg.costPerKW['4‑10'];
    } else {
      costPerKW = cfg.costPerKW['>10'];
    }
  } else {
    costPerKW = cfg.costPerKW || 55000;
  }
  
  // Calculate investment range
  const investment_lower = systemSizeKw_lower * costPerKW;
  const investment_upper = systemSizeKw_upper * costPerKW;
  const investment = systemSizeKw * costPerKW;
  
  // Calculate annual savings
  const annualKwh = monthlyKwh * 12;
  const annualSavings = annualKwh * tariff * shadingEfficiency * panelEfficiency;
  
  // Calculate payback period
  const paybackPeriod = investment / annualSavings;
  
  // Calculate total returns over 10 years
  const years = 10;
  const totalReturns = annualSavings * years;
  const totalValue = totalReturns - investment;
  
  // Calculate CO2 savings
  const co2FactorKgPerKWh = cfg.co2FactorKgPerKWh || 0.82;
  const annualCo2Savings = annualKwh * co2FactorKgPerKWh * shadingEfficiency * panelEfficiency;
  const totalCo2Savings = annualCo2Savings * years;
  
  // Calculate tree equivalent
  const co2PerTree = 22; // kg of CO2 absorbed by one tree per year
  const treesEquivalentPerYear = Math.round(annualCo2Savings / co2PerTree);
  const totalTreesEquivalent = treesEquivalentPerYear * years;
  
  return {
    monthlyKwh,
    systemSizeKw_lower,
    systemSizeKw_upper,
    systemSizeKw,
    areaNeeded,
    feasible,
    panels,
    investment_lower,
    investment_upper,
    investment,
    annualSavings,
    paybackPeriod,
    totalReturns,
    totalValue,
    annualCo2Savings,
    totalCo2Savings,
    treesEquivalentPerYear,
    totalTreesEquivalent
  };
};

/**
 * Main solar calculator function
 * @param {Object} inputs - User inputs
 * @param {string} inputs.state - Indian state name
 * @param {number} inputs.monthlyBill - Average monthly electricity bill in ₹
 * @param {number} inputs.roofArea - Available roof area in sq ft
 * @param {string} inputs.financeOption - 'cash' or 'loan'
 * @param {number} [inputs.downPaymentPercent=0.2] - Down payment percentage if loan option selected
 * @param {number} [inputs.tenureYears=5] - Loan tenure in years if loan option selected
 * @returns {Object} Calculation results
 */
const solarCalc = (inputs) => {
  const { state, monthlyBill, roofArea, financeOption } = inputs;
  const downPaymentPercent = inputs.downPaymentPercent || 0.2;
  const tenureYears = inputs.tenureYears || 5;
  
  // Input validation
  if (monthlyBill < 300) {
    throw new Error('ERR_BILL_RANGE');
  }
  
  if (roofArea < 50) {
    throw new Error('ERR_ROOF_RANGE');
  }
  
  // Get configuration values from solar.json
  const cfg = solarConfig;
  const tariff = cfg.tariff[state] || cfg.tariff['Default'];
  const genPerDay = typeof cfg.genPerKW_day === 'object' ? 
    (cfg.genPerKW_day[state] || cfg.genPerKW_day['Default']) : 
    cfg.genPerKW_day;
  
  // Basic calculations
  const unitsMonth = monthlyBill / tariff;
  const unitsYear = unitsMonth * 12;
  
  // Calculate annual generation per kW
  const annualGenPerKW = genPerDay * 365;
  
  const kW_demand = unitsYear / annualGenPerKW;
  const kW_roof = roofArea / cfg.areaPerKW;
  const systemKw = Math.max(1, Math.min(kW_demand, kW_roof));
  
  // Flag for insufficient roof area
  const insufficientRoof = (systemKw === 1 && kW_roof < 1);
  
  // Determine price slab and subsidy
  let slabPrice, slabSubsidy;
  
  if (typeof cfg.costPerKW === 'object') {
    // Use slab-based pricing if available
    if (systemKw <= 3) {
      slabPrice = cfg.costPerKW['≤3'];
      slabSubsidy = cfg.subsidy ? cfg.subsidy['≤3'] : 0;
    } else if (systemKw <= 10) {
      slabPrice = cfg.costPerKW['4‑10'];
      slabSubsidy = cfg.subsidy ? cfg.subsidy['4‑10'] : 0;
    } else {
      slabPrice = cfg.costPerKW['>10'];
      slabSubsidy = cfg.subsidy ? cfg.subsidy['>10'] : 0;
    }
  } else {
    // Use flat pricing if slab-based pricing is not available
    slabPrice = cfg.costPerKW;
    slabSubsidy = 0;
  }
  
  // Cost calculations
  const capexGross = systemKw * slabPrice;
  const capexSubsidy = systemKw * slabSubsidy;
  const capexNet = capexGross - capexSubsidy;
  
  // Generation and savings calculations
  const annualGenerationYr1 = systemKw * annualGenPerKW;
  const annualSavingsYr1 = annualGenerationYr1 * tariff;
  
  // Payback period
  const paybackYears = capexNet / annualSavingsYr1;
  
  // Calculate lifetime savings (25 years)
  let lifetimeSavings25 = 0;
  let co2SavedKg = 0;
  
  // Use panel degradation rate if available, otherwise use default
  const degradationRate = cfg.panelDegradationRate || 0.005;
  // Use tariff escalation rate if available, otherwise use default
  const escalationRate = cfg.tariffEscalationRate || 0.05;
  // Use CO2 factor if available, otherwise use default
  const co2Factor = cfg.co2FactorKgPerKWh || cfg.EF || 0.82;
  
  for (let n = 0; n < 25; n++) {
    const generationFactor = Math.pow(1 - degradationRate, n);
    const tariffFactor = Math.pow(1 + escalationRate, n);
    
    const yearlyGeneration = annualGenerationYr1 * generationFactor;
    lifetimeSavings25 += yearlyGeneration * tariff * tariffFactor;
    co2SavedKg += yearlyGeneration * co2Factor;
  }
  
  // Loan calculations
  let loanPrincipal = 0;
  let emi = 0;
  
  if (financeOption === 'loan') {
    loanPrincipal = capexNet * (1 - downPaymentPercent);
    const interestRate = cfg.loan ? cfg.loan.interestRate : 0.11;
    emi = PMT(interestRate / 12, tenureYears * 12, -loanPrincipal);
  }
  
  // Prepare results
  return {
    systemKw: parseFloat(systemKw.toFixed(1)),
    requiredRoofArea: Math.round(systemKw * cfg.areaPerKW),
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
      genPerDay,
      annualGenPerKW,
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