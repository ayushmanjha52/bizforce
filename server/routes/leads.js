const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createLead,
  getLeads,
  updateLead,
  deleteLead
} = require('../controllers/leadController');

// Protect all lead routes
router.use(protect);

router.post('/', createLead);
router.get('/', getLeads);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;