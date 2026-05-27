import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { generationQueue } from '../queues/generation.queue';
import { NotFoundError } from '../middleware/errorHandler';

export const jobsController = {
  getJobStatus: asyncHandler(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    
    const job = await generationQueue.getJob(jobId);
    if (!job) {
      throw new NotFoundError(`Job ${jobId} not found in queue`);
    }

    const state = await job.getState();
    const progress = job.progress;
    const failedReason = job.failedReason;

    res.status(200).json({
      success: true,
      data: {
        jobId: job.id,
        state,
        progress,
        failedReason,
        data: job.data,
        returnValue: job.returnvalue,
      },
    });
  }),
};
