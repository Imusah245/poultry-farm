const Mortality = require('../models/Mortality');

/**
 * @desc    Get mortality records aggregated by week.
 *          Supports optional startDate and endDate query params for date range filtering.
 * @route   GET /api/mortality
 * @access  Private
 */
const getMortality = async (req, res, next) => {
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
          _id: { $isoWeek: '$date' },
          year: { $first: { $isoWeekYear: '$date' } },
          totalCount: { $sum: '$count' },
          records: { $push: '$$ROOT' },
        },
      },
      { $sort: { year: 1, _id: 1 } }
    );

    const data = await Mortality.aggregate(pipeline);

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a mortality record.
 *          Validates date, count (positive integer), and optional cause.
 * @route   POST /api/mortality
 * @access  Private
 */
const createMortality = async (req, res, next) => {
  try {
    const { date, count, cause } = req.body;

    const recordData = {
      date: new Date(date),
      count,
    };

    if (cause) {
      recordData.cause = cause;
    }

    const record = await Mortality.create(recordData);

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMortality, createMortality };
