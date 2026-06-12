import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'puc-hub-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, traceId, ...meta }) => {
          const idStr = traceId ? ` [Trace-ID: ${traceId}]` : '';
          return `${timestamp} [${level}]${idStr}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
      )
    })
  ]
});
