import { useAssignmentStore } from '../store/assignmentStore';
import { useUiStore } from '../store/uiStore';
import { assignmentService } from '../services/assignmentService';

export function useAssignment() {
  const { setAssignments, assignments } = useAssignmentStore();
  const { showToast, setLoading } = useUiStore();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const list = await assignmentService.list();
      setAssignments(list);
    } catch (err) {
      showToast((err as Error).message || 'Failed to load assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      setLoading(true);
      await assignmentService.delete(id);
      setAssignments(assignments.filter((a) => a._id !== id));
      showToast('Assignment successfully deleted', 'success');
    } catch (err) {
      showToast((err as Error).message || 'Failed to delete assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAssignments,
    deleteAssignment,
  };
}
