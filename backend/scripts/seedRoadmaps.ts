import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ROADMAP_DATA = [
  {
    title: 'Full Stack Web Development Roadmap',
    category: 'Software Engineering',
    description: 'Complete roadmap from HTML/CSS to full-stack JavaScript development',
    level: 'beginner-to-intermediate',
    duration: '12 weeks',
    icon: '🚀',
    estimatedHours: 120,
    tags: ['web-development', 'javascript', 'react', 'nodejs'],
    weeks: [
      {
        title: 'HTML & CSS Fundamentals',
        weekNumber: 1,
        days: [
          {
            title: 'HTML Basics & Structure',
            dayNumber: 1,
            description: 'Learn semantic HTML structure and document organization',
            tasks: [
              {
                title: 'HTML Document Structure',
                description: 'Create valid HTML documents with proper structure',
                duration: '2 hours',
                xp: 100,
              },
              {
                title: 'Semantic Elements',
                description: 'Use semantic tags for accessibility',
                duration: '1.5 hours',
                xp: 75,
              },
            ],
          },
          {
            title: 'CSS Styling Basics',
            dayNumber: 2,
            description: 'Learn CSS fundamentals and styling techniques',
            tasks: [
              {
                title: 'CSS Selectors & Properties',
                description: 'Master CSS selectors, specificity, and properties',
                duration: '2 hours',
                xp: 100,
              },
            ],
          },
          {
            title: 'Responsive Design',
            dayNumber: 3,
            description: 'Create responsive layouts with Flexbox and Grid',
            tasks: [
              {
                title: 'Flexbox Layout',
                description: 'Master Flexbox for flexible layouts',
                duration: '2 hours',
                xp: 120,
              },
              {
                title: 'CSS Grid',
                description: 'Build complex layouts with CSS Grid',
                duration: '1.5 hours',
                xp: 100,
              },
            ],
          },
        ],
      },
      {
        title: 'JavaScript Fundamentals',
        weekNumber: 2,
        days: [
          {
            title: 'JavaScript Basics',
            dayNumber: 1,
            description: 'Learn JavaScript fundamentals',
            tasks: [
              {
                title: 'Variables & Data Types',
                description: 'Understand JS data types and variables',
                duration: '2 hours',
                xp: 100,
              },
              {
                title: 'Functions & Scope',
                description: 'Learn functions and scope management',
                duration: '2 hours',
                xp: 120,
              },
            ],
          },
          {
            title: 'DOM & Events',
            dayNumber: 2,
            description: 'Manipulate DOM and handle user interactions',
            tasks: [
              {
                title: 'DOM Manipulation',
                description: 'Select, modify, and create DOM elements',
                duration: '2 hours',
                xp: 100,
              },
              {
                title: 'Event Handling',
                description: 'Handle click, submit, and other events',
                duration: '1.5 hours',
                xp: 80,
              },
            ],
          },
          {
            title: 'Async JavaScript',
            dayNumber: 3,
            description: 'Master callbacks, promises, and async/await',
            tasks: [
              {
                title: 'Promises & Async/Await',
                description: 'Handle asynchronous operations',
                duration: '2.5 hours',
                xp: 150,
              },
            ],
          },
        ],
      },
      {
        title: 'React & Frontend Frameworks',
        weekNumber: 3,
        days: [
          {
            title: 'React Basics',
            dayNumber: 1,
            description: 'Learn React fundamentals',
            tasks: [
              {
                title: 'Components & JSX',
                description: 'Create functional components with JSX',
                duration: '2 hours',
                xp: 120,
              },
              {
                title: 'Props & State',
                description: 'Manage component data with props and state',
                duration: '2 hours',
                xp: 120,
              },
            ],
          },
          {
            title: 'React Hooks',
            dayNumber: 2,
            description: 'Master React hooks for state management',
            tasks: [
              {
                title: 'useState & useEffect',
                description: 'Use state and lifecycle hooks',
                duration: '2 hours',
                xp: 120,
              },
              {
                title: 'Custom Hooks',
                description: 'Create reusable custom hooks',
                duration: '1.5 hours',
                xp: 100,
              },
            ],
          },
        ],
      },
      {
        title: 'Backend with Node.js & Express',
        weekNumber: 4,
        days: [
          {
            title: 'Node.js Basics',
            dayNumber: 1,
            description: 'Learn Node.js fundamentals',
            tasks: [
              {
                title: 'Node.js & npm',
                description: 'Setup Node.js environment and packages',
                duration: '1.5 hours',
                xp: 80,
              },
              {
                title: 'File System & Modules',
                description: 'Work with files and modules in Node',
                duration: '2 hours',
                xp: 100,
              },
            ],
          },
          {
            title: 'Express Server',
            dayNumber: 2,
            description: 'Build APIs with Express.js',
            tasks: [
              {
                title: 'Express Basics',
                description: 'Create basic Express server and routes',
                duration: '2 hours',
                xp: 120,
              },
              {
                title: 'Middleware & Routing',
                description: 'Use middleware and organize routes',
                duration: '1.5 hours',
                xp: 100,
              },
            ],
          },
        ],
      },
      {
        title: 'Database & APIs',
        weekNumber: 5,
        days: [
          {
            title: 'MongoDB Basics',
            dayNumber: 1,
            description: 'Learn MongoDB fundamentals',
            tasks: [
              {
                title: 'MongoDB & Collections',
                description: 'Understand documents and collections',
                duration: '2 hours',
                xp: 100,
              },
              {
                title: 'CRUD Operations',
                description: 'Create, read, update, delete operations',
                duration: '2 hours',
                xp: 120,
              },
            ],
          },
          {
            title: 'REST API Design',
            dayNumber: 2,
            description: 'Design and build RESTful APIs',
            tasks: [
              {
                title: 'API Design Principles',
                description: 'Learn REST principles and best practices',
                duration: '1.5 hours',
                xp: 80,
              },
              {
                title: 'Building APIs',
                description: 'Create complete CRUD API endpoints',
                duration: '2 hours',
                xp: 130,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Python for Data Science',
    category: 'Data Science',
    description: 'Complete roadmap to become a Data Scientist using Python',
    level: 'beginner-to-advanced',
    duration: '16 weeks',
    icon: '📊',
    estimatedHours: 160,
    tags: ['python', 'data-science', 'machine-learning', 'analytics'],
    weeks: [
      {
        title: 'Python Basics',
        weekNumber: 1,
        days: [
          {
            title: 'Python Environment Setup',
            dayNumber: 1,
            description: 'Setup Python and Jupyter notebooks',
            tasks: [
              {
                title: 'Python Installation & Jupyter',
                description: 'Setup Python environment with Jupyter',
                duration: '1 hour',
                xp: 50,
              },
            ],
          },
          {
            title: 'Python Syntax',
            dayNumber: 2,
            description: 'Learn Python fundamentals',
            tasks: [
              {
                title: 'Variables & Data Types',
                description: 'Understand Python data types',
                duration: '2 hours',
                xp: 100,
              },
              {
                title: 'Control Flow',
                description: 'Use loops and conditionals',
                duration: '1.5 hours',
                xp: 75,
              },
            ],
          },
        ],
      },
      {
        title: 'Data Analysis with Pandas',
        weekNumber: 2,
        days: [
          {
            title: 'Pandas Fundamentals',
            dayNumber: 1,
            description: 'Learn data manipulation with Pandas',
            tasks: [
              {
                title: 'DataFrames & Series',
                description: 'Work with Pandas data structures',
                duration: '2 hours',
                xp: 120,
              },
              {
                title: 'Data Loading & Cleaning',
                description: 'Load and clean data with Pandas',
                duration: '2 hours',
                xp: 130,
              },
            ],
          },
        ],
      },
      {
        title: 'Data Visualization',
        weekNumber: 3,
        days: [
          {
            title: 'Matplotlib & Seaborn',
            dayNumber: 1,
            description: 'Create data visualizations',
            tasks: [
              {
                title: 'Matplotlib Basics',
                description: 'Create plots and charts with Matplotlib',
                duration: '2 hours',
                xp: 120,
              },
              {
                title: 'Seaborn Advanced',
                description: 'Beautiful statistical visualizations',
                duration: '1.5 hours',
                xp: 100,
              },
            ],
          },
        ],
      },
      {
        title: 'Statistics & Probability',
        weekNumber: 4,
        days: [
          {
            title: 'Statistical Foundations',
            dayNumber: 1,
            description: 'Learn statistics for data science',
            tasks: [
              {
                title: 'Descriptive Statistics',
                description: 'Mean, median, distribution analysis',
                duration: '2 hours',
                xp: 120,
              },
              {
                title: 'Hypothesis Testing',
                description: 'Test statistical hypotheses',
                duration: '2 hours',
                xp: 130,
              },
            ],
          },
        ],
      },
      {
        title: 'Machine Learning Basics',
        weekNumber: 5,
        days: [
          {
            title: 'ML Introduction',
            dayNumber: 1,
            description: 'Learn machine learning concepts',
            tasks: [
              {
                title: 'Supervised Learning',
                description: 'Regression and classification basics',
                duration: '2.5 hours',
                xp: 150,
              },
              {
                title: 'Scikit-learn Basics',
                description: 'Use sklearn for ML models',
                duration: '2 hours',
                xp: 130,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Cybersecurity Fundamentals',
    category: 'Cybersecurity',
    description: 'Learn security principles, tools, and ethical hacking',
    level: 'beginner-to-intermediate',
    duration: '10 weeks',
    icon: '🔒',
    estimatedHours: 100,
    tags: ['security', 'networking', 'hacking', 'compliance'],
    weeks: [
      {
        title: 'Network Fundamentals',
        weekNumber: 1,
        days: [
          {
            title: 'Networking Basics',
            dayNumber: 1,
            description: 'Understand network concepts',
            tasks: [
              {
                title: 'OSI Model',
                description: 'Learn the 7-layer OSI model',
                duration: '2 hours',
                xp: 120,
              },
              {
                title: 'TCP/IP Basics',
                description: 'Understand TCP/IP protocols',
                duration: '1.5 hours',
                xp: 100,
              },
            ],
          },
        ],
      },
      {
        title: 'Security Threats & Attacks',
        weekNumber: 2,
        days: [
          {
            title: 'Common Attack Vectors',
            dayNumber: 1,
            description: 'Learn about security threats',
            tasks: [
              {
                title: 'Malware & Viruses',
                description: 'Understand malware types',
                duration: '1.5 hours',
                xp: 80,
              },
              {
                title: 'Web Vulnerabilities',
                description: 'Learn OWASP top 10 vulnerabilities',
                duration: '2 hours',
                xp: 130,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'UPSC Exam Preparation',
    category: 'Government & Public Service',
    description: 'Complete roadmap for UPSC Civil Service examination',
    level: 'advanced',
    duration: '52 weeks',
    icon: '🏛️',
    estimatedHours: 520,
    tags: ['upsc', 'civil-service', 'government', 'exams'],
    weeks: [
      {
        title: 'General Studies - History',
        weekNumber: 1,
        days: [
          {
            title: 'Ancient Indian History',
            dayNumber: 1,
            description: 'Learn ancient India history',
            tasks: [
              {
                title: 'Indus Valley Civilization',
                description: 'Understand Harappan civilization',
                duration: '3 hours',
                xp: 200,
              },
              {
                title: 'Vedic Period',
                description: 'Study Vedic age and Aryan civilization',
                duration: '2.5 hours',
                xp: 180,
              },
            ],
          },
        ],
      },
      {
        title: 'General Studies - Geography',
        weekNumber: 2,
        days: [
          {
            title: 'Indian Geography',
            dayNumber: 1,
            description: 'Learn Indian geography details',
            tasks: [
              {
                title: 'Physical Geography',
                description: 'Mountain ranges, rivers, climate zones',
                duration: '3 hours',
                xp: 200,
              },
            ],
          },
        ],
      },
      {
        title: 'Current Affairs',
        weekNumber: 3,
        days: [
          {
            title: 'National & International Affairs',
            dayNumber: 1,
            description: 'Daily current affairs tracking',
            tasks: [
              {
                title: 'Daily News Reading',
                description: 'Read and analyze daily news',
                duration: '1.5 hours',
                xp: 100,
              },
              {
                title: 'News Consolidation',
                description: 'Weekly news consolidation and analysis',
                duration: '2 hours',
                xp: 120,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'UI/UX Design Mastery',
    category: 'Design',
    description: 'Learn to design beautiful and functional user interfaces',
    level: 'beginner-to-advanced',
    duration: '12 weeks',
    icon: '🎨',
    estimatedHours: 120,
    tags: ['design', 'ui', 'ux', 'figma'],
    weeks: [
      {
        title: 'Design Fundamentals',
        weekNumber: 1,
        days: [
          {
            title: 'Design Principles',
            dayNumber: 1,
            description: 'Learn fundamental design principles',
            tasks: [
              {
                title: 'Design Principles',
                description: 'Alignment, contrast, emphasis, hierarchy',
                duration: '2 hours',
                xp: 120,
              },
              {
                title: 'Color Theory',
                description: 'Color harmony and psychology',
                duration: '1.5 hours',
                xp: 100,
              },
            ],
          },
        ],
      },
      {
        title: 'UX Research',
        weekNumber: 2,
        days: [
          {
            title: 'User Research Methods',
            dayNumber: 1,
            description: 'Learn UX research techniques',
            tasks: [
              {
                title: 'User Interviews & Surveys',
                description: 'Conduct user research',
                duration: '2.5 hours',
                xp: 150,
              },
              {
                title: 'User Personas',
                description: 'Create user personas from research',
                duration: '2 hours',
                xp: 130,
              },
            ],
          },
        ],
      },
    ],
  },
];

async function seedRoadmaps() {
  console.log('🌱 Starting roadmap seeding...');

  try {
    // Clear existing roadmaps
    await prisma.roadmap.deleteMany({});
    await prisma.week.deleteMany({});
    await prisma.day.deleteMany({});
    await prisma.task.deleteMany({});

    for (const roadmapData of ROADMAP_DATA) {
      const { weeks, ...roadmapBase } = roadmapData;

      // Create roadmap
      const roadmap = await prisma.roadmap.create({
        data: {
          ...roadmapBase,
          weeks: {
            create: weeks.map((week) => {
              const { days, ...weekBase } = week;
              return {
                ...weekBase,
                days: {
                  create: days.map((day) => {
                    const { tasks, ...dayBase } = day;
                    return {
                      ...dayBase,
                      tasks: {
                        create: tasks.map((task) => ({
                          ...task,
                        })),
                      },
                    };
                  }),
                },
              };
            }),
          },
        },
      });

      console.log(`✅ Seeded roadmap: ${roadmap.title}`);
    }

    console.log(`\n✨ Roadmap seeding complete! Seeded ${ROADMAP_DATA.length} roadmaps.`);
  } catch (error) {
    console.error('❌ Error seeding roadmaps:', error);
    throw error;
  }
}

seedRoadmaps()
  .then(() => {
    console.log('Roadmap seed complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Roadmap seed failed:', error);
    process.exit(1);
  });
