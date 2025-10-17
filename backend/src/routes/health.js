const express = require('express');
const router = express.Router();
const { getRedisClient } = require('../db/redis');
const { getDbPool } = require('../db/postgres');

router.get('/', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      api: 'up',
      redis: 'unknown',
      database: 'unknown'
    }
  };

  try {
    const redis = getRedisClient();
    await redis.ping();
    health.services.redis = 'up';
  } catch (error) {
    health.services.redis = 'down';
    health.status = 'degraded';
    console.error('Redis health check failed:', error.message);
  }

  try {
    const pool = getDbPool();
    await pool.query('SELECT 1');
    health.services.database = 'up';
  } catch (error) {
    health.services.database = 'down';
    health.status = 'degraded';
    console.error('Database health check failed:', error.message);
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

module.exports = router;