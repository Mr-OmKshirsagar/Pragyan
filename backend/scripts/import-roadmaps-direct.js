/**
 * Direct MongoDB import for roadmaps
 */

const { MongoClient } = require('mongodb');
const path = require('path');
const {
  loadTabularFile,
  listDatasetFiles,
  normalizeText,
  normalizeSkillName,
  splitList,
  toTitle,
  pickFirst,
} = require('./import-utils');

const MONGO_URL = process.env.DATABASE_URL;
if (!MONGO_URL) {
  throw new Error('DATABASE_URL must point to MongoDB Atlas');
}
const DB_NAME = 'Pragyan';

function inferRoadmapLevel(careerTitle, skillsList) {
  const allText = (careerTitle + ' ' + skillsList.join(' ')).toLowerCase();
  if (allText.includes('deep learning') || allText.includes('advanced') || allText.includes('research')) return 'Advanced';
  if (allText.includes('machine learning') || allText.includes('full stack') || allText.includes('specialist')) return 'Intermediate';
  return 'Beginner';
}

async function importRoadmaps() {
  const client = new MongoClient(MONGO_URL);

  try {
    console.log(`🔌 Connecting to MongoDB: ${MONGO_URL}`);
    await client.connect();
    const db = client.db(DB_NAME);
    const roadmapsCollection = db.collection('Roadmap');

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

    const processedRoadmaps = new Set();
    let importedCount = 0;

    for (const row of rows) {
      const careerNameRaw = pickFirst(row, [
        'Recommended_Career',
        'career',
        'Career',
        'career_name',
        'Role',
        'JobRole',
      ]);

      const careerName = toTitle(careerNameRaw);
      if (!careerName) continue;

      const roadmapKey = `${careerName}_roadmap`;
      if (processedRoadmaps.has(roadmapKey)) continue;
      processedRoadmaps.add(roadmapKey);

      const skills = splitList(pickFirst(row, ['Skills', 'skills', 'required_skills', 'RequiredSkills']))
        .map((s) => normalizeSkillName(s))
        .filter(Boolean);

      const level = inferRoadmapLevel(careerName, skills);

      // Extract category from career name
      const category = careerName.includes('Data') ? 'Data & Analytics'
        : careerName.includes('Software') ? 'Software Development'
        : careerName.includes('Design') ? 'Design'
        : careerName.includes('DevOps') ? 'DevOps & Cloud'
        : careerName.includes('AI') || careerName.includes('Machine Learning') ? 'AI & ML'
        : 'Technology';

      const roadmap = {
        title: `${careerName} Roadmap`,
        description: `A comprehensive roadmap for becoming a ${careerName}`,
        category,
        level,
        duration: level === 'Advanced' ? '12 months' : level === 'Intermediate' ? '6-9 months' : '3-6 months',
        icon: level === 'Advanced' ? '🚀' : level === 'Intermediate' ? '📚' : '🌱',
        estimatedHours: level === 'Advanced' ? 480 : level === 'Intermediate' ? 240 : 120,
        tags: skills.slice(0, 5), // Top 5 skills as tags
        milestones: [
          { title: 'Foundation', description: 'Learn core concepts' },
          { title: 'Development', description: 'Build practical projects' },
          { title: 'Specialization', description: 'Deep dive into specialties' },
          { title: 'Mastery', description: 'Become an expert' },
        ],
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await roadmapsCollection.insertOne(roadmap);
      console.log(`✓ Created roadmap: ${roadmap.title}`);
      importedCount++;
    }

    console.log(`\n✅ Successfully imported ${importedCount} roadmaps`);
  } catch (err) {
    console.error('❌ Import failed:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

importRoadmaps();
