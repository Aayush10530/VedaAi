import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Download, Loader2 } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PaperPDF } from './PaperPDF';
import type { QuestionPaper } from '@vedaai/shared';
import { assignmentService } from '../../services/assignmentService';
import { useUiStore } from '../../store/uiStore';
import { useWsStore } from '../../store/wsStore';

interface PaperActionBarProps {
  paper: QuestionPaper;
}

export function PaperActionBar({ paper }: PaperActionBarProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { showToast, setLoading } = useUiStore();
  const { setActiveJobId, setJobStatus } = useWsStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRegenerate = async () => {
    router.push(`/assignments/${paper.assignmentId}/configure`);
  };

  return (
    <div className="flex items-center justify-end gap-3 max-w-2xl mx-auto pt-2 pb-12 px-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button
        onClick={handleRegenerate}
        className="flex items-center gap-2 border border-neutral-300 bg-white hover:bg-neutral-50 rounded-full px-5 py-2.5 text-xs font-bold text-neutral-700 transition-all active:scale-95 shadow-2xs"
      >
        <RefreshCw className="w-4 h-4 text-neutral-500" />
        Regenerate Paper
      </button>

      {isClient ? (
        <PDFDownloadLink
          document={<PaperPDF paper={paper} />}
          fileName={`${paper.schoolName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_exam.pdf`}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full px-5 py-2.5 text-xs font-bold transition-all active:scale-95 shadow-md hover:shadow-lg"
        >
          {((params: any) => {
            const loading = !!params?.loading;
            return (
              <>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-white" />
                    Download PDF
                  </>
                )}
              </>
            );
          }) as any}
        </PDFDownloadLink>
      ) : (
        <button
          disabled
          className="flex items-center gap-2 bg-neutral-900/50 text-white rounded-full px-5 py-2.5 text-xs font-bold shadow-md cursor-not-allowed"
        >
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          Loading...
        </button>
      )}
    </div>
  );
}
