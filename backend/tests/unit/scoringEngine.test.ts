jest.mock('@/services/aiProvider');
jest.mock('@/lib/redis');
jest.mock('@/ai/GeminiProvider', () => ({
  generateContent: jest.fn()
}));
import { enhanceAndCombineScores } from '@/ai/scoringEngine';
import { generateContent } from '@/ai/GeminiProvider';
const mockedGenerateContent = generateContent as jest.Mock;

describe('scoringEngine', ()=>{
  beforeEach(()=>{ jest.resetAllMocks(); });

  it('uses AI adjustments when valid response arrives', async ()=>{
    mockedGenerateContent.mockResolvedValue(JSON.stringify([
      { careerId: 'c1', adjustment: 0.05, reason: 'strong fit' },
      { careerId: 'c2', adjustment: -0.05, reason: 'slightly lower match' },
    ]));
    const profile = { name: 'Alice'};
    const localMatches = [
      { careerId: 'c1', careerTitle: 'AI Engineer', matchScore: 0.8, reasons: ['r1'], skillGaps: ['ml'] },
      { careerId: 'c2', careerTitle: 'Frontend', matchScore: 0.7, reasons: ['r2'], skillGaps: ['react'] },
    ];
    const result = await enhanceAndCombineScores(profile, localMatches as any);
    expect(result[0].match).toBeGreaterThanOrEqual(result[1].match);
    expect(result[0].reasons.join(' ')).toContain('strong fit');
  });

  it('falls back to local scores when AI fails', async ()=>{
    mockedGenerateContent.mockRejectedValue(new Error('AI error'));
    const profile = { name: 'Alice'};
    const localMatches = [{ careerId: 'c1', careerTitle: 'Eng', matchScore: 0.8, reasons: ['r1'], skillGaps: [] }];
    const result = await enhanceAndCombineScores(profile, localMatches as any);
    expect(result[0].match).toBe(80);
  });
});
