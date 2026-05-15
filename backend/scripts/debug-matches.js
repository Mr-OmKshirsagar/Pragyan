/**
 * Debug script to check if career matches are being saved
 */

const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const DB_NAME = 'Pragyan';

async function checkDatabase() {
  const client = new MongoClient(MONGO_URL);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db(DB_NAME);

    // Check careers
    const careerCount = await db.collection('Career').countDocuments();
    console.log(`✓ Careers: ${careerCount}`);

    // Check career matches
    const matchCount = await db.collection('CareerMatch').countDocuments();
    console.log(`✓ Career Matches: ${matchCount}`);

    // List recent matches
    const recent = await db
      .collection('CareerMatch')
      .find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .toArray();

    if (recent.length > 0) {
      console.log('\nRecent matches:');
      recent.forEach((match) => {
        console.log(`  - userId: ${match.userId}, careerTitle: ${match.careerTitle}, score: ${match.matchScore}`);
      });
    }

    // Check for specific user from smoke test
    const smokeUser = await db
      .collection('CareerMatch')
      .findOne({ userId: { $regex: 'smoke' } });

    if (smokeUser) {
      console.log(`\nSmoke user matches: ${smokeUser.userId}`);
      console.log(JSON.stringify(smokeUser, null, 2));
    } else {
      console.log('\nNo smoke user matches found');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.close();
  }
}

checkDatabase();
