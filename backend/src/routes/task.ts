// src/routes/task.ts

import express from 'express';
import {
  getTasksBySkill,
  getTaskById,
  createTask,
  updateTaskProgress,
} from '@/controllers/task';

const router = express.Router();

router.get('/skill/:skillId', getTasksBySkill);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:taskId/progress/:skillId', updateTaskProgress);

export default router;
