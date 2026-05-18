// src/services/assessment.ts

import { prisma } from '@/lib/prisma';
import { careerMatchingEngine } from '@/services/career-matching';
import { enhanceAndCombineScores } from '@/ai/scoringEngine';
import { generateQuestionsWithAI } from '@/ai/questionGenerator';
import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'Pragyan';

export class AssessmentService {
  /**
   * Generate dynamic assessment questions based on careers in dataset
   */
  async generateDynamicQuestions() {
    try {
      const client = new MongoClient(MONGO_URL);
      await client.connect();
      const db = client.db(DB_NAME);

      // Get all careers with their skills and interests
      const careers = await db.collection('Career').find({}).toArray();
      const skillMappings = await db.collection('CareerSkillMapping').find({}).toArray();
      const interestMappings = await db.collection('CareerInterestMapping').find({}).toArray();

      // Extract unique skills, interests, and categories
      const uniqueSkills = [...new Set(
        skillMappings.map((sm: any) => sm.skill).filter((s: string) => s && s.trim())
      )];
      const uniqueInterests = [...new Set(
        interestMappings.map((im: any) => im.interest).filter((i: string) => i && i.trim())
      )];
      const uniqueCategories = [...new Set(
        careers.map((c: any) => c.category).filter(Boolean)
      )];

      await client.close();

      // Shuffle function for variety
      const shuffle = (arr: any[]) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      // Build dynamic question set
      const questions = [
        {
          id: 'q1_career_category',
          type: 'interest',
          question: 'Which career area excites you the most?',
          category: 'Career Interest',
          options: uniqueCategories.slice(0, 4),
          dataSourced: true,
        },
        {
          id: 'q2_skills',
          type: 'interest',
          question: 'Which of these technical areas interest you?',
          category: 'Skill Interest',
          options: shuffle(uniqueSkills).slice(0, 4),
          dataSourced: true,
        },
        {
          id: 'q3_work_env',
          type: 'mcq',
          question: 'Which work environment do you prefer?',
          category: 'Work Style',
          options: [
            'Fast-paced and innovative',
            'Structured and organized',
            'Collaborative teams',
            'Independent work'
          ],
          dataSourced: false,
        },
        {
          id: 'q4_education',
          type: 'mcq',
          question: 'What is your highest level of education or target?',
          category: 'Education',
          options: ['High School', "Diploma/Bachelor's", "Master's Degree", 'PhD/Advanced'],
          dataSourced: false,
        },
        {
          id: 'q5_experience',
          type: 'interest',
          question: 'What best describes your current experience?',
          category: 'Experience',
          options: ['Fresher - No experience', 'Junior - 1-2 years', 'Mid-level - 3-5 years', 'Senior - 5+ years'],
          dataSourced: false,
        },
        {
          id: 'q6_problem_solving',
          type: 'scenario',
          question: 'When facing a complex problem, you tend to:',
          category: 'Problem Solving',
          options: [
            'Analyze data and patterns',
            'Brainstorm creative solutions',
            'Collaborate with team',
            'Use proven methodologies'
          ],
          dataSourced: false,
        },
        {
          id: 'q7_interests',
          type: 'interest',
          question: 'Which of these areas interest you most?',
          category: 'Domain Interest',
          options: shuffle(uniqueInterests).slice(0, 4),
          dataSourced: true,
        },
        {
          id: 'q8_learning_style',
          type: 'mcq',
          question: "What's your preferred learning approach?",
          category: 'Learning Style',
          options: ['Hands-on projects', 'Structured courses', 'Self-paced learning', 'Mentorship'],
          dataSourced: false,
        },
        {
          id: 'q9_workplace_values',
          type: 'mcq',
          question: "What's most important in a workplace?",
          category: 'Workplace Values',
          options: ['Growth opportunities', 'Team culture', 'Compensation', 'Meaningful work'],
          dataSourced: false,
        },
        {
          id: 'q10_coding_comfort',
          type: 'interest',
          question: 'How comfortable are you with coding/technical skills?',
          category: 'Skill Level',
          options: ['Expert', 'Intermediate', 'Beginner', 'Want to learn'],
          dataSourced: false,
        },
      ];

      return questions;
    } catch (error) {
      console.error('Error generating dynamic questions:', error);
      // Fallback to static questions if dynamic generation fails
      return this.getStaticFallbackQuestions();
    }
  }

