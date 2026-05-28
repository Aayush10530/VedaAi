import 'dotenv/config';
import { env } from './config/env';
import { connectDB } from './config/db';
import { createApp } from './app';
import http from 'http';
import { initSocket } from './websocket/socket';
import { redis } from './config/redis';

async function main() {
  try {
    await connectDB();

    const app = createApp();
    const httpServer = http.createServer(app);

    const io = initSocket(httpServer);

    const subscriber = redis.duplicate();
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
