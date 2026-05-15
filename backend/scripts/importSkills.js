const path = require('path');
const { PrismaClient } = require('@prisma/client');
const {
  loadTabularFile,
  listDatasetFiles,
  normalizeSkillName,
  normalizeText,
  splitList,
  toTitle,
  pickFirst,
  uniqueBy,
} = require('./import-utils');

const prisma = new PrismaClient();

function inferSkillCategory(skill) {
  const s = normalizeText(skill);
  if (s.includes('python') || s.includes('javascript') || s.includes('java') || s.includes('typescript')) return 'programming';
  if (s.includes('machine learning') || s.includes('deep learning') || s.includes('nlp')) return 'ai-ml';
  if (s.includes('docker') || s.includes('kubernetes') || s.includes('cloud')) return 'devops';
  if (s.includes('security') || s.includes('network')) return 'cybersecurity';
  if (s.includes('react') || s.includes('frontend') || s.includes('ui')) return 'frontend';
  if (s.includes('backend') || s.includes('api') || s.includes('database') || s.includes('sql')) return 'backend';
  return 'tools';
}

function inferDifficulty(skill) {
  const s = normalizeText(skill);
  if (s.includes('deep learning') || s.includes('kubernetes') || s.includes('distributed')) return 'advanced';
  if (s.includes('python') || s.includes('javascript') || s.includes('sql') || s.includes('react')) return 'intermediate';
  return 'beginner';
}

async function main() {
  const datasetsDir = path.join(__dirname, '../datasets');
  const datasetFiles = listDatasetFiles(datasetsDir);

  const aggregate = [];
  for (const filePath of datasetFiles) {
    const rows = loadTabularFile(filePath);
    rows.forEach((row) => {
      const skills = splitList(pickFirst(row, ['Skills', 'skills', 'required_skills', 'RequiredSkills']))
        .map((skill) => normalizeSkillName(skill))
        .filter(Boolean);

      const career = toTitle(pickFirst(row, ['Recommended_Career', 'career', 'Career', 'career_name', 'Role', 'JobRole']));
      skills.forEach((skill) => aggregate.push({ skill, career }));
    });
  }

  const uniqueSkills = uniqueBy(aggregate, (item) => item.skill);
  for (const item of uniqueSkills) {
    const skillName = toTitle(item.skill);
    await prisma.skill.upsert({
      where: { skillName },
      update: {
        skillCategory: inferSkillCategory(skillName),
        difficulty: inferDifficulty(skillName),
        updatedAt: new Date(),
      },
      create: {
        skillName,
        skillCategory: inferSkillCategory(skillName),
        difficulty: inferDifficulty(skillName),
        description: `${skillName} learning track`,
        totalDuration: '4 weeks',
        estimatedHours: 20,
        icon: 'BookOpen',
        color: '#4F46E5',
        prerequisites: [],
        relatedSkills: [],
        totalDays: 28,
      },
    });
  }

  console.log(`Skill import completed. Unique skills synced: ${uniqueSkills.length}`);
}

main()
  .catch((error) => {
    console.error('Skill import failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
