import mongoose, { Schema, Document } from 'mongoose';
import type { QuestionConfig } from '@vedaai/shared';

const QuestionConfigSchema = new Schema<QuestionConfig>({
  type: {
    type: String,
    enum: ['mcq', 'true_false', 'short_answer', 'long_answer', 'fill_blank'],
    required: true,
  },
  count: { type: Number, required: true, min: 1 },
  marksEach: { type: Number, required: true, min: 1 },
}, { _id: false });

const QuestionSchema = new Schema({
  number: { type: Number, required: true },
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'moderate', 'hard'], required: true },
  marks: { type: Number, required: true },
  options: { type: [String] },
  answer: { type: String },
}, { _id: false });

const SectionSchema = new Schema({
  label: { type: String, required: true },
  instruction: { type: String, required: true },
  questionType: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true },
}, { _id: false });

const QuestionPaperSchema = new Schema({
  schoolName: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  timeMinutes: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  generalInstructions: { type: [String], required: true },
  sections: { type: [SectionSchema], required: true },
  answerKey: [{
    questionNumber: { type: Number, required: true },
    sectionLabel: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  generatedAt: { type: Date, default: Date.now },
}, { _id: false });

// Plain interface matching the embedded QuestionPaperSchema shape
export interface QuestionPaperResult {
  schoolName: string
  subject: string
  grade: string
  timeMinutes: number
  maxMarks: number
  generalInstructions: string[]
  sections: Array<{
    label: string
    instruction: string
    questionType: string
    questions: Array<{
      number: number
      text: string
      difficulty: 'easy' | 'moderate' | 'hard'
      marks: number
      options?: string[] | undefined
      answer?: string | undefined
    }>
  }>
  answerKey: Array<{
    questionNumber: number
    sectionLabel: string
    answer: string
  }>
  generatedAt: Date | string
}

export interface AssignmentDocument extends Document {
  title: string;
  subject: string;
  grade: string;
  schoolName: string;
  assignedBy: string;
  dueDate: Date;
  timeLimit: number;
  additionalInstructions: string;
  fileUrl?: string;
  extractedText?: string;
  questionConfig: QuestionConfig[];
  status: 'pending' | 'generating' | 'complete' | 'failed';
  jobId?: string;
  result?: QuestionPaperResult;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<AssignmentDocument>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    schoolName: { type: String, required: true, trim: true },
    assignedBy: { type: String, required: true, default: 'Aayush' },
    dueDate: { type: Date, required: true },
    timeLimit: { type: Number, required: true, min: 1, max: 300 },
    additionalInstructions: { type: String, default: '' },
    fileUrl: { type: String },
    extractedText: { type: String },
    questionConfig: { type: [QuestionConfigSchema], required: true },
    status: {
      type: String,
      enum: ['pending', 'generating', 'complete', 'failed'],
      default: 'pending',
    },
    jobId: { type: String },
    result: { type: QuestionPaperSchema, default: null },
  },
  { timestamps: true }
);

export const AssignmentModel = mongoose.model<AssignmentDocument>('Assignment', AssignmentSchema);
