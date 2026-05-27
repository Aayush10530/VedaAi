import { Router } from 'express';
import { jobsController } from '../controllers/jobs.controller';

export const jobsRouter = Router();

// GET /api/jobs/:jobId/status
jobsRouter.get('/:jobId/status', jobsController.getJobStatus);
