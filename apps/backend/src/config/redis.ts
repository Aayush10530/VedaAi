import Redis from 'ioredis';
import { env } from './env';

const redisUrl = new URL(env.REDIS_URL);

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  keepAlive: 10000,
  pingInterval: 30000, // Send a ping every 30 seconds
  ...(redisUrl.protocol === 'rediss:' ? { tls: {} } : {}),
});

redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message);
});