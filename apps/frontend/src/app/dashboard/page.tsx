'use client';

import React, { useEffect } from 'react';
import { useAssignmentStore } from '../../store/assignmentStore';
import { useUiStore } from '../../store/uiStore';
import { useAssignment } from '../../hooks/useAssignment';
import { EmptyState } from '../../components/assignment/EmptyState';
import { AssignmentGrid } from '../../components/assignment/AssignmentGrid';
import { Spinner } from '../../components/ui/Spinner';

export default function DashboardPage() {
  const { fetchAssignments } = useAssignment();
  const assignments = useAssignmentStore((state) => state.assignments);
  const isLoading = useUiStore((state) => state.isLoading);

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (isLoading && assignments.length === 0) {
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
