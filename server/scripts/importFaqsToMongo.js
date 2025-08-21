/**
 * Script to import FAQs from solar_company_profile.json to MongoDB
 */
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmic')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import Faq model
const Faq = require('../models/Faq');

// Read FAQs from JSON file
const configPath = path.join(__dirname, '../data/solar_company_profile.json');
const rawData = fs.readFileSync(configPath, 'utf8');
const companyData = JSON.parse(rawData);
const faqs = companyData.faq || [];

async function importFaqs() {
  try {
    // Delete all existing FAQs
    await Faq.deleteMany({});
    console.log('Deleted existing FAQs');
    
    // Create new FAQs
    const faqPromises = faqs.map((faq, index) => {
      return new Faq({
        question: faq.question,
        answer: faq.answer,
        order: index,
        isActive: true
      }).save();
    });
    
    const savedFaqs = await Promise.all(faqPromises);
    console.log(`Successfully imported ${savedFaqs.length} FAQs to MongoDB`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error importing FAQs:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}

importFaqs();