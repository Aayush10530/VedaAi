'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AssignmentForm } from '../../../../components/assignment/form/AssignmentForm';
import { assignmentService } from '../../../../services/assignmentService';
import { useUiStore } from '../../../../store/uiStore';
import { Spinner } from '../../../../components/ui/Spinner';

export default function ConfigureAssignmentPage() {
  const { id } = useParams() as { id: string };
  const [initialData, setInitialData] = React.useState<any>(null);
  const { showToast } = useUiStore();
  
  useEffect(() => {
    assignmentService.get(id)
      .then(setInitialData)
      .catch(() => showToast('Failed to load assignment data', 'error'));
  }, [id, showToast]);

  if (!initialData) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-140px)]">
        <Spinner size="lg" />
      </div>
    );
  }

  return <AssignmentForm initialData={initialData} isUpdate={true} />;
}
