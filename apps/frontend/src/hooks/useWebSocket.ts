import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useWsStore } from '../store/wsStore';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { setConnected, setJobProgress, setJobStatus, activeJobId } = useWsStore();

  useEffect(() => {
    const wsURL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
    
    const socket = io(wsURL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      if (activeJobId) {
        socket.emit('subscribe:job', { jobId: activeJobId });
      }
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('job:progress', (data: { step: string; percent: number }) => {
      setJobProgress({ step: data.step, percent: data.percent });
      setJobStatus('generating');
    });

    socket.on('job:complete', () => {
      setJobStatus('complete');
      setJobProgress({ step: 'Done!', percent: 100 });
    });

    socket.on('job:failed', (data: { error: string }) => {
      setJobStatus('failed');
      setJobProgress({ step: `Failed: ${data.error}`, percent: 0 });
    });

    return () => {
      socket.disconnect();
    };
  }, [activeJobId, setConnected, setJobProgress, setJobStatus]);

  const subscribeToJob = (jobId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('subscribe:job', { jobId });
    }
  };

  return { subscribeToJob };
}
