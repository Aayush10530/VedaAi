import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { env } from '../config/env';

let io: Server;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('subscribe:job', ({ jobId }: { jobId: string }) => {
      socket.join(`job:${jobId}`);
      console.log(`[Socket] ${socket.id} subscribed to room: job:${jobId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket first.');
  }
  return io;
}
