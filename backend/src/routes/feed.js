const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getFeedConsumption,
  createFeedConsumption,
} = require('../controllers/feedController');

const router = express.Router();

// GET /api/feed - Get feed consumption records aggregated by day (auth protected)
router.get('/', protect, getFeedConsumption);

// POST /api/feed - Create feed consumption record (auth protected, validated)
router.post(
  '/',
  protect,
  [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),
    body('houseId')
      .notEmpty()
      .withMessage('House ID is required'),
  ],
  validate,
  createFeedConsumption
);

module.exports = router;
