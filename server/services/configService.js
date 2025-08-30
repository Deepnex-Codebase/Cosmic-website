const fs = require('fs');
const path = require('path');

class ConfigService {
  constructor() {
    this.configPath = path.join(__dirname, '../data/solar_company_profile.json');
    this.companyData = null;
  }

  /**
   * Load company profile data from JSON file
   * @returns {Object} - The company profile data
   */
  loadCompanyData() {
    try {
      if (!this.companyData) {
        const rawData = fs.readFileSync(this.configPath, 'utf8');
        this.companyData = JSON.parse(rawData);
      }
      return this.companyData;
    } catch (error) {
      console.error('Error loading company data:', error);
      throw new Error('Failed to load company configuration data');
    }
  }

  /**
   * Get company profile data
   * @returns {Object} - The company profile data
   */
  getCompanyData() {
    return this.loadCompanyData();
  }

  /**
   * Get specific section of company profile data
   * @param {String} section - The section name to retrieve
   * @returns {Object} - The requested section data
   */
  getSection(section) {
    const data = this.loadCompanyData();
    if (data && data[section]) {
      return data[section];
    }
    throw new Error(`Section '${section}' not found in company data`);
  }

  /**
   * Get offerings for a specific customer type
   * @param {String} customerType - The customer type (residential, commercial, society)
   * @returns {Object} - The offerings for the specified customer type
   */
  getOfferings(customerType) {
    const data = this.loadCompanyData();
    if (data && data.offerings && data.offerings[customerType]) {
      return data.offerings[customerType];
    }
    throw new Error(`Offerings for '${customerType}' not found in company data`);
  }

  /**
   * Get subsidy information for a specific customer type
   * @param {String} customerType - The customer type (residential, commercial)
   * @returns {Object} - The subsidy information for the specified customer type
   */
  getSubsidyInfo(customerType) {
    const data = this.loadCompanyData();
    if (data && data.subsidyInfo && data.subsidyInfo[customerType]) {
      return data.subsidyInfo[customerType];
    }
    throw new Error(`Subsidy information for '${customerType}' not found in company data`);
  }

  /**
   * Get ROI calculator data
   * @returns {Object} - The ROI calculator data
   */
  getROICalculatorData() {
    const data = this.loadCompanyData();
    if (data && data.roiCalculator) {
      return data.roiCalculator;
    }
    throw new Error('ROI calculator data not found in company data');
  }
}

module.exports = new ConfigService();