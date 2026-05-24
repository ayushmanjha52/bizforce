const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET /api/team/leaderboard
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: 'deals',
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'deals'
        }
      },
      {
        $project: {
          name: 1,
          role: 1,
          dealsCount: { $size: '$deals' },
          revenue: { $sum: '$deals.value' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;