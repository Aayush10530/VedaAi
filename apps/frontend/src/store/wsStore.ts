import { create } from 'zustand';

interface JobProgress {
  percent: number;
  step: string;
}

interface WsState {
  connected: boolean;
  activeJobId: string | null;
  jobStatus: 'pending' | 'generating' | 'complete' | 'failed' | null;
  jobProgress: JobProgress | null;
  setConnected: (connected: boolean) => void;
  setActiveJobId: (jobId: string | null) => void;
  setJobStatus: (status: 'pending' | 'generating' | 'complete' | 'failed' | null) => void;
  setJobProgress: (progress: JobProgress | null) => void;
  resetJobState: () => void;
}

export const useWsStore = create<WsState>((set) => ({
  connected: false,
  activeJobId: null,
  jobStatus: null,
  jobProgress: null,
  setConnected: (connected) => set({ connected }),
  setActiveJobId: (jobId) => set({ activeJobId: jobId }),
  setJobStatus: (status) => set({ jobStatus: status }),
  setJobProgress: (progress) => set({ jobProgress: progress }),
  resetJobState: () => set({ activeJobId: null, jobStatus: null, jobProgress: null }),
}));
