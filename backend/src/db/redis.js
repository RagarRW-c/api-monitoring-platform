const redis = require('redis');

let client = null;

async function initRedis() {
  if (client) {
    return client;
  }

  client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://redis:6379',
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('Too many Redis reconnection attempts');
          return new Error('Too many retries');
        }
        return retries * 100;
      }
    }
  });

  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  client.on('connect', () => {
    console.log('✅ Connected to Redis');
  });

  await client.connect();
  return client;
}

function getRedisClient() {
  if (!client) {
    throw new Error('Redis client not initialized. Call initRedis() first.');
  }
  return client;
}

// Initialize on module load
initRedis().catch(console.error);

module.exports = { initRedis, getRedisClient };