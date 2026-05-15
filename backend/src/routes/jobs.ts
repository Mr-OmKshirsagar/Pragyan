import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import * as jobsController from '@/controllers/jobs';

const router = Router();

router.get('/', authenticate, jobsController.getJobs);
router.post('/sync', jobsController.syncJobs);
router.post('/:jobId/apply', authenticate, jobsController.applyToJob);

export default router;