import { Router } from 'express';
import * as careersController from '@/controllers/careers';

const router = Router();

router.get('/', careersController.getCareers);
router.get('/:id', careersController.getCareerById);

export default router;
