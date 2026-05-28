import React, { useEffect } from 'react';
import { useUiStore } from '../../store/uiStore';
import { cn } from '../../lib/cn';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export function Toast() {
  const { toast, hideToast } = useUiStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-neutral-100 bg-white p-4 shadow-lg animate-in slide-in-from-bottom-5">
      {toast.type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-red-500" />
      )}
      <span className="text-sm font-medium text-neutral-800">{toast.message}</span>
      <button
        onClick={hideToast}
        className="ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
