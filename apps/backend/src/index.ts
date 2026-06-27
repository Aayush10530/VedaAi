process.on('uncaughtException', (err: NodeJS.ErrnoException) => {
  if (err.code === 'ECONNRESET' || err.code === 'EPIPE') return; // normal on Render
  console.error('[Process] Uncaught exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Process] Unhandled rejection:', reason);
});

import 'dotenv/config';
import { env } from './config/env';
import { connectDB } from './config/db';
import { createApp } from './app';
import http from 'http';
import { initSocket } from './websocket/socket';
import { redis } from './config/redis';
import './workers/generation.worker';

async function main() {
  try {
    await connectDB();

    const app = createApp();
    const httpServer = http.createServer(app);

    httpServer.on('clientError', (err: NodeJS.ErrnoException, socket) => {
      if (err.code === 'ECONNRESET' || err.code === 'EPIPE') {
        socket.destroy();
        return;
      }
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });

    const io = initSocket(httpServer);

    const subscriber = redis.duplicate();
    subscriber.on('error', (err) => {
      console.error('[Redis Subscriber] Error:', err.message);
    });
    await subscriber.subscribe('job-events');

    subscriber.on('message', (channel, message) => {
      if (channel === 'job-events') {
        try {
          const event = JSON.parse(message);
          const { type, jobId, ...payload } = event;
          io.to(`job:${jobId}`).emit(`job:${type}`, { jobId, ...payload });
        } catch (err) {
          console.error('[Socket Broadcast] Error parsing pub/sub message:', err);
        }
      }
    });

    httpServer.listen(env.PORT, () => {
      console.log(`[Server] Running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();