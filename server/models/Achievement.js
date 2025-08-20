const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    title: {
      type: String,
      default: 'Achievements & Awards'
    },
    subtitle: {
      type: String,
      default: ''
    },
    backgroundImage: {
      type: String,
      default: '/quality1.jpg'
    }
  },
  
  // Our Award-Winning Solar Solutions Section
  awardWinningSolutions: {
    title: {
      type: String,
      default: 'Our Award-Winning Solar Solutions'
    },
    description: {
      type: String,
      default: 'We take pride in our accomplishments and the recognition we\'ve received for our dedication to excellence in the solar energy industry.'
    },
    achievements: [{
      title: {
        type: String,
        required: true
      },
      year: {
        type: String,
        required: true
      },
      organization: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      order: {
        type: Number,
        default: 0
      }
    }]
  },
  
  // Our Certifications Section
  certifications: {
    title: {
      type: String,
      default: 'Our Certifications'
    },
    description: {
      type: String,
      default: 'We maintain the highest standards of quality and safety through these industry-recognized certifications.'
    },
    certificates: [{
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        default: 'shield'
      },
      order: {
        type: Number,
        default: 0
      }
    }]
  },
  
  // Industry Recognition Section
  industryRecognition: {
    title: {
      type: String,
      default: 'Industry Recognition'
    },
    description: {
      type: String,
      default: 'Our commitment to excellence has been recognized by leading organizations in the renewable energy sector.'
    },
    partners: [{
      name: {
        type: String,
        required: true
      },
      logo: {
        type: String,
        required: true
      },
      order: {
        type: Number,
        default: 0
      }
    }]
  },
  
  // Call to Action Section
  callToAction: {
    title: {
      type: String,
      default: 'Join Our Award-Winning Team'
    },
    description: {
      type: String,
      default: 'Experience the difference of working with an industry leader in solar energy solutions.'
    },
    primaryButtonText: {
      type: String,
      default: 'Contact Us Today'
    },
    primaryButtonLink: {
      type: String,
      default: '/contact'
    },
    secondaryButtonText: {
      type: String,
      default: 'Explore Our Services'
    },
    secondaryButtonLink: {
      type: String,
      default: '/services'
    }
  },
  
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
achievementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Achievement', achievementSchema);