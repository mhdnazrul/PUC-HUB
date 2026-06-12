import crypto from 'crypto';

// Generates a CSRF token and sets it as a client-readable cookie
export const setCsrfCookie = (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString('hex');
  
  res.cookie('csrf-token', csrfToken, {
    httpOnly: false, // Must be readable by client-side JS to send in X-CSRF-Token header
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  
  return csrfToken;
};

// Verifies double-submit cookie vs X-CSRF-Token header
export const verifyCsrfToken = (req, res, next) => {
  const skipMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (skipMethods.includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies['csrf-token'];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      error_code: 'CSRF_VALIDATION_FAILED',
      message: 'CSRF token mismatch or missing.'
    });
  }

  next();
};
