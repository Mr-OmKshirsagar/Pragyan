import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CAREER_DATA = [
  // Software Engineering
  {
    title: 'Full Stack Developer',
    description: 'Design, build, and maintain web applications across frontend and backend.',
    category: 'Software Engineering',
    averageSalary: '$80,000 - $150,000',
    jobMarketDemand: 95,
    requiredEducation: 'Bachelor in CS or equivalent',
    yearsExperience: 2,
    skills: [
      { skill: 'JavaScript/TypeScript', importance: 0.95 },
      { skill: 'React', importance: 0.9 },
      { skill: 'Node.js', importance: 0.9 },
      { skill: 'SQL Databases', importance: 0.85 },
      { skill: 'REST APIs', importance: 0.85 },
      { skill: 'CSS & HTML', importance: 0.8 },
      { skill: 'Git & Version Control', importance: 0.8 },
      { skill: 'Docker & DevOps', importance: 0.7 },
    ],
    interests: [
      { interest: 'Problem Solving', importance: 0.95 },
      { interest: 'Building Products', importance: 0.9 },
      { interest: 'Learning New Tech', importance: 0.85 },
      { interest: 'Collaboration', importance: 0.75 },
    ],
  },
  {
    title: 'Backend Engineer',
    description: 'Build scalable server-side systems and APIs.',
    category: 'Software Engineering',
    averageSalary: '$85,000 - $160,000',
    jobMarketDemand: 90,
    requiredEducation: 'Bachelor in CS or equivalent',
    yearsExperience: 2,
    skills: [
      { skill: 'Python/Java/Go', importance: 0.95 },
      { skill: 'System Design', importance: 0.9 },
      { skill: 'Databases', importance: 0.95 },
      { skill: 'Microservices', importance: 0.85 },
      { skill: 'API Design', importance: 0.9 },
      { skill: 'Cloud Services', importance: 0.8 },
      { skill: 'Testing & QA', importance: 0.8 },
    ],
    interests: [
      { interest: 'Solving Complex Problems', importance: 0.95 },
      { interest: 'System Design', importance: 0.95 },
      { interest: 'Performance Optimization', importance: 0.85 },
      { interest: 'Data Management', importance: 0.8 },
    ],
  },
  {
    title: 'Frontend Developer',
    description: 'Create interactive user interfaces and experiences.',
    category: 'Software Engineering',
    averageSalary: '$70,000 - $140,000',
    jobMarketDemand: 85,
    requiredEducation: 'Bachelor in CS or equivalent',
    yearsExperience: 1,
    skills: [
      { skill: 'JavaScript/TypeScript', importance: 0.95 },
      { skill: 'React/Vue/Angular', importance: 0.95 },
      { skill: 'CSS & HTML', importance: 0.9 },
      { skill: 'UI/UX Design', importance: 0.75 },
      { skill: 'Responsive Design', importance: 0.85 },
      { skill: 'Performance Optimization', importance: 0.75 },
      { skill: 'Testing (Jest, Cypress)', importance: 0.7 },
    ],
    interests: [
      { interest: 'Design & UI', importance: 0.95 },
      { interest: 'User Experience', importance: 0.95 },
      { interest: 'Creative Problem Solving', importance: 0.85 },
      { interest: 'Web Performance', importance: 0.75 },
    ],
  },

  // AI/ML
  {
    title: 'Machine Learning Engineer',
    description: 'Build and deploy ML models for real-world applications.',
    category: 'AI/ML',
    averageSalary: '$100,000 - $200,000',
    jobMarketDemand: 92,
    requiredEducation: "Master's in ML/AI or equivalent",
    yearsExperience: 2,
    skills: [
      { skill: 'Python', importance: 0.98 },
      { skill: 'TensorFlow/PyTorch', importance: 0.95 },
      { skill: 'Machine Learning Algorithms', importance: 0.95 },
      { skill: 'Data Science', importance: 0.9 },
      { skill: 'Statistics & Math', importance: 0.9 },
      { skill: 'Deep Learning', importance: 0.85 },
      { skill: 'Model Deployment', importance: 0.8 },
    ],
    interests: [
      { interest: 'AI Research', importance: 0.95 },
      { interest: 'Data Analysis', importance: 0.9 },
      { interest: 'Innovation', importance: 0.85 },
      { interest: 'Mathematical Problem Solving', importance: 0.95 },
    ],
  },
  {
    title: 'Data Scientist',
    description: 'Extract insights from data to drive business decisions.',
    category: 'AI/ML',
    averageSalary: '$90,000 - $180,000',
    jobMarketDemand: 88,
    requiredEducation: "Master's in Statistics/CS or equivalent",
    yearsExperience: 2,
    skills: [
      { skill: 'Python/R', importance: 0.95 },
      { skill: 'SQL', importance: 0.9 },
      { skill: 'Statistics', importance: 0.95 },
      { skill: 'Data Visualization', importance: 0.85 },
      { skill: 'Machine Learning', importance: 0.85 },
      { skill: 'Big Data Tools', importance: 0.75 },
      { skill: 'Communication', importance: 0.8 },
    ],
    interests: [
      { interest: 'Data Analysis', importance: 0.98 },
      { interest: 'Statistics', importance: 0.95 },
      { interest: 'Business Insights', importance: 0.85 },
      { interest: 'Storytelling with Data', importance: 0.8 },
    ],
  },

  // Cybersecurity
  {
    title: 'Cybersecurity Engineer',
    description: 'Protect systems and networks from security threats.',
    category: 'Cybersecurity',
    averageSalary: '$95,000 - $180,000',
    jobMarketDemand: 94,
    requiredEducation: 'Bachelor in CS/Cybersecurity',
    yearsExperience: 2,
    skills: [
      { skill: 'Network Security', importance: 0.95 },
      { skill: 'Penetration Testing', importance: 0.9 },
      { skill: 'Cryptography', importance: 0.85 },
      { skill: 'System Administration', importance: 0.85 },
      { skill: 'Python/C', importance: 0.8 },
      { skill: 'Security Tools (Nessus, Burp)', importance: 0.9 },
      { skill: 'Compliance & Risk Management', importance: 0.75 },
    ],
    interests: [
      { interest: 'Security & Protection', importance: 0.98 },
      { interest: 'Problem Solving', importance: 0.9 },
      { interest: 'Ethical Hacking', importance: 0.95 },
      { interest: 'System Hardening', importance: 0.85 },
    ],
  },

  // Cloud Engineering
  {
    title: 'Cloud Architect',
    description: 'Design and manage cloud infrastructure and solutions.',
    category: 'Cloud Engineering',
    averageSalary: '$110,000 - $200,000',
    jobMarketDemand: 90,
    requiredEducation: 'Bachelor in CS/IT',
    yearsExperience: 5,
    skills: [
      { skill: 'AWS/Azure/GCP', importance: 0.95 },
      { skill: 'System Design', importance: 0.95 },
      { skill: 'DevOps', importance: 0.85 },
      { skill: 'Infrastructure as Code', importance: 0.85 },
      { skill: 'Kubernetes', importance: 0.8 },
      { skill: 'Networking', importance: 0.8 },
      { skill: 'Cost Optimization', importance: 0.75 },
    ],
    interests: [
      { interest: 'Cloud Computing', importance: 0.98 },
      { interest: 'System Design', importance: 0.95 },
      { interest: 'Scalability', importance: 0.9 },
      { interest: 'Cost Efficiency', importance: 0.75 },
    ],
  },

  // Design
  {
    title: 'UI/UX Designer',
    description: 'Create beautiful and intuitive user experiences.',
    category: 'Design',
    averageSalary: '$70,000 - $140,000',
    jobMarketDemand: 80,
    requiredEducation: 'Degree in Design or equivalent',
    yearsExperience: 1,
    skills: [
      { skill: 'Figma/Adobe XD', importance: 0.95 },
      { skill: 'User Research', importance: 0.85 },
      { skill: 'Wireframing & Prototyping', importance: 0.9 },
      { skill: 'Visual Design', importance: 0.9 },
      { skill: 'CSS & HTML', importance: 0.6 },
      { skill: 'Usability Testing', importance: 0.75 },
      { skill: 'Design Systems', importance: 0.75 },
    ],
    interests: [
      { interest: 'Design & Aesthetics', importance: 0.98 },
      { interest: 'User Experience', importance: 0.98 },
      { interest: 'Creative Expression', importance: 0.85 },
      { interest: 'Problem Solving', importance: 0.8 },
    ],
  },

  // Government & Public Service
  {
    title: 'IAS Officer (Civil Service)',
    description: 'Serve in government administration and policy making.',
    category: 'Government & Public Service',
    averageSalary: '₹56,100 - ₹2,50,000',
    jobMarketDemand: 70,
    requiredEducation: 'Bachelor degree (any stream)',
    yearsExperience: 0,
    skills: [
      { skill: 'General Knowledge', importance: 0.95 },
      { skill: 'Current Affairs', importance: 0.95 },
      { skill: 'Indian Constitution', importance: 0.95 },
      { skill: 'History & Geography', importance: 0.85 },
      { skill: 'Policy Analysis', importance: 0.8 },
      { skill: 'Leadership', importance: 0.85 },
      { skill: 'Communication', importance: 0.85 },
    ],
    interests: [
      { interest: 'Public Service', importance: 0.98 },
      { interest: 'Governance & Policy', importance: 0.95 },
      { interest: 'Social Impact', importance: 0.9 },
      { interest: 'Administration', importance: 0.85 },
    ],
  },

  // Defence
  {
    title: 'Defence Officer (Army)',
    description: 'Serve in military leadership and strategic roles.',
    category: 'Defence',
    averageSalary: '₹56,100 - ₹2,50,000',
    jobMarketDemand: 65,
    requiredEducation: 'Bachelor degree',
    yearsExperience: 0,
    skills: [
      { skill: 'Leadership', importance: 0.95 },
      { skill: 'Physical Fitness', importance: 0.95 },
      { skill: 'Strategic Thinking', importance: 0.9 },
      { skill: 'Team Management', importance: 0.9 },
      { skill: 'Discipline & Ethics', importance: 0.95 },
      { skill: 'Technical Knowledge', importance: 0.7 },
      { skill: 'Communication', importance: 0.85 },
    ],
    interests: [
      { interest: 'Service & Sacrifice', importance: 0.98 },
      { interest: 'Leadership', importance: 0.95 },
      { interest: 'Adventure', importance: 0.8 },
      { interest: 'Discipline', importance: 0.95 },
    ],
  },

  // Teaching
  {
    title: 'School Teacher',
    description: 'Educate and mentor students at school level.',
    category: 'Teaching',
    averageSalary: '₹30,000 - ₹60,000',
    jobMarketDemand: 75,
    requiredEducation: "B.Ed or equivalent teacher's certificate",
    yearsExperience: 0,
    skills: [
      { skill: 'Subject Expertise', importance: 0.95 },
      { skill: 'Communication', importance: 0.95 },
      { skill: 'Student Mentoring', importance: 0.9 },
      { skill: 'Curriculum Development', importance: 0.8 },
      { skill: 'Classroom Management', importance: 0.9 },
      { skill: 'Digital Learning Tools', importance: 0.7 },
      { skill: 'Assessment & Evaluation', importance: 0.85 },
    ],
    interests: [
      { interest: 'Education & Knowledge Sharing', importance: 0.98 },
      { interest: 'Student Development', importance: 0.95 },
      { interest: 'Social Impact', importance: 0.85 },
      { interest: 'Mentoring', importance: 0.9 },
    ],
  },

  // Medicine
  {
    title: 'Doctor/Physician',
    description: 'Provide medical care and diagnosis to patients.',
    category: 'Medicine',
    averageSalary: '₹40,000 - ₹2,00,000',
    jobMarketDemand: 75,
    requiredEducation: 'MBBS degree',
    yearsExperience: 0,
    skills: [
      { skill: 'Medical Knowledge', importance: 0.98 },
      { skill: 'Diagnosis & Treatment', importance: 0.98 },
      { skill: 'Patient Communication', importance: 0.9 },
      { skill: 'Research Skills', importance: 0.75 },
      { skill: 'Ethical Practice', importance: 0.95 },
      { skill: 'Emergency Management', importance: 0.85 },
      { skill: 'Continuous Learning', importance: 0.9 },
    ],
    interests: [
      { interest: 'Healthcare & Wellbeing', importance: 0.98 },
      { interest: 'Helping Others', importance: 0.98 },
      { interest: 'Scientific Research', importance: 0.75 },
      { interest: 'Social Responsibility', importance: 0.85 },
    ],
  },

  // Commerce & Finance
  {
    title: 'Investment Banker',
    description: 'Provide financial advisory and investment solutions.',
    category: 'Commerce & Finance',
    averageSalary: '$100,000 - $300,000',
    jobMarketDemand: 75,
    requiredEducation: 'MBA in Finance',
    yearsExperience: 2,
    skills: [
      { skill: 'Financial Analysis', importance: 0.95 },
      { skill: 'Excel & Financial Modeling', importance: 0.95 },
      { skill: 'Valuation Methods', importance: 0.9 },
      { skill: 'Communication', importance: 0.85 },
      { skill: 'Negotiation', importance: 0.85 },
      { skill: 'Market Knowledge', importance: 0.85 },
      { skill: 'Deal Structuring', importance: 0.8 },
    ],
    interests: [
      { interest: 'Finance & Markets', importance: 0.98 },
      { interest: 'Business Strategy', importance: 0.9 },
      { interest: 'Risk Management', importance: 0.85 },
      { interest: 'Leadership', importance: 0.75 },
    ],
  },

  // Digital Marketing
  {
    title: 'Digital Marketing Manager',
    description: 'Drive online growth and customer engagement.',
    category: 'Digital Marketing',
    averageSalary: '$50,000 - $120,000',
    jobMarketDemand: 85,
    requiredEducation: 'Bachelor degree (any field)',
    yearsExperience: 1,
    skills: [
      { skill: 'SEO & SEM', importance: 0.9 },
      { skill: 'Social Media Marketing', importance: 0.9 },
      { skill: 'Content Marketing', importance: 0.85 },
      { skill: 'Analytics & Data', importance: 0.85 },
      { skill: 'Email Marketing', importance: 0.75 },
      { skill: 'Advertising Platforms', importance: 0.85 },
      { skill: 'Communication', importance: 0.8 },
    ],
    interests: [
      { interest: 'Marketing & Branding', importance: 0.95 },
      { interest: 'Digital Technology', importance: 0.85 },
      { interest: 'Creative Strategy', importance: 0.85 },
      { interest: 'Customer Engagement', importance: 0.9 },
    ],
  },

  // Content Creation
  {
    title: 'Content Creator / Influencer',
    description: 'Create engaging content across digital platforms.',
    category: 'Content Creation',
    averageSalary: '$20,000 - $500,000',
    jobMarketDemand: 70,
    requiredEducation: 'No formal requirement',
    yearsExperience: 0,
    skills: [
      { skill: 'Content Creation', importance: 0.95 },
      { skill: 'Video Production', importance: 0.85 },
      { skill: 'Editing & Design', importance: 0.8 },
      { skill: 'Social Media Expertise', importance: 0.9 },
      { skill: 'Audience Engagement', importance: 0.9 },
      { skill: 'Niche Knowledge', importance: 0.75 },
      { skill: 'Analytics & Metrics', importance: 0.7 },
    ],
    interests: [
      { interest: 'Creative Expression', importance: 0.98 },
      { interest: 'Social Media', importance: 0.95 },
      { interest: 'Storytelling', importance: 0.9 },
      { interest: 'Community Building', importance: 0.85 },
    ],
  },

  // Entrepreneurship
  {
    title: 'Startup Founder / Entrepreneur',
    description: 'Build and scale innovative business ventures.',
    category: 'Entrepreneurship',
    averageSalary: 'Variable (₹0 - ₹unlimited)',
    jobMarketDemand: 80,
    requiredEducation: 'Bachelor degree (any field)',
    yearsExperience: 0,
    skills: [
      { skill: 'Business Strategy', importance: 0.95 },
      { skill: 'Problem Solving', importance: 0.95 },
      { skill: 'Leadership & Management', importance: 0.9 },
      { skill: 'Financial Acumen', importance: 0.85 },
      { skill: 'Innovation & Creativity', importance: 0.95 },
      { skill: 'Sales & Negotiation', importance: 0.85 },
      { skill: 'Risk Management', importance: 0.8 },
    ],
    interests: [
      { interest: 'Innovation & Entrepreneurship', importance: 0.98 },
      { interest: 'Building from Scratch', importance: 0.95 },
      { interest: 'Risk Taking', importance: 0.85 },
      { interest: 'Independent Decision Making', importance: 0.9 },
    ],
  },
];

