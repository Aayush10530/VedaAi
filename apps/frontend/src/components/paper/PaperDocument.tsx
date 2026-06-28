import React from 'react';
import type { QuestionPaper } from '@vedaai/shared';

interface PaperDocumentProps {
  paper: QuestionPaper;
  showAnswerKey?: boolean;
}

export function PaperDocument({ paper, showAnswerKey = true }: PaperDocumentProps) {
  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      mcq: 'Multiple Choice Questions',
      true_false: 'True/False Questions',
      short_answer: 'Short Answer Questions',
      long_answer: 'Long Answer Questions',
      fill_blank: 'Fill in the Blanks',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-neutral-100 p-8 md:p-12 max-w-2xl mx-auto space-y-6 font-sans text-neutral-800 leading-relaxed select-none animate-in fade-in zoom-in-95 duration-355">
      <div className="text-center space-y-1">
        <h1 className="text-lg md:text-xl font-extrabold text-neutral-900 tracking-tight leading-snug">
          {paper.schoolName}
        </h1>
        <p className="text-xs md:text-sm font-semibold text-neutral-600">Subject: {paper.subject}</p>
        <p className="text-xs md:text-sm font-semibold text-neutral-600">Class: {paper.grade}</p>
      </div>

      <div className="flex justify-between items-center text-xs md:text-sm font-bold text-neutral-700 pt-2">
        <span>Time Allowed: {paper.timeMinutes} minutes</span>
        <span>Maximum Marks: {paper.maxMarks}</span>
      </div>

      <div className="space-y-4 pt-1">
        <p className="text-xs md:text-sm italic text-neutral-500 font-medium">
          {paper.generalInstructions?.[0] || 'All questions are compulsory unless stated otherwise.'}
        </p>

        <div className="space-y-3 pt-2 border-t border-neutral-100 text-xs md:text-sm font-bold text-neutral-700">
          <div className="flex items-center">
            <span>Name:</span>
            <span className="flex-1 border-b border-neutral-350 ml-2 h-4">&nbsp;</span>
          </div>
          <div className="flex items-center">
            <span>Roll Number:</span>
            <span className="flex-1 border-b border-neutral-350 ml-2 h-4">&nbsp;</span>
          </div>
          <div className="flex items-center">
            <span>Class:</span>
            <span className="ml-2 font-medium">{paper.grade}</span>
            <span className="ml-6">Section:</span>
            <span className="flex-1 border-b border-neutral-350 ml-2 h-4">&nbsp;</span>
          </div>
        </div>
      </div>

      <hr className="border-neutral-150" />

      {paper.sections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-4">
          <h2 className="text-center font-extrabold text-neutral-950 text-sm md:text-base tracking-wide uppercase">
            {section.label}
          </h2>
          <div className="space-y-1">
            <h3 className="font-extrabold text-xs md:text-sm text-neutral-900">
              {getQuestionTypeLabel(section.questionType)}
            </h3>
            <p className="text-[10px] md:text-xs text-neutral-400 font-semibold italic">
              {section.instruction}
            </p>
          </div>

          <ol className="space-y-3.5 pl-1.5">
            {section.questions.map((q, qIdx) => (
              <li key={qIdx} className="space-y-2 text-xs md:text-sm text-neutral-800">
                <div>
                  <span className="font-bold pr-1">{q.number}.</span>
                  <span className="text-neutral-500 font-bold pr-1">[{q.difficulty}]</span>
                  <span>{q.text}</span>
                  <span className="font-bold pl-1 text-neutral-900">[{q.marks} Marks]</span>
                </div>

                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 pt-1">
                    {q.options.map((opt, optIdx) => (
                      <span key={optIdx} className="text-neutral-500 font-semibold text-xs leading-normal">
                        {opt}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}

      <div className="text-center py-6">
        <span className="text-xs md:text-sm font-extrabold text-neutral-900 border-y border-neutral-200 py-1.5 px-6 uppercase tracking-wider">
          --- End of Question Paper ---
        </span>
      </div>

    </div>
  );
}
