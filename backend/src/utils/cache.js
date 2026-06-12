import Redis from 'ioredis';
import { logger } from './logger.js';

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false // Prevent blocking memory during outages
  });

  redisClient.on('error', (err) => {
    logger.error('Redis client connection error. Falling back to DB queries.', { error: err.message });
  });
}

export const cacheGet = async (key) => {
  if (!redisClient) return null;
  try {
    return await redisClient.get(key);
  } catch (err) {
    return null;
  }
};

export const cacheSet = async (key, value, ttlSeconds = 3600) => {
  if (!redisClient) return;
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    // Fail silently
  }
};
