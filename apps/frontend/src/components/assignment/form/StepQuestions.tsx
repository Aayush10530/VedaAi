import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Mic } from 'lucide-react';
import { QuestionTypeRow } from './QuestionTypeRow';
import { QuestionTypeEnum } from '../../../lib/constants';

export function StepQuestions() {
  const { control, register, watch } = useFormContext();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'questionConfig',
  });

  const questionConfig = watch('questionConfig') || [];

  const totalQuestions = questionConfig.reduce((sum: number, q: any) => sum + (Number(q.count) || 0), 0);
  const totalMarks = questionConfig.reduce(
    (sum: number, q: any) => sum + (Number(q.count) || 0) * (Number(q.marksEach) || 0),
    0
  );

  const handleAddRow = () => {
    append({ type: 'mcq', count: 5, marksEach: 2 });
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-250">
      <div className="border-b border-neutral-100 pb-4 mb-4">
        <h2 className="text-base font-bold text-neutral-900 tracking-tight">Question Configuration</h2>
        <p className="text-xs text-neutral-500 font-medium">Define question styles, sections, and values</p>
      </div>

      <div className="space-y-2">
        <div className="hidden md:flex items-center gap-3 border-b border-neutral-100 pb-2 mb-2 px-1">
          <span className="flex-1 text-xs font-bold text-neutral-500 uppercase tracking-wider">Question Type</span>
          <span className="w-10" />
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider w-24 text-center">Questions</span>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider w-24 text-center">Marks</span>
        </div>

        {fields.length === 0 ? (
          <div className="border border-neutral-200 border-dashed rounded-xl p-8 text-center bg-neutral-50">
            <p className="text-xs font-semibold text-neutral-500">No question configurations configured.</p>
            <button
              type="button"
              onClick={handleAddRow}
              className="mt-3 inline-flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-neutral-800 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Initialize First Type
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {fields.map((item, index) => (
              <QuestionTypeRow
                key={item.id}
                type={questionConfig[index]?.type || 'mcq'}
                count={questionConfig[index]?.count || 0}
                marksEach={questionConfig[index]?.marksEach || 0}
                onUpdate={(data) => update(index, { ...questionConfig[index], ...data })}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        )}

        {fields.length > 0 && (
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100 flex-wrap gap-4">
            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <span className="w-7 h-7 bg-neutral-900 rounded-full flex items-center justify-center transition-all group-hover:scale-105 active:scale-95 shadow-xs">
                <Plus className="w-4 h-4 text-white" />
              </span>
              <span className="text-xs font-bold text-neutral-700 hover:text-neutral-900 transition-colors">Add Question Type</span>
            </button>

            <div className="text-right space-y-1 select-none pr-1">
              <p className="text-xs font-semibold text-neutral-500">
                Total Questions : <span className="font-extrabold text-neutral-900">{totalQuestions}</span>
              </p>
              <p className="text-xs font-semibold text-neutral-500">
                Total Marks : <span className="font-extrabold text-neutral-900">{totalMarks}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5 pt-4 border-t border-neutral-100">
        <label className="block text-sm font-semibold text-neutral-900">
          Additional Information (For better output)
        </label>
        <div className="relative border border-neutral-200 focus-within:border-neutral-400 rounded-xl bg-white focus-within:ring-2 focus-within:ring-neutral-100 transition-all shadow-2xs">
          <textarea
            placeholder="e.g. Generate a question paper for 3 hour exam duration. Focus heavily on electrolysis."
            rows={4}
            className="w-full p-4 text-xs bg-transparent rounded-xl outline-none resize-none min-h-[100px] text-neutral-800 placeholder-neutral-400"
            {...register('additionalInstructions')}
          />
          <Mic className="absolute bottom-3.5 right-3.5 w-4 h-4 text-neutral-400 cursor-pointer hover:text-neutral-600 transition-colors" />
        </div>
      </div>
    </div>
  );
}
