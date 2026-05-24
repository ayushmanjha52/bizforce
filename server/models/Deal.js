const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: false
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  stage: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Closed'],
    default: 'New'
  },
  value: {
    type: Number,
    default: 0
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);