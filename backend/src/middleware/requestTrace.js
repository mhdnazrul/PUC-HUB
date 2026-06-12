import { v4 as uuidv4 } from 'uuid';

export const requestTraceMiddleware = (req, res, next) => {
  const traceId = req.header('X-Request-ID') || uuidv4();
  req.traceId = traceId;
  res.setHeader('X-Request-ID', traceId);
  next();
};
