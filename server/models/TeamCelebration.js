const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const achievementSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true
  },
  title: {
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
  }
});

const teamCelebrationSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    title: {
      type: String,
      default: 'Team Celebrations & Achievements'
    },
    subtitle: {
      type: String,
      default: 'At SS Tech, we believe in celebrating our successes, recognizing excellence, and building a strong team culture.'
    },
    backgroundImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80'
    }
  },

  // Team Culture Section
  teamCulture: {
    title: {
      type: String,
      default: 'Our Team Culture'
    },
    description: {
      type: String,
      default: 'At SS Tech, we foster a culture of innovation, collaboration, and celebration. We believe that recognizing achievements and creating opportunities for team bonding are essential for maintaining a motivated and engaged workforce.'
    },
    secondDescription: {
      type: String,
      default: 'Our regular team events, celebrations, and recognition programs help build camaraderie, boost morale, and create a positive work environment where everyone feels valued and appreciated.'
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80'
    },
    stats: {
      annualEvents: {
        type: String,
        default: '15+'
      },
      employeeSatisfaction: {
        type: String,
        default: '90%'
      },
      industryAwards: {
        type: String,
        default: '12+'
      }
    }
  },

  // Events Section
  eventsSection: {
    title: {
      type: String,
      default: 'Upcoming Team Events'
    },
    subtitle: {
      type: String,
      default: 'Join us for these exciting team events and celebrations. These gatherings are designed to recognize achievements, foster team bonding, and create memorable experiences.'
    },
    events: [eventSchema]
  },

  // Achievements Section
  achievementsSection: {
    title: {
      type: String,
      default: 'Our Achievements'
    },
    subtitle: {
      type: String,
      default: 'We take pride in the recognition our team has received for excellence in innovation, sustainability, and workplace culture.'
    },
    achievements: [achievementSchema]
  },

  // Join Team CTA Section
  joinTeamCTA: {
    title: {
      type: String,
      default: 'Join Our Award-Winning Team'
    },
    subtitle: {
      type: String,
      default: 'Be part of a culture that celebrates success, fosters innovation, and values every team member\'s contribution.'
    },
    buttonText: {
      type: String,
      default: 'View Open Positions'
    },
    buttonLink: {
      type: String,
      default: '/careers'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TeamCelebration', teamCelebrationSchema);