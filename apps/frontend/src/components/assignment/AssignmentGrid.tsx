import React, { useState } from 'react';
import { Filter, Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AssignmentCard } from './AssignmentCard';
import type { Assignment } from '@vedaai/shared';

interface AssignmentGridProps {
  assignments: Assignment[];
}

export function AssignmentGrid({ assignments }: AssignmentGridProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'generating' | 'complete' | 'failed'>('all');

  const filtered = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    return a.status === activeFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
        <h1 className="text-lg font-black text-neutral-900 leading-none pl-2.5">Assignments</h1>
      </div>
      <p className="text-xs text-neutral-500 -mt-4 pl-4.5 font-semibold">
        Manage and create assignments for your classes.
      </p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 border rounded-full transition-all duration-300 shadow-sm active:scale-95 ${
              activeFilter === 'all'
                ? 'bg-neutral-900 border-neutral-950 text-white'
                : 'border-white/40 bg-white/40 text-neutral-600 hover:bg-white/70'
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> All
          </button>
          <button
            onClick={() => setActiveFilter('complete')}
            className={`text-xs font-bold px-4 py-2 border rounded-full transition-all duration-300 shadow-sm active:scale-95 ${
              activeFilter === 'complete'
                ? 'bg-emerald-550 bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-600 text-white'
                : 'border-white/40 bg-white/40 text-neutral-600 hover:bg-white/70'
            }`}
          >
            Complete
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`text-xs font-bold px-4 py-2 border rounded-full transition-all duration-300 shadow-sm active:scale-95 ${
              activeFilter === 'pending'
                ? 'bg-orange-550 bg-gradient-to-r from-brand-orange to-red-400 border-orange-600 text-white'
                : 'border-white/40 bg-white/40 text-neutral-600 hover:bg-white/70'
            }`}
          >
            Pending
          </button>
        </div>

        <div className="flex items-center gap-2 border border-white/30 rounded-full px-4 py-2 bg-white/35 backdrop-blur-md w-full sm:w-64 focus-within:border-brand-orange/40 focus-within:ring-4 focus-within:ring-orange-500/5 transition-all duration-300 shadow-sm">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search Assignment"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs outline-none flex-1 text-neutral-800 placeholder-neutral-400 bg-transparent"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/50 shadow-md">
          <p className="text-sm font-bold text-neutral-500">No matching assignments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <AssignmentCard key={item._id} assignment={item} />
          ))}
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10 z-30 shadow-2xl">
        <button
          onClick={() => router.push('/assignments/new')}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-red-500 hover:from-orange-650 hover:to-red-600 text-white text-xs font-black px-6 py-3.5 rounded-full shadow-lg hover:shadow-orange-500/15 hover:scale-[1.03] active:scale-95 transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </div>
    </div>
  );
}
