const path = require('path');
const { PrismaClient } = require('@prisma/client');
const {
  loadTabularFile,
  listDatasetFiles,
  normalizeText,
  normalizeSkillName,
  splitList,
  toTitle,
  pickFirst,
  uniqueBy,
} = require('./import-utils');

const prisma = new PrismaClient();

function normalizeCategory(value) {
  const v = normalizeText(value);
  if (v.includes('ai') || v.includes('machine learning') || v.includes('data')) return 'ai-ml';
  if (v.includes('frontend') || v.includes('ui') || v.includes('react')) return 'frontend';
  if (v.includes('backend') || v.includes('api') || v.includes('server')) return 'backend';
  if (v.includes('cyber') || v.includes('security')) return 'cybersecurity';
  if (v.includes('cloud') || v.includes('devops')) return 'devops';
  if (v.includes('programming') || v.includes('language')) return 'programming-languages';
  return 'technology';
}

function inferRoadmapLevel(skills) {
  const skillText = skills.join(' ').toLowerCase();
  if (skillText.includes('deep learning') || skillText.includes('kubernetes')) return 'advanced';
  if (skillText.includes('python') || skillText.includes('javascript') || skillText.includes('sql')) return 'intermediate';
  return 'beginner';
}

async function main() {
  const datasetsDir = path.join(__dirname, '../datasets');
  const datasetFiles = listDatasetFiles(datasetsDir);

  const rows = [];
  for (const filePath of datasetFiles) {
    rows.push(...loadTabularFile(filePath));
  }

  const extracted = rows.map((row) => {
    const career = toTitle(pickFirst(row, ['Recommended_Career', 'career', 'Career', 'Role', 'JobRole']));
    const rawCategory = pickFirst(row, ['category', 'Category', 'domain', 'Domain']) || career;
    const skills = splitList(pickFirst(row, ['Skills', 'skills', 'required_skills', 'RequiredSkills']))
      .map((skill) => normalizeSkillName(skill))
      .filter(Boolean);

    if (!career) return null;

    return {
      title: `${career} Roadmap`,
      category: normalizeCategory(rawCategory),
      description: `Learning path for ${career}`,
      level: inferRoadmapLevel(skills),
      duration: '8-12 weeks',
      icon: 'Target',
      estimatedHours: 80,
      tags: [...new Set([normalizeCategory(rawCategory), ...skills.slice(0, 8)])],
    };
  }).filter(Boolean);

  const uniqueRoadmaps = uniqueBy(extracted, (item) => `${item.title.toLowerCase()}::${item.category}`);

  let created = 0;
  for (const roadmap of uniqueRoadmaps) {
    const existing = await prisma.roadmap.findFirst({
      where: {
        title: roadmap.title,
        category: roadmap.category,
      },
    });

    if (existing) continue;

    await prisma.roadmap.create({
      data: roadmap,
    });

    created += 1;
  }

  console.log(`Roadmap import completed. New roadmaps created: ${created}`);
}

main()
  .catch((error) => {
    console.error('Roadmap import failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
