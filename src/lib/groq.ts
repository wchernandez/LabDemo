import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Fast, free-tier friendly. Alternatives: llama-3.3-70b-versatile, mixtral-8x7b-32768
export const HINT_MODEL = 'llama-3.3-70b-versatile';

export interface HintResponse {
  broke: string;
  concept: string;
  nudge: string;
}

export async function generateHintText(prompt: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: HINT_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 500,
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from Groq');
  return content;
}
