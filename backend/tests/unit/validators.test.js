const { validationResult } = require('express-validator');
const {
  validateDate,
  validatePositiveInt,
  validatePositiveNumber,
  validateEmail,
} = require('../../src/utils/validators');

// Helper to run a validation chain against a mock request
const runValidation = async (validationChain, body) => {
  const req = { body };
  // express-validator expects req to have certain methods
  // We use the run() method available on validation chains
  await validationChain.run(req);
  return validationResult(req);
};

describe('validators', () => {
  describe('validateDate', () => {
    it('should pass for valid ISO8601 date', async () => {
      const result = await runValidation(validateDate, { date: '2024-01-15' });
      expect(result.isEmpty()).toBe(true);
    });

    it('should pass for full ISO8601 datetime', async () => {
      const result = await runValidation(validateDate, { date: '2024-01-15T10:30:00Z' });
      expect(result.isEmpty()).toBe(true);
    });

    it('should fail for invalid date string', async () => {
      const result = await runValidation(validateDate, { date: 'not-a-date' });
      expect(result.isEmpty()).toBe(false);
      expect(result.array()[0].msg).toBe('Valid ISO8601 date is required');
    });

    it('should fail for missing date', async () => {
      const result = await runValidation(validateDate, {});
      expect(result.isEmpty()).toBe(false);
    });
  });

  describe('validatePositiveInt', () => {
    it('should pass for positive integer', async () => {
      const validator = validatePositiveInt('count');
      const result = await runValidation(validator, { count: '5' });
      expect(result.isEmpty()).toBe(true);
    });

    it('should fail for zero', async () => {
      const validator = validatePositiveInt('count');
      const result = await runValidation(validator, { count: '0' });
      expect(result.isEmpty()).toBe(false);
      expect(result.array()[0].msg).toBe('count must be a positive integer');
    });

    it('should fail for negative integer', async () => {
      const validator = validatePositiveInt('count');
      const result = await runValidation(validator, { count: '-1' });
      expect(result.isEmpty()).toBe(false);
    });

    it('should fail for float', async () => {
      const validator = validatePositiveInt('count');
      const result = await runValidation(validator, { count: '1.5' });
      expect(result.isEmpty()).toBe(false);
    });
  });

  describe('validatePositiveNumber', () => {
    it('should pass for positive float', async () => {
      const validator = validatePositiveNumber('weight');
      const result = await runValidation(validator, { weight: '2.5' });
      expect(result.isEmpty()).toBe(true);
    });

    it('should pass for minimum value 0.01', async () => {
      const validator = validatePositiveNumber('weight');
      const result = await runValidation(validator, { weight: '0.01' });
      expect(result.isEmpty()).toBe(true);
    });

    it('should fail for zero', async () => {
      const validator = validatePositiveNumber('weight');
      const result = await runValidation(validator, { weight: '0' });
      expect(result.isEmpty()).toBe(false);
      expect(result.array()[0].msg).toBe('weight must be a positive number');
    });

    it('should fail for negative number', async () => {
      const validator = validatePositiveNumber('weight');
      const result = await runValidation(validator, { weight: '-1.5' });
      expect(result.isEmpty()).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should pass for valid email', async () => {
      const result = await runValidation(validateEmail, { email: 'test@example.com' });
      expect(result.isEmpty()).toBe(true);
    });

    it('should fail for invalid email', async () => {
      const result = await runValidation(validateEmail, { email: 'not-an-email' });
      expect(result.isEmpty()).toBe(false);
      expect(result.array()[0].msg).toBe('Valid email is required');
    });

    it('should fail for missing email', async () => {
      const result = await runValidation(validateEmail, {});
      expect(result.isEmpty()).toBe(false);
    });
  });
});
