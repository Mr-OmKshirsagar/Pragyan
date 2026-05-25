import { prisma } from '@/lib/prisma';

export class DecisionSnapshotService {
  async createSnapshot(userId: string, snapshot: any) {
    try {
      const top = (snapshot?.evaluated || []).slice(0, 5).map((s: any) => s.career || s.careerTitle || s.title || String(s));
      const meta = snapshot?.meta || {};
      // use bracket access to avoid TypeScript Prisma client typing until client is regenerated
      const model = (prisma as any)['decisionSnapshot'];
      if (!model) return null; // gracefully no-op when client not generated yet
      return model.create({ data: { userId, snapshot, topItems: top, meta } });
    } catch (e) {
      // swallow - non-blocking
      return null;
    }
  }

  async getSnapshots(userId: string, limit = 50) {
    const model = (prisma as any)['decisionSnapshot'];
    if (!model) return [];
    return model.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit });
  }
}

export const decisionSnapshotService = new DecisionSnapshotService();
