import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Ping PostgreSQL to confirm active connection
    await db.raw('SELECT 1');
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'online'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

export default router;