async function seedCareers() {
  console.log('🌱 Starting career seeding...');

  try {
    // Clear existing careers
    await prisma.career.deleteMany({});
    await prisma.careerSkillMapping.deleteMany({});
    await prisma.careerInterestMapping.deleteMany({});

    for (const careerData of CAREER_DATA) {
      const { skills, interests, ...careerBase } = careerData;

      // Create career
      const career = await prisma.career.create({
        data: careerBase as any,
      });

      // Create skill mappings
      for (const { skill, importance } of skills) {
        await prisma.careerSkillMapping.create({
          data: {
            careerId: career.id,
            skill,
            importance,
          },
        });
      }

      // Create interest mappings
      for (const { interest, importance } of interests) {
        await prisma.careerInterestMapping.create({
          data: {
            careerId: career.id,
            interest,
            importance,
          },
        });
      }

      console.log(`✅ Seeded career: ${career.title}`);
    }

    console.log(`\n✨ Career seeding complete! Seeded ${CAREER_DATA.length} careers.`);
  } catch (error) {
    console.error('❌ Error seeding careers:', error);
    throw error;
  }
}

seedCareers().then(() => {
  console.log('Career seed complete.');
  process.exit(0);
}).catch((error) => {
  console.error('Career seed failed:', error);
  process.exit(1);
});
