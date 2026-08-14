const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getBroilerGrowth, createBroilerGrowth } = require('../controllers/broilerGrowthController');

const router = express.Router();

// GET /api/broilers - Get broiler growth data (auth protected)
router.get('/', protect, getBroilerGrowth);

// POST /api/broilers - Create broiler growth record (auth protected, validated)
router.post(
  '/',
  protect,
  [
    body('batchId')
      .trim()
      .notEmpty()
      .withMessage('Batch ID is required'),
    body('week')
      .isInt({ min: 1 })
      .withMessage('Week must be a positive integer'),
    body('weight')
      .isFloat({ gt: 0 })
      .withMessage('Weight must be a positive number'),
  ],
  validate,
  createBroilerGrowth
);

module.exports = router;