  /**
   * Static fallback questions in case database is unavailable
   */
  getStaticFallbackQuestions() {
    return [
      {
        id: 'q1_interest',
        type: 'interest',
        question: 'What excites you the most?',
        category: 'Interest',
        options: ['Solving complex problems', 'Creating visual designs', 'Helping people', 'Analyzing data'],
      },
      {
        id: 'q2_env',
        type: 'mcq',
        question: 'Which environment do you thrive in?',
        category: 'Work Style',
        options: ['Structured and organized', 'Creative and flexible', 'Fast-paced and dynamic', 'Collaborative teams'],
      },
      {
        id: 'q3_scenario',
        type: 'scenario',
        question: 'Your team faces a critical deadline. What do you do?',
        category: 'Decision',
        options: [
          'Create a detailed plan and execute',
          'Brainstorm creative solutions',
          'Rally the team and delegate',
          'Analyze bottlenecks and optimize'
        ],
      },
      {
        id: 'q4_education',
        type: 'mcq',
        question: 'What is your highest level of education or target?',
        category: 'Education',
        options: ['High School', "Diploma/Bachelor's", "Master's Degree", 'PhD/Advanced'],
      },
      {
        id: 'q5_experience',
        type: 'interest',
        question: 'What best describes your current work experience?',
        category: 'Experience',
        options: ['Fresher - No experience', 'Junior - 1-2 years', 'Mid-level - 3-5 years', 'Senior - 5+ years'],
      },
    ];
  }

  async getQuestions() {
    // Try to generate dynamic questions from dataset
    const dynamicQuestions = await this.generateDynamicQuestions();

    // Enhance phrasing with GPT-driven question generator (non-blocking fallback)
    try {
      const enhanced = await generateQuestionsWithAI(dynamicQuestions as any);
      if (enhanced && enhanced.length) return enhanced;
    } catch (err) {
      // fall back to dataset-generated questions
    }

    return dynamicQuestions;
  }

  async getQuestionsByCategory(category: string) {
    const questions = await this.generateDynamicQuestions();
    return questions.filter((q: any) => q.category === category || q.category?.toLowerCase() === category.toLowerCase());
  }

  async submitAssessment(userId: string, answers: Record<string, string>) {
    const assessmentAnswers = this.extractAnswersForMatching(answers);

    let matches: Array<{ careerTitle: string; matchScore: number }> = [];
    try {
      matches = await careerMatchingEngine.analyzeAssessment(userId, assessmentAnswers);
    } catch (error) {
      console.error('Career matching failed:', error);
    }

    // Enhance local matches with a lightweight GPT layer for explanations and small adjustments
    const combined = await enhanceAndCombineScores(assessmentAnswers, matches as any[]).catch((e) => {
      console.error('Scoring enhancement failed:', e);
      return null;
    });

    const result = this.buildAssessmentSummary(answers, matches, assessmentAnswers);
    // Attach combinedMatches if available
    if (combined) {
      (result as any).combinedMatches = combined;
    }

    const assessmentResult = await prisma.assessmentResult.create({
      data: {
        userId,
        answers: JSON.stringify(answers),
        suggestedCareers: result.suggestedCareers,
        scores: JSON.stringify(result.scores),
        strengths: result.strengths,
        weaknesses: result.weaknesses,
      },
    });

    return assessmentResult;
  }

