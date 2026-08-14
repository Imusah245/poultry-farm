const Order = require('../models/Order');

/**
 * @desc    Get all orders, optionally filtered by status
 * @route   GET /api/orders
 * @access  Private
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res, next) => {
  try {
    const { customerName, customerPhone, customerEmail, productType, quantity } = req.body;

    const order = await Order.create({
      customerName,
      customerPhone,
      customerEmail,
      productType,
      quantity,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Private
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date() });
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllOrders, createOrder, updateOrderStatus };
