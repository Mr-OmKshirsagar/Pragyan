import 'dotenv/config';

import { generateText } from './src/ai/GeminiProvider';

async function main() {
  const res = await generateText('Explain AI Engineering career');
  console.log(res);
}

void main();