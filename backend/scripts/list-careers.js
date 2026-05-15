/**
 * List all careers in the database
 */

const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const DB_NAME = 'Pragyan';

async function listCareers() {
  const client = new MongoClient(MONGO_URL);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db(DB_NAME);

    // Get all careers
    const careers = await db
      .collection('Career')
      .find({})
      .sort({ title: 1 })
      .toArray();

    console.log(`\n📊 Total Career Roles: ${careers.length}\n`);
    console.log('Career List:');
    console.log('═'.repeat(60));

    careers.forEach((career, index) => {
      console.log(`${index + 1}. ${career.title}`);
      console.log(`   Category: ${career.category || 'N/A'}`);
      console.log(`   Salary: ${career.averageSalary || 'N/A'}`);
      console.log(`   Education: ${career.requiredEducation || 'N/A'}`);
      console.log(`   Experience: ${career.yearsExperience || 0} years`);
      console.log('');
    });

    // Summary by category
    const byCategory = {};
    careers.forEach((career) => {
      const cat = career.category || 'Uncategorized';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });

    console.log('\n📈 Careers by Category:');
    console.log('═'.repeat(60));
    Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} roles`);
      });
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.close();
  }
}

listCareers();
