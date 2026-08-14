const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getStats,
  createProduction,
  getProduction,
} = require('../controllers/dashboardController');

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

// GET /api/dashboard/stats - Get KPI stats with trends
router.get('/stats', getStats);

// POST /api/dashboard/production - Create a new production record
router.post(
  '/production',
  [
    body('date').isISO8601().withMessage('Valid ISO8601 date is required'),
    body('eggsProduced')
      .isInt({ min: 0 })
      .withMessage('eggsProduced must be a non-negative integer'),
    body('birdsAvailable')
      .isInt({ min: 0 })
      .withMessage('birdsAvailable must be a non-negative integer'),
    body('feedStockTonnes')
      .isFloat({ min: 0 })
      .withMessage('feedStockTonnes must be a non-negative number'),
  ],
  validate,
  createProduction
);

// GET /api/dashboard/production - Get production records (with optional date range)
router.get('/production', getProduction);

module.exports = router;
