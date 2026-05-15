/**
 * Clear roadmaps collection
 */

const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const DB_NAME = 'Pragyan';

async function clearRoadmaps() {
  const client = new MongoClient(MONGO_URL);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db(DB_NAME);

    const result = await db.collection('Roadmap').deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} roadmaps`);
  } finally {
    await client.close();
  }
}

clearRoadmaps();