  async saveAssessmentSession(userId: string, answers: Record<string, string>) {
    const assessmentAnswers = this.extractAnswersForMatching(answers);

    let matches: Array<{
      careerTitle: string;
      matchScore: number;
      confidenceLevel?: string;
      skillGaps?: string[];
      reasons?: string[];
    }> = [];

    try {
      matches = await careerMatchingEngine.analyzeAssessment(userId, assessmentAnswers);
    } catch (error) {
      console.error('Career matching failed during save session:', error);
    }

    const analysis = {
      ...this.buildAssessmentSummary(answers, matches, assessmentAnswers),
      extractedProfile: assessmentAnswers,
      rankedCareers: matches.slice(0, 5).map((match) => ({
        career: match.careerTitle,
        match: Math.round(match.matchScore * 100),
        confidenceLevel: match.confidenceLevel,
        skillsNeeded: match.skillGaps?.slice(0, 5) || [],
        reasons: match.reasons || [],
      })),
      totalAnswers: Object.keys(answers).length,
      generatedAt: new Date().toISOString(),
    };
    // Attach combinedMatches to analysis when available
    try {
      const combined = await enhanceAndCombineScores(assessmentAnswers, matches as any[]).catch(() => null);
      if (combined) (analysis as any).combinedMatches = combined;
    } catch (e) {
      // ignore
    }
    const selectedOptions = Object.values(answers).map((value) => String(value));

    const session = await prisma.assessmentSession.create({
      data: {
        userId,
        answers: JSON.stringify(answers),
        selectedOptions,
        analysis: JSON.stringify(analysis),
      },
    });

    return {
      id: session.id,
      completedAt: session.completedAt,
      selectedOptions: session.selectedOptions,
      analysis,
    };
  }

  async getAssessmentHistory(userId: string) {
    const sessions = await prisma.assessmentSession.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    return sessions.map((session) => ({
      id: session.id,
      completedAt: session.completedAt,
      answers: this.safeJsonParse<Record<string, string>>(session.answers, {}),
      selectedOptions: session.selectedOptions,
      analysis: this.safeJsonParse(session.analysis, {}),
    }));
  }

