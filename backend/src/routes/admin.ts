import { Router } from 'express';
import { authenticate, authorize } from '@/middleware/auth';
import * as adminController from '@/controllers/admin';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.getAdminDashboard);
router.get('/users', adminController.getUsers);
router.get('/current-users', adminController.getCurrentUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.get('/roadmaps', adminController.getRoadmapStats);
router.get('/resources', adminController.getResources);
router.post('/resources', adminController.createResource);
router.put('/resources/:id', adminController.updateResource);
router.delete('/resources/:id', adminController.deleteResource);
router.get('/assessments', adminController.getAssessmentAnalytics);

export default router;
