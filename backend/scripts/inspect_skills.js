require('dotenv').config({ path: 'backend/.env' });
const { MongoClient } = require('mongodb');

(async () => {
  try {
    const uri = process.env.DATABASE_URL;
    if (!uri) {
      throw new Error('DATABASE_URL must point to MongoDB Atlas');
    }
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    const coll = db.collection('Skill');
    const count = await coll.countDocuments();
    console.log('SKILL_COUNT:', count);
    const sample = await coll.find({}).limit(20).toArray();
    console.log('SAMPLE:', JSON.stringify(sample.map(s=>s.skillName), null, 2));
    await client.close();
  } catch (err) {
    console.error('ERROR inspecting skills:', err);
    process.exit(1);
  }
})();
