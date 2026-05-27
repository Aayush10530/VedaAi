import Groq from 'groq-sdk';
import { env } from '../../config/env';

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export async function callGroq(prompt: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational assessment designer. You MUST respond with valid JSON only. No markdown fences, no preamble, no explanation. Just the raw JSON object.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    return completion.choices[0]?.message?.content ?? '';
  } catch (error) {
    console.error('[Groq Client] Error calling LLM completion:', error);
    throw error;
  }
}
