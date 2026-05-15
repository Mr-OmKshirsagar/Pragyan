// src/routes/progress.ts

import { Router } from 'express';
import * as progressController from '@/controllers/progress';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/:roadmapId', progressController.getProgress);
router.post('/complete-task', progressController.completeTask);
router.post('/complete-roadmap', progressController.completeRoadmap);
router.get('/user/dashboard', progressController.getDashboard);

export default router;
