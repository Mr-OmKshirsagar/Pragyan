// src/routes/assessment.ts

import { Router } from 'express';
import * as assessmentController from '@/controllers/assessment';
import { authenticate } from '@/middleware/auth';
import { authorize } from '@/middleware/auth';
import { validate } from '@/middleware/validator';
import { assessmentAnswersSchema } from '@/validators/assessment';
import { assessmentCreateSchema } from '@/validators/assessment';
import { MongoClient } from 'mongodb';

const router = Router();

router.get('/questions', assessmentController.getQuestions);
router.get('/questions/:category', assessmentController.getQuestionsByCategory);

router.post('/create', authenticate, authorize('ADMIN'), validate(assessmentCreateSchema), assessmentController.createAssessment);

router.post('/submit', authenticate, assessmentController.submitAssessment);
router.get('/result/:resultId', authenticate, assessmentController.getAssessmentResult);
router.post('/save', authenticate, validate(assessmentAnswersSchema), assessmentController.saveAssessment);
router.get('/history', authenticate, assessmentController.getAssessmentHistory);
router.get('/latest', authenticate, assessmentController.getLatestAssessment);

/**
 * GET /api/assessment/metadata
 * Get assessment coverage info - what careers/skills/interests are covered
 */
router.get('/metadata', async (_req, res) => {
  try {
    const MONGO_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
    const DB_NAME = process.env.DB_NAME || 'Pragyan';
    
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const db = client.db(DB_NAME);

    // Get statistics
    const careerCount = await db.collection('Career').countDocuments();
    const skillCount = await db.collection('CareerSkillMapping').countDocuments();
    const interestCount = await db.collection('CareerInterestMapping').countDocuments();

    // Get unique categories
    const careers = await db.collection('Career').find({}).project({ category: 1 }).toArray();
    const categories = [...new Set(careers.map((c: any) => c.category).filter(Boolean))];

    // Get sample careers
    const sampleCareers = await db
      .collection('Career')
      .find({})
      .limit(10)
      .toArray();

    await client.close();

    return res.json({
      success: true,
      data: {
        assessmentCoverage: {
          totalJobRoles: careerCount,
          totalSkillsInDataset: skillCount,
          totalInterestsMapped: interestCount,
          uniqueCategories: categories.length,
          categories: categories.sort(),
          questionsGenerated: 10,
          message: `Assessment is dynamically generated from ${careerCount} job roles with ${skillCount} skill mappings and ${interestCount} interest mappings`
        },
        sampleCareers: sampleCareers.slice(0, 5).map((c: any) => c.title),
        status: 'Dataset-driven assessment system active'
      }
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch assessment metadata'
    });
  }
});

export default router;
