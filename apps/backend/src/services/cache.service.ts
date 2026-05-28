import { redis } from '../config/redis';

/**
 * Type-safe central registry for Redis cache keys.
 * Standardizes key names across controllers, services, and workers to prevent spelling drift.
 */
export const CacheKeys = {
  /**
   * Scoped cache key for a teacher's list of assignments.
   * Format: `assignment:list:${userId}`
   */
  assignmentList: (userId: string) => `assignment:list:${userId}`,

  /**
   * Scoped cache key for a single assignment document.
   * Format: `assignment:${assignmentId}`
   */
  assignmentDetail: (id: string) => `assignment:${id}`,

  /**
   * Scoped cache key for a generated question paper result.
   * Format: `result:${assignmentId}`
   */
  assignmentResult: (id: string) => `result:${id}`,
};

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

  /**
   * Non-blocking cache invalidator that expels keys matching a wildcard pattern.
   * Upgraded from KEYS to O(1) SCAN steps to ensure Redis doesn't freeze under load.
   */
  async invalidatePattern(pattern: string): Promise<void> {
    let cursor = '0';
    do {
      const reply = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = reply[0];
      const keys = reply[1];
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  },
};
