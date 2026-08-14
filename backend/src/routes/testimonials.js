const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getApproved,
  createTestimonial,
  updateTestimonial,
} = require('../controllers/testimonialController');

const router = express.Router();

// Validation rules for testimonial creation
const testimonialValidation = [
  body('quote').notEmpty().withMessage('Quote is required'),
  body('author').notEmpty().withMessage('Author is required'),
];

// GET /api/testimonials - Public, returns approved testimonials
router.get('/', getApproved);

// POST /api/testimonials - Auth protected, create new testimonial
router.post('/', protect, testimonialValidation, validate, createTestimonial);

// PUT /api/testimonials/:id - Auth protected, update existing testimonial
router.put('/:id', protect, updateTestimonial);

module.exports = router;
