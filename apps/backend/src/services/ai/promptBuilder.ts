import type { Assignment, QuestionConfig } from '@vedaai/shared';
import { QUESTION_TYPE_LABELS } from '@vedaai/shared';

export function buildPrompt(
  assignment: Partial<Assignment>,
  extractedText?: string
): string {
  const totalMarks = assignment.questionConfig!.reduce(
    (sum: number, q: QuestionConfig) => sum + q.count * q.marksEach,
    0
  );

  return `
Create a complete question paper with the following specifications:

PAPER DETAILS:
- School: ${assignment.schoolName}
- Subject: ${assignment.subject}
- Grade/Class: ${assignment.grade}
- Time Allowed: ${assignment.timeLimit} minutes
- Total Marks: ${totalMarks}
${assignment.additionalInstructions ? `- Special Instructions: ${assignment.additionalInstructions}` : ''}

${extractedText ? `REFERENCE MATERIAL (use this as the topic/context for generating questions):\n${extractedText.slice(0, 3000)}\n` : ''}

QUESTION REQUIREMENTS:
${assignment.questionConfig!.map((q: QuestionConfig, i: number) => 
  `Section ${String.fromCharCode(65 + i)}: ${q.count} × ${QUESTION_TYPE_LABELS[q.type] || q.type} (${q.marksEach} marks each)`
).join('\n')}

DIFFICULTY DISTRIBUTION PER SECTION:
~40% easy, 40% moderate, 20% hard. Represent these levels exactly as "easy", "moderate", "hard".

RULES:
1. Group questions into sections labeled "Section A", "Section B", etc. — one section per question type.
2. For MCQ: provide exactly 4 options as a list formatted like ["A. option text", "B. option text", "C. option text", "D. option text"].
3. For True/False: options are ["True", "False"].
4. Questions must be grade-appropriate, clear, and unambiguous.
5. Provide a correct answer for every question inside the "answer" field. For MCQs/True-False, let "answer" be the exact matching option string (e.g. "A. option text" or "True").
6. Respond ONLY with a valid JSON object matching this EXACT schema structure:

{
  "generalInstructions": ["string instruction 1", "string instruction 2"],
  "maxMarks": number,
  "sections": [
    {
      "label": "Section A",
      "instruction": "Attempt all questions. Each question carries X marks",
      "questionType": "mcq",
      "questions": [
        {
          "number": 1,
          "text": "What is...?",
          "difficulty": "easy",
          "marks": 2,
          "options": ["A. choice 1", "B. choice 2", "C. choice 3", "D. choice 4"],
          "answer": "A. choice 1"
        }
      ]
    }
  ],
  "answerKey": [
    { "questionNumber": 1, "sectionLabel": "Section A", "answer": "answer explanation or text" }
  ]
}

RESPOND WITH RAW JSON ONLY. NO MARKDOWN FENCES (NO \`\`\`json). NO EXPLANATION.
  `.trim();
}
