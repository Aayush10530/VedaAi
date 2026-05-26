export type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'long_answer' | 'fill_blank';
export type AssignmentStatus = 'pending' | 'generating' | 'complete' | 'failed';
export type Difficulty = 'easy' | 'moderate' | 'hard';

export interface QuestionConfig {
  type: QuestionType;
  count: number;
  marksEach: number;
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  schoolName: string;
  assignedBy: string;
  dueDate: string;
  timeLimit: number;
  additionalInstructions: string;
  fileUrl?: string;
  extractedText?: string;
  questionConfig: QuestionConfig[];
  status: AssignmentStatus;
  jobId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentInput {
  title: string;
  subject: string;
  grade: string;
  schoolName: string;
  assignedBy: string;
  dueDate: string;
  timeLimit: number;
  additionalInstructions?: string;
  fileUrl?: string;
  questionConfig: QuestionConfig[];
}
