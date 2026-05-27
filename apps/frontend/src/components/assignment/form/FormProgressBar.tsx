import React from 'react';

interface FormProgressBarProps {
  step: 1 | 2;
}

export function FormProgressBar({ step }: FormProgressBarProps) {
  return (
    <div className="w-full flex gap-2.5 mb-7">
      <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-neutral-900 shadow-xs' : 'bg-neutral-300/60'}`} />
      <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-neutral-900 shadow-xs' : 'bg-neutral-300/60'}`} />
    </div>
  );
}
