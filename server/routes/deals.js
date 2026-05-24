const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Deal = require('../models/Deal');

// Create Deal
router.post('/', protect, async (req, res) => {
  try {
    const { leadId, title, stage, value } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const deal = await Deal.create({
      leadId: leadId || null,
      title,
      stage: stage || 'New',
      value: value || 0,
      assignedTo: req.user.id,
      createdBy: req.user.id
    });

    res.status(201).json(deal);
  } catch (error) {
    console.error("Error creating deal:", error);
    res.status(500).json({ message: error.message || "Failed to create deal" });
  }
});

// Get all deals
router.get('/', protect, async (req, res) => {
  try {
    const deals = await Deal.find()
      .populate('leadId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ deals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update deal stage (Drag & Drop ke liye)
router.put('/:id/stage', protect, async (req, res) => {
  try {
    const { stage } = req.body;
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { stage },
      { new: true }
    );
    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;