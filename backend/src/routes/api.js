const express = require('express');
const router = express.Router();
const { getRedisClient } = require('../db/redis');
const { getDbPool } = require('../db/postgres');

router.get('/status', async (req, res, next) => {
  try {
    const redis = getRedisClient();
    const status = await redis.get('app:status');
    
    if (!status) {
      const defaultStatus = {
        message: 'System operational',
        cached: false,
        timestamp: new Date().toISOString()
      };
      await redis.setEx('app:status', 300, JSON.stringify(defaultStatus));
      return res.json(defaultStatus);
    }

    const parsedStatus = JSON.parse(status);
    parsedStatus.cached = true;
    res.json(parsedStatus);
  } catch (error) {
    next(error);
  }
});

router.post('/status', async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }

    const redis = getRedisClient();
    const status = {
      message,
      cached: false,
      timestamp: new Date().toISOString()
    };
    
    await redis.setEx('app:status', 300, JSON.stringify(status));
    res.status(201).json(status);
  } catch (error) {
    next(error);
  }
});

router.post('/logs', async (req, res, next) => {
  try {
    const { level, message, metadata } = req.body;
    
    if (!level || !message) {
      return res.status(400).json({
        error: 'Level and message are required'
      });
    }

    const pool = getDbPool();
    const result = await pool.query(
      'INSERT INTO logs (level, message, metadata, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [level, message, JSON.stringify(metadata || {})]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get('/logs', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const pool = getDbPool();
    const result = await pool.query(
      'SELECT * FROM logs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      logs: result.rows,
      count: result.rowCount,
      limit,
      offset
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;