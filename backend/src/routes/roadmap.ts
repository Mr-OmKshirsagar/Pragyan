// src/routes/roadmap.ts

import { Router } from 'express';
import * as roadmapController from '@/controllers/roadmap';
import { validate } from '@/middleware/validator';
import { createRoadmapSchema } from '@/validators/roadmap';
import { saveRoadmapProgressSchema, updateRoadmapTaskSchema } from '@/validators/progress';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

// Public routes
router.get('/', roadmapController.getAllRoadmaps);
router.get('/search', roadmapController.searchRoadmaps);
router.get('/categories', roadmapController.getCategories);
router.get('/category/:category', roadmapController.getRoadmapsByCategory);

// Authenticated user progress routes
router.post('/progress', authenticate, validate(saveRoadmapProgressSchema), roadmapController.saveRoadmapProgress);
router.get('/progress', authenticate, roadmapController.getRoadmapProgress);
router.patch('/task/:id', authenticate, validate(updateRoadmapTaskSchema), roadmapController.updateRoadmapTaskProgress);

router.get('/:id', roadmapController.getRoadmap);
router.get('/skillup/:careerId', authenticate, roadmapController.skillUp);

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), validate(createRoadmapSchema), roadmapController.createRoadmap);
router.put('/:id', authenticate, authorize('ADMIN'), validate(createRoadmapSchema), roadmapController.updateRoadmap);
router.delete('/:id', authenticate, authorize('ADMIN'), roadmapController.deleteRoadmap);

export default router;
