/**
 * Remove invalid Skill documents that break Prisma unique index creation.
 */

const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.DATABASE_URL;
if (!MONGO_URL) {
  throw new Error('DATABASE_URL must point to MongoDB Atlas');
}
const DB_NAME = 'Pragyan';

async function clearInvalidSkills() {
  const client = new MongoClient(MONGO_URL);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db(DB_NAME);

    const result = await db.collection('Skill').deleteMany({
      $or: [
        { skillName: null },
        { skillName: '' },
        { skillName: { $exists: false } },
      ],
    });

    console.log(`✓ Deleted ${result.deletedCount} invalid skills`);
  } finally {
    await client.close();
  }
}

clearInvalidSkills().catch((error) => {
  console.error('Failed to clear invalid skills:', error);
  process.exit(1);
});