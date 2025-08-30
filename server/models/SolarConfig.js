const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const SolarConfigSchema = new mongoose.Schema({
  configType: {
    type: String,
    required: true,
    enum: ['companyProfile', 'solarConfig', 'solarBasic'],
    unique: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Initialize default configurations if they don't exist
SolarConfigSchema.statics.initializeDefaultConfigs = async function() {
  try {
    const companyProfilePath = path.join(__dirname, '../data/solar_company_profile.json');
    const solarConfigPath = path.join(__dirname, '../../cosmic-main/src/config/solarConfig.json');
    const solarBasicPath = path.join(__dirname, '../../cosmic-main/src/config/solar.json');
    
    // Read JSON files
    const companyProfileData = JSON.parse(fs.readFileSync(companyProfilePath, 'utf8'));
    const solarConfigData = JSON.parse(fs.readFileSync(solarConfigPath, 'utf8'));
    const solarBasicData = JSON.parse(fs.readFileSync(solarBasicPath, 'utf8'));
    
    // Check if configs exist, if not create them
    const configs = [
      { configType: 'companyProfile', data: companyProfileData },
      { configType: 'solarConfig', data: solarConfigData },
      { configType: 'solarBasic', data: solarBasicData }
    ];
    
    for (const config of configs) {
      const existingConfig = await this.findOne({ configType: config.configType });
      if (!existingConfig) {
        await this.create(config);
        console.log(`Default ${config.configType} configuration created`);
      }
    }
    
    console.log('All default configurations initialized');
  } catch (error) {
    console.error('Error initializing default configurations:', error);
  }
};

// Update JSON files when configurations are updated
SolarConfigSchema.statics.updateJsonFiles = async function(configType, data) {
  try {
    let filePath;
    
    switch (configType) {
      case 'companyProfile':
        filePath = path.join(__dirname, '../data/solar_company_profile.json');
        break;
      case 'solarConfig':
        filePath = path.join(__dirname, '../../cosmic-main/src/config/solarConfig.json');
        break;
      case 'solarBasic':
        filePath = path.join(__dirname, '../../cosmic-main/src/config/solar.json');
        break;
      default:
        throw new Error(`Invalid config type: ${configType}`);
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`${configType} JSON file updated successfully`);
    return true;
  } catch (error) {
    console.error(`Error updating ${configType} JSON file:`, error);
    throw error;
  }
};

module.exports = mongoose.model('SolarConfig', SolarConfigSchema);