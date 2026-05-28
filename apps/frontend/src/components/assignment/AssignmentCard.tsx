import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Calendar, Eye, Trash2, Loader2 } from 'lucide-react';
import type { Assignment } from '@vedaai/shared';
import { formatDate } from '../../lib/formatters';
import { useAssignment } from '../../hooks/useAssignment';
import { cn } from '../../lib/cn';
import { useAssignmentStore } from '../../store/assignmentStore';

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { deleteAssignment } = useAssignment();
  const { setActiveAssignment } = useAssignmentStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCardClick = () => {
    setActiveAssignment(assignment);
    if (assignment.status === 'complete') {
      router.push(`/assignments/${assignment._id}/result`);
    } else {
      router.push(`/assignments/${assignment._id}`);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    handleCardClick();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      await deleteAssignment(assignment._id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="glass-card-hover rounded-2xl p-5 relative border border-white/50 shadow-sm cursor-pointer group animate-fade-in-up"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-neutral-900 text-base truncate leading-snug group-hover:text-brand-orange transition-colors">
              {assignment.title}
            </h3>
            <span
              className={cn(
                'text-[9px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1 uppercase tracking-wider',
                {
                  'bg-orange-500/10 text-orange-650 border border-orange-500/20 shadow-inner': assignment.status === 'pending',
                  'bg-blue-500/10 text-blue-650 border border-blue-500/20 shadow-inner': assignment.status === 'generating',
                  'bg-emerald-500/10 text-emerald-650 border border-emerald-500/20 shadow-inner': assignment.status === 'complete',
                  'bg-red-500/10 text-red-650 border border-red-500/20 shadow-inner': assignment.status === 'failed',
                }
              )}
            >
              {assignment.status === 'generating' && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
              {assignment.status}
            </span>
          </div>
          <p className="text-xs text-neutral-450 font-bold">
            {assignment.subject} • Grade {assignment.grade}
          </p>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1.5 hover:bg-white/40 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 glass-panel rounded-xl shadow-xl py-1.5 z-20 min-w-[150px] border border-white/50 bg-white/90 backdrop-blur-md animate-scale-in">
              <button
                onClick={handleView}
                className="w-full flex items-center gap-2 text-left px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-white/60 transition-colors"
              >
                <Eye className="w-4 h-4 text-neutral-450" />
                View Details
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 text-left px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-red-50/50 border-t border-white/30 mt-1 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                Delete Paper
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-white/30">
        <span className="inline-flex items-center gap-1 font-semibold text-[10px]">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          <strong className="text-neutral-700 font-bold">Assigned</strong>: {formatDate(assignment.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-[10px]">
          <strong className="text-neutral-700 font-bold">Due</strong>: {formatDate(assignment.dueDate)}
        </span>
      </div>
    </div>
  );
}
