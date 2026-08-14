const Contact = require('../models/Contact');

/**
 * @desc    Submit a contact form (public)
 * @route   POST /api/contact
 * @access  Public
 */
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all contact submissions (auth required)
 * @route   GET /api/contact
 * @access  Private
 */
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Mark a contact submission as read (auth required)
 * @route   PATCH /api/contact/:id/read
 * @access  Private
 */
const markAsRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContact, getAllContacts, markAsRead };
