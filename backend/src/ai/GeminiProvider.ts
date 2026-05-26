import { aiProvider } from '@/services/aiProvider';

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
  try {
    const response = await aiProvider.generateJsonRaw(prompt, { timeoutMs: 20000 });
    return response;
  } catch (error) {
    console.warn('AI generation failed; using deterministic fallback:', error);
    return deterministicTestResponse();
  }
}
