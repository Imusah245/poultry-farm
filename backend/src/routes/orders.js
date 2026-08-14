const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getAllOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/ordersController');

const router = express.Router();

// Validation rules for order creation
const createOrderValidation = [
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('productType')
    .isIn(['eggs', 'broilers'])
    .withMessage('Product type must be either eggs or broilers'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
];

// Validation rules for status update
const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, confirmed, processing, completed, cancelled'),
];

// GET /api/orders - Auth protected, get all orders (optional status filter)
router.get('/', protect, getAllOrders);

// POST /api/orders - Auth protected, create new order
router.post('/', protect, createOrderValidation, validate, createOrder);

// PATCH /api/orders/:id/status - Auth protected, update order status
router.patch('/:id/status', protect, updateStatusValidation, validate, updateOrderStatus);

module.exports = router;
