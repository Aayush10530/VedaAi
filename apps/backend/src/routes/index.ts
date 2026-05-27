import { Router } from 'express';
import mongoose from 'mongoose';
import { redis } from '../config/redis';
import { assignmentsRouter } from './assignments.route';
import { uploadRouter } from './upload.route';
import { jobsRouter } from './jobs.route';

export const routes = Router();

routes.get('/health', (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const redisStatus = redis.status === 'ready' ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      mongo: dbStatus,
      redis: redisStatus,
    },
  });
});

routes.use('/assignments', assignmentsRouter);
routes.use('/upload', uploadRouter);
routes.use('/jobs', jobsRouter);
