const CookieConsent = require('../models/CookieConsent');

/**
 * Create or update a cookie consent record
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createOrUpdateConsent = async (req, res) => {
  try {
    const { consentChoice, cookieSettings } = req.body;
    
    // Validate required fields
    if (!consentChoice) {
      return res.status(400).json({
        success: false,
        message: 'Consent choice is required'
      });
    }
    
    // Get IP address from request
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Get user agent from request
    const userAgent = req.headers['user-agent'];
    
    // Set expiry date to 1 month from now
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    // Check if a consent record already exists for this IP
    let consent = await CookieConsent.findOne({ ipAddress });
    
    if (consent) {
      // Update existing record
      consent.consentChoice = consentChoice;
      consent.cookieSettings = cookieSettings || consent.cookieSettings;
      consent.userAgent = userAgent;
      consent.expiresAt = expiryDate;
      await consent.save();
    } else {
      // Create new record
      consent = await CookieConsent.create({
        consentChoice,
        cookieSettings: cookieSettings || {
          essential: true,
          analytics: consentChoice === 'accepted',
          marketing: consentChoice === 'accepted',
          preferences: consentChoice === 'accepted'
        },
        ipAddress,
        userAgent,
        expiresAt: expiryDate,
        userActivity: {
          pagesVisited: [],
          totalSessionDuration: 0,
          lastVisitedPage: req.headers.referer || '/'
        }
      });
    }
    
    return res.status(201).json({
      success: true,
      data: consent
    });
  } catch (error) {
    console.error('Error in createOrUpdateConsent controller:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error creating/updating consent record',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Track user activity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.trackUserActivity = async (req, res) => {
  try {
    const { page, duration } = req.body;
    
    // Validate required fields
    if (!page) {
      return res.status(400).json({
        success: false,
        message: 'Page is required'
      });
    }
    
    // Get IP address from request
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Find consent record for this IP
    const consent = await CookieConsent.findOne({ ipAddress });
    
    if (!consent) {
      return res.status(404).json({
        success: false,
        message: 'No consent record found for this user'
      });
    }
    
    // Add page visit to user activity
    consent.userActivity.pagesVisited.push({
      page,
      timestamp: new Date(),
      duration: duration || 0
    });
    
    // Update last visited page
    consent.userActivity.lastVisitedPage = page;
    
    // Update total session duration
    if (duration) {
      consent.userActivity.totalSessionDuration += duration;
    }
    
    await consent.save();
    
    return res.status(200).json({
      success: true,
      message: 'User activity tracked successfully'
    });
  } catch (error) {
    console.error('Error in trackUserActivity controller:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error tracking user activity',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get all consent records (for CMS)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllConsents = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Sorting parameters
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Filtering parameters
    const filter = {};
    if (req.query.consentChoice) {
      filter.consentChoice = req.query.consentChoice;
    }
    
    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    // Get total count for pagination
    const total = await CookieConsent.countDocuments(filter);
    
    // Get consent records
    const consents = await CookieConsent.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    
    // If not admin, return limited data
    if (!req.isAdmin) {
      // Return only aggregated stats for non-admins
      const acceptedCount = await CookieConsent.countDocuments({
        ...filter,
        consentChoice: 'accepted'
      });
      
      const declinedCount = await CookieConsent.countDocuments({
        ...filter,
        consentChoice: 'declined'
      });
      
      const customizedCount = await CookieConsent.countDocuments({
        ...filter,
        consentChoice: 'customized'
      });
      
      return res.status(200).json({
        success: true,
        message: 'Limited access: Only summary data available',
        data: {
          total,
          consentChoices: {
            accepted: acceptedCount,
            declined: declinedCount,
            customized: customizedCount
          }
        }
      });
    }
    
    // Full data for admins
    return res.status(200).json({
      success: true,
      count: consents.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: consents
    });
  } catch (error) {
    console.error('Error in getAllConsents controller:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error retrieving consent records',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get consent record by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getConsentById = async (req, res) => {
  try {
    const consent = await CookieConsent.findById(req.params.id);
    
    if (!consent) {
      return res.status(404).json({
        success: false,
        message: 'Consent record not found'
      });
    }
    
    // If not admin, return limited data
    if (!req.isAdmin) {
      // Return only basic consent info for non-admins
      return res.status(200).json({
        success: true,
        message: 'Limited access: Only basic consent data available',
        data: {
          id: consent._id,
          consentChoice: consent.consentChoice,
          cookieSettings: consent.cookieSettings,
          createdAt: consent.createdAt,
          updatedAt: consent.updatedAt
        }
      });
    }
    
    // Full data for admins
    return res.status(200).json({
      success: true,
      data: consent
    });
  } catch (error) {
    console.error('Error in getConsentById controller:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error retrieving consent record',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Delete consent record by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteConsent = async (req, res) => {
  try {
    const consent = await CookieConsent.findByIdAndDelete(req.params.id);
    
    if (!consent) {
      return res.status(404).json({
        success: false,
        message: 'Consent record not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Consent record deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteConsent controller:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error deleting consent record',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get consent statistics (for CMS dashboard)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getConsentStats = async (req, res) => {
  try {
    // Date range filtering
    const filter = {};
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    // Get total count
    const total = await CookieConsent.countDocuments(filter);
    
    // Get count by consent choice
    const acceptedCount = await CookieConsent.countDocuments({
      ...filter,
      consentChoice: 'accepted'
    });
    
    const declinedCount = await CookieConsent.countDocuments({
      ...filter,
      consentChoice: 'declined'
    });
    
    const customizedCount = await CookieConsent.countDocuments({
      ...filter,
      consentChoice: 'customized'
    });
    
    // Basic stats for both admin and non-admin users
    const basicStats = {
      total,
      consentChoices: {
        accepted: acceptedCount,
        declined: declinedCount,
        customized: customizedCount
      }
    };
    
    // If not admin, return limited data
    if (!req.isAdmin) {
      return res.status(200).json({
        success: true,
        message: 'Limited access: Only basic statistics available',
        data: basicStats
      });
    }
    
    // Additional detailed stats for admins only
    // Get count by cookie settings
    const analyticsCount = await CookieConsent.countDocuments({
      ...filter,
      'cookieSettings.analytics': true
    });
    
    const marketingCount = await CookieConsent.countDocuments({
      ...filter,
      'cookieSettings.marketing': true
    });
    
    const preferencesCount = await CookieConsent.countDocuments({
      ...filter,
      'cookieSettings.preferences': true
    });
    
    // Get most visited pages
    const mostVisitedPages = await CookieConsent.aggregate([
      { $match: filter },
      { $unwind: '$userActivity.pagesVisited' },
      { $group: {
        _id: '$userActivity.pagesVisited.page',
        count: { $sum: 1 },
        totalDuration: { $sum: '$userActivity.pagesVisited.duration' }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get average session duration
    const avgSessionDuration = await CookieConsent.aggregate([
      { $match: filter },
      { $group: {
        _id: null,
        avgDuration: { $avg: '$userActivity.totalSessionDuration' }
      }}
    ]);
    
    // Full data for admins
    return res.status(200).json({
      success: true,
      data: {
        ...basicStats,
        cookieSettings: {
          analytics: analyticsCount,
          marketing: marketingCount,
          preferences: preferencesCount
        },
        mostVisitedPages,
        avgSessionDuration: avgSessionDuration.length > 0 ? avgSessionDuration[0].avgDuration : 0
      }
    });
  } catch (error) {
    console.error('Error in getConsentStats controller:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error retrieving consent statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};