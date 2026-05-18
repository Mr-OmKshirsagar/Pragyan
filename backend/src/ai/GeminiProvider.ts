import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const TEST_MODE = process.env.NODE_ENV === 'test' || !GEMINI_API_KEY;

let model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

if (GEMINI_API_KEY) {
  const generativeAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = generativeAI.getGenerativeModel({ model: GEMINI_MODEL });
} else {
  console.warn('GEMINI_API_KEY is not set — using deterministic fallback responses');
}

function deterministicTestResponse() {
  return JSON.stringify([
    {
      id: 'stub-q1',
      question: 'Which of the following best describes your strongest technical skill?',
      type: 'multiple_choice',
      options: ['Programming', 'Data Analysis', 'Design', 'DevOps'],
      category: 'skills',
    },
  ]);
}

export async function generateContent(prompt: string): Promise<string> {
  if (TEST_MODE || !model) {
    return deterministicTestResponse();
  }

  try {
    const response = await model.generateContent([prompt]);
    if (!response || !response.response) {
      throw new Error('Invalid response from Gemini API');
    }
    return response.response.text();
  } catch (error) {
    console.error('Gemini generation failed:', error);
    return deterministicTestResponse();
  }
}
