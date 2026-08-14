const mongoose = require('mongoose');

const mortalitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    min: 1,
  },
  cause: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Mortality', mortalitySchema);
