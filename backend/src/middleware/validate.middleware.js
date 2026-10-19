/**
 * Generic Reusable Input Validation Middleware
 */
const ApiError = require('../utils/apiError');

/**
 * Validates request data against defined schema rules.
 *
 * @param {Object} schema - Field rules:
 * {
 *   email: { required: true, isEmail: true },
 *   password: { required: true, minLength: 6 }
 * }
 * @param {'body'|'query'|'params'} [source='body'] - The property on `req` to validate
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source] || {};
    const errors = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      const fieldLabel = rules.label || field;

      // 1. Required check
      if (rules.required) {
        if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
          errors[field] = `${fieldLabel} is required`;
          continue;
        }
      }

      // If value is not provided and not required, skip other checks
      if (value === undefined || value === null || value === '') {
        continue;
      }

      // 2. Type checks
      if (rules.type && typeof value !== rules.type) {
        errors[field] = `${fieldLabel} must be of type ${rules.type}`;
        continue;
      }

      // 3. String minLength & maxLength
      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors[field] = `${fieldLabel} must be at least ${rules.minLength} characters`;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors[field] = `${fieldLabel} cannot exceed ${rules.maxLength} characters`;
        }
      }

      // 4. Number min & max
      if (typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors[field] = `${fieldLabel} must be at least ${rules.min}`;
        }
        if (rules.max !== undefined && value > rules.max) {
          errors[field] = `${fieldLabel} cannot exceed ${rules.max}`;
        }
      }

      // 5. Email format check
      if (rules.isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field] = `${fieldLabel} must be a valid email address`;
        }
      }

      // 6. Enum whitelist check
      if (rules.enum && Array.isArray(rules.enum)) {
        if (!rules.enum.includes(value)) {
          errors[field] = `${fieldLabel} must be one of: [${rules.enum.join(', ')}]`;
        }
      }

      // 7. Custom validator function: (value, req) => string | boolean
      if (typeof rules.custom === 'function') {
        const customResult = rules.custom(value, req);
        if (customResult !== true && typeof customResult === 'string') {
          errors[field] = customResult;
        } else if (customResult === false) {
          errors[field] = `${fieldLabel} failed validation`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throw ApiError.validation(errors, 'Validation error occurred');
    }

    next();
  };
};

module.exports = validate;
