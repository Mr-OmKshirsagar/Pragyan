const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URL = process.env.DATABASE_URL;
if (!MONGO_URL) {
  throw new Error('DATABASE_URL must point to MongoDB Atlas');
}
const DB_NAME = process.env.DB_NAME || 'Pragyan';

async function seed() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);

  // Clear small sample collections (non-destructive to others)
  const careerColl = db.collection('Career');
  const skillMapColl = db.collection('CareerSkillMapping');
  const interestMapColl = db.collection('CareerInterestMapping');
  const personalityColl = db.collection('PersonalityMapping');
  const roadmapColl = db.collection('Roadmap');

  console.log('Seeding sample roadmaps...');
  const roadmaps = [
    { _id: new ObjectId(), title: 'Frontend Developer Roadmap', category: 'Technology', level: 'beginner', steps: ['HTML/CSS', 'JavaScript', 'React', 'Testing'] },
    { _id: new ObjectId(), title: 'Data Scientist Roadmap', category: 'Technology', level: 'intermediate', steps: ['Python', 'Statistics', 'Machine Learning', 'Model Deployment'] },
    { _id: new ObjectId(), title: 'Civil Services Preparation', category: 'Government Exams', level: 'advanced', steps: ['Syllabus coverage', 'Current affairs', 'Answer writing', 'Mock tests'] },
    { _id: new ObjectId(), title: 'Medical Entrance Prep', category: 'Medical', level: 'advanced', steps: ['Core biology', 'Chemistry', 'Physics', 'Mock tests'] },
  ];

  for (const r of roadmaps) {
    const { _id, ...rData } = r;
    await roadmapColl.updateOne({ title: r.title }, { $set: rData, $setOnInsert: { _id } }, { upsert: true });
  }

  console.log('Seeding sample careers and mappings...');

  const careers = [
    // Technology
    {
      _id: new ObjectId(),
      title: 'Frontend Developer',
      description: 'Build user interfaces with modern web technologies',
      category: 'Technology',
      yearsExperience: 1,
      requiredEducation: 'bachelor',
      roadmapId: roadmaps[0]._id,
    },
    {
      _id: new ObjectId(),
      title: 'Data Scientist',
      description: 'Analyze data and build predictive models',
      category: 'Technology',
      yearsExperience: 2,
      requiredEducation: 'master',
      roadmapId: roadmaps[1]._id,
    },
    // Government Exams
    {
      _id: new ObjectId(),
      title: 'Civil Services Officer',
      description: 'Public administration and policy implementation',
      category: 'Government Exams',
      yearsExperience: 0,
      requiredEducation: 'bachelor',
      roadmapId: roadmaps[2]._id,
    },
    // Defence
    {
      _id: new ObjectId(),
      title: 'Defence Services Officer',
      description: 'Leadership and disciplined operations in defence',
      category: 'Defence',
      yearsExperience: 0,
      requiredEducation: 'bachelor',
    },
    // Teaching
    {
      _id: new ObjectId(),
      title: 'School Teacher',
      description: 'Teaching and mentoring students',
      category: 'Teaching',
      yearsExperience: 0,
      requiredEducation: 'bachelor',
    },
    // Medical
    {
      _id: new ObjectId(),
      title: 'Medical Practitioner',
      description: 'Clinical diagnosis and patient care',
      category: 'Medical',
      yearsExperience: 3,
      requiredEducation: 'master',
      roadmapId: roadmaps[3]._id,
    },
    // Commerce
    {
      _id: new ObjectId(),
      title: 'Chartered Accountant',
      description: 'Accounting, auditing, and finance advisory',
      category: 'Commerce',
      yearsExperience: 2,
      requiredEducation: 'bachelor',
    },
    // Creative
    {
      _id: new ObjectId(),
      title: 'UX Designer',
      description: 'Design user experiences and interfaces',
      category: 'Creative Careers',
      yearsExperience: 1,
      requiredEducation: 'bachelor',
    },
  ];

  for (const c of careers) {
    const { _id, ...cData } = c;
    await careerColl.updateOne({ title: c.title }, { $set: cData, $setOnInsert: { _id } }, { upsert: true });

    // Simple skill mappings per career
    const baseSkills = {
      'Frontend Developer': ['javascript', 'react', 'html', 'css'],
      'Data Scientist': ['python', 'statistics', 'machine learning', 'sql'],
      'Civil Services Officer': ['current affairs', 'writing', 'policy understanding'],
      'Defence Services Officer': ['discipline', 'leadership', 'physical fitness'],
      'School Teacher': ['communication', 'lesson planning', 'mentoring'],
      'Medical Practitioner': ['biology', 'clinical diagnosis', 'patient communication'],
      'Chartered Accountant': ['accounting', 'taxation', 'audit'],
      'UX Designer': ['design', 'prototyping', 'user research'],
    };

    const skills = baseSkills[c.title] || [];
    for (const s of skills) {
      await skillMapColl.updateOne({ careerId: c._id, skill: s }, { $set: { careerId: c._id, skill: s, importance: 1 } }, { upsert: true });
    }

    // Simple interest mappings
    const interestGroups = {
      'Frontend Developer': ['web', 'frontend', 'ui'],
      'Data Scientist': ['data', 'analysis', 'ml'],
      'Civil Services Officer': ['government', 'policy', 'administration'],
      'Defence Services Officer': ['defence', 'service', 'leadership'],
      'School Teacher': ['education', 'teaching', 'mentoring'],
      'Medical Practitioner': ['healthcare', 'medicine', 'clinical'],
      'Chartered Accountant': ['finance', 'accounting', 'business'],
      'UX Designer': ['design', 'creativity', 'product'],
    };

    const interests = interestGroups[c.title] || [];
    for (const i of interests) {
      await interestMapColl.updateOne({ careerId: c._id, interest: i }, { $set: { careerId: c._id, interest: i, importance: 1 } }, { upsert: true });
    }
  }

  console.log('Seeding personality mappings...');
  const personalities = [
    { trait: 'analytical', keywords: ['analysis', 'data', 'statistics'] },
    { trait: 'creative', keywords: ['design', 'creative', 'innovation'] },
    { trait: 'leadership', keywords: ['lead', 'manage', 'ownership'] },
    { trait: 'detail-oriented', keywords: ['quality', 'testing', 'accuracy'] },
    { trait: 'collaborative', keywords: ['team', 'communication', 'stakeholder'] },
  ];

  for (const p of personalities) {
    await personalityColl.updateOne({ trait: p.trait }, { $set: p }, { upsert: true });
  }

  console.log('Seeding complete.');
  await client.close();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
