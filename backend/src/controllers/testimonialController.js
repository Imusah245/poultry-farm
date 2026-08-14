const Testimonial = require('../models/Testimonial');

/**
 * GET /api/testimonials
 * Public - Returns approved testimonials sorted by createdAt descending.
 */
const getApproved = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({
      createdAt: -1,
    });
    res.json(testimonials);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/testimonials
 * Auth protected - Creates a new testimonial.
 * Requires quote and author in request body.
 */
const createTestimonial = async (req, res, next) => {
  try {
    const { quote, author, role, initials, approved } = req.body;

    const testimonial = await Testimonial.create({
      quote,
      author,
      role,
      initials,
      approved: approved !== undefined ? approved : true,
    });

    res.status(201).json(testimonial);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/testimonials/:id
 * Auth protected - Updates an existing testimonial.
 */
const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quote, author, role, initials, approved } = req.body;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    if (quote !== undefined) testimonial.quote = quote;
    if (author !== undefined) testimonial.author = author;
    if (role !== undefined) testimonial.role = role;
    if (initials !== undefined) testimonial.initials = initials;
    if (approved !== undefined) testimonial.approved = approved;

    await testimonial.save();
    res.json(testimonial);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getApproved,
  createTestimonial,
  updateTestimonial,
};
