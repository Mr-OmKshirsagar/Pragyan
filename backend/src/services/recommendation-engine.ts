import { prisma } from '@/lib/prisma';
import { careerMatchingEngine, type AssessmentAnswers } from '@/services/career-matching';

export interface RecommendationRequestProfile {
  skills?: string[];
  interests?: string[];
  personality?: string[];
  education?: string;
  experience?: string;
  workStyle?: string[];
  learningPreferences?: string[];
}

export interface RankedCareer {
  careerId: string;
  career: string;
  match: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  salaryEstimate?: string;
  category?: string;
  reasons: string[];
  requiredSkills: string[];
  missingSkills: string[];
}

export interface RecommendedSkill {
  skill: string;
  confidence: number;
  reason: string;
}

export interface RecommendedRoadmap {
  id: string;
  title: string;
  category: string;
  level: string;
  matchScore: number;
  reason: string;
  tags: string[];
}

export interface RecommendationResponse {
  topCareer: RankedCareer | null;
  careerMatches: RankedCareer[];
  skillRecommendations: RecommendedSkill[];
  roadmapRecommendations: RecommendedRoadmap[];
}

export class RecommendationEngineService {
  async generateRecommendations(
    userId: string,
    profile?: RecommendationRequestProfile
  ): Promise<RecommendationResponse> {
    const effectiveProfile = profile && this.hasSignal(profile)
      ? this.normalizeProfile(profile)
      : await this.loadProfileFromLatestAssessment(userId);

    let matches: any[] = [];
    try {
      matches = await careerMatchingEngine.analyzeAssessment(userId, effectiveProfile);
    } catch (error) {
      console.error('Error in analyzeAssessment:', error);
    }

    const storedMatches = await careerMatchingEngine.getUserCareerMatches(userId);
    const rankedMatches = this.mapCareerMatches(storedMatches, matches);

    const skillRecommendations = this.buildSkillRecommendations(rankedMatches, effectiveProfile.skills || []);
    const roadmapRecommendations = await this.buildRoadmapRecommendations(rankedMatches, skillRecommendations);

    return {
      topCareer: rankedMatches[0] || null,
      careerMatches: rankedMatches,
      skillRecommendations,
      roadmapRecommendations,
    };
  }

  async getTopCareer(userId: string): Promise<RankedCareer | null> {
    const recommendation = await this.generateRecommendations(userId);
    return recommendation.topCareer;
  }

  async getRecommendedSkills(userId: string): Promise<RecommendedSkill[]> {
    const recommendation = await this.generateRecommendations(userId);
    return recommendation.skillRecommendations;
  }

  async getRecommendedRoadmaps(userId: string): Promise<RecommendedRoadmap[]> {
    const recommendation = await this.generateRecommendations(userId);
    return recommendation.roadmapRecommendations;
  }

  async getLegacyCareerList(userId: string): Promise<Array<{ career: string; score: number; reason: string }>> {
    const recommendation = await this.generateRecommendations(userId);
    return recommendation.careerMatches.map((item) => ({
      career: item.career,
      score: item.match,
      reason: item.reasons[0] || `Recommended based on your skill and interest alignment for ${item.career}.`,
    }));
  }

