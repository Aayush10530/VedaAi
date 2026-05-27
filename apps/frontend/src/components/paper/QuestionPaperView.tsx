import React from 'react';
import type { QuestionPaper } from '@vedaai/shared';
import { AIContextBanner } from './AIContextBanner';
import { PaperDocument } from './PaperDocument';
import { PaperActionBar } from './PaperActionBar';

interface QuestionPaperViewProps {
  paper: QuestionPaper;
  assignedBy: string;
}

export function QuestionPaperView({ paper, assignedBy }: QuestionPaperViewProps) {
  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <AIContextBanner
        teacherName={assignedBy}
        subject={paper.subject}
        grade={paper.grade}
      />
      
      <PaperDocument paper={paper} />
      
      <PaperActionBar paper={paper} />
    </div>
  );
}
