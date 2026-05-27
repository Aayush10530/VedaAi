import { redis } from '../config/redis';

export async function emitJobProgress(
  jobId: string,
  step: string,
  percent: number
): Promise<void> {
  const payload = {
    type: 'progress',
    jobId,
    step,
    percent,
  };
  await redis.publish('job-events', JSON.stringify(payload));
}

export async function emitJobComplete(
  jobId: string,
  assignmentId: string
): Promise<void> {
  const payload = {
    type: 'complete',
    jobId,
    assignmentId,
  };
  await redis.publish('job-events', JSON.stringify(payload));
}

export async function emitJobFailed(
  jobId: string,
  error: string
): Promise<void> {
  const payload = {
    type: 'failed',
    jobId,
    error,
  };
  await redis.publish('job-events', JSON.stringify(payload));
}
