const mongoose = require('mongoose');

const broilerGrowthSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
  },
  week: {
    type: Number,
    required: true,
    min: 1,
  },
  weight: {
    type: Number,
    required: true,
    min: 0.01,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index: one weight record per batch per week
broilerGrowthSchema.index({ batchId: 1, week: 1 }, { unique: true });

module.exports = mongoose.model('BroilerGrowth', broilerGrowthSchema);