  async getLatestAssessment(userId: string) {
    const latest = await prisma.assessmentSession.findFirst({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    if (!latest) {
      return null;
    }

    return {
      id: latest.id,
      completedAt: latest.completedAt,
      answers: this.safeJsonParse<Record<string, string>>(latest.answers, {}),
      selectedOptions: latest.selectedOptions,
      analysis: this.safeJsonParse(latest.analysis, {}),
    };
  }

  async getAssessmentResult(userId: string, resultId: string) {
    const result = await prisma.assessmentResult.findFirst({
      where: {
        id: resultId,
        userId,
      },
    });

    return result;
  }

  async createAssessment(payload: {
    title: string;
    description?: string | null;
    questions: { questionText: string; options: string[]; category?: string }[];
  }) {
    const { title, description, questions } = payload;

    const assessment = await prisma.assessment.create({
      data: {
        title,
        description: description ?? null,
      },
    });

    // create questions linked to assessment
    for (const q of questions) {
      await prisma.assessmentQuestion.create({
        data: {
          assessmentId: assessment.id,
          questionText: q.questionText,
          options: q.options,
          category: q.category ?? '',
        },
      });
    }

    // return assessment with its questions
    const created = await prisma.assessment.findUnique({
      where: { id: assessment.id },
      include: { questions: true },
    });

    return created;
  }

  private safeJsonParse<T>(value: string, fallback: T): T {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  private buildAssessmentSummary(
    answers: Record<string, string>,
    matches: Array<{ careerTitle: string; matchScore: number }>,
    assessmentAnswers: {
      skills: string[];
      interests: string[];
      education: string;
      experience: string;
      personality: string[];
      workStyle: string[];
      careerGoals: string[];
    }
  ) {
    const suggestedCareers = matches.length > 0
      ? matches.slice(0, 5).map((match) => match.careerTitle)
      : ['Career exploration in progress'];

    const scores = matches.reduce<Record<string, number>>((acc, match) => {
      acc[match.careerTitle] = Math.round(match.matchScore * 100);
      return acc;
    }, {});

    const strengths = [
      ...assessmentAnswers.skills.slice(0, 2).map((skill) => this.toTitleCase(skill)),
      ...assessmentAnswers.personality.slice(0, 2).map((trait) => this.toTitleCase(trait)),
      ...assessmentAnswers.interests.slice(0, 1).map((interest) => this.toTitleCase(interest)),
    ].filter(Boolean);

    const weaknesses = this.inferGrowthAreas(answers, assessmentAnswers);

    return {
      suggestedCareers,
      scores,
      strengths: strengths.length > 0 ? strengths.slice(0, 3) : ['Foundational skills developing'],
      weaknesses,
    };
  }

  private inferGrowthAreas(
    answers: Record<string, string>,
    assessmentAnswers: {
      skills: string[];
      interests: string[];
      education: string;
      experience: string;
      personality: string[];
      workStyle: string[];
      careerGoals: string[];
    }
  ): string[] {
    const growthAreas = new Set<string>();

    if (!assessmentAnswers.skills.length) growthAreas.add('Technical skills clarity');
    if (!assessmentAnswers.interests.length) growthAreas.add('Career interest exploration');
    if (!assessmentAnswers.education) growthAreas.add('Education path planning');
    if (!assessmentAnswers.experience) growthAreas.add('Hands-on project experience');

    const answerText = Object.values(answers).join(' ').toLowerCase();
    if (answerText.includes('new - i want to learn') || answerText.includes('beginner')) {
      growthAreas.add('Core technical foundations');
    }
    if (answerText.includes('team') || answerText.includes('collabor')) {
      growthAreas.add('Leadership and stakeholder communication');
    }

    if (growthAreas.size === 0) {
      growthAreas.add('Advanced specialization depth');
    }

    return Array.from(growthAreas).slice(0, 3);
  }

  private toTitleCase(value: string): string {
    return value
      .split(/[^a-zA-Z0-9+]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private extractAnswersForMatching(answers: Record<string, string>) {
    const skills = new Set<string>();
    const interests = new Set<string>();
    const personality = new Set<string>();
    const workStyle = new Set<string>();
    const careerGoals = new Set<string>();
    let education = '';
    let experience = '';

    const skillKeywords = [
      'python', 'javascript', 'react', 'node', 'java', 'kotlin', 'c++', 'rust',
      'machine learning', 'deep learning', 'data analysis', 'statistics', 'sql',
      'cybersecurity', 'devops', 'cloud', 'docker', 'kubernetes', 'testing',
    ];

    const interestKeywords = [
      'artificial intelligence', 'ai', 'web development', 'cybersecurity', 'data science',
      'ui/ux', 'product design', 'marketing', 'finance', 'operations', 'strategy',
      'research', 'backend', 'frontend', 'full-stack', 'devops',
    ];

    Object.values(answers).forEach((value) => {
      const lowerValue = String(value).toLowerCase();

      for (const keyword of skillKeywords) {
        if (lowerValue.includes(keyword)) skills.add(keyword);
      }

      for (const keyword of interestKeywords) {
        if (lowerValue.includes(keyword)) interests.add(keyword);
      }

      if (lowerValue.includes('high school')) education = 'high school';
      if (lowerValue.includes('diploma') || lowerValue.includes("bachelor")) education = "bachelor";
      if (lowerValue.includes('master')) education = "master";
      if (lowerValue.includes('phd')) education = 'phd';

      if (lowerValue.includes('fresher')) experience = 'fresher';
      if (lowerValue.includes('junior') || lowerValue.includes('1-2 years')) experience = 'junior';
      if (lowerValue.includes('mid-level') || lowerValue.includes('3-5 years')) experience = 'mid';
      if (lowerValue.includes('senior') || lowerValue.includes('5+ years')) experience = 'senior';

      if (lowerValue.includes('analytical') || lowerValue.includes('analyze') || lowerValue.includes('systematic')) personality.add('analytical');
      if (lowerValue.includes('creative') || lowerValue.includes('design') || lowerValue.includes('innovation')) personality.add('creative');
      if (lowerValue.includes('team') || lowerValue.includes('collaborative') || lowerValue.includes('inclusive')) personality.add('collaborative');
      if (lowerValue.includes('lead') || lowerValue.includes('coaching') || lowerValue.includes('decisive')) personality.add('leadership');
      if (lowerValue.includes('detail') || lowerValue.includes('quality')) personality.add('detail-oriented');

      if (lowerValue.includes('remote') || lowerValue.includes('hybrid') || lowerValue.includes('office')) {
        workStyle.add(lowerValue);
      }

      if (
        lowerValue.includes('career advancement') ||
        lowerValue.includes('mastery') ||
        lowerValue.includes('financial') ||
        lowerValue.includes('impact')
      ) {
        careerGoals.add(lowerValue);
      }
    });

    return {
      skills: Array.from(skills),
      interests: Array.from(interests),
      education,
      experience,
      personality: Array.from(personality),
      workStyle: Array.from(workStyle),
      careerGoals: Array.from(careerGoals),
    };
  }
}

export const assessmentService = new AssessmentService();
