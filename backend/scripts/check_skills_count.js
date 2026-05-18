require('dotenv').config({ path: 'backend/.env' });
const { MongoClient } = require('mongodb');

(async () => {
  try {
    const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/Pragyan?directConnection=true';
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    const coll = db.collection('Job');
    const total = await coll.countDocuments();
    const withSkills = await coll.countDocuments({ skills: { $exists: true, $ne: [] } });
    console.log('TOTAL_JOBS:', total);
    console.log('JOBS_WITH_SKILLS:', withSkills);
    const sample = await coll.find({ skills: { $exists: true, $ne: [] } }).limit(5).toArray();
    console.log('SAMPLE_WITH_SKILLS:', JSON.stringify(sample, null, 2));
    await client.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
