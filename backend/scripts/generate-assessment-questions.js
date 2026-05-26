/**
 * Dynamic Assessment Question Generator
 * Generates assessment questions based on careers, skills, and interests in the database
 */

const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.DATABASE_URL;
if (!MONGO_URL) {
  throw new Error('DATABASE_URL must point to MongoDB Atlas');
}
const DB_NAME = 'Pragyan';

async function generateDynamicQuestions() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // Get all careers with their skills and interests
    const careers = await db.collection('Career').find({}).toArray();
    const skillMappings = await db.collection('CareerSkillMapping').find({}).toArray();
    const interestMappings = await db.collection('CareerInterestMapping').find({}).toArray();
    const skills = await db.collection('Skill').find({}).toArray();

    // Extract unique skills and interests
    const uniqueSkills = [...new Set(skillMappings.map(sm => sm.skill))];
    const uniqueInterests = [...new Set(interestMappings.map(im => im.interest))];
    const uniqueCategories = [...new Set(careers.map(c => c.category).filter(Boolean))];

    console.log(`Found ${careers.length} careers`);
    console.log(`Found ${uniqueSkills.length} unique skills`);
    console.log(`Found ${uniqueInterests.length} unique interests`);
    console.log(`Found ${uniqueCategories.length} unique categories\n`);

    // Build question set
    const questions = [];

    // Question 1: Career Category Interest
    questions.push({
      id: 'q1_career_category',
      type: 'interest',
      question: 'Which career category interests you the most?',
      category: 'Career Interest',
      options: uniqueCategories.slice(0, 4),
      relatedCareers: 'Based on category selection'
    });

    // Question 2: Top Skills Interest
    const topSkills = uniqueSkills.slice(0, 4);
    questions.push({
      id: 'q2_skills',
      type: 'interest',
      question: 'Which of these skills are you most passionate about?',
      category: 'Skill Interest',
      options: topSkills,
      relatedCareers: 'Based on skill selection'
    });

    // Question 3: Work Environment
    questions.push({
      id: 'q3_work_env',
      type: 'mcq',
      question: 'Which work environment do you prefer?',
      category: 'Work Style',
      options: ['Fast-paced and innovative', 'Structured and organized', 'Collaborative and team-focused', 'Independent and autonomous'],
      relatedCareers: 'Based on work style'
    });

    // Question 4: Education Level
    const educationLevels = ['High School', 'Diploma/Bachelor\'s', 'Master\'s Degree', 'PhD/Advanced'];
    questions.push({
      id: 'q4_education',
      type: 'mcq',
      question: 'What is your highest level of education or target?',
      category: 'Education',
      options: educationLevels,
      relatedCareers: 'Based on education requirements'
    });

    // Question 5: Experience Level
    questions.push({
      id: 'q5_experience',
      type: 'interest',
      question: 'What best describes your current work experience?',
      category: 'Experience',
      options: ['Fresher - No experience', 'Junior - 1-2 years', 'Mid-level - 3-5 years', 'Senior - 5+ years'],
      relatedCareers: 'Based on experience level'
    });

    // Question 6: Problem Solving Approach
    questions.push({
      id: 'q6_problem_solving',
      type: 'scenario',
      question: 'When facing a complex problem, you tend to:',
      category: 'Problem Solving',
      options: [
        'Analyze data and patterns systematically',
        'Brainstorm creative solutions',
        'Collaborate with team members',
        'Seek proven methodologies'
      ],
      relatedCareers: 'Based on problem-solving style'
    });

    // Question 7: Technology Interest (based on actual skills in DB)
    const techSkills = uniqueSkills.filter(s => 
      s.toLowerCase().includes('python') || 
      s.toLowerCase().includes('java') || 
      s.toLowerCase().includes('javascript') ||
      s.toLowerCase().includes('react') ||
      s.toLowerCase().includes('ml') ||
      s.toLowerCase().includes('ai')
    ).slice(0, 4);

    if (techSkills.length >= 2) {
      questions.push({
        id: 'q7_tech_stack',
        type: 'interest',
        question: 'Which technologies excite you most?',
        category: 'Tech Interest',
        options: techSkills.length >= 4 ? techSkills : [...techSkills, 'Other/Multiple'],
        relatedCareers: 'Based on technology preference'
      });
    }

    // Question 8: Interest Type (from actual database interests)
    const interestSample = uniqueInterests.slice(0, 4);
    if (interestSample.length >= 2) {
      questions.push({
        id: 'q8_interests',
        type: 'interest',
        question: 'Which of these areas interest you the most?',
        category: 'Domain Interest',
        options: interestSample,
        relatedCareers: 'Based on domain interests'
      });
    }

    // Question 9: Learning Style
    questions.push({
      id: 'q9_learning_style',
      type: 'mcq',
      question: 'What\'s your preferred learning approach?',
      category: 'Learning Style',
      options: ['Hands-on projects', 'Structured courses', 'Self-paced learning', 'Mentorship & guidance'],
      relatedCareers: 'Based on learning preference'
    });

    // Question 10: Workplace Values
    questions.push({
      id: 'q10_workplace_values',
      type: 'mcq',
      question: 'What\'s most important in a workplace?',
      category: 'Workplace Values',
      options: ['Growth opportunities', 'Team culture & values', 'Compensation & benefits', 'Impact & meaningful work'],
      relatedCareers: 'Based on values alignment'
    });

    return {
      totalQuestions: questions.length,
      totalCareers: careers.length,
      dataPoints: {
        skills: uniqueSkills.length,
        interests: uniqueInterests.length,
        categories: uniqueCategories.length
      },
      questions
    };
  } finally {
    await client.close();
  }
}

// Export for use as a module
module.exports = { generateDynamicQuestions };

// Run if called directly
if (require.main === module) {
  generateDynamicQuestions().then(result => {
    console.log('\n📋 Generated Assessment Questions:');
    console.log('═'.repeat(60));
    console.log(`Total Questions: ${result.totalQuestions}`);
    console.log(`Total Careers Covered: ${result.totalCareers}`);
    console.log(`Data Points - Skills: ${result.dataPoints.skills}, Interests: ${result.dataPoints.interests}, Categories: ${result.dataPoints.categories}\n`);

    result.questions.forEach((q, idx) => {
      console.log(`Q${idx + 1}. ${q.question}`);
      console.log(`   Type: ${q.type} | Category: ${q.category}`);
      q.options.forEach(opt => console.log(`   - ${opt}`));
      console.log('');
    });
  });
}
