const CompanyStats = require('../models/CompanyStats');

// Get all company stats
const getCompanyStats = async (req, res) => {
  try {
    const stats = await CompanyStats.find({ isActive: true }).sort({ order: 1 });
    
    // If no stats exist, create default ones
    if (stats.length === 0) {
      const defaultStats = [
        {
          value: 30,
          label: 'Years of Experience',
          icon: 'FaUsers',
          color: '#9fc22f',
          suffix: '+',
          animationDelay: 0,
          order: 1
        },
        {
          value: 10000,
          label: 'Successful Projects',
          icon: 'FaProjectDiagram',
          color: 'rgb(28 155 231)',
          suffix: '+',
          animationDelay: 0.2,
          order: 2
        },
        {
          value: 2,
          label: 'Modules Shipped',
          icon: 'FaSolarPanel',
          color: '#9fc22f',
          suffix: 'M+',
          animationDelay: 0.4,
          order: 3
        },
        {
          value: 1.5,
          label: 'PV Modules Manufacturing Capacity',
          icon: 'FaBolt',
          color: 'rgb(28 155 231)',
          suffix: 'GW',
          description: '+2.5 GW Under Development',
          animationDelay: 0.6,
          order: 4
        }
      ];
      
      await CompanyStats.insertMany(defaultStats);
      return res.json(defaultStats);
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching company stats:', error);
    res.status(500).json({ message: 'Error fetching company stats', error: error.message });
  }
};

// Get single company stat
const getCompanyStatById = async (req, res) => {
  try {
    const stat = await CompanyStats.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Company stat not found' });
    }
    res.json(stat);
  } catch (error) {
    console.error('Error fetching company stat:', error);
    res.status(500).json({ message: 'Error fetching company stat', error: error.message });
  }
};

// Create new company stat
const createCompanyStat = async (req, res) => {
  try {
    const {
      value,
      label,
      icon,
      color,
      suffix,
      description,
      animationDelay,
      order
    } = req.body;

    const newStat = new CompanyStats({
      value,
      label,
      icon,
      color,
      suffix,
      description,
      animationDelay,
      order
    });

    await newStat.save();
    res.status(201).json({ message: 'Company stat created successfully', stat: newStat });
  } catch (error) {
    console.error('Error creating company stat:', error);
    res.status(500).json({ message: 'Error creating company stat', error: error.message });
  }
};

// Update company stat
const updateCompanyStat = async (req, res) => {
  try {
    const {
      value,
      label,
      icon,
      color,
      suffix,
      description,
      animationDelay,
      order
    } = req.body;

    const stat = await CompanyStats.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Company stat not found' });
    }

    // Update fields
    if (value !== undefined) stat.value = value;
    if (label !== undefined) stat.label = label;
    if (icon !== undefined) stat.icon = icon;
    if (color !== undefined) stat.color = color;
    if (suffix !== undefined) stat.suffix = suffix;
    if (description !== undefined) stat.description = description;
    if (animationDelay !== undefined) stat.animationDelay = animationDelay;
    if (order !== undefined) stat.order = order;

    await stat.save();
    res.json({ message: 'Company stat updated successfully', stat });
  } catch (error) {
    console.error('Error updating company stat:', error);
    res.status(500).json({ message: 'Error updating company stat', error: error.message });
  }
};

// Delete company stat
const deleteCompanyStat = async (req, res) => {
  try {
    const stat = await CompanyStats.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Company stat not found' });
    }

    await CompanyStats.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company stat deleted successfully' });
  } catch (error) {
    console.error('Error deleting company stat:', error);
    res.status(500).json({ message: 'Error deleting company stat', error: error.message });
  }
};

// Reset to default stats
const resetCompanyStats = async (req, res) => {
  try {
    await CompanyStats.deleteMany({});
    
    const defaultStats = [
      {
        value: 30,
        label: 'Years of Experience',
        icon: 'FaUsers',
        color: '#9fc22f',
        suffix: '+',
        animationDelay: 0,
        order: 1
      },
      {
        value: 10000,
        label: 'Successful Projects',
        icon: 'FaProjectDiagram',
        color: 'rgb(28 155 231)',
        suffix: '+',
        animationDelay: 0.2,
        order: 2
      },
      {
        value: 2,
        label: 'Modules Shipped',
        icon: 'FaSolarPanel',
        color: '#9fc22f',
        suffix: 'M+',
        animationDelay: 0.4,
        order: 3
      },
      {
        value: 1.5,
        label: 'PV Modules Manufacturing Capacity',
        icon: 'FaBolt',
        color: 'rgb(28 155 231)',
        suffix: 'GW',
        description: '+2.5 GW Under Development',
        animationDelay: 0.6,
        order: 4
      }
    ];
    
    await CompanyStats.insertMany(defaultStats);
    res.json({ message: 'Company stats reset to default', stats: defaultStats });
  } catch (error) {
    console.error('Error resetting company stats:', error);
    res.status(500).json({ message: 'Error resetting company stats', error: error.message });
  }
};

module.exports = {
  getCompanyStats,
  getCompanyStatById,
  createCompanyStat,
  updateCompanyStat,
  deleteCompanyStat,
  resetCompanyStats
};