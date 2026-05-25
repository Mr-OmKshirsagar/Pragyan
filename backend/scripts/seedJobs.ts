import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JOB_DATA = [
  // Software Engineering Jobs
  {
    title: 'Senior Full Stack Developer',
    company: 'Tech Startup XYZ',
    location: 'San Francisco, CA',
    description: 'We are looking for an experienced Full Stack developer to build our next-generation platform.',
    salary: { min: 150000, max: 180000, currency: 'USD' },
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
    applyLink: 'https://company.example.com/careers/full-stack',
    source: 'LinkedIn',
  },
  {
    title: 'Backend Engineer',
    company: 'Enterprise Solutions Inc',
    location: 'New York, NY',
    description: 'Build scalable backend systems for our cloud platform.',
    salary: { min: 140000, max: 170000, currency: 'USD' },
    skills: ['Java', 'Microservices', 'Kubernetes', 'AWS', 'PostgreSQL'],
    applyLink: 'https://company.example.com/careers/backend',
    source: 'AngelList',
  },
  {
    title: 'Frontend Developer (React)',
    company: 'Design-First Startup',
    location: 'Remote',
    description: 'Create stunning user interfaces for our SaaS product.',
    salary: { min: 100000, max: 130000, currency: 'USD' },
    skills: ['React', 'TypeScript', 'CSS', 'UI/UX', 'REST APIs'],
    applyLink: 'https://company.example.com/careers/frontend',
    source: 'GitHub Jobs',
  },
  {
    title: 'DevOps Engineer',
    company: 'Cloud Infrastructure Co',
    location: 'Austin, TX',
    description: 'Manage and optimize our cloud infrastructure.',
    salary: { min: 130000, max: 160000, currency: 'USD' },
    skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Python'],
    applyLink: 'https://company.example.com/careers/devops',
    source: 'LinkedIn',
  },
  {
    title: 'Mobile Developer (React Native)',
    company: 'App Innovations Ltd',
    location: 'London, UK',
    description: 'Build cross-platform mobile apps for iOS and Android.',
    salary: { min: 80000, max: 110000, currency: 'GBP' },
    skills: ['React Native', 'JavaScript', 'Firebase', 'REST APIs'],
    applyLink: 'https://company.example.com/careers/mobile',
    source: 'Glassdoor',
  },

  // Machine Learning / Data Science Jobs
  {
    title: 'Machine Learning Engineer',
    company: 'AI Research Labs',
    location: 'Mountain View, CA',
    description: 'Develop and deploy ML models for real-world applications.',
    salary: { min: 180000, max: 250000, currency: 'USD' },
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'Data Science'],
    applyLink: 'https://company.example.com/careers/ml',
    source: 'LinkedIn',
  },
  {
    title: 'Data Scientist',
    company: 'Analytics Corp',
    location: 'Boston, MA',
    description: 'Extract actionable insights from complex datasets.',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Visualization'],
    applyLink: 'https://company.example.com/careers/data-scientist',
    source: 'Indeed',
  },
  {
    title: 'NLP Engineer',
    company: 'Language AI Startup',
    location: 'Remote',
    description: 'Build natural language processing models.',
    salary: { min: 140000, max: 190000, currency: 'USD' },
    skills: ['NLP', 'Python', 'BERT', 'GPT', 'Machine Learning'],
    applyLink: 'https://company.example.com/careers/nlp',
    source: 'LinkedIn',
  },

  // Cybersecurity Jobs
  {
    title: 'Security Engineer',
    company: 'Cybersecurity Solutions',
    location: 'Washington, DC',
    description: 'Protect enterprise systems from security threats.',
    salary: { min: 130000, max: 170000, currency: 'USD' },
    skills: ['Network Security', 'Penetration Testing', 'Python', 'Linux', 'Compliance'],
    applyLink: 'https://company.example.com/careers/security',
    source: 'LinkedIn',
  },
  {
    title: 'Ethical Hacker / Penetration Tester',
    company: 'Red Team Security',
    location: 'Chicago, IL',
    description: 'Test and validate security systems.',
    salary: { min: 100000, max: 150000, currency: 'USD' },
    skills: ['Penetration Testing', 'Networking', 'Security Tools', 'Python'],
    applyLink: 'https://company.example.com/careers/pentest',
    source: 'HackerOne',
  },

  // Cloud & DevOps Jobs
  {
    title: 'Cloud Architect',
    company: 'Enterprise Cloud Services',
    location: 'Seattle, WA',
    description: 'Design scalable cloud solutions for Fortune 500 companies.',
    salary: { min: 160000, max: 220000, currency: 'USD' },
    skills: ['AWS', 'Architecture', 'Kubernetes', 'System Design', 'Leadership'],
    applyLink: 'https://company.example.com/careers/cloud-architect',
    source: 'LinkedIn',
  },
  {
    title: 'Infrastructure Engineer',
    company: 'Cloud Tech Innovations',
    location: 'Remote',
    description: 'Build and maintain cloud infrastructure.',
    salary: { min: 110000, max: 150000, currency: 'USD' },
    skills: ['Terraform', 'AWS', 'Python', 'Linux', 'Monitoring'],
    applyLink: 'https://company.example.com/careers/infra',
    source: 'LinkedIn',
  },

  // Design Jobs
  {
    title: 'Senior UI/UX Designer',
    company: 'Design Studio Pro',
    location: 'San Francisco, CA',
    description: 'Lead design for our flagship product.',
    salary: { min: 110000, max: 150000, currency: 'USD' },
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Communication'],
    applyLink: 'https://company.example.com/careers/design',
    source: 'Dribbble',
  },
  {
    title: 'Product Designer',
    company: 'SaaS Innovators',
    location: 'Remote',
    description: 'Design beautiful and functional interfaces.',
    salary: { min: 90000, max: 130000, currency: 'USD' },
    skills: ['Figma', 'Wireframing', 'UX Research', 'CSS', 'Collaboration'],
    applyLink: 'https://company.example.com/careers/product-design',
    source: 'LinkedIn',
  },

  // Digital Marketing
  {
    title: 'Digital Marketing Manager',
    company: 'Marketing Agency Plus',
    location: 'Los Angeles, CA',
    description: 'Lead digital marketing campaigns and strategy.',
    salary: { min: 70000, max: 110000, currency: 'USD' },
    skills: ['SEO', 'SEM', 'Social Media', 'Analytics', 'Content Marketing'],
    applyLink: 'https://company.example.com/careers/marketing',
    source: 'LinkedIn',
  },
  {
    title: 'Growth Marketer',
    company: 'Startup Growth Co',
    location: 'Remote',
    description: 'Drive rapid user acquisition and engagement.',
    salary: { min: 80000, max: 120000, currency: 'USD' },
    skills: ['Growth Hacking', 'Analytics', 'A/B Testing', 'SQL', 'Data Analysis'],
    applyLink: 'https://company.example.com/careers/growth',
    source: 'LinkedIn',
  },

  // Product Management
  {
    title: 'Product Manager',
    company: 'Tech Product Co',
    location: 'San Francisco, CA',
    description: 'Define product vision and drive execution.',
    salary: { min: 130000, max: 180000, currency: 'USD' },
    skills: ['Product Strategy', 'Analytics', 'Communication', 'User Research', 'Leadership'],
    applyLink: 'https://company.example.com/careers/pm',
    source: 'LinkedIn',
  },

  // Teaching & Education
  {
    title: 'Computer Science Teacher',
    company: 'Premier International School',
    location: 'New Delhi, India',
    description: 'Teach advanced computer science to high school students.',
    salary: { min: 500000, max: 800000, currency: 'INR' },
    skills: ['Teaching', 'Computer Science', 'Python', 'Curriculum Design', 'Mentoring'],
    applyLink: 'https://school.example.com/careers/cs-teacher',
    source: 'LinkedIn',
  },

  // Finance & Investment Banking
  {
    title: 'Investment Banking Analyst',
    company: 'Global Investment Bank',
    location: 'London, UK',
    description: 'Provide financial advisory services to corporations.',
    salary: { min: 80000, max: 120000, currency: 'GBP' },
    skills: ['Financial Modeling', 'Excel', 'Valuation', 'Communication', 'Networking'],
    applyLink: 'https://bank.example.com/careers/analyst',
    source: 'LinkedIn',
  },

  // Content Creation (Creator Jobs)
  {
    title: 'Video Content Creator',
    company: 'Media Production House',
    location: 'Remote',
    description: 'Create engaging video content for YouTube and social media.',
    salary: { min: 30000, max: 80000, currency: 'USD' },
    skills: ['Video Production', 'Editing', 'Content Creation', 'Social Media', 'Storytelling'],
    applyLink: 'https://company.example.com/careers/creator',
    source: 'YouTube',
  },

  // Indian Government & Defence
  {
    title: 'Banking Sector Officer',
    company: 'State Bank of India',
    location: 'Mumbai, India',
    description: 'Work as an officer in the banking sector.',
    salary: { min: 600000, max: 1200000, currency: 'INR' },
    skills: ['Finance', 'Banking', 'Customer Service', 'Leadership', 'Compliance'],
    applyLink: 'https://sbi.co.in/careers',
    source: 'SBI Official',
  },
];

async function seedJobs() {
  console.log('🌱 Starting job seeding...');

  try {
    // Clear existing jobs
    await prisma.job.deleteMany({});

    for (const jobData of JOB_DATA) {
      await prisma.job.create({
        data: {
          ...jobData,
          salary: jobData.salary as any,
        } as any,
      });

      console.log(`✅ Seeded job: ${jobData.title} at ${jobData.company}`);
    }

    console.log(`\n✨ Job seeding complete! Seeded ${JOB_DATA.length} jobs.`);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    throw error;
  }
}

seedJobs()
  .then(() => {
    console.log('Job seed complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Job seed failed:', error);
    process.exit(1);
  });
