const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getMortality,
  createMortality,
} = require('../controllers/mortalityController');

const router = express.Router();

// GET /api/mortality - Get mortality records aggregated by week (auth protected)
router.get('/', protect, getMortality);

// POST /api/mortality - Create mortality record (auth protected, validated)
router.post(
  '/',
  protect,
  [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('count')
      .isInt({ min: 1 })
      .withMessage('Count must be a positive integer'),
    body('cause').optional(),
  ],
  validate,
  createMortality
);

module.exports = router;
