const EggProduction = require('../models/EggProduction');

/**
 * @desc    Get egg production records, sorted by date ascending.
 *          Supports optional startDate and endDate query params for date range filtering.
 * @route   GET /api/eggs
 * @access  Private
 */
const getEggProduction = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const records = await EggProduction.find(filter).sort({ date: 1 });
    res.json(records);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create or update an egg production record (upsert on date).
 *          Validates that count is a positive integer.
 * @route   POST /api/eggs
 * @access  Private
 */
const createEggProduction = async (req, res, next) => {
  try {
    const { date, count } = req.body;

    const recordDate = new Date(date);

    const existing = await EggProduction.findOneAndUpdate(
      { date: recordDate },
      { count, updatedAt: new Date() },
      { new: true }
    );

    if (existing) {
      return res.status(200).json(existing);
    }

    const record = await EggProduction.create({ date: recordDate, count });
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

module.exports = { getEggProduction, createEggProduction };
