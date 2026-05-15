// src/routes/skill.ts

import express from 'express';
import {
  getSkills,
  getSkillById,
  getSkillByName,
  getSkillsByCategory,
  createSkill,
} from '@/controllers/skill';

const router = express.Router();

router.get('/', getSkills);
router.get('/category/:category', getSkillsByCategory);
router.get('/name/:name', getSkillByName);
router.get('/:id', getSkillById);
router.post('/', createSkill);

export default router;
