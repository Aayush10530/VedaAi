import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { routes } from './routes';

export function createApp(): express.Application {
  const app = express();

  app.use(cors({
    origin: env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/uploads', express.static(env.UPLOAD_DIR));
  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
