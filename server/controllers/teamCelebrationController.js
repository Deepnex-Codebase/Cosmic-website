const TeamCelebration = require('../models/TeamCelebration');
const path = require('path');
const fs = require('fs');

// Get team celebration data
const getTeamCelebration = async (req, res) => {
  try {
    let teamCelebration = await TeamCelebration.findOne();
    
    // If no data exists, create default data
    if (!teamCelebration) {
      teamCelebration = new TeamCelebration({
        eventsSection: {
          events: [
            {
              title: "Annual Team Retreat 2025",
              date: "15-18 March 2025",
              location: "Himalayan Eco Resort, Shimla",
              image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
              description: "Our annual team retreat combines strategic planning with team-building activities in the beautiful Himalayan mountains. Join us for workshops, adventure activities, and celebration of our achievements."
            },
            {
              title: "Quarterly Awards Ceremony",
              date: "30 April 2025",
              location: "SS Tech Headquarters, Mumbai",
              image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
              description: "Recognizing excellence across all departments with our quarterly awards ceremony. Categories include Innovation Champion, Customer Service Star, and Sustainability Leader."
            },
            {
              title: "Green Energy Hackathon",
              date: "12-13 May 2025",
              location: "Tech Innovation Hub, Bangalore",
              image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
              description: "A 48-hour hackathon where our teams collaborate to develop innovative solar energy solutions. Past winners have seen their ideas implemented in our product roadmap."
            },
            {
              title: "Company Foundation Day",
              date: "5 June 2025",
              location: "Grand Hyatt, Delhi",
              image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
              description: "Celebrating another year of growth and success with all employees and their families. The event includes dinner, entertainment, and special recognition for long-serving team members."
            }
          ]
        },
        achievementsSection: {
          achievements: [
            {
              year: "2024",
              title: "Renewable Energy Excellence Award",
              organization: "Indian Green Energy Association",
              description: "Recognized for outstanding contribution to renewable energy adoption in India."
            },
            {
              year: "2023",
              title: "Best Place to Work",
              organization: "National HR Excellence Forum",
              description: "Ranked among top 10 companies for employee satisfaction and workplace culture."
            },
            {
              year: "2022",
              title: "Innovation in Solar Technology",
              organization: "Tech Innovators Summit",
              description: "Award for our proprietary solar panel efficiency enhancement technology."
            },
            {
              year: "2021",
              title: "Sustainability Champion",
              organization: "Environmental Action Coalition",
              description: "Recognized for carbon footprint reduction initiatives and sustainable business practices."
            }
          ]
        }
      });
      await teamCelebration.save();
    }
    
    res.json(teamCelebration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update team celebration data
const updateTeamCelebration = async (req, res) => {
  try {
    let teamCelebration = await TeamCelebration.findOne();
    
    if (!teamCelebration) {
      teamCelebration = new TeamCelebration(req.body);
    } else {
      // Update the existing document
      Object.assign(teamCelebration, req.body);
    }
    
    await teamCelebration.save();
    res.json(teamCelebration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload image for team celebration
const uploadTeamCelebrationImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/team-celebration/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTeamCelebration,
  updateTeamCelebration,
  uploadTeamCelebrationImage
};