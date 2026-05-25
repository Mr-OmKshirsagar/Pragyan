import { prisma } from '@/lib/prisma';

export class AIMemoryService {
  async getProfile(userId: string) {
    return prisma.aIMemoryProfile.findFirst({ where: { userId } });
  }

  async saveProfile(userId: string, profileData: any, compositeScore?: number, xp?: number) {
    const existing = await prisma.aIMemoryProfile.findFirst({ where: { userId } });
    if (existing) {
      return prisma.aIMemoryProfile.update({ where: { id: existing.id }, data: { profileData, compositeScore, xp, lastUpdated: new Date() } });
    }

    return prisma.aIMemoryProfile.create({ data: { userId, profileData, compositeScore, xp: xp || 0 } });
  }

  async recordRecommendation(userId: string, recommendation: any, reason?: string, score?: number, source?: string) {
    return prisma.recommendationHistory.create({ data: { userId, recommendation, reason, score, source } });
  }

  async recordRoadmapMutation(userId: string, mutation: any, reason?: string) {
    return prisma.roadmapMutation.create({ data: { userId, mutation, reason } });
  }

  async getPersonality(userId: string) {
    return prisma.personalityProfile.findFirst({ where: { userId }, orderBy: { lastEvaluatedAt: 'desc' } });
  }

  async savePersonality(userId: string, profile: any, confidence?: number) {
    const existing = await prisma.personalityProfile.findFirst({ where: { userId } });
    if (existing) {
      return prisma.personalityProfile.update({ where: { id: existing.id }, data: { profile, confidence } });
    }
    return prisma.personalityProfile.create({ data: { userId, profile, confidence } });
  }

  async recordLearningVelocity(userId: string, windowStart: Date, windowEnd: Date, metrics: any) {
    return prisma.learningVelocity.create({ data: { userId, windowStart, windowEnd, metrics } });
  }

  async getLearningVelocities(userId: string, limit = 20) {
    return prisma.learningVelocity.findMany({ where: { userId }, orderBy: { windowStart: 'desc' }, take: limit });
  }

  async getRecommendationHistory(userId: string, limit = 50) {
    return prisma.recommendationHistory.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit });
  }

  async recordFeedback(userId: string, target: any, feedbackType: string, note?: string) {
    const recommendation = { target, feedbackType, note };
    return prisma.recommendationHistory.create({ data: { userId, recommendation, reason: note || feedbackType, source: 'feedback' } });
  }
}

export const aiMemoryService = new AIMemoryService();
