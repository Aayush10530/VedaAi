'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAssignmentStore } from '../../../../store/assignmentStore';
import { useUiStore } from '../../../../store/uiStore';
import { assignmentService } from '../../../../services/assignmentService';
import { QuestionPaperView } from '../../../../components/paper/QuestionPaperView';
import { Spinner } from '../../../../components/ui/Spinner';

export default function AssignmentResultPage() {
  const { id } = useParams() as { id: string };
  const { currentResult, setCurrentResult, activeAssignment, setActiveAssignment } = useAssignmentStore();
  const { showToast } = useUiStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        
        const [assignmentData, resultData] = await Promise.all([
          assignmentService.get(id),
          assignmentService.getResult(id),
        ]);

        setActiveAssignment(assignmentData);
        setCurrentResult(resultData);
      } catch (err) {
        showToast((err as Error).message || 'Failed to load generated assessment', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 min-h-[calc(100vh-140px)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!currentResult) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[calc(100vh-140px)]">
        <p className="text-sm font-semibold text-neutral-500">Result Question Paper not available</p>
      </div>
    );
  }

  return (
    <QuestionPaperView
      paper={currentResult}
      assignedBy={activeAssignment?.assignedBy || 'Aayush'}
    />
  );
}
