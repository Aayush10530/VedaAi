import { z } from 'zod';

const QuestionSchema = z.object({
  number: z.number(),
  text: z.string().min(1),
  difficulty: z.enum(['easy', 'moderate', 'hard']),
  marks: z.number().positive(),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
});

const SectionSchema = z.object({
  label: z.string(),
  instruction: z.string(),
  questionType: z.string(),
  questions: z.array(QuestionSchema).min(1),
});

export const QuestionPaperOutputSchema = z.object({
  generalInstructions: z.array(z.string()),
  maxMarks: z.number(),
  sections: z.array(SectionSchema).min(1),
  answerKey: z.array(
    z.object({
      questionNumber: z.number(),
      sectionLabel: z.string(),
      answer: z.string(),
    })
  ),
});

export type QuestionPaperOutput = z.infer<typeof QuestionPaperOutputSchema>;

export function parseGroqResponse(raw: string): QuestionPaperOutput {
  // Strip markdown fences if present (safety net)
  let cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // If there's extra text before/after JSON, attempt to locate the first '{' and last '}'
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.slice(startIdx, endIdx + 1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new Error(`AI response was not valid JSON. Error: ${(error as Error).message}. Raw segment: ${raw.slice(0, 200)}`);
  }

  const result = QuestionPaperOutputSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`AI response failed schema validation: ${result.error.message}`);
  }

  return result.data;
}
