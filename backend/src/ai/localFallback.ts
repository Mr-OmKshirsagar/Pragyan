/*
  Deterministic local AI fallback for Pragyan.
  Provides simple, stable responses when external AI is unavailable.
*/
function safeJson(obj: unknown) {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return JSON.stringify({ error: 'failed to build fallback' });
  }
}

export async function generateTextFallback(prompt: string): Promise<string> {
  const p = String(prompt || '').toLowerCase();

  // Questions generation path
  if (p.includes('for each input item') || p.includes('return a json array') || p.includes('input:')) {
    // produce simple 1-to-1 mapping back to the prompt items if possible
    // conservative stable output
    const items = [{ id: 'q1', question: 'Which of these describes you best?', options: ['Option A', 'Option B'], hint: 'Pick the best fit' }];
    return safeJson(items);
  }

  // Career explanation path
  if (p.includes('career') || p.includes('explain')) {
    const structured = {
      summary: 'AI enhancement temporarily unavailable — using intelligent local recommendations. This role typically requires core technical skills, practical projects, and focused learning.',
      skillGaps: ['Fundamentals', 'Practical projects', 'Domain knowledge'],
      roadmap: [
        { week: 1, items: ['Learn fundamentals', 'Follow tutorials'] },
        { week: 2, items: ['Complete small project', 'Read domain articles'] },
        { week: 3, items: ['Expand project', 'Write documentation'] },
        { week: 4, items: ['Polish portfolio', 'Practice interviews'] },
        { week: 5, items: ['Advanced exercises'] },
        { week: 6, items: ['Apply for roles and network'] },
      ],
      nextActions: ['Start a focused tutorial', 'Build a 2-week project', 'Document and share your work'],
      targetLevel: 'junior',
    };

    return safeJson(structured);
  }

  // Generic fallback
  return 'AI enhancement temporarily unavailable — using intelligent local recommendations.';
}

export default { generateTextFallback };
