import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWsStore } from '../../store/wsStore';
import { useUiStore } from '../../store/uiStore';
import { Spinner } from '../ui/Spinner';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { assignmentService } from '../../services/assignmentService';

interface GenerationProgressProps {
  assignmentId: string;
}

export function GenerationProgress({ assignmentId }: GenerationProgressProps) {
  const router = useRouter();
  const { jobStatus, jobProgress, setActiveJobId, setJobStatus, resetJobState } = useWsStore();
  const { showToast } = useUiStore();

  useEffect(() => {
    if (jobStatus === 'complete') {
      showToast('Assessment generated successfully!', 'success');
      resetJobState();
      router.push(`/assignments/${assignmentId}/result`);
    }
  }, [jobStatus, assignmentId, router, showToast, resetJobState]);

  const handleRetry = async () => {
    resetJobState();
    router.push(`/assignments/${assignmentId}/configure`);
  };

  const stepText = jobProgress?.step || 'Preparing assessment configuration...';
  const percent = jobProgress?.percent || 0;

  if (jobStatus === 'failed') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[calc(100vh-140px)]">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5 border border-red-100 shadow-xs">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Generation Failed</h2>
        <p className="text-xs text-neutral-500 max-w-sm mt-2 leading-relaxed">
          Something went wrong while generating the question paper. Please review your custom additional instructions or check your internet connection and try again.
        </p>
        <button
          onClick={handleRetry}
          className="mt-6 flex items-center gap-2 bg-neutral-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-800 hover:shadow-md transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4 animate-spin-once" />
          Regenerate Paper
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[calc(100vh-140px)] space-y-6">
      <div className="relative flex items-center justify-center w-24 h-24">
        <Spinner size="lg" className="border-brand-orange" />
        <div className="absolute w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center animate-pulse">
          <Sparkles className="w-6 h-6 text-brand-orange" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-base font-bold text-neutral-900 tracking-tight">Creating your assessment...</h2>
        <p className="text-xs text-neutral-400 font-medium tracking-wide">
          Llama 3.3 is currently generating custom sections, questions, and answers.
        </p>
      </div>

      <div className="w-80 space-y-2.5">
        <div className="w-full bg-neutral-300/60 h-2 rounded-full overflow-hidden shadow-2xs">
          <div
            className="bg-brand-orange h-full rounded-full transition-all duration-350"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold px-1 uppercase tracking-wider">
          <span className="truncate max-w-56 text-left">{stepText}</span>
          <span>{percent}%</span>
        </div>
      </div>
    </div>
  );
}
