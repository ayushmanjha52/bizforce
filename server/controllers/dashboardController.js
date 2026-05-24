const Lead = require('../models/Lead.js');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
  try {
    // Agar database connect nahi hai toh dummy data bhejo
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        totalLeads: 12,
        averageAIScore: 68,
        leadsByStatus: {
          New: 5,
          Contacted: 3,
          Qualified: 2,
          Proposal: 1,
          Closed: 1
        },
        highValueLeads: 4,
        message: "Testing Mode - Dummy Data"
      });
    }

    // Real Database Stats
    const totalLeads = await Lead.countDocuments();

    const avgScoreResult = await Lead.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$aiScore" } } }
    ]);
    const averageAIScore = avgScoreResult[0]?.avgScore || 0;

    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const highValueLeads = await Lead.countDocuments({ dealValue: { $gt: 500000 } });

    // Convert array to object
    const statusCount = {};
    leadsByStatus.forEach(item => {
      statusCount[item._id] = item.count;
    });

    res.json({
      totalLeads,
      averageAIScore: Math.round(averageAIScore),
      leadsByStatus: statusCount,
      highValueLeads
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
  }
};