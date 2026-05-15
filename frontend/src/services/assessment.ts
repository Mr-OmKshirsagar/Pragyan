import { apiFetch } from './api';

export interface Question {
  id: string;
  type: 'mcq' | 'scenario' | 'interest';
  question: string;
  options: string[];
  category: string;
  dataSourced?: boolean;
}

export interface AssessmentSession {
  id: string;
  completedAt: string;
  answers: Record<string, string>;
  selectedOptions: string[];
  analysis: {
    suggestedCareers?: string[];
    scores?: Record<string, number>;
    strengths?: string[];
    weaknesses?: string[];
    rankedCareers?: Array<{
      career: string;
      match: number;
      confidenceLevel?: string;
      skillsNeeded?: string[];
      reasons?: string[];
    }>;
  };
}

/**
 * Fetch dynamic assessment questions from backend
 * Questions are generated based on actual job roles in the dataset
 */
export async function getDynamicAssessmentQuestions() {
  try {
    const response = await apiFetch<{ data: Question[] }>(
      '/api/assessment/questions',
      undefined,
      { auth: false }
    );
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch dynamic questions:', error);
    return [];
  }
}

/**
 * Fetch assessment metadata - what careers/skills/interests are covered
 */
export async function getAssessmentMetadata() {
  try {
    const response = await apiFetch<{
      data: {
        assessmentCoverage: {
          totalJobRoles: number;
          totalSkillsInDataset: number;
          totalInterestsMapped: number;
          uniqueCategories: number;
          categories: string[];
          questionsGenerated: number;
          message: string;
        };
        sampleCareers: string[];
        status: string;
      };
    }>('/api/assessment/metadata', undefined, { auth: false });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assessment metadata:', error);
    return null;
  }
}

export async function saveAssessment(answers: Record<string, string>) {
  const response = await apiFetch<{ data: AssessmentSession }>(
    '/api/assessment/save',
    {
      method: 'POST',
      body: JSON.stringify({ answers }),
    },
    { auth: true }
  );
  return response.data;
}

export async function getAssessmentHistory() {
  const response = await apiFetch<{ data: AssessmentSession[] }>(
    '/api/assessment/history',
    undefined,
    { auth: true }
  );
  return response.data;
}

export async function getLatestAssessment() {
  const response = await apiFetch<{ data: AssessmentSession | null }>(
    '/api/assessment/latest',
    undefined,
    { auth: true }
  );
  return response.data;
}
