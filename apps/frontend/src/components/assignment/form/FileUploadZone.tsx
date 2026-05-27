import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { assignmentService } from '../../../services/assignmentService';

interface FileUploadZoneProps {
  onUploadComplete: (fileUrl: string, extractedText: string, filename: string) => void;
  initialFilename?: string;
}

export function FileUploadZone({ onUploadComplete, initialFilename = '' }: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [filename, setFilename] = useState(initialFilename);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    try {
      setStatus('uploading');
      setFilename(file.name);
      
      const res = await assignmentService.uploadFile(file);
      setStatus('success');
      onUploadComplete(res.fileUrl, res.extractedText, res.filename);
    } catch (err) {
      setStatus('error');
      setErrorMessage((err as Error).message || 'Failed to upload file');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all bg-white flex flex-col items-center justify-center cursor-pointer ${
          dragActive ? 'border-brand-orange bg-orange-50/20' : 'border-neutral-200 hover:border-neutral-350'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.txt,.jpg,.jpeg,.png"
          onChange={handleChange}
          disabled={status === 'uploading'}
        />

        {status === 'idle' && (
          <>
            <UploadCloud className="w-8 h-8 text-neutral-400 mb-3" />
            <p className="text-sm font-semibold text-neutral-700">Choose a file or drag & drop it here</p>
            <p className="text-[10px] text-neutral-400 mt-1 font-medium">PDF, TXT, JPEG, PNG up to 10MB</p>
            <button
              type="button"
              className="mt-4 px-5 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-full text-xs font-bold text-neutral-700 transition-colors"
            >
              Browse Files
            </button>
          </>
        )}

        {status === 'uploading' && (
          <div className="flex flex-col items-center py-4">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin mb-3" />
            <p className="text-sm font-semibold text-neutral-700">Uploading and analyzing "{filename}"...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-3 animate-bounce" />
            <p className="text-sm font-semibold text-neutral-700">Successfully uploaded</p>
            <p className="text-xs text-neutral-400 mt-1 truncate max-w-sm font-medium">{filename}</p>
            <button
              type="button"
              className="mt-4 px-4 py-1.5 border border-neutral-100 hover:bg-neutral-50 rounded-full text-[10px] font-bold text-neutral-500 transition-colors"
            >
              Replace File
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-2">
            <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
            <p className="text-sm font-semibold text-neutral-700">Upload failed</p>
            <p className="text-xs text-red-400 mt-1 truncate max-w-sm font-medium">{errorMessage}</p>
            <button
              type="button"
              className="mt-4 px-4 py-1.5 border border-neutral-100 hover:bg-neutral-50 rounded-full text-[10px] font-bold text-neutral-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
      <p className="text-[10px] text-neutral-400 font-medium text-center">
        Upload reference document context for AI (optional)
      </p>
    </div>
  );
}
