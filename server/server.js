require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const chatRoutes = require('./routes/chatRoutes');
const leadRoutes = require('./routes/leadRoutes');
const configRoutes = require('./routes/configRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const directorRoutes = require('./routes/directorRoutes');
const teamRoutes = require('./routes/teamRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const companyCultureRoutes = require('./routes/companyCultureRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const processRoutes = require('./routes/processRoutes');
const blogRoutes = require('./routes/blogRoutes');
const heroRoutes = require('./routes/heroRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const pressReleaseRoutes = require('./routes/pressReleaseRoutes');
const teamCelebrationRoutes = require('./routes/teamCelebrationRoutes');
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');
const panIndiaPresenceRoutes = require('./routes/panIndiaPresenceRoutes');
const companyIntroRoutes = require('./routes/companyIntroRoutes');
const videoHeroRoutes = require('./routes/videoHeroRoutes');
const timelineRoutes = require('./routes/timelineRoutes');
const heroSectionRoutes = require('./routes/heroSection');
const companyStatsRoutes = require('./routes/companyStats');
const greenFutureRoutes = require('./routes/greenFuture');
const newsCardsRoutes = require('./routes/newsCards');
const solarJourneyRoutes = require('./routes/solarJourneyRoutes');
const formConfigurationRoutes = require('./routes/formConfigurationRoutes');
const footerConfigurationRoutes = require('./routes/footerConfigurationRoutes');

const navbarConfigurationRoutes = require('./routes/navbarConfigurationRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Custom middleware for transforming image URLs
const transformImageUrls = require('./middleware/imageUrlMiddleware');
app.use(transformImageUrls);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set port
const PORT = process.env.PORT || 5000;


// Webhook route is now handled by whatsappRoutes
// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  // Main database connection
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Main MongoDB connected successfully'))
    .catch(err => {
      console.error('Main MongoDB connection error:', err);
      process.exit(1);
    });
    
  // CMS database connection
  const cmsConnection = mongoose.createConnection(process.env.MONGODB_URI_CMS || process.env.MONGODB_URI);
  cmsConnection
    .on('connected', () => console.log('CMS MongoDB connected successfully'))
    .on('error', (err) => console.error('CMS MongoDB connection error:', err));
    
  // Make CMS connection available globally
  mongoose.cmsConnection = cmsConnection;
}

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/lead', leadRoutes);
app.use('/api/config', configRoutes);
app.use('/webhook/whatsapp', whatsappRoutes);
app.use('/api/directors', directorRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cms/about', aboutRoutes);
app.use('/api/cms/company-culture', companyCultureRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/processes', processRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/heroes', heroRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/press-releases', pressReleaseRoutes);
app.use('/api/team-celebrations', teamCelebrationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/pan-india-presence', panIndiaPresenceRoutes);
app.use('/api/company-intro', companyIntroRoutes);
app.use('/api/cms/video-hero', videoHeroRoutes);
app.use('/api/cms/timeline', timelineRoutes);
app.use('/api/cms/hero-section', heroSectionRoutes);
app.use('/api/cms/company-stats', companyStatsRoutes);
app.use('/api/cms/green-future', greenFutureRoutes);
app.use('/api/cms/news-cards', newsCardsRoutes);
app.use('/api/cms/solar-journey', solarJourneyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/press-releases', pressReleaseRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/heroes', heroRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/team-celebration', teamCelebrationRoutes);
app.use('/api/form-config', formConfigurationRoutes);
app.use('/api/footer-config', footerConfigurationRoutes);

app.use('/api/navbar-config', navbarConfigurationRoutes);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes