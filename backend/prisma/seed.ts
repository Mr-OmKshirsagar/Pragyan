import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

const skillSeeds = [
  {
    skillName: 'HTML & CSS Fundamentals',
    skillCategory: 'frontend',
    difficulty: 'beginner',
    description: 'Learn semantic HTML, modern CSS, Flexbox, Grid, accessibility, and responsive layouts.',
    totalDuration: '4 weeks',
    estimatedHours: 40,
    icon: '🎨',
    color: 'primary',
    prerequisites: [],
    relatedSkills: ['JavaScript Fundamentals'],
    totalDays: 28,
    dailyTasks: [
      {
        taskNumber: 1,
        title: 'Introduction to Web',
        description: 'Understand the web and HTML basics.',
        estimatedTime: '45 mins',
        subtasks: ['How the web works', 'Client-server basics', 'HTML file structure'],
        resources: [
          {
            title: 'MDN Web Docs - Getting started with the web',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web',
            description: 'Learn how the web works.',
            platform: 'MDN',
            type: 'documentation',
          },
          {
            title: 'W3Schools HTML Tutorial',
            url: 'https://www.w3schools.com/html/',
            description: 'Interactive HTML tutorial.',
            platform: 'W3Schools',
            type: 'tutorial',
          },
        ],
      },
      {
        taskNumber: 2,
        title: 'Semantic HTML',
        description: 'Build structured, accessible HTML pages.',
        estimatedTime: '50 mins',
        subtasks: ['Semantic tags', 'Forms', 'Media elements'],
        resources: [
          {
            title: 'MDN Semantic HTML',
            url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics',
            description: 'Semantic markup reference.',
            platform: 'MDN',
            type: 'documentation',
          },
        ],
      },
      {
        taskNumber: 3,
        title: 'CSS Layouts',
        description: 'Use Flexbox and Grid to create responsive layouts.',
        estimatedTime: '60 mins',
        subtasks: ['Box model', 'Flexbox', 'Grid layouts'],
        resources: [
          {
            title: 'MDN Flexbox Guide',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox',
            description: 'Flexbox layout guide.',
            platform: 'MDN',
            type: 'documentation',
          },
        ],
      },
    ],
  },
  {
    skillName: 'JavaScript Fundamentals',
    skillCategory: 'frontend',
    difficulty: 'beginner',
    description: 'Master JavaScript syntax, DOM manipulation, events, and async programming.',
    totalDuration: '5 weeks',
    estimatedHours: 50,
    icon: '✨',
    color: 'secondary',
    prerequisites: ['HTML & CSS Fundamentals'],
    relatedSkills: ['React Fundamentals'],
    totalDays: 35,
    dailyTasks: [
      {
        taskNumber: 1,
        title: 'Variables and Data Types',
        description: 'Learn variables, primitives, and coercion.',
        estimatedTime: '60 mins',
        subtasks: ['let, const', 'Strings, numbers, booleans', 'Undefined vs null'],
        resources: [
          {
            title: 'MDN JavaScript Guide',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
            description: 'Official JavaScript guide.',
            platform: 'MDN',
            type: 'documentation',
          },
        ],
      },
      {
        taskNumber: 2,
        title: 'Functions and Scope',
        description: 'Work with functions, closures, and scope.',
        estimatedTime: '60 mins',
        subtasks: ['Function declarations', 'Arrow functions', 'Closures'],
        resources: [
          {
            title: 'JavaScript.info Functions',
            url: 'https://javascript.info/function-basics',
            description: 'Functions and scope tutorial.',
            platform: 'JavaScript.info',
            type: 'tutorial',
          },
        ],
      },
    ],
  },
  {
    skillName: 'React Fundamentals',
    skillCategory: 'frontend',
    difficulty: 'intermediate',
    description: 'Build component-based user interfaces with React hooks, props, and state.',
    totalDuration: '6 weeks',
    estimatedHours: 60,
    icon: '⚛️',
    color: 'accent',
    prerequisites: ['JavaScript Fundamentals'],
    relatedSkills: ['Node.js Backend'],
    totalDays: 42,
    dailyTasks: [
      {
        taskNumber: 1,
        title: 'React Setup',
        description: 'Set up a React app and understand JSX.',
        estimatedTime: '45 mins',
        subtasks: ['Project setup', 'JSX syntax', 'Component structure'],
        resources: [
          {
            title: 'React Docs - Quick Start',
            url: 'https://react.dev/learn',
            description: 'Official React learning path.',
            platform: 'React',
            type: 'documentation',
          },
        ],
      },
      {
        taskNumber: 2,
        title: 'State and Props',
        description: 'Pass data with props and manage component state.',
        estimatedTime: '60 mins',
        subtasks: ['Props basics', 'useState', 'Component composition'],
        resources: [
          {
            title: 'React State Guide',
            url: 'https://react.dev/learn/state-a-components-memory',
            description: 'Learn component state.',
            platform: 'React',
            type: 'documentation',
          },
        ],
      },
    ],
  },
  {
    skillName: 'Node.js Backend',
    skillCategory: 'backend',
    difficulty: 'intermediate',
    description: 'Create APIs with Node.js, Express, and MongoDB integration.',
    totalDuration: '6 weeks',
    estimatedHours: 60,
    icon: '🟢',
    color: 'success',
    prerequisites: ['JavaScript Fundamentals'],
    relatedSkills: ['React Fundamentals'],
    totalDays: 42,
    dailyTasks: [
      {
        taskNumber: 1,
        title: 'Node.js Setup',
        description: 'Set up Node.js and npm.',
        estimatedTime: '30 mins',
        subtasks: ['Install Node.js', 'npm basics', 'Run scripts'],
        resources: [
          {
            title: 'Node.js Docs',
            url: 'https://nodejs.org/en/learn',
            description: 'Official Node.js learning resource.',
            platform: 'Node.js',
            type: 'documentation',
          },
        ],
      },
      {
        taskNumber: 2,
        title: 'Express APIs',
        description: 'Build REST endpoints with Express.',
        estimatedTime: '60 mins',
        subtasks: ['Routing', 'Middleware', 'Request validation'],
        resources: [
          {
            title: 'Express Guide',
            url: 'https://expressjs.com/en/guide/routing.html',
            description: 'Express routing guide.',
            platform: 'Express',
            type: 'documentation',
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log('Starting Prisma seed...');

  await prisma.resource.deleteMany();
  await prisma.dailyTask.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.userRoadmap.deleteMany();
  await prisma.taskProgress.deleteMany();
  await prisma.assessmentAnswer.deleteMany();
  await prisma.assessmentQuestion.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.careerMatch.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hashPassword('admin123');
  await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@pragyan.com',
      password: adminPassword,
      role: 'ADMIN',
      skills: ['HTML & CSS Fundamentals', 'JavaScript Fundamentals'],
      interests: ['Web Development', 'Backend Development'],
      skillLevel: 'Advanced',
      xp: 1000,
    },
  });

  const userPassword = await hashPassword('user123');
  for (let index = 1; index <= 3; index++) {
    await prisma.user.create({
      data: {
        fullName: `Sample User ${index}`,
        email: `user${index}@pragyan.com`,
        password: userPassword,
        role: 'USER',
        skills: [],
        interests: ['Web Development', 'AI/ML'],
        skillLevel: 'Beginner',
        xp: Math.round(Math.random() * 500),
      },
    });
  }

  for (const skillSeed of skillSeeds) {
    await prisma.skill.create({
      data: {
        skillName: skillSeed.skillName,
        skillCategory: skillSeed.skillCategory,
        difficulty: skillSeed.difficulty,
        description: skillSeed.description,
        totalDuration: skillSeed.totalDuration,
        estimatedHours: skillSeed.estimatedHours,
        icon: skillSeed.icon,
        color: skillSeed.color,
        prerequisites: skillSeed.prerequisites,
        relatedSkills: skillSeed.relatedSkills,
        totalDays: skillSeed.totalDays,
        dailyTasks: {
          create: skillSeed.dailyTasks.map((task) => ({
            taskNumber: task.taskNumber,
            title: task.title,
            description: task.description,
            estimatedTime: task.estimatedTime,
            subtasks: task.subtasks,
            resources: {
              create: task.resources.map((resource) => ({
                title: resource.title,
                url: resource.url,
                description: resource.description,
                platform: resource.platform,
                type: resource.type,
              })),
            },
          })),
        },
      },
    });
  }

  const assessment = await prisma.assessment.create({
    data: {
      title: 'Career Direction Assessment',
      description: 'Short assessment to understand your current interests and goals.',
    },
  });

  const assessmentQuestions = [
    {
      questionText: 'Do you enjoy building user interfaces?',
      options: ['Yes', 'No', 'Maybe'],
      category: 'frontend',
    },
    {
      questionText: 'Do you enjoy working with APIs and databases?',
      options: ['Yes', 'No', 'Maybe'],
      category: 'backend',
    },
    {
      questionText: 'Are you interested in data and machine learning?',
      options: ['Yes', 'No', 'Maybe'],
      category: 'ai-ml',
    },
    {
      questionText: 'Do you like automation and deployment?',
      options: ['Yes', 'No', 'Maybe'],
      category: 'devops',
    },
    {
      questionText: 'Are you curious about security and ethical hacking?',
      options: ['Yes', 'No', 'Maybe'],
      category: 'cyber-security',
    },
  ];

  for (const question of assessmentQuestions) {
    await prisma.assessmentQuestion.create({
      data: {
        assessmentId: assessment.id,
        questionText: question.questionText,
        options: question.options,
        category: question.category,
      },
    });
  }

  const sampleUser = await prisma.user.findUnique({
    where: { email: 'user1@pragyan.com' },
  });

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@pragyan.com' },
  });

  if (sampleUser && adminUser) {
    await prisma.careerMatch.create({
      data: {
        userId: sampleUser.id,
        careerTitle: 'Frontend Developer',
        company: 'Pragyan Labs',
        description: 'Strong fit for frontend roles focused on React and design systems.',
        matchScore: 92,
        requiredSkills: ['React', 'TypeScript', 'CSS'],
        growthAreas: ['Testing', 'Performance optimization'],
        salaryRange: '$70k - $110k',
        jobMarketDemand: 8,
      },
    });

    await prisma.careerMatch.create({
      data: {
        userId: adminUser.id,
        careerTitle: 'Full Stack Engineer',
        company: 'Pragyan Labs',
        description: 'Experienced profile with backend, frontend, and platform skills.',
        matchScore: 98,
        requiredSkills: ['Node.js', 'React', 'MongoDB'],
        growthAreas: ['Leadership', 'Architecture'],
        salaryRange: '$110k - $150k',
        jobMarketDemand: 9,
      },
    });
  }

  console.log(`Seeded ${skillSeeds.length} skill roadmaps, demo users, assessment data, and career matches.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
