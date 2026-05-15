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
} = require('./import-utils');

const prisma = new PrismaClient();

function inferCategory(title) {
  const t = normalizeText(title);
  if (t.includes('data')) return 'Data & Analytics';
  if (t.includes('ai') || t.includes('machine learning')) return 'AI & ML';
  if (t.includes('security') || t.includes('cyber')) return 'Cybersecurity';
  if (t.includes('devops') || t.includes('cloud')) return 'DevOps & Cloud';
  if (t.includes('frontend') || t.includes('backend') || t.includes('software')) return 'Software Development';
  if (t.includes('design') || t.includes('ux') || t.includes('ui')) return 'Design';
  return 'Technology';
}

async function upsertCareer(row) {
  const careerNameRaw = pickFirst(row, [
    'Recommended_Career',
    'career',
    'Career',
    'career_name',
    'Role',
    'JobRole',
  ]);

  const careerName = toTitle(careerNameRaw);
  if (!careerName) return;

  const skills = splitList(pickFirst(row, ['Skills', 'skills', 'required_skills', 'RequiredSkills']))
    .map((s) => normalizeSkillName(s))
    .filter(Boolean);

  const interests = splitList(pickFirst(row, ['Interests', 'interests', 'interest_areas']))
    .map((s) => normalizeText(s))
    .filter(Boolean);

  const salary = pickFirst(row, ['Salary', 'salary_range', 'SalaryRange']) || null;
  const education = pickFirst(row, ['Education', 'education', 'required_education']) || null;
  const yearsExperienceRaw = pickFirst(row, ['Experience', 'years_experience', 'YearsExperience']);
  const yearsExperience = Number.parseInt(String(yearsExperienceRaw || '').replace(/[^0-9]/g, ''), 10);

  const career = await prisma.career.upsert({
    where: { title: careerName },
    update: {
      category: inferCategory(careerName),
      averageSalary: salary,
      requiredEducation: education,
      yearsExperience: Number.isNaN(yearsExperience) ? null : yearsExperience,
      updatedAt: new Date(),
    },
    create: {
      title: careerName,
      description: `Career path: ${careerName}`,
      category: inferCategory(careerName),
      averageSalary: salary,
      requiredEducation: education,
      yearsExperience: Number.isNaN(yearsExperience) ? null : yearsExperience,
      jobMarketDemand: 80,
    },
  });

  for (const skill of [...new Set(skills)]) {
    await prisma.careerSkillMapping.upsert({
      where: {
        careerId_skill: {
          careerId: career.id,
          skill,
        },
      },
      update: {},
      create: {
        careerId: career.id,
        skill,
        importance: 1,
      },
    });
  }

  for (const interest of [...new Set(interests)]) {
    await prisma.careerInterestMapping.upsert({
      where: {
        careerId_interest: {
          careerId: career.id,
          interest,
        },
      },
      update: {},
      create: {
        careerId: career.id,
        interest,
        importance: 1,
      },
    });
  }
}

async function main() {
  const datasetsDir = path.join(__dirname, '../datasets');
  const datasetFiles = listDatasetFiles(datasetsDir);

  if (!datasetFiles.length) {
    console.log('No dataset files found in backend/datasets');
    return;
  }

  let imported = 0;
  for (const filePath of datasetFiles) {
    const rows = loadTabularFile(filePath);
    for (const row of rows) {
      const hasCareer = pickFirst(row, ['Recommended_Career', 'career', 'Career', 'career_name', 'Role', 'JobRole']);
      if (!hasCareer) continue;
      await upsertCareer(row);
      imported += 1;
    }
  }

  console.log(`Career import completed. Processed rows: ${imported}`);
}

main()
  .catch((error) => {
    console.error('Career import failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
