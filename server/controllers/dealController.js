const Deal = require('../models/Deal.js');
const mongoose = require('mongoose');

// Create Deal
exports.createDeal = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        message: "Deal created successfully (Testing Mode)",
        deal: { ...req.body, _id: "test-deal-id" }
      });
    }

    const deal = new Deal(req.body);
    await deal.save();
    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ message: "Error creating deal", error: error.message });
  }
};

// Get All Deals
exports.getDeals = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ deals: [], message: "Testing Mode" });
    }
    const deals = await Deal.find().populate('lead', 'name company').sort({ createdAt: -1 });
    res.json({ deals });
  } catch (error) {
    res.status(500).json({ message: "Error fetching deals", error: error.message });
  }
};

// Update Deal Stage (Important for Kanban)
exports.updateDealStage = async (req, res) => {
  try {
    const { stage } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: "Stage updated (Testing Mode)", stage });
    }

    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { stage },
      { new: true }
    );

    if (!deal) return res.status(404).json({ message: "Deal not found" });

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: "Error updating deal stage", error: error.message });
  }
};

// Delete Deal
exports.deleteDeal = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: "Deal deleted (Testing Mode)" });
    }
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ message: "Deal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting deal", error: error.message });
  }
};