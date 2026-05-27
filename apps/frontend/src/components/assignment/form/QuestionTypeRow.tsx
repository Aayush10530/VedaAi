import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Minus, Plus } from 'lucide-react';
import { QUESTION_TYPES, QuestionTypeEnum } from '../../../lib/constants';

interface QuestionTypeRowProps {
  type: QuestionTypeEnum;
  count: number;
  marksEach: number;
  onUpdate: (data: { type?: QuestionTypeEnum; count?: number; marksEach?: number }) => void;
  onRemove: () => void;
}

export function QuestionTypeRow({ type, count, marksEach, onUpdate, onRemove }: QuestionTypeRowProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLabel = QUESTION_TYPES.find((qt) => qt.value === type)?.label || type;

  const handleSelect = (val: QuestionTypeEnum) => {
    onUpdate({ type: val });
    setDropdownOpen(false);
  };

  const handleIncrementCount = () => onUpdate({ count: count + 1 });
  const handleDecrementCount = () => onUpdate({ count: Math.max(1, count - 1) });

  const handleIncrementMarks = () => onUpdate({ marksEach: marksEach + 1 });
  const handleDecrementMarks = () => onUpdate({ marksEach: Math.max(1, marksEach - 1) });

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 py-3 border-b border-neutral-100 last:border-b-0">
      <div className="flex items-center gap-2 flex-1 relative" ref={dropdownRef}>
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex-1 flex items-center justify-between border border-neutral-200 rounded-full px-4.5 py-2.5 bg-white cursor-pointer hover:border-neutral-300 transition-colors shadow-2xs"
        >
          <span className="text-xs font-semibold text-neutral-700 truncate">{activeLabel}</span>
          <ChevronDown className="w-4 h-4 text-neutral-400 ml-2 flex-shrink-0" />
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="text-neutral-400 hover:text-neutral-600 p-1.5 hover:bg-neutral-50 rounded-full transition-colors flex-shrink-0"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 top-12 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-20 w-full min-w-[200px] animate-in fade-in slide-in-from-top-1">
            {QUESTION_TYPES.map((qt) => (
              <button
                key={qt.value}
                type="button"
                onClick={() => handleSelect(qt.value)}
                className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-neutral-50 block ${
                  type === qt.value ? 'text-brand-orange bg-orange-50/10' : 'text-neutral-700'
                }`}
              >
                {qt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 md:justify-end flex-shrink-0">
        <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-2.5 py-1.5 shadow-2xs">
          <button
            type="button"
            onClick={handleDecrementCount}
            className="w-6 h-6 hover:bg-neutral-50 text-neutral-500 rounded-full flex items-center justify-center transition-colors font-bold text-sm"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-bold text-neutral-800 w-6 text-center select-none">{count}</span>
          <button
            type="button"
            onClick={handleIncrementCount}
            className="w-6 h-6 hover:bg-neutral-50 text-neutral-500 rounded-full flex items-center justify-center transition-colors font-bold text-sm"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-2.5 py-1.5 shadow-2xs">
          <button
            type="button"
            onClick={handleDecrementMarks}
            className="w-6 h-6 hover:bg-neutral-50 text-neutral-500 rounded-full flex items-center justify-center transition-colors font-bold text-sm"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-bold text-neutral-800 w-6 text-center select-none">{marksEach}</span>
          <button
            type="button"
            onClick={handleIncrementMarks}
            className="w-6 h-6 hover:bg-neutral-50 text-neutral-500 rounded-full flex items-center justify-center transition-colors font-bold text-sm"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
