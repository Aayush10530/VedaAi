import React from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function EmptyState() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[calc(100vh-140px)]">
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div className="w-44 h-44 bg-neutral-300/60 rounded-full scale-95" />
        
        <div className="absolute bg-white rounded-xl shadow-lg border border-neutral-100 p-4.5 w-22 h-28 top-8 left-12 flex flex-col gap-2.5 transition-transform hover:scale-105 duration-300">
          <div className="h-2.5 bg-neutral-300 rounded-full w-5/6" />
          <div className="h-1.5 bg-neutral-200 rounded-full w-full" />
          <div className="h-1.5 bg-neutral-200 rounded-full w-4/6" />
          <div className="h-1.5 bg-neutral-200 rounded-full w-5/6" />
          <div className="h-1.5 bg-neutral-200 rounded-full w-3/6" />
        </div>

        <div className="absolute right-6 top-10 w-22 h-22 border-[5px] border-neutral-400 rounded-full flex items-center justify-center bg-white/90 shadow-md backdrop-blur-xs">
          <span className="text-red-500 text-3xl font-black tracking-tight">✕</span>
        </div>

        <span className="absolute bottom-8 left-8 text-indigo-500 text-2xl font-semibold animate-pulse">✦</span>
        <span className="absolute top-14 right-6 w-4 h-4 bg-teal-400 rounded-full border-2 border-white shadow-xs" />
      </div>

      <h2 className="text-xl font-bold text-neutral-900 mt-6 tracking-tight">No assignments yet</h2>
      <p className="text-sm text-neutral-500 text-center max-w-sm mt-3.5 leading-relaxed">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      <button
        onClick={() => router.push('/assignments/new')}
        className="mt-7 flex items-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-neutral-800 hover:shadow-md transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" />
        Create Your First Assignment
      </button>
    </div>
  );
}
