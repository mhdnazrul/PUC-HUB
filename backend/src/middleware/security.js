import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export const configureSecurity = (app) => {
  // Configures Helmet with customized CSP to protect API routes
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://*.supabase.co", "https://*.sentry.io"],
        upgradeInsecureRequests: []
      }
    }
  }));

  // Strict CORS policy matching Vercel domains
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://puc-hub.vercel.app',
    'http://localhost:5500',
    'http://localhost:3000'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
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
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error_code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests from this IP. Please try again later.'
  }
});
