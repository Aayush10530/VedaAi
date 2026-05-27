import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { Input } from '../../ui/Input';
import { FileUploadZone } from './FileUploadZone';

export function StepDetails() {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const fileUrl = watch('fileUrl');
  const filename = watch('filename');

  const handleUploadComplete = (url: string, _text: string, name: string) => {
    setValue('fileUrl', url);
    setValue('filename', name);
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-250">
      <div className="border-b border-neutral-100 pb-4 mb-4">
        <h2 className="text-base font-bold text-neutral-900 tracking-tight">Assignment Details</h2>
        <p className="text-xs text-neutral-500 font-medium">Basic information about your assignment</p>
      </div>

      <FileUploadZone onUploadComplete={handleUploadComplete} initialFilename={filename} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Assignment Name"
          placeholder="e.g. Quiz on Magnetism"
          error={errors.title?.message as string}
          {...register('title', { required: 'Assignment name is required' })}
        />

        <Input
          label="Subject"
          placeholder="e.g. Science"
          error={errors.subject?.message as string}
          {...register('subject', { required: 'Subject is required' })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Class / Grade"
          placeholder="e.g. 8th"
          error={errors.grade?.message as string}
          {...register('grade', { required: 'Class/Grade is required' })}
        />

        <Input
          label="School Name"
          placeholder="e.g. Delhi Public School"
          error={errors.schoolName?.message as string}
          {...register('schoolName', { required: 'School name is required' })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 w-full">
          <label className="block text-sm font-semibold text-neutral-900">
            Due Date
          </label>
          <div className={`flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100 transition-all ${errors.dueDate ? 'border-red-500' : ''}`}>
            <input
              type="date"
              className="flex-1 text-sm outline-none bg-transparent"
              {...register('dueDate', { required: 'Due date is required' })}
            />
            <Calendar className="w-4 h-4 text-neutral-400 self-center ml-2" />
          </div>
          {errors.dueDate && <p className="text-xs font-medium text-red-500">{errors.dueDate.message as string}</p>}
        </div>

        <Input
          label="Time Limit (Minutes)"
          type="number"
          placeholder="e.g. 45"
          error={errors.timeLimit?.message as string}
          {...register('timeLimit', {
            required: 'Time limit is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Time limit must be positive' },
            max: { value: 300, message: 'Time limit cannot exceed 5 hours' }
          })}
        />
      </div>
    </div>
  );
}
