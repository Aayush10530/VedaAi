import React, { useState } from 'react';
import type { QuestionPaper } from '@vedaai/shared';
import { AIContextBanner } from './AIContextBanner';
import { PaperDocument } from './PaperDocument';
import { PaperActionBar } from './PaperActionBar';
import { AiToolkitPanel } from '../ui/AiToolkitPanel';
import { useUiStore } from '../../store/uiStore';
import { useWsStore } from '../../store/wsStore';
import { assignmentService } from '../../services/assignmentService';
import { useRouter } from 'next/navigation';

interface QuestionPaperViewProps {
  paper: QuestionPaper;
  assignedBy: string;
}

export function QuestionPaperView({ paper, assignedBy }: QuestionPaperViewProps) {
  const router = useRouter();
  const [showAnswerKey, setShowAnswerKey] = useState(true);
  const { showToast, setLoading } = useUiStore();
  const { setActiveJobId, setJobStatus } = useWsStore();

  const handleRegenerateWithRules = async (rules: string) => {
    try {
      setLoading(true);
      const triggered = await assignmentService.generate(paper.assignmentId);
      
      setActiveJobId(triggered.jobId);
      setJobStatus('generating');
      
      showToast(`Regenerating with custom rules: "${rules}"`, 'success');
      router.push(`/assignments/${paper.assignmentId}`);
    } catch (err) {
      showToast((err as Error).message || 'Failed to trigger regeneration', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Output Paper */}
        <div className="lg:col-span-2 space-y-5">
          <AIContextBanner
            teacherName={assignedBy}
            subject={paper.subject}
            grade={paper.grade}
          />
          
          <PaperDocument paper={paper} showAnswerKey={showAnswerKey} />
          
          <PaperActionBar paper={paper} />
        </div>

        {/* Right Column: AI Toolkit */}
        <div className="lg:col-span-1">
          <AiToolkitPanel
            mode="result"
            onToggleAnswerKey={() => setShowAnswerKey(!showAnswerKey)}
            onRegenerateWithRules={handleRegenerateWithRules}
          />
        </div>
      </div>
    </div>
  );
}
