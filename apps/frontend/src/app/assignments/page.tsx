'use client';

import React, { useEffect } from 'react';
import { useAssignmentStore } from '../../store/assignmentStore';
import { useUiStore } from '../../store/uiStore';
import { useAssignment } from '../../hooks/useAssignment';
import { EmptyState } from '../../components/assignment/EmptyState';
import { AssignmentGrid } from '../../components/assignment/AssignmentGrid';
import { Spinner } from '../../components/ui/Spinner';
import { useAuthStore } from '../../store/authStore';

export default function AssignmentsPage() {
  const { fetchAssignments } = useAssignment();
  const assignments = useAssignmentStore((state) => state.assignments);
  const isLoading = useUiStore((state) => state.isLoading);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    fetchAssignments();
  }, [hasHydrated]);

  if ((!hasHydrated || isLoading) && assignments.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 min-h-[calc(100vh-140px)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return <EmptyState />;
  }

  return <AssignmentGrid assignments={assignments} />;
}
