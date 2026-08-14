const { body } = require('express-validator');

const validateDate = body('date')
  .isISO8601()
  .withMessage('Valid ISO8601 date is required');

const validatePositiveInt = (field) =>
  body(field)
    .isInt({ min: 1 })
    .withMessage(`${field} must be a positive integer`);

const validatePositiveNumber = (field) =>
  body(field)
    .isFloat({ min: 0.01 })
    .withMessage(`${field} must be a positive number`);

const validateEmail = body('email')
  .isEmail()
  .withMessage('Valid email is required');

module.exports = {
  validateDate,
  validatePositiveInt,
  validatePositiveNumber,
  validateEmail,
};
