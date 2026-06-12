import { body, validationResult } from 'express-validator';

/**
 * Sanitize string fields — trim whitespace, but do NOT escape special characters.
 *
 * Why no .escape(): bcrypt hashes the raw password the user typed.
 * If we HTML-escape first (& → &amp;, etc.) the stored hash is for the ESCAPED
 * string. On the next login the raw string is compared → bcrypt mismatch → login
 * always fails for any password containing special characters. Trimming alone is
 * sufficient for our API since output is JSON, not HTML.
 */
export const cleanInput = (fields) => {
  return fields.map(field => body(field).trim());
};

export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error_code: 'VALIDATION_FAILED',
      errors: errors.array()
    });
  }
  next();
};
