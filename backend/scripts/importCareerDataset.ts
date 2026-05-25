import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';

const prisma = new PrismaClient();

interface CareerRecord {
  CandidateID: string;
  Name: string;
  Age: string;
  Education: string;
  Skills: string;
  Interests: string;
  Recommended_Career: string;
  Recommendation_Score: string;
}

interface ProcessedCareer {
  title: string;
  skills: string[];
  interests: string[];
  scores: number[];
}

function parseCSV(filePath: string): CareerRecord[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      CandidateID: values[0],
      Name: values[1],
      Age: values[2],
      Education: values[3],
      Skills: values[4],
      Interests: values[5],
      Recommended_Career: values[6],
      Recommendation_Score: values[7],
    };
  });
}

function processCareerData(records: CareerRecord[]): Map<string, ProcessedCareer> {
  const careerMap = new Map<string, ProcessedCareer>();

  records.forEach(record => {
    const career = record.Recommended_Career.trim();
    const skills = record.Skills.split(';').map(s => s.trim()).filter(s => s);
    const interests = record.Interests.split(';').map(i => i.trim()).filter(i => i);
    const score = parseFloat(record.Recommendation_Score) || 0;

    if (!careerMap.has(career)) {
      careerMap.set(career, {
        title: career,
        skills: [],
        interests: [],
        scores: [],
      });
    }

    const existing = careerMap.get(career)!;
    existing.skills.push(...skills);
    existing.interests.push(...interests);
    existing.scores.push(score);
  });

  // Deduplicate and calculate statistics
  careerMap.forEach((career) => {
    career.skills = [...new Set(career.skills)];
    career.interests = [...new Set(career.interests)];
  });

  return careerMap;
}

async function importCareers(careerMap: Map<string, ProcessedCareer>) {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error('DATABASE_URL must point to MongoDB Atlas');
  }
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db('Pragyan');
    const careersCollection = db.collection('Career');
    const skillMappingsCollection = db.collection('CareerSkillMapping');
    const interestMappingsCollection = db.collection('CareerInterestMapping');

    let careerCount = 0;
    let skillMappingCount = 0;
    let interestMappingCount = 0;

    for (const [careerTitle, careerData] of careerMap) {
      // Check if career already exists
      const existing = await careersCollection.findOne({ title: careerTitle });

      if (!existing) {
        const avgScore = careerData.scores.length > 0
          ? careerData.scores.reduce((a, b) => a + b, 0) / careerData.scores.length
          : 0.85;

        const careerResult = await careersCollection.insertOne({
          title: careerTitle,
          description: `Career in ${careerTitle}`,
          category: categorizeCareer(careerTitle),
          averageSalary: null,
          jobMarketDemand: Math.round(avgScore * 100),
          requiredEducation: 'Bachelor\'s',
          yearsExperience: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`✓ Imported career: ${careerTitle}`);
        careerCount++;

        const careerId = careerResult.insertedId.toString();

        // Import skill mappings
        for (const skill of careerData.skills) {
          const existingSkillMapping = await skillMappingsCollection.findOne({
            careerId: careerResult.insertedId,
            skill,
          });

          if (!existingSkillMapping) {
            await skillMappingsCollection.insertOne({
              careerId: careerResult.insertedId,
              skill,
              importance: 1.0,
              createdAt: new Date(),
            });
            skillMappingCount++;
          }
        }

        // Import interest mappings
        for (const interest of careerData.interests) {
          const existingInterestMapping = await interestMappingsCollection.findOne({
            careerId: careerResult.insertedId,
            interest,
          });

          if (!existingInterestMapping) {
            await interestMappingsCollection.insertOne({
              careerId: careerResult.insertedId,
              interest,
              importance: 1.0,
              createdAt: new Date(),
            });
            interestMappingCount++;
          }
        }

        console.log(`  - Skills: ${careerData.skills.length}, Interests: ${careerData.interests.length}`);
      } else {
        console.log(`- Career already exists: ${careerTitle}`);
      }
    }

    console.log('\n✅ Import Summary:');
    console.log(`   Careers: ${careerCount}`);
    console.log(`   Skill Mappings: ${skillMappingCount}`);
    console.log(`   Interest Mappings: ${interestMappingCount}`);
  } finally {
    await client.close();
  }
}

function categorizeCareer(careerTitle: string): string {
  const title = careerTitle.toLowerCase();

  if (title.includes('data') || title.includes('analyst')) return 'Data & Analytics';
  if (title.includes('ai') || title.includes('machine') || title.includes('learning')) return 'AI & Machine Learning';
  if (title.includes('software') || title.includes('engineer') || title.includes('developer')) return 'Software Development';
  if (title.includes('design') || title.includes('ux') || title.includes('ui')) return 'Design';
  if (title.includes('security') || title.includes('cyber')) return 'Cybersecurity';
  if (title.includes('research')) return 'Research';

  return 'Technology';
}

async function main() {
  try {
    const datasetPath = path.join(__dirname, '../datasets/AI-based Career Recommendation System.csv');

    if (!fs.existsSync(datasetPath)) {
      throw new Error(`Dataset not found at ${datasetPath}`);
    }

    console.log('📊 Importing Career Dataset...\n');

    const records = parseCSV(datasetPath);
    console.log(`✓ Parsed ${records.length} records from CSV\n`);

    const careerMap = processCareerData(records);
    console.log(`✓ Processed ${careerMap.size} unique careers\n`);

    await importCareers(careerMap);

    console.log('\n✅ Dataset import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();
