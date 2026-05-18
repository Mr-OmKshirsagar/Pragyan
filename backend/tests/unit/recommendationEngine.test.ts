jest.mock('@/lib/prisma', () => ({
  prisma: {
    career: { findUnique: jest.fn() },
    assessmentSession: { findFirst: jest.fn() },
    user: { findUnique: jest.fn() },
    roadmap: { findMany: jest.fn().mockResolvedValue([]) },
  },
}));
jest.mock('@/lib/redis');
jest.mock('@/services/aiProvider');
jest.mock('@/ai/GeminiProvider', () => ({
  generateContent: jest.fn()
}));
jest.mock('@/services/career-matching', () => ({
  careerMatchingEngine: {
    analyzeAssessment: jest.fn(),
    getUserCareerMatches: jest.fn(),
  },
}));

import { recommendationEngineService as recService } from '@/services/recommendation-engine';
import { generateContent } from '@/ai/GeminiProvider';
const prismaMock = require('@/lib/prisma').prisma;
const careerMatchingMock = require('@/services/career-matching').careerMatchingEngine;
const mockedGenerateContent = generateContent as jest.Mock;

describe('recommendation-engine', () => {
  beforeEach(()=>{
    jest.resetAllMocks();
    prismaMock.career.findUnique.mockResolvedValue({
      id: 'career1',
      title: 'AI Engineer',
      description: 'Build ML systems',
      category: 'AI',
      skillMappings: [{ skill: 'python' }, { skill: 'ml' }],
    });
    prismaMock.assessmentSession.findFirst.mockResolvedValue(null);
    prismaMock.user.findUnique.mockResolvedValue({ skills: ['python'], interests: ['ai'], preferences: [], education: 'BS', experience: '2 years' });
    prismaMock.roadmap.findMany.mockResolvedValue([
      { id: 'r1', title: 'AI Foundations', category: 'AI', level: 'beginner', description: 'Learn AI', tags: ['ai','ml'], updatedAt: new Date() },
      { id: 'r2', title: 'Frontend Sprint', category: 'Web', level: 'beginner', description: 'UI basics', tags: ['frontend'], updatedAt: new Date() },
    ]);
    careerMatchingMock.analyzeAssessment.mockResolvedValue([
      { careerId: 'c1', careerTitle: 'AI Engineer', matchScore: 0.92, confidenceLevel: 'high', reasons: ['strong'], requiredSkills: ['python'], skillGaps: ['ml'] },
      { careerId: 'c2', careerTitle: 'Frontend Developer', matchScore: 0.75, confidenceLevel: 'medium', reasons: ['good'], requiredSkills: ['js'], skillGaps: ['react'] },
    ]);
    careerMatchingMock.getUserCareerMatches.mockResolvedValue([]);
    mockedGenerateContent.mockResolvedValue(JSON.stringify({ summary: 'Good job', skillGaps: ['ml'], roadmap: [], nextActions: [], targetLevel: 'mid' }));
  });

  it('generates recommendations and derived lists', async () => {
    const rec = await recService.generateRecommendations('user1', { skills: ['python'], interests: ['ai'] });
    expect(rec.topCareer?.career).toContain('AI Engineer');
    expect(rec.skillRecommendations.length).toBeGreaterThan(0);
    expect(rec.roadmapRecommendations.length).toBeGreaterThanOrEqual(1);

    const top = await recService.getTopCareer('user1');
    expect(top?.career).toBeTruthy();
    const skills = await recService.getRecommendedSkills('user1');
    expect(skills.length).toBeGreaterThan(0);
    const roadmaps = await recService.getRecommendedRoadmaps('user1');
    expect(roadmaps.length).toBeGreaterThan(0);
    const legacy = await recService.getLegacyCareerList('user1');
    expect(legacy[0].career).toBeTruthy();
    const jobs = await recService.getLegacyJobs('user1');
    expect(jobs[0].title).toBeTruthy();
  });

  it('uses stored matches and profile fallback when no signal is supplied', async () => {
    careerMatchingMock.getUserCareerMatches.mockResolvedValue([
      { careerId: 'c-store', matchScore: 0.88, confidenceLevel: 'high', career: { id: 'c-store', title: 'Stored Career', averageSalary: '$100k', category: 'Tech' }, reasons: ['stored'], requiredSkills: ['sql'], skillGaps: ['sql'] },
    ]);
    prismaMock.assessmentSession.findFirst.mockResolvedValue({ analysis: JSON.stringify({ extractedProfile: { skills: ['sql'], interests: ['data'], personality: ['curious'], education: 'BS', experience: '5 years' } }) });

    const rec = await recService.generateRecommendations('user2');
    expect(rec.topCareer?.career).toContain('Stored Career');
    expect(rec.careerMatches[0].match).toBeGreaterThan(0);
  });

  it('returns ai explanation and caches it', async () => {
    const res = await recService.explainCareer('user1','career1');
    expect(res).not.toBeNull();
    expect((mockedGenerateContent as jest.Mock).mock.calls.length).toBe(1);

    const res2 = await recService.explainCareer('user1','career1');
    expect(res2).not.toBeNull();
    expect((mockedGenerateContent as jest.Mock).mock.calls.length).toBe(1);
  });

  it('falls back when AI fails', async () => {
    mockedGenerateContent.mockRejectedValue(new Error('AI fail'));
    const res = await recService.explainCareer('u','c');
    expect(res).not.toBeNull();
    expect(res!.explanation).toContain('The');
  });
});
