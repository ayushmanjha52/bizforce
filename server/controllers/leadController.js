const Lead = require('../models/Lead.js');
const Deal = require('../models/Deal.js');

// Improved AI Lead Scoring
const calculateAIScore = (lead) => {
  let score = 0;

  // Source Weight (Max 30)
  const sourceMap = {
    'Referral': 30,
    'Inbound': 20,
    'LinkedIn': 15,
    'Website': 10,
    'Cold Call': 5,
    'Other': 5
  };
  score += sourceMap[lead.source] || 5;

  // Deal Value Weight (Max 25)
  if (lead.dealValue > 500000) score += 25;
  else if (lead.dealValue > 200000) score += 15;
  else score += 5;

  // Status Weight (Max 25)
  const statusMap = {
    'Qualified': 25,
    'Contacted': 15,
    'New': 10,
    'Proposal': 20,
    'Closed': 5
  };
  score += statusMap[lead.status] || 5;

  // Activity Count Weight (Max 20)
  if (lead.activityCount >= 8) score += 20;
  else if (lead.activityCount >= 4) score += 12;
  else if (lead.activityCount >= 1) score += 6;

  return Math.min(Math.max(score, 0), 100); // Clamp between 0-100
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      createdBy: req.user.id,
      aiScore: calculateAIScore(req.body)
    };

    const lead = await Lead.create(leadData);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ leads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        aiScore: calculateAIScore({ ...lead.toObject(), ...req.body })
      },
      { new: true }
    );

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.deleteOne();
    res.json({ message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  calculateAIScore
};