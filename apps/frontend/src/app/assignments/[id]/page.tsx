'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAssignmentStore } from '../../../store/assignmentStore';
import { useUiStore } from '../../../store/uiStore';
import { useWsStore } from '../../../store/wsStore';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { assignmentService } from '../../../services/assignmentService';
import { GenerationProgress } from '../../../components/assignment/GenerationProgress';
import { Spinner } from '../../../components/ui/Spinner';

export default function AssignmentDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { subscribeToJob } = useWebSocket();
  const { activeAssignment, setActiveAssignment } = useAssignmentStore();
  const { setActiveJobId, setJobStatus } = useWsStore();
  const { showToast } = useUiStore();

  useEffect(() => {
    async function load() {
      try {
        const data = await assignmentService.get(id);
        setActiveAssignment(data);

        if (data.status === 'complete') {
          router.replace(`/assignments/${id}/result`);
        } else if (data.status === 'pending') {
          const triggered = await assignmentService.generate(id);
          setActiveJobId(triggered.jobId);
          setJobStatus('generating');
          subscribeToJob(triggered.jobId);
        } else if (data.status === 'generating' && data.jobId) {
          setActiveJobId(data.jobId);
          setJobStatus('generating');
          subscribeToJob(data.jobId);
        }
      } catch (err) {
        showToast((err as Error).message || 'Failed to sync assignment details', 'error');
      }
    }
    load();
  }, [id]);

  if (!activeAssignment) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 min-h-[calc(100vh-140px)]">
        <Spinner size="lg" />
      </div>
    );
  }

  return <GenerationProgress assignmentId={id} />;
}
