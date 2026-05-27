import { create } from 'zustand';
import type { Assignment, QuestionPaper } from '@vedaai/shared';

interface AssignmentState {
  assignments: Assignment[];
  activeAssignment: Assignment | null;
  currentResult: QuestionPaper | null;
  setAssignments: (assignments: Assignment[]) => void;
  setActiveAssignment: (assignment: Assignment | null) => void;
  setCurrentResult: (result: QuestionPaper | null) => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  activeAssignment: null,
  currentResult: null,
  setAssignments: (assignments) => set({ assignments }),
  setActiveAssignment: (assignment) => set({ activeAssignment: assignment }),
  setCurrentResult: (result) => set({ currentResult: result }),
}));
