import express from 'express';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { configureSecurity, apiRateLimiter } from './middleware/security.js';
import { verifyCsrfToken, setCsrfCookie } from './middleware/csrf.js';
import { metricsMiddleware } from './routes/metrics.js';
import { requestTraceMiddleware } from './middleware/requestTrace.js';
import healthRouter from './routes/health.js';
import metricsRouter from './routes/metrics.js';
import authRouter from './routes/auth.js';
import googleAuthRouter from './routes/googleAuth.js';
import adminRouter from './routes/admin.js';
import { logger } from './utils/logger.js';
import db from './db.js';

dotenv.config();

// Fail fast in production if JWT_SECRET is not properly configured.
// A missing or weak secret allows attackers to forge arbitrary tokens.
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  logger.error('FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Initialize Sentry Observability
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
  });
}

// 2. Request Tracing and Body Parsers
app.use(requestTraceMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(metricsMiddleware);

// 3. Security Hardening
// NOTE: CORS must be registered before CSRF so that OPTIONS preflight requests
// receive the correct CORS headers and are not intercepted by the CSRF middleware.
configureSecurity(app); // registers helmet + cors

// 4. OpenAPI / Swagger Documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 5. Health Probes (no auth required — used by Render)
app.get('/liveness', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/readiness', async (_req, res) => {
  try {
    await db.raw('SELECT 1');
    res.status(200).send('OK');
  } catch {
    res.status(503).send('Service Unavailable');
  }
});

// 6. CSRF Handshake — MUST be registered BEFORE verifyCsrfToken middleware.
// This is the bootstrap endpoint: the client calls this first to receive a
// CSRF cookie. If verifyCsrfToken ran first, this request would always be
// rejected (chicken-and-egg problem).
app.get('/api/v1/csrf-token', (_req, res) => {
  const token = setCsrfCookie(_req, res);
  res.status(200).json({ success: true, csrfToken: token });
});

// 7. Apply CSRF verification to ALL subsequent state-changing routes (POST/PUT/DELETE/PATCH)
app.use(verifyCsrfToken);

// 8. Rate Limiting
app.use(apiRateLimiter);

// 9. Prometheus Metrics — Internal access only (restrict in Render via private network)
app.use('/', metricsRouter);

// 10. Application Routes
app.use('/api/v1', authRouter);
app.use('/api/v1', googleAuthRouter);
app.use('/api/v1', adminRouter);
app.use('/api/v1', healthRouter);

// 11. Sentry Error Handler (must be after routes)
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

// 12. Central Error Fallback Handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  logger.error('Unhandled error', { status, message: err.message, stack: err.stack });
  res.status(status).json({
    success: false,
    error_code: err.errorCode || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected server error occurred.'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`PUC HUB API running`, { port: PORT, env: process.env.NODE_ENV || 'development' });
});
