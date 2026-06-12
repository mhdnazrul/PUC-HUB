import { body, validationResult } from 'express-validator';

export const cleanInput = (fields) => {
  return fields.map(field => body(field).trim().escape());
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
