/**
 * Clear refresh tokens collection
 * Use this in development when Prisma unique index creation fails due to legacy duplicates.
 */

const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.DATABASE_URL;
if (!MONGO_URL) {
  throw new Error('DATABASE_URL must point to MongoDB Atlas');
}
const DB_NAME = 'Pragyan';

async function clearRefreshTokens() {
  const client = new MongoClient(MONGO_URL);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db(DB_NAME);

    const result = await db.collection('RefreshToken').deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} refresh tokens`);
  } finally {
    await client.close();
  }
}

clearRefreshTokens().catch((error) => {
  console.error('Failed to clear refresh tokens:', error);
  process.exit(1);
});