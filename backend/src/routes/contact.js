const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { submitContact, getAllContacts, markAsRead } = require('../controllers/contactController');

const router = express.Router();

// POST /api/contact - Submit contact form (public)
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  submitContact
);

// GET /api/contact - Get all submissions (auth protected)
router.get('/', protect, getAllContacts);

// PATCH /api/contact/:id/read - Mark as read (auth protected)
router.patch('/:id/read', protect, markAsRead);

module.exports = router;