  async getLegacyJobs(userId: string): Promise<Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    matchScore: number;
  }>> {
    const recommendation = await this.generateRecommendations(userId);
    return recommendation.careerMatches.slice(0, 6).map((item, index) => ({
      id: `${item.careerId}-${index}`,
      title: item.career,
      company: item.category || 'Career Opportunity',
      location: item.salaryEstimate || 'Salary estimate available in details',
      matchScore: item.match,
    }));
  }

  private hasSignal(profile: RecommendationRequestProfile): boolean {
    return Boolean(
      (profile.skills && profile.skills.length) ||
      (profile.interests && profile.interests.length) ||
      (profile.personality && profile.personality.length) ||
      profile.education ||
      profile.experience
    );
  }

  private normalizeProfile(profile: RecommendationRequestProfile): AssessmentAnswers {
    return {
      skills: (profile.skills || []).map((item) => item.toLowerCase().trim()).filter(Boolean),
      interests: (profile.interests || []).map((item) => item.toLowerCase().trim()).filter(Boolean),
      personality: (profile.personality || []).map((item) => item.toLowerCase().trim()).filter(Boolean),
      education: (profile.education || '').toLowerCase().trim(),
      experience: (profile.experience || '').toLowerCase().trim(),
      workStyle: (profile.workStyle || []).map((item) => item.toLowerCase().trim()).filter(Boolean),
      careerGoals: (profile.learningPreferences || []).map((item) => item.toLowerCase().trim()).filter(Boolean),
    };
  }

  private async loadProfileFromLatestAssessment(userId: string): Promise<AssessmentAnswers> {
    const latest = await prisma.assessmentSession.findFirst({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    if (!latest) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return {
        skills: user?.skills || [],
        interests: user?.interests || [],
        personality: user?.preferences || [],
        education: user?.education || '',
        experience: user?.experience || user?.experienceType || '',
      };
    }

    const parsed = this.safeJsonParse<Record<string, any>>(latest.analysis, {});
    const extracted = parsed?.extractedProfile || {};

    return {
      skills: Array.isArray(extracted.skills) ? extracted.skills : [],
      interests: Array.isArray(extracted.interests) ? extracted.interests : [],
      personality: Array.isArray(extracted.personality) ? extracted.personality : [],
      education: typeof extracted.education === 'string' ? extracted.education : '',
      experience: typeof extracted.experience === 'string' ? extracted.experience : '',
      workStyle: Array.isArray(extracted.workStyle) ? extracted.workStyle : [],
      careerGoals: Array.isArray(extracted.careerGoals) ? extracted.careerGoals : [],
    };
  }

  private mapCareerMatches(storedMatches: any[], freshMatches: any[]): RankedCareer[] {
    const source = storedMatches.length > 0
      ? storedMatches
      : freshMatches.map((item) => ({
          careerId: item.careerId,
          matchScore: item.matchScore,
          confidenceLevel: item.confidenceLevel,
          career: {
            id: item.careerId,
            title: item.careerTitle,
            averageSalary: null,
            category: null,
          },
          reasons: item.reasons,
          requiredSkills: item.requiredSkills,
          skillGaps: item.skillGaps,
        }));

    return source
      .map((item: any) => ({
        careerId: String(item.careerId || item?.career?.id || ''),
        career: String(item?.career?.title || item.careerTitle || 'Career Match'),
        match: Math.round(Number(item.matchScore || 0) * 100),
        confidenceLevel: (item.confidenceLevel || 'medium') as 'high' | 'medium' | 'low',
        salaryEstimate: item?.career?.averageSalary || undefined,
        category: item?.career?.category || undefined,
        reasons: Array.isArray(item.reasons) ? item.reasons : [],
        requiredSkills: Array.isArray(item.requiredSkills) ? item.requiredSkills : [],
        missingSkills: Array.isArray(item.skillGaps) ? item.skillGaps : [],
      }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 5);
  }

  private buildSkillRecommendations(
    careerMatches: RankedCareer[],
    userSkills: string[]
  ): RecommendedSkill[] {
    const normalizedUserSkills = new Set(userSkills.map((item) => item.toLowerCase().trim()));
    const skillScores = new Map<string, { score: number; reasons: string[] }>();

    careerMatches.forEach((match) => {
      match.missingSkills.forEach((skill) => {
        const normalized = skill.toLowerCase().trim();
        if (!normalized || normalizedUserSkills.has(normalized)) return;

        const current = skillScores.get(normalized) || { score: 0, reasons: [] };
        current.score += Math.max(10, Math.round(match.match * 0.4));
        current.reasons.push(`Important for ${match.career} (${match.match}% match).`);
        skillScores.set(normalized, current);
      });
    });

    return Array.from(skillScores.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 10)
      .map(([skill, meta], index) => ({
        skill: this.toTitle(skill),
        confidence: Math.max(55, Math.min(98, meta.score - index * 2)),
        reason: meta.reasons[0] || 'Recommended to improve your top career matches.',
      }));
  }

  private async buildRoadmapRecommendations(
    careerMatches: RankedCareer[],
    skillRecommendations: RecommendedSkill[]
  ): Promise<RecommendedRoadmap[]> {
    if (!careerMatches.length) {
      return [];
    }

    const keywords = new Set<string>();

    careerMatches.slice(0, 3).forEach((match) => {
      match.career
        .toLowerCase()
        .split(/[^a-z0-9+]+/)
        .filter((token) => token.length > 2)
        .forEach((token) => keywords.add(token));
      match.missingSkills.slice(0, 4).forEach((skill) => keywords.add(skill.toLowerCase()));
    });

    skillRecommendations.slice(0, 6).forEach((skill) => {
      keywords.add(skill.skill.toLowerCase());
    });

    const roadmapPool = await prisma.roadmap.findMany({
      take: 200,
      orderBy: { updatedAt: 'desc' },
    });

    const scored = roadmapPool
      .map((roadmap) => {
        const haystack = [
          roadmap.title,
          roadmap.category,
          roadmap.description,
          ...(roadmap.tags || []),
        ]
          .join(' ')
          .toLowerCase();

        let score = 0;
        for (const keyword of keywords) {
          if (!keyword) continue;
          if (haystack.includes(keyword)) score += 10;
        }

        return {
          roadmap,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => ({
        id: item.roadmap.id,
        title: item.roadmap.title,
        category: item.roadmap.category,
        level: item.roadmap.level,
        matchScore: Math.max(50, Math.min(98, item.score)),
        reason: `Aligned with your top career goals and skill-gap priorities.`,
        tags: item.roadmap.tags || [],
      }));

    return scored;
  }

  private safeJsonParse<T>(value: string, fallback: T): T {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  private toTitle(value: string): string {
    return value
      .split(/[^a-zA-Z0-9+]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}

export const recommendationEngineService = new RecommendationEngineService();
