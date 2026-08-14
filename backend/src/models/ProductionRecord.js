const mongoose = require('mongoose');

const productionRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  eggsProduced: {
    type: Number,
    default: 0,
  },
  birdsAvailable: {
    type: Number,
    default: 0,
  },
  feedStockTonnes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ProductionRecord', productionRecordSchema);
