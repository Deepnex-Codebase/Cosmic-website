const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createDefaultUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmic_cms');
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: 'admin@cosmic.com' });
    
    if (existingUser) {
      console.log('Default admin user already exists');
      return;
    }

    // Create default admin user
    const defaultUser = new User({
      email: 'admin@cosmic.com',
      password: 'cosmic@123',
      role: 'admin',
      isActive: true
    });

    await defaultUser.save();
    console.log('Default admin user created successfully');
    console.log('Email: admin@cosmic.com');
    console.log('Password: cosmic@123');

  } catch (error) {
    console.error('Error creating default user:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

createDefaultUser();