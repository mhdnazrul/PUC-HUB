import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export const configureSecurity = (app) => {
  // Configures Helmet with customized CSP to protect API routes
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc:  ["'self'"],
        connectSrc: ["'self'", "https://*.supabase.co", "https://*.sentry.io"],
        upgradeInsecureRequests: []
      }
    }
  }));

  // Strict CORS policy — allow Vercel production URL + local dev origins.
  // FRONTEND_URL on Render must be set to https://puc-hub-ten.vercel.app
  const allowedOrigins = [
    process.env.FRONTEND_URL,          // set on Render: https://puc-hub-ten.vercel.app
    'https://puc-hub-ten.vercel.app',  // hard-coded fallback in case env var is missing
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3000'
  ].filter(Boolean); // remove undefined if FRONTEND_URL is not set

  app.use(cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no origin) and listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Blocked by CORS policy: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-XSRF-Token']
  }));
};

// Global rate limiting
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error_code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests from this IP. Please try again later.'
  }
});
