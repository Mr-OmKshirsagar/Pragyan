import 'dotenv/config';

import { generateContent } from './ai/GeminiProvider';

async function main() {
  try {
    const prompt = 'Explain AI Engineering career';
    const result = await generateContent(prompt);
    console.log('SMOKE RESULT:', result);
  } catch (e) {
    console.error('SMOKE ERROR:', e);
    process.exitCode = 2;
  }
}

void main();
