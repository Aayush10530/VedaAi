import { Queue } from 'bullmq';
import { env } from '../config/env';

const redisUrl = new URL(env.REDIS_URL);

export const generationQueue = new Queue('generation', {
  connection: {
    host: redisUrl.hostname,
    port: Number(redisUrl.port) || 6379,
    username: redisUrl.username ? decodeURIComponent(redisUrl.username) : undefined,
    password: redisUrl.password ? decodeURIComponent(redisUrl.password) : undefined,
    maxRetriesPerRequest: null,
    keepAlive: 10000,
    ...(redisUrl.protocol === 'rediss:' ? { tls: {} } : {}),
  },
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export async function addGenerationJob(assignmentId: string): Promise<string> {
  const job = await generationQueue.add(
    'generate-questions',
    { assignmentId },
    { jobId: assignmentId }
  );
  return job.id!;
}
