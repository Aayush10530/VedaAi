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
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
        <h1 className="text-lg font-bold text-neutral-900 leading-none pl-2.5">Assignments</h1>
      </div>
      <p className="text-xs text-neutral-500 -mt-4 pl-4.5 font-medium">
        Manage and create assignments for your classes.
      </p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 border rounded-full transition-all ${
              activeFilter === 'all'
                ? 'bg-neutral-900 border-neutral-950 text-white'
                : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> All
          </button>
          <button
            onClick={() => setActiveFilter('complete')}
            className={`text-xs font-semibold px-4 py-2 border rounded-full transition-all ${
              activeFilter === 'complete'
                ? 'bg-emerald-500 border-emerald-600 text-white'
                : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Complete
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`text-xs font-semibold px-4 py-2 border rounded-full transition-all ${
              activeFilter === 'pending'
                ? 'bg-orange-500 border-orange-600 text-white'
                : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Pending
          </button>
        </div>

        <div className="flex items-center gap-2 border border-neutral-200 rounded-full px-4 py-2 bg-white w-full sm:w-64 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100 transition-all">
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
        <div className="bg-white rounded-xl border border-neutral-100 p-12 text-center">
          <p className="text-sm font-semibold text-neutral-500">No matching assignments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <AssignmentCard key={item._id} assignment={item} />
          ))}
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10 z-30">
        <button
          onClick={() => router.push('/assignments/new')}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-lg active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </div>
    </div>
  );
}
