import { Queue } from 'bullmq';
import { redis } from '../config/redis';

export const generationQueue = new Queue('generation', {
  connection: redis as any,
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
