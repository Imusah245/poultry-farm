const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getEggProduction,
  createEggProduction,
} = require('../controllers/eggProductionController');

const router = express.Router();

// GET /api/eggs - Get egg production records (auth protected)
router.get('/', protect, getEggProduction);

// POST /api/eggs - Create/update egg production record (auth protected, validated)
router.post(
  '/',
  protect,
  [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('count')
      .isInt({ min: 1 })
      .withMessage('Count must be a positive integer'),
  ],
  validate,
  createEggProduction
);

module.exports = router;
