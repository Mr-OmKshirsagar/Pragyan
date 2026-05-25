/**
 * Direct MongoDB import script (no Prisma, no transactions)
 * Bypasses replica set requirement for initial data load
 */

const { MongoClient, ObjectId } = require('mongodb');
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

async function importCareers() {
  const client = new MongoClient(MONGO_URL);

  try {
    console.log(`🔌 Connecting to MongoDB: ${MONGO_URL}`);
    await client.connect();
    const db = client.db(DB_NAME);
    const careersCollection = db.collection('Career');
    const skillMappingsCollection = db.collection('CareerSkillMapping');
    const interestMappingsCollection = db.collection('CareerInterestMapping');

    // Find dataset file
    const datasetsDir = path.join(__dirname, '../datasets');
    const datasets = listDatasetFiles(datasetsDir);
    if (datasets.length === 0) {
      console.error('❌ No dataset files found in backend/datasets/');
      return process.exit(1);
    }

    const datasetFile = datasets[0]; // Already a full path
    const datasetName = path.basename(datasetFile);
    console.log(`📂 Loading dataset: ${datasetName}`);

    const rows = loadTabularFile(datasetFile);
    if (!rows || rows.length === 0) {
      console.error('❌ No data in dataset file');
      return process.exit(1);
    }

    console.log(`📊 Found ${rows.length} rows`);

    let importedCount = 0;
    const processedCareers = new Set();

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
      if (!careerName || processedCareers.has(careerName)) continue;
      processedCareers.add(careerName);

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

      // Insert or update career
      const careerResult = await careersCollection.updateOne(
        { title: careerName },
        {
          $set: {
            title: careerName,
            category: inferCategory(careerName),
            averageSalary: salary,
            requiredEducation: education,
            yearsExperience: Number.isNaN(yearsExperience) ? 0 : yearsExperience,
            jobMarketDemand: 80, // Default demand
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      const careerId = (
        await careersCollection.findOne({ title: careerName })
      )._id;

      // Insert skills
      for (const skill of skills) {
        await skillMappingsCollection.updateOne(
          { careerId, skill },
          {
            $set: {
              careerId,
              skill,
              importance: 1,
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
      }

      // Insert interests
      for (const interest of interests) {
        await interestMappingsCollection.updateOne(
          { careerId, interest },
          {
            $set: {
              careerId,
              interest,
              importance: 1,
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
      }

      console.log(`✓ Imported career: ${careerName} (${skills.length} skills, ${interests.length} interests)`);
      importedCount++;
    }

    console.log(`\n✅ Successfully imported ${importedCount} careers`);
  } catch (err) {
    console.error('❌ Import failed:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

importCareers();
