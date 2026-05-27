import { redis } from '../config/redis';

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};
