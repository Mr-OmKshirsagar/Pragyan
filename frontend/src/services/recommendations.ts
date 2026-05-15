import { apiFetch } from './api';

export interface CareerRecommendation {
  career: string;
  score: number;
  reason: string;
}

export interface SkillRecommendation {
  skill: string;
  confidence: number;
  reason: string;
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
}

export interface RecommendationBundle {
  topCareer: {
    careerId: string;
    career: string;
    match: number;
    confidenceLevel: 'high' | 'medium' | 'low';
    salaryEstimate?: string;
    category?: string;
    reasons: string[];
    requiredSkills: string[];
    missingSkills: string[];
  } | null;
  careerMatches: Array<{
    careerId: string;
    career: string;
    match: number;
    confidenceLevel: 'high' | 'medium' | 'low';
    salaryEstimate?: string;
    category?: string;
    reasons: string[];
    requiredSkills: string[];
    missingSkills: string[];
  }>;
  skillRecommendations: SkillRecommendation[];
  roadmapRecommendations: Array<{
    id: string;
    title: string;
    category: string;
    level: string;
    matchScore: number;
    reason: string;
    tags: string[];
  }>;
}

export interface RecommendationProfileInput {
  skills?: string[];
  interests?: string[];
  personality?: string[];
  education?: string;
  experience?: string;
  workStyle?: string[];
  learningPreferences?: string[];
}

export async function generateRecommendations(
  profile: RecommendationProfileInput = {}
): Promise<RecommendationBundle> {
  const response = await apiFetch<{ data: RecommendationBundle }>(
    '/api/recommendations',
    {
      method: 'POST',
      body: JSON.stringify(profile),
    },
    { auth: true }
  );
  return response.data;
}

export async function getTopCareerRecommendation() {
  const response = await apiFetch<{ data: RecommendationBundle['topCareer'] }>(
    '/api/recommendations/top-career',
    undefined,
    { auth: true }
  );
  return response.data;
}

export async function getRoadmapRecommendations() {
  const response = await apiFetch<{ data: RecommendationBundle['roadmapRecommendations'] }>(
    '/api/recommendations/roadmaps',
    undefined,
    { auth: true }
  );
  return response.data ?? [];
}

export async function getCareerRecommendations(): Promise<CareerRecommendation[]> {
  const response = await apiFetch<{ data: CareerRecommendation[] }>(
    '/api/recommendations/careers',
    undefined,
    { auth: true }
  );
  return response.data ?? [];
}

export async function getSkillRecommendations(): Promise<SkillRecommendation[]> {
  const response = await apiFetch<{ data: SkillRecommendation[] }>(
    '/api/recommendations/skills',
    undefined,
    { auth: true }
  );
  return response.data ?? [];
}

export async function getJobRecommendations(): Promise<JobRecommendation[]> {
  const response = await apiFetch<{ data: JobRecommendation[] }>(
    '/api/recommendations/jobs',
    undefined,
    { auth: true }
  );
  return response.data ?? [];
}
