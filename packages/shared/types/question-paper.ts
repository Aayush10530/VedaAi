import type { QuestionType, Difficulty } from './assignment';

export interface Question {
  number: number;
  text: string;
  difficulty: Difficulty;
  marks: number;
  options?: string[];
  answer?: string;
}

export interface Section {
  label: string;         // e.g. "Section A"
  instruction: string;   // e.g. "Attempt all questions"
  questionType: QuestionType;
  questions: Question[];
}

export interface AnswerKeyEntry {
  questionNumber: number;
  answer: string;
}

export interface QuestionPaper {
  assignmentId: string;
  schoolName: string;
  subject: string;
  grade: string;
  timeMinutes: number;
  maxMarks: number;
  generalInstructions: string[];
  sections: Section[];
  answerKey: AnswerKeyEntry[];
  generatedAt: string;
}
