const BroilerGrowth = require('../models/BroilerGrowth');

/**
 * @desc    Get broiler growth data
 * @route   GET /api/broilers
 * @access  Private
 *
 * If batchId query param is provided, returns records for that batch sorted by week.
 * If no batchId, finds the most recent record to determine the latest batch,
 * then returns all records for that batch.
 */
const getBroilerGrowth = async (req, res, next) => {
  try {
    const { batchId } = req.query;

    let targetBatchId = batchId;

    if (!targetBatchId) {
      // Find the most recent record to determine the latest batch
      const mostRecent = await BroilerGrowth.findOne().sort({ createdAt: -1 });
      if (!mostRecent) {
        return res.status(200).json({ success: true, data: [] });
      }
      targetBatchId = mostRecent.batchId;
    }

    const records = await BroilerGrowth.find({ batchId: targetBatchId }).sort({ week: 1 });

    res.status(200).json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create broiler growth record
 * @route   POST /api/broilers
 * @access  Private
 *
 * Validates batchId (required string), week (required positive integer),
 * weight (required positive number). The compound unique index on
 * {batchId, week} handles duplicate prevention at the DB level.
 */
const createBroilerGrowth = async (req, res, next) => {
  try {
    const { batchId, week, weight } = req.body;

    const record = await BroilerGrowth.create({ batchId, week, weight });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    // Handle duplicate key error (same batchId + week)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A record for this batch and week already exists',
      });
    }
    next(err);
  }
};

module.exports = { getBroilerGrowth, createBroilerGrowth };
