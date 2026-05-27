import { create } from 'zustand';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

interface UiState {
  toast: Toast | null;
  isLoading: boolean;
  showToast: (message: string, type?: 'success' | 'error') => void;
  hideToast: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  toast: null,
  isLoading: false,
  showToast: (message, type = 'success') => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
