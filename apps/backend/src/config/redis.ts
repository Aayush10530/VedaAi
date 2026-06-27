import Redis from 'ioredis';
import { env } from './env';

const redisUrl = new URL(env.REDIS_URL);

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  keepAlive: 10000,
  ...(redisUrl.protocol === 'rediss:' ? { tls: {} } : {}),
});

// Send a manual ping every 30 seconds to prevent cloud provider from dropping idle connections
setInterval(() => {
  if (redis.status === 'ready') {
    redis.ping().catch(() => {});
  }
}, 30000);

redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message);
});