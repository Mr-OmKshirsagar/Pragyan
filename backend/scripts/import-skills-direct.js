/**
 * Direct MongoDB import for skills
 */

const { MongoClient } = require('mongodb');
const path = require('path');
const {
  loadTabularFile,
  listDatasetFiles,
  normalizeSkillName,
  splitList,
  pickFirst,
} = require('./import-utils');

const MONGO_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const DB_NAME = 'Pragyan';

function inferSkillCategory(skillName) {
  const s = skillName.toLowerCase();
  if (s.includes('python') || s.includes('java') || s.includes('javascript') || s.includes('c++')) return 'Programming';
  if (s.includes('sql') || s.includes('database') || s.includes('mongodb')) return 'Databases';
  if (s.includes('ml') || s.includes('machine learning') || s.includes('deep learning')) return 'Machine Learning';
  if (s.includes('react') || s.includes('angular') || s.includes('vue')) return 'Frontend';
  if (s.includes('docker') || s.includes('kubernetes') || s.includes('devops')) return 'DevOps';
  if (s.includes('aws') || s.includes('azure') || s.includes('cloud')) return 'Cloud';
  return 'General';
}

function inferSkillDifficulty(skillName) {
  const s = skillName.toLowerCase();
  if (s.includes('advanced') || s.includes('deep learning') || s.includes('kubernetes')) return 'Advanced';
  if (s.includes('intermediate') || s.includes('machine learning') || s.includes('docker')) return 'Intermediate';
  return 'Beginner';
}

async function importSkills() {
  const client = new MongoClient(MONGO_URL);

  try {
    console.log(`🔌 Connecting to MongoDB: ${MONGO_URL}`);
    await client.connect();
    const db = client.db(DB_NAME);
    const skillsCollection = db.collection('Skill');
    const skillMappingsCollection = db.collection('CareerSkillMapping');

    // Find dataset file
    const datasetsDir = path.join(__dirname, '../datasets');
    const datasets = listDatasetFiles(datasetsDir);
    if (datasets.length === 0) {
      console.error('❌ No dataset files found in backend/datasets/');
      return process.exit(1);
    }

    const datasetFile = datasets[0];
    console.log(`📂 Loading dataset: ${path.basename(datasetFile)}`);

    const rows = loadTabularFile(datasetFile);
    if (!rows || rows.length === 0) {
      console.error('❌ No data in dataset file');
      return process.exit(1);
    }

    const uniqueSkills = new Set();

    // Aggregate all skills from dataset
    for (const row of rows) {
      const skillsStr = pickFirst(row, ['Skills', 'skills', 'required_skills', 'RequiredSkills']);
      const skills = splitList(skillsStr)
        .map((s) => normalizeSkillName(s))
        .filter(Boolean);

      skills.forEach((skill) => uniqueSkills.add(skill));
    }

    console.log(`📊 Found ${uniqueSkills.size} unique skills`);

    let importedCount = 0;
    for (const skill of Array.from(uniqueSkills)) {
      await skillsCollection.updateOne(
        { name: skill },
        {
          $set: {
            name: skill,
            category: inferSkillCategory(skill),
            difficulty: inferSkillDifficulty(skill),
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
      importedCount++;
    }

    console.log(`✅ Successfully imported ${importedCount} skills`);
  } catch (err) {
    console.error('❌ Import failed:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

importSkills();
