const ProductionRecord = require('../models/ProductionRecord');
const Order = require('../models/Order');
const { calculateTrend } = require('../utils/trendCalculation');

/**
 * @desc    Get dashboard KPI stats with trends
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    // Get the two most recent production records for trend calculation
    const records = await ProductionRecord.find()
      .sort({ date: -1 })
      .limit(2);

    const current = records[0] || null;
    const previous = records[1] || null;

    // Calculate trends for each KPI
    const eggsTrend = current && previous
      ? calculateTrend(current.eggsProduced, previous.eggsProduced)
      : 0;

    const birdsTrend = current && previous
      ? calculateTrend(current.birdsAvailable, previous.birdsAvailable)
      : 0;

    const feedTrend = current && previous
      ? calculateTrend(current.feedStockTonnes, previous.feedStockTonnes)
      : 0;

    // Count pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      data: {
        eggsProduced: current ? current.eggsProduced : 0,
        birdsAvailable: current ? current.birdsAvailable : 0,
        feedStockTonnes: current ? current.feedStockTonnes : 0,
        pendingOrders,
        trends: {
          eggs: eggsTrend,
          birds: birdsTrend,
          feed: feedTrend,
        },
        lastUpdated: current ? current.date : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new production record
 * @route   POST /api/dashboard/production
 * @access  Private
 */
const createProduction = async (req, res, next) => {
  try {
    const { date, eggsProduced, birdsAvailable, feedStockTonnes } = req.body;

    const record = await ProductionRecord.create({
      date,
      eggsProduced,
      birdsAvailable,
      feedStockTonnes,
    });

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get production records with optional date range filter
 * @route   GET /api/dashboard/production
 * @access  Private
 */
const getProduction = async (req, res, next) => {
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

    const records = await ProductionRecord.find(filter).sort({ date: -1 });

    res.json({
      success: true,
      data: records,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, createProduction, getProduction };
