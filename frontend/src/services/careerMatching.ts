import { apiFetch } from './api';

export interface CareerMatch {
  careerId: string;
  careerTitle: string;
  matchScore: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  requiredSkills: string[];
  recommendedSkills: string[];
  skillGaps: string[];
  personalityMatch?: number;
  educationMatch: number;
  experienceMatch: number;
  reasons: string[];
}

export interface Career {
  id: string;
  title: string;
  description?: string;
  category?: string;
  averageSalary?: string;
  jobMarketDemand?: number;
  requiredEducation?: string;
  yearsExperience?: number;
  skillMappings?: Array<{ skill: string; importance: number }>;
  interestMappings?: Array<{ interest: string; importance: number }>;
}

class CareerService {
  async analyzeAssessment(assessmentData: {
    skills?: string[];
    interests?: string[];
    education?: string;
    experience?: string;
    personality?: string[];
    workStyle?: string[];
    careerGoals?: string[];
  }): Promise<CareerMatch[]> {
    return apiFetch('/career-matching/analyze', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  }

  async getCareerMatches(): Promise<any[]> {
    return apiFetch('/career-matching/matches', {
      method: 'GET',
    });
  }

  async getTopCareer(): Promise<CareerMatch> {
    return apiFetch('/career-matching/top-career', {
      method: 'GET',
    });
  }

  async getAllCareers(): Promise<Career[]> {
    return apiFetch('/career-matching/careers', {
      method: 'GET',
    });
  }

  async getCareerDetails(careerId: string): Promise<Career> {
    return apiFetch(`/career-matching/careers/${careerId}`, {
      method: 'GET',
    });
  }
}

export const careerService = new CareerService();
