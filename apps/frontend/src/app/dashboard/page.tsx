'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Users,
  BookOpen,
  FolderHeart,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAssignmentStore } from '../../store/assignmentStore';
import { useAssignment } from '../../hooks/useAssignment';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { EmptyState } from '../../components/assignment/EmptyState';
import { Spinner } from '../../components/ui/Spinner';

export default function DashboardPage() {
  const router = useRouter();
  const { fetchAssignments } = useAssignment();
  const assignments = useAssignmentStore((state) => state.assignments);
  const user = useAuthStore((state) => state.user);
  const isLoading = useUiStore((state) => state.isLoading);
  const { showToast } = useUiStore();

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (isLoading && assignments.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 min-h-[calc(100vh-140px)] bg-[#E8E8E8]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return <EmptyState />;
  }

  const totalAssignments = assignments.length;
  const completeAssignments = assignments.filter((a) => a.status === 'complete').length;
  const generatingAssignments = assignments.filter((a) => a.status === 'generating').length;

  const stats = [
    {
      label: 'Total Assignments',
      value: totalAssignments,
      icon: BookOpen,
      desc: `${completeAssignments} completed, ${generatingAssignments} active`,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Class Groups',
      value: 0,
      icon: Users,
      desc: 'No groups created yet',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Stored Templates',
      value: 0,
      icon: FolderHeart,
      desc: 'No templates stored yet',
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      label: 'Success Metrics',
      value: '--',
      icon: TrendingUp,
      desc: 'Awaiting grading submissions',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  const recentActivity = assignments.slice(0, 5).map((a) => {
    const isComplete = a.status === 'complete';
    const isFailed = a.status === 'failed';
    const isGenerating = a.status === 'generating';
    
    let text = `Created assessment "${a.title}"`;
    let icon = BookOpen;
    let color = 'text-indigo-500 bg-indigo-50';
    
    if (isComplete) {
      text = `AI generated "${a.title}" successfully`;
      icon = CheckCircle2;
      color = 'text-emerald-500 bg-emerald-50';
    } else if (isFailed) {
      text = `AI generation of "${a.title}" failed`;
      icon = AlertCircle;
      color = 'text-red-500 bg-red-50';
    } else if (isGenerating) {
      text = `AI is generating "${a.title}"...`;
      icon = Clock;
      color = 'text-amber-500 bg-amber-50';
    }
    
    const timeAgo = a.createdAt 
      ? new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      : 'Recently';
      
    return {
      type: a.status,
      text,
      time: timeAgo,
      icon,
      color,
    };
  });

  const upcomingExams = assignments
    .filter((a) => {
      if (!a.dueDate) return false;
      const due = new Date(a.dueDate).getTime();
      return due > Date.now();
    })
    .slice(0, 3)
    .map((a) => {
      const due = new Date(a.dueDate);
      const timeDiff = due.getTime() - Date.now();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const dateText = daysDiff === 1 ? 'Due tomorrow' : `Due in ${daysDiff} days`;
      
      const totalMarks = a.questionConfig?.reduce((acc, q) => acc + (q.count * q.marksEach), 0) || 0;
      
      return {
        title: a.title,
        class: `${a.grade} (${a.subject})`,
        date: dateText,
        marks: `${totalMarks} Marks`,
      };
    });

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-brand-dark rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-48 sm:h-40">
        <div className="absolute right-4 bottom-0 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-white" />
        </div>
        <div className="space-y-1 z-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">School Admin Portal</span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Welcome back, {user?.name || 'Guest Teacher'}!</h2>
          <p className="text-xs text-neutral-300 max-w-xl font-medium leading-relaxed">
            Configure assessments, manage student class groups, and let VedaAI automate standard question paper creations in seconds.
          </p>
        </div>

        <div className="z-10 pt-2 flex items-center gap-2">
          <button
            onClick={() => router.push('/assignments/new')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-brand-orange to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold px-4.5 py-2.5 rounded-full shadow hover:scale-[1.01] transition-all"
          >
            ✦ Create Assignment
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-neutral-100 p-5 shadow-sm hover:shadow transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-xl font-bold text-neutral-950">{stat.value}</h3>
                <p className="text-[10px] text-neutral-400 font-medium">{stat.desc}</p>
              </div>
              <div className={`p-3 rounded-xl border ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities & Quick CTAs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-xl border border-neutral-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-1.5">
              🚀 Portal Quick Workspaces
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => router.push('/assignments')}
                className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-200 transition-all cursor-pointer text-center space-y-1 group"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-1 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-neutral-800">Assignments</h4>
                <p className="text-[9px] text-neutral-400 font-medium">Track evaluations</p>
              </div>

              <div
                onClick={() => router.push('/groups')}
                className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-200 transition-all cursor-pointer text-center space-y-1 group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-neutral-800">My Groups</h4>
                <p className="text-[9px] text-neutral-400 font-medium">View student lists</p>
              </div>

              <div
                onClick={() => router.push('/library')}
                className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-200 transition-all cursor-pointer text-center space-y-1 group"
              >
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-1 group-hover:scale-105 transition-transform">
                  <FolderHeart className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-neutral-800">My Library</h4>
                <p className="text-[9px] text-neutral-400 font-medium">Saved files vault</p>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl border border-neutral-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-1.5">
              🔔 Recent Notifications & Activities
            </h3>
            <div className="space-y-3.5">
              {recentActivity.length === 0 ? (
                <div className="text-center py-6 text-neutral-400">
                  <p className="text-xs font-semibold">No recent activity detected.</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Generated assessments will appear here.</p>
                </div>
              ) : (
                recentActivity.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-neutral-50/80 border border-transparent hover:border-neutral-100 transition-all"
                    >
                      <div className={`p-2 rounded-lg ${activity.color} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-xs font-bold text-neutral-800 leading-tight">
                          {activity.text}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {activity.time}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Calendar / Schedule */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-1.5">
              📅 Upcoming Assessment Calendar
            </h3>
            <div className="space-y-3">
              {upcomingExams.length === 0 ? (
                <div className="text-center py-6 text-neutral-400">
                  <p className="text-xs font-semibold">No upcoming assessments</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Assignments with future due dates will list here.</p>
                </div>
              ) : (
                upcomingExams.map((exam, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/40 hover:bg-neutral-50 transition-all space-y-1.5"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {exam.class}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-bold">{exam.marks}</span>
                    </div>
                    <h4 className="font-bold text-xs text-neutral-800 leading-snug">
                      {exam.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exam.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => {
                router.push('/assignments');
                showToast('Viewing assignment list', 'success');
              }}
              className="w-full py-2.5 bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 text-neutral-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              Manage Assessments <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
