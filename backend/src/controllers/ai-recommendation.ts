// src/controllers/ai-recommendation.ts

import { Request, Response } from 'express';
import { hasGroqKey, hasGeminiKey } from '@/config/env';
import { aiRecommendationService } from '@/services/ai-recommendation';
import { aiProvider } from '@/services/aiProvider';
import { sendSuccess, sendError } from '@/utils/response';
import { asyncHandler } from '@/middleware/errorHandler';
import aiTelemetry from '@/lib/aiTelemetry';

export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const recommendations = await aiRecommendationService.recommendCareers(req.user.id);

  return sendSuccess(res, recommendations, 200, 'Career recommendations fetched');
});

export const getRecommendedRoadmaps = asyncHandler(async (req: Request, res: Response) => {
  const { career } = req.params;

  if (!career) {
    return sendError(res, 400, 'Career parameter is required');
  }

  const roadmaps = await aiRecommendationService.getRecommendedRoadmaps(career);

  return sendSuccess(res, roadmaps, 200, 'Recommended roadmaps fetched');
});

export const getPersonalizedRoadmap = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const { careerGoal, skillLevel } = req.body;

  if (!careerGoal || !skillLevel) {
    return sendError(res, 400, 'careerGoal and skillLevel are required');
  }

  const roadmaps = await aiRecommendationService.generatePersonalizedRoadmap(
    req.user.id,
    careerGoal,
    skillLevel
  );

  return sendSuccess(res, roadmaps, 200, 'Personalized roadmaps generated');
});

export const getStatus = asyncHandler(async (_req: Request, res: Response) => {
  const runtime = aiProvider.getRuntime();
  return sendSuccess(
    res,
    {
      enabled: runtime.provider !== 'local',
      provider: runtime.provider,
      model: runtime.model,
      fallbackAvailable: {
        gemini: hasGeminiKey,
        groq: hasGroqKey,
      },
    },
    200,
    'AI status fetched'
  );
});

export const getTelemetry = asyncHandler(async (_req: Request, res: Response) => {
  const data = aiTelemetry.getTelemetry();
  return sendSuccess(res, data, 200, 'AI telemetry');
});

export const chatAssistant = asyncHandler(async (req: Request, res: Response) => {
  const { message, context = {}, history = [] } = req.body || {};

  if (!message || typeof message !== 'string') {
    return sendError(res, 400, 'message is required');
  }

  const historyText = Array.isArray(history)
    ? history
        .slice(-6)
        .map((entry: any) => `${entry?.role === 'assistant' ? 'Assistant' : 'User'}: ${String(entry?.content || '')}`)
        .join('\n')
    : '';

  const prompt = [
    'You are Pragyan, an AI career operating system assistant.',
    'Answer in concise markdown with practical bullet points when helpful.',
    'Use career guidance, roadmap help, resume help, and interview preparation as your primary domains.',
    context.career ? `Current top career context: ${context.career}` : '',
    context.roadmap ? `Relevant roadmap context: ${context.roadmap}` : '',
    context.goal ? `User goal: ${context.goal}` : '',
    historyText ? `Conversation so far:\n${historyText}` : '',
    `User message: ${message}`,
    'If the request needs backend data you do not have, be transparent and suggest the closest available Pragyan feature.',
    'Return a helpful response only.'
  ].filter(Boolean).join('\n\n');

  try {
    const reply = await aiProvider.generateText(prompt);
    return sendSuccess(res, { reply, provider: aiProvider.getRuntime().provider, fallbackUsed: false }, 200, 'AI assistant response');
  } catch (error) {
    const fallback = 'I can help with that. Based on your current Pragyan data, focus on the top recommended career, align your roadmap, and keep your resume targeted to the skills gap.';
    return sendSuccess(res, { reply: fallback, provider: aiProvider.getRuntime().provider, fallbackUsed: true }, 200, 'AI assistant fallback response');
  }
});

export const generateAssessmentReport = asyncHandler(async (req: Request, res: Response) => {
  const { topMatches = [], confidence = 0, strengths = [], weaknesses = [], targetCareer } = req.body || {};

  if (!Array.isArray(topMatches) || !topMatches.length) {
    return sendError(res, 400, 'topMatches is required');
  }

  const prompt = [
    'You are an AI explainer for Pragyan career assessment.',
    'Important: you are NOT allowed to choose or change careers. Recommendation ranking is already decided by deterministic engine.',
    `Top matches (fixed): ${JSON.stringify(topMatches)}`,
    `Confidence score (fixed): ${Number(confidence)}`,
    `Strengths: ${Array.isArray(strengths) ? strengths.join(', ') : ''}`,
    `Growth areas: ${Array.isArray(weaknesses) ? weaknesses.join(', ') : ''}`,
    targetCareer ? `Primary target career: ${String(targetCareer)}` : '',
    'Return JSON with keys: summary, insights (string[]), skillGapAnalysis (string[]), interviewPlan (string[]).',
  ].filter(Boolean).join('\n\n');

  try {
    const raw = await aiProvider.generateText(prompt);
    return sendSuccess(res, { report: raw, mode: 'explainer-only' }, 200, 'AI report generated');
  } catch {
    const fallback = {
      summary: 'Your deterministic assessment indicates a strong fit for the top ranked role with actionable next steps.',
      insights: ['Build consistency in your strongest signal areas.', 'Translate strengths into projects and interview stories.'],
      skillGapAnalysis: ['Focus on role-specific practical depth.', 'Close missing foundational competencies with weekly practice.'],
      interviewPlan: ['Revise fundamentals', 'Practice scenario-based answers', 'Run mock interviews'],
    };
    return sendSuccess(res, { report: fallback, mode: 'fallback-explainer' }, 200, 'AI report fallback generated');
  }
});

export const generateLearningRoadmap = asyncHandler(async (req: Request, res: Response) => {
  const { targetCareer, skillGaps = [], timelineWeeks = 12, profileSummary = '' } = req.body || {};

  if (!targetCareer) {
    return sendError(res, 400, 'targetCareer is required');
  }

  const prompt = [
    'You are a roadmap assistant for Pragyan.',
    'Important: do not select careers or alter ranking. Only generate a learning roadmap for the already-selected target role.',
    `Target career (fixed): ${String(targetCareer)}`,
    `Skill gaps: ${Array.isArray(skillGaps) ? skillGaps.join(', ') : ''}`,
    `Timeline in weeks: ${Number(timelineWeeks)}`,
    `Profile summary: ${String(profileSummary)}`,
    'Return concise markdown with week-by-week milestones, projects, and interview prep checkpoints.',
  ].join('\n\n');

  console.log('[AI ROADMAP START]', { targetCareer, timestamp: new Date().toISOString() });
  try {
    const roadmap = await aiProvider.generateText(prompt);
    console.log('[AI ROADMAP SUCCESS]', { targetCareer, timestamp: new Date().toISOString() });
    return sendSuccess(res, { roadmap, mode: 'explainer-only' }, 200, 'AI roadmap generated');
  } catch (error) {
    console.error('[AI ROADMAP ERROR]', { error: (error as any)?.message || error, targetCareer, timestamp: new Date().toISOString() });
    const fallback = {
      week1to4: ['Strengthen core fundamentals', 'Complete 1 guided mini project'],
      week5to8: ['Build production-quality project', 'Document outcomes and trade-offs'],
      week9to12: ['Mock interviews', 'Portfolio polishing', 'Targeted applications'],
    };
    return sendSuccess(res, { roadmap: fallback, mode: 'fallback-explainer', fallback: true }, 200, 'AI roadmap fallback generated');
  }
});
