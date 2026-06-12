import express from 'express';
import client from 'prom-client';

const router = express.Router();

// Initialize default system metrics (CPU, Memory, etc.)
client.collectDefaultMetrics();

// Define custom API request metrics
export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests processed',
  labelNames: ['method', 'route', 'status']
});

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});

// Middleware to capture metrics
export const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const seconds = duration[0] + duration[1] / 1e9;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestsTotal.inc({ method: req.method, route, status: res.statusCode });
    httpRequestDuration.observe({ method: req.method, route, status: res.statusCode }, seconds);
  });
  next();
};

router.get('/metrics', async (req, res) => {
  if (req.headers['x-metrics-token'] !== process.env.METRICS_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.setHeader('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

export default router;
