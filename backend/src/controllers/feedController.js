const FeedConsumption = require('../models/FeedConsumption');

/**
 * @desc    Get feed consumption records aggregated by day (grouped by date, summed amounts).
 *          Supports optional startDate and endDate query params for date range filtering.
 * @route   GET /api/feed
 * @access  Private
 */
const getFeedConsumption = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const matchStage = {};

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) {
        matchStage.date.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.date.$lte = new Date(endDate);
      }
    }

    const pipeline = [];

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalAmount: { $sum: '$amount' },
          records: { $push: '$$ROOT' },
        },
      },
      { $sort: { _id: 1 } }
    );

    const data = await FeedConsumption.aggregate(pipeline);

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a feed consumption record.
 *          Validates date, amount (positive number), and houseId (required).
 * @route   POST /api/feed
 * @access  Private
 */
const createFeedConsumption = async (req, res, next) => {
  try {
    const { date, amount, houseId } = req.body;

    const record = await FeedConsumption.create({
      date: new Date(date),
      amount,
      houseId,
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFeedConsumption, createFeedConsumption };
