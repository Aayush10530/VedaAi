import Redis from 'ioredis';
import { env } from './env';

const redisUrl = new URL(env.REDIS_URL);

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  ...(redisUrl.protocol === 'rediss:' ? { tls: {} } : {}),
});