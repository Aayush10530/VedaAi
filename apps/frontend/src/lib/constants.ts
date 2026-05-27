export const QUESTION_TYPES = [
  { value: 'mcq', label: 'Multiple Choice Questions' },
  { value: 'true_false', label: 'True/False Questions' },
  { value: 'short_answer', label: 'Short Answer Questions' },
  { value: 'long_answer', label: 'Long Answer Questions' },
  { value: 'fill_blank', label: 'Fill in the Blanks' },
] as const;

export type QuestionTypeEnum = typeof QUESTION_TYPES[number]['value'];
