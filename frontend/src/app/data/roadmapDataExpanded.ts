import { ExpandedRoadmap, RoadmapCategory } from '../types/roadmapExpanded';

// ============ FRONTEND DEVELOPMENT ROADMAPS ============

export const htmlCssRoadmapExpanded: ExpandedRoadmap = {
  id: 'html-css-fundamentals',
  title: 'HTML & CSS Fundamentals',
  category: 'frontend',
  icon: '🎨',
  description: 'Master the foundations of web development with semantic HTML and modern CSS techniques.',
  level: 'beginner',
  duration: '4 weeks',
  totalTasks: 28,
  estimatedHours: 40,
  color: 'primary',
  learningOutcomes: [
    'Create semantic HTML structures',
    'Style websites with CSS',
    'Build responsive layouts with Flexbox & Grid',
    'Understand accessibility best practices',
  ],
  weeks: [
    {
      week: 1,
      title: 'HTML Basics',
      topics: [
        { title: 'HTML Structure', description: 'Doctype, html, head, body tags' },
        { title: 'Semantic HTML', description: 'Header, nav, main, footer, article, section' },
        { title: 'Forms & Inputs', description: 'Input types, labels, validation' },
      ],
      estimatedHours: 8,
    },
    {
      week: 2,
      title: 'CSS Fundamentals',
      topics: [
        { title: 'Selectors & Specificity', description: 'Class, ID, attribute selectors' },
        { title: 'Box Model', description: 'Margin, padding, border' },
        { title: 'Typography', description: 'Font properties, text styling' },
      ],
      estimatedHours: 8,
    },
    {
      week: 3,
      title: 'Layouts',
      topics: [
        { title: 'Flexbox', description: 'Flexible layouts, alignment' },
        { title: 'CSS Grid', description: 'Grid layout, areas, templates' },
      ],
      estimatedHours: 12,
    },
    {
      week: 4,
      title: 'Responsive Design',
      topics: [
        { title: 'Media Queries', description: 'Mobile-first approach' },
        { title: 'Animations', description: 'Transitions and keyframes' },
        { title: 'Project', description: 'Build responsive portfolio' },
      ],
      estimatedHours: 12,
    },
  ],
};

export const javascriptFundamentalsExpanded: ExpandedRoadmap = {
  id: 'javascript-fundamentals-expanded',
  title: 'JavaScript Fundamentals',
  category: 'frontend',
  icon: '✨',
  description: 'Learn JavaScript from scratch. Master ES6+, DOM manipulation, and async programming.',
  level: 'beginner',
  duration: '5 weeks',
  totalTasks: 35,
  estimatedHours: 50,
  color: 'secondary',
  learningOutcomes: [
    'Master JavaScript syntax and fundamentals',
    'Manipulate the DOM effectively',
    'Handle asynchronous operations',
    'Build interactive web applications',
  ],
  weeks: [
    { week: 1, title: 'Basics', topics: [{ title: 'Variables & Data Types', description: 'var, let, const' }], estimatedHours: 10 },
    { week: 2, title: 'Control Flow', topics: [{ title: 'Conditionals & Loops', description: 'if/else, for, while' }], estimatedHours: 10 },
    { week: 3, title: 'Functions & Objects', topics: [{ title: 'Functions', description: 'Declaration, expressions, arrows' }], estimatedHours: 10 },
    { week: 4, title: 'DOM & Events', topics: [{ title: 'DOM Manipulation', description: 'Selectors, event listeners' }], estimatedHours: 10 },
    { week: 5, title: 'Async & Projects', topics: [{ title: 'Promises & Async/Await', description: 'Handle async operations' }], estimatedHours: 10 },
  ],
};

export const typeScriptRoadmap: ExpandedRoadmap = {
  id: 'typescript-professional',
  title: 'TypeScript Professional',
  category: 'frontend',
  icon: '📘',
  description: 'Master TypeScript for scalable, type-safe JavaScript applications.',
  level: 'intermediate',
  duration: '3 weeks',
  totalTasks: 21,
  estimatedHours: 30,
  color: 'primary',
  prerequisites: ['javascript-fundamentals-expanded'],
  learningOutcomes: ['Understand type systems', 'Write scalable code', 'Use advanced TypeScript features'],
  weeks: [
    { week: 1, title: 'Types & Interfaces', topics: [{ title: 'Basic Types', description: 'string, number, boolean, arrays' }], estimatedHours: 10 },
    { week: 2, title: 'Advanced Types', topics: [{ title: 'Generics & Unions', description: 'Reusable type definitions' }], estimatedHours: 10 },
    { week: 3, title: 'OOP & Decorators', topics: [{ title: 'Classes & Interfaces', description: 'Object-oriented programming' }], estimatedHours: 10 },
  ],
};

export const reactAdvancedRoadmap: ExpandedRoadmap = {
  id: 'react-advanced',
  title: 'React Advanced Patterns',
  category: 'frontend',
  icon: '⚛️',
  description: 'Master advanced React concepts: hooks, context, performance optimization, and state management.',
  level: 'advanced',
  duration: '6 weeks',
  totalTasks: 42,
  estimatedHours: 60,
  color: 'accent',
  prerequisites: ['javascript-fundamentals-expanded'],
  learningOutcomes: ['Advanced React patterns', 'Performance optimization', 'Complex state management'],
  weeks: [
    { week: 1, title: 'Hooks Mastery', topics: [{ title: 'useState, useEffect', description: 'Custom hooks' }], estimatedHours: 10 },
    { week: 2, title: 'Context & Performance', topics: [{ title: 'Context API', description: 'useContext, useReducer' }], estimatedHours: 10 },
    { week: 3, title: 'Advanced Patterns', topics: [{ title: 'Render Props', description: 'HOC, Compound Components' }], estimatedHours: 10 },
    { week: 4, title: 'State Management', topics: [{ title: 'Redux/Zustand', description: 'Global state solutions' }], estimatedHours: 10 },
    { week: 5, title: 'Testing & Performance', topics: [{ title: 'Unit Testing', description: 'Jest, React Testing Library' }], estimatedHours: 10 },
    { week: 6, title: 'Real Projects', topics: [{ title: 'Build Complex App', description: 'Full-featured application' }], estimatedHours: 10 },
  ],
};

export const nextJsRoadmap: ExpandedRoadmap = {
  id: 'nextjs-fullstack',
  title: 'Next.js Full Stack',
  category: 'fullstack',
  icon: '⚡',
  description: 'Build full-stack applications with Next.js, API routes, and modern deployment.',
  level: 'advanced',
  duration: '5 weeks',
  totalTasks: 35,
  estimatedHours: 50,
  color: 'secondary',
  prerequisites: ['react-advanced'],
  learningOutcomes: ['Full-stack development', 'Server-side rendering', 'API development', 'Deployment'],
  weeks: [
    { week: 1, title: 'Next.js Basics', topics: [{ title: 'Routing & Pages', description: 'File-based routing system' }], estimatedHours: 10 },
    { week: 2, title: 'API Routes', topics: [{ title: 'Create APIs', description: 'Build backend endpoints' }], estimatedHours: 10 },
    { week: 3, title: 'Database Integration', topics: [{ title: 'ORM & Databases', description: 'Prisma, MongoDB' }], estimatedHours: 10 },
    { week: 4, title: 'Authentication', topics: [{ title: 'NextAuth.js', description: 'Secure authentication' }], estimatedHours: 10 },
    { week: 5, title: 'Deployment & Projects', topics: [{ title: 'Deploy to Production', description: 'Vercel, Docker' }], estimatedHours: 10 },
  ],
};

export const reduxRoadmap: ExpandedRoadmap = {
  id: 'redux-mastery',
  title: 'Redux State Management',
  category: 'frontend',
  icon: '🔄',
  description: 'Master Redux for predictable state management in large React applications.',
  level: 'advanced',
  duration: '3 weeks',
  totalTasks: 21,
  estimatedHours: 30,
  color: 'primary',
  prerequisites: ['react-advanced'],
  learningOutcomes: ['Redux patterns', 'Middleware', 'Redux Toolkit', 'DevTools'],
  weeks: [
    { week: 1, title: 'Redux Basics', topics: [{ title: 'Actions & Reducers', description: 'Core Redux concepts' }], estimatedHours: 10 },
    { week: 2, title: 'Advanced Redux', topics: [{ title: 'Middleware', description: 'Thunk, Saga' }], estimatedHours: 10 },
    { week: 3, title: 'Redux Toolkit', topics: [{ title: 'Modern Redux', description: 'Simplified API' }], estimatedHours: 10 },
  ],
};

export const tailwindCssRoadmap: ExpandedRoadmap = {
  id: 'tailwind-css-mastery',
  title: 'Tailwind CSS Mastery',
  category: 'frontend',
  icon: '🎨',
  description: 'Master utility-first CSS with Tailwind. Build beautiful UIs rapidly.',
  level: 'intermediate',
  duration: '2 weeks',
  totalTasks: 14,
  estimatedHours: 20,
  color: 'accent',
  learningOutcomes: ['Utility-first CSS', 'Component design', 'Responsive design', 'Customization'],
  weeks: [
    { week: 1, title: 'Tailwind Basics', topics: [{ title: 'Utilities & Layout', description: 'Core Tailwind classes' }], estimatedHours: 10 },
    { week: 2, title: 'Advanced Topics', topics: [{ title: 'Customization', description: 'Theme, plugins, dark mode' }], estimatedHours: 10 },
  ],
};

// ============ BACKEND DEVELOPMENT ROADMAPS ============

export const nodeJsAdvancedRoadmap: ExpandedRoadmap = {
  id: 'nodejs-advanced',
  title: 'Node.js Advanced Development',
  category: 'backend',
  icon: '🟢',
  description: 'Build scalable, production-ready Node.js applications with Express and databases.',
  level: 'intermediate',
  duration: '6 weeks',
  totalTasks: 42,
  estimatedHours: 60,
  color: 'success',
  learningOutcomes: ['Build scalable APIs', 'Database integration', 'Authentication', 'Error handling'],
  weeks: [
    { week: 1, title: 'Node Fundamentals', topics: [{ title: 'Modules & NPM', description: 'Node.js basics' }], estimatedHours: 10 },
    { week: 2, title: 'Express.js', topics: [{ title: 'Routing & Middleware', description: 'Build web servers' }], estimatedHours: 10 },
    { week: 3, title: 'Databases', topics: [{ title: 'MongoDB & Mongoose', description: 'NoSQL databases' }], estimatedHours: 10 },
    { week: 4, title: 'Authentication', topics: [{ title: 'JWT & OAuth', description: 'Secure APIs' }], estimatedHours: 10 },
    { week: 5, title: 'Advanced Patterns', topics: [{ title: 'Error Handling', description: 'Logging, monitoring' }], estimatedHours: 10 },
    { week: 6, title: 'Deployment', topics: [{ title: 'Docker & Cloud', description: 'Production deployment' }], estimatedHours: 10 },
  ],
};

export const restApisRoadmap: ExpandedRoadmap = {
  id: 'rest-apis-design',
  title: 'RESTful APIs Design & Development',
  category: 'backend',
  icon: '🔌',
  description: 'Design and build professional RESTful APIs following best practices.',
  level: 'intermediate',
  duration: '4 weeks',
  totalTasks: 28,
  estimatedHours: 40,
  color: 'primary',
  learningOutcomes: ['API design principles', 'Versioning', 'Documentation', 'Testing APIs'],
  weeks: [
    { week: 1, title: 'REST Concepts', topics: [{ title: 'HTTP Methods', description: 'GET, POST, PUT, DELETE' }], estimatedHours: 10 },
    { week: 2, title: 'API Design', topics: [{ title: 'Resources & Endpoints', description: 'Best practices' }], estimatedHours: 10 },
    { week: 3, title: 'Error Handling', topics: [{ title: 'Status Codes', description: 'Error responses' }], estimatedHours: 10 },
    { week: 4, title: 'Documentation & Testing', topics: [{ title: 'Swagger, Postman', description: 'API testing' }], estimatedHours: 10 },
  ],
};

export const authenticationRoadmap: ExpandedRoadmap = {
  id: 'auth-security',
  title: 'Authentication & Security',
  category: 'backend',
  icon: '🔐',
  description: 'Master authentication methods and security best practices for web applications.',
  level: 'advanced',
  duration: '3 weeks',
  totalTasks: 21,
  estimatedHours: 30,
  color: 'danger',
  learningOutcomes: ['JWT implementation', 'OAuth integration', 'Security best practices', 'Password hashing'],
  weeks: [
    { week: 1, title: 'Authentication Basics', topics: [{ title: 'Sessions vs Tokens', description: 'JWT & OAuth' }], estimatedHours: 10 },
    { week: 2, title: 'Implementation', topics: [{ title: 'JWT Implementation', description: 'Token generation & verification' }], estimatedHours: 10 },
    { week: 3, title: 'Advanced Security', topics: [{ title: 'CORS, CSRF', description: 'Security headers' }], estimatedHours: 10 },
  ],
};

export const mongodbRoadmap: ExpandedRoadmap = {
  id: 'mongodb-advanced',
  title: 'MongoDB Advanced',
  category: 'backend',
  icon: '🍃',
  description: 'Master MongoDB NoSQL database with advanced queries and optimization.',
  level: 'intermediate',
  duration: '4 weeks',
  totalTasks: 28,
  estimatedHours: 40,
  color: 'primary',
  learningOutcomes: ['CRUD operations', 'Indexing & optimization', 'Aggregation pipeline', 'Replication'],
  weeks: [
    { week: 1, title: 'MongoDB Basics', topics: [{ title: 'Documents & Collections', description: 'NoSQL concepts' }], estimatedHours: 10 },
    { week: 2, title: 'Queries & Indexing', topics: [{ title: 'Find, Update, Delete', description: 'Query optimization' }], estimatedHours: 10 },
    { week: 3, title: 'Aggregation', topics: [{ title: 'Aggregation Pipeline', description: 'Complex queries' }], estimatedHours: 10 },
    { week: 4, title: 'Performance & Scaling', topics: [{ title: 'Replication & Sharding', description: 'Scale MongoDB' }], estimatedHours: 10 },
  ],
};

export const sqlPostgresRoadmap: ExpandedRoadmap = {
  id: 'sql-postgresql',
  title: 'SQL & PostgreSQL Mastery',
  category: 'backend',
  icon: '🗄️',
  description: 'Master SQL and PostgreSQL relational databases for production applications.',
  level: 'intermediate',
  duration: '4 weeks',
  totalTasks: 28,
  estimatedHours: 40,
  color: 'secondary',
  learningOutcomes: ['SQL queries', 'Database design', 'Performance optimization', 'Transactions'],
  weeks: [
    { week: 1, title: 'SQL Fundamentals', topics: [{ title: 'SELECT, INSERT, UPDATE', description: 'Basic operations' }], estimatedHours: 10 },
    { week: 2, title: 'Joins & Aggregations', topics: [{ title: 'Complex Queries', description: 'JOINs, GROUP BY' }], estimatedHours: 10 },
    { week: 3, title: 'Database Design', topics: [{ title: 'Normalization', description: 'Schema design' }], estimatedHours: 10 },
    { week: 4, title: 'Advanced Topics', topics: [{ title: 'Transactions, Indexes', description: 'Performance tuning' }], estimatedHours: 10 },
  ],
};

// ============ PROGRAMMING LANGUAGES ROADMAPS ============

export const pythonRoadmap: ExpandedRoadmap = {
  id: 'python-fundamentals',
  title: 'Python Fundamentals',
  category: 'programming',
  icon: '🐍',
  description: 'Learn Python programming from basics to advanced concepts. Versatile language for multiple domains.',
  level: 'beginner',
  duration: '6 weeks',
  totalTasks: 42,
  estimatedHours: 60,
  color: 'primary',
  learningOutcomes: ['Python syntax', 'OOP concepts', 'File handling', 'Libraries & frameworks'],
  weeks: [
    { week: 1, title: 'Basics', topics: [{ title: 'Variables & Types', description: 'Python fundamentals' }], estimatedHours: 10 },
    { week: 2, title: 'Control Flow', topics: [{ title: 'Loops & Conditionals', description: 'Program flow' }], estimatedHours: 10 },
    { week: 3, title: 'Functions', topics: [{ title: 'Defining & Using', description: 'Function concepts' }], estimatedHours: 10 },
    { week: 4, title: 'OOP', topics: [{ title: 'Classes & Objects', description: 'Object-oriented programming' }], estimatedHours: 10 },
    { week: 5, title: 'File Handling', topics: [{ title: 'Read/Write Files', description: 'File operations' }], estimatedHours: 10 },
    { week: 6, title: 'Libraries & Projects', topics: [{ title: 'NumPy, Pandas', description: 'Popular libraries' }], estimatedHours: 10 },
  ],
};

export const cppRoadmap: ExpandedRoadmap = {
  id: 'cpp-advanced',
  title: 'C++ Mastery',
  category: 'programming',
  icon: '⚙️',
  description: 'Master C++ for system programming, game development, and performance-critical applications.',
  level: 'advanced',
  duration: '8 weeks',
  totalTasks: 56,
  estimatedHours: 80,
  color: 'warning',
  learningOutcomes: ['C++ syntax', 'Memory management', 'STL', 'Object-oriented design'],
  weeks: [
    { week: 1, title: 'Basics', topics: [{ title: 'Variables & Data Types', description: 'C++ fundamentals' }], estimatedHours: 10 },
    { week: 2, title: 'Control Flow', topics: [{ title: 'Loops & Functions', description: 'Program structure' }], estimatedHours: 10 },
    { week: 3, title: 'Pointers & References', topics: [{ title: 'Memory Management', description: 'Advanced concepts' }], estimatedHours: 10 },
    { week: 4, title: 'OOP', topics: [{ title: 'Classes & Inheritance', description: 'Object-oriented C++' }], estimatedHours: 10 },
    { week: 5, title: 'STL', topics: [{ title: 'Containers & Algorithms', description: 'Standard library' }], estimatedHours: 10 },
    { week: 6, title: 'Exception Handling', topics: [{ title: 'Try, Catch, Throw', description: 'Error handling' }], estimatedHours: 10 },
    { week: 7, title: 'Advanced Topics', topics: [{ title: 'Templates & Metaprogramming', description: 'Advanced C++' }], estimatedHours: 10 },
    { week: 8, title: 'Projects', topics: [{ title: 'Real-world Applications', description: 'System programming' }], estimatedHours: 10 },
  ],
};

export const javaRoadmap: ExpandedRoadmap = {
  id: 'java-enterprise',
  title: 'Java Enterprise Development',
  category: 'programming',
  icon: '☕',
  description: 'Master Java for enterprise applications, Spring Framework, and backend services.',
  level: 'intermediate',
  duration: '8 weeks',
  totalTasks: 56,
  estimatedHours: 80,
  color: 'secondary',
  learningOutcomes: ['Java syntax', 'OOP mastery', 'Spring Framework', 'Microservices'],
  weeks: [
    { week: 1, title: 'Java Basics', topics: [{ title: 'Syntax & Data Types', description: 'Java fundamentals' }], estimatedHours: 10 },
    { week: 2, title: 'OOP', topics: [{ title: 'Classes, Inheritance', description: 'Object-oriented concepts' }], estimatedHours: 10 },
    { week: 3, title: 'Collections', topics: [{ title: 'Lists, Sets, Maps', description: 'Data structures' }], estimatedHours: 10 },
    { week: 4, title: 'Exception Handling', topics: [{ title: 'Try, Catch, Finally', description: 'Error handling' }], estimatedHours: 10 },
    { week: 5, title: 'Spring Basics', topics: [{ title: 'Dependency Injection', description: 'Spring Framework' }], estimatedHours: 10 },
    { week: 6, title: 'Spring Boot', topics: [{ title: 'REST APIs', description: 'Build web services' }], estimatedHours: 10 },
    { week: 7, title: 'Databases', topics: [{ title: 'JPA & Hibernate', description: 'ORM with Spring' }], estimatedHours: 10 },
    { week: 8, title: 'Projects', topics: [{ title: 'Enterprise Applications', description: 'Full-stack projects' }], estimatedHours: 10 },
  ],
};

export const goRoadmap: ExpandedRoadmap = {
  id: 'go-backend',
  title: 'Go Programming for Backend',
  category: 'programming',
  icon: '🐹',
  description: 'Learn Go for building fast, concurrent, and scalable backend systems.',
  level: 'intermediate',
  duration: '4 weeks',
  totalTasks: 28,
  estimatedHours: 40,
  color: 'primary',
  learningOutcomes: ['Go syntax', 'Goroutines', 'RESTful APIs', 'Concurrency'],
  weeks: [
    { week: 1, title: 'Go Basics', topics: [{ title: 'Variables & Types', description: 'Go fundamentals' }], estimatedHours: 10 },
    { week: 2, title: 'Functions & Packages', topics: [{ title: 'Modularity', description: 'Code organization' }], estimatedHours: 10 },
    { week: 3, title: 'Concurrency', topics: [{ title: 'Goroutines & Channels', description: 'Concurrent programming' }], estimatedHours: 10 },
    { week: 4, title: 'Web Services', topics: [{ title: 'Build APIs', description: 'REST with Go' }], estimatedHours: 10 },
  ],
};

export const rustRoadmap: ExpandedRoadmap = {
  id: 'rust-systems',
  title: 'Rust Systems Programming',
  category: 'programming',
  icon: '⚡',
  description: 'Master Rust for safe, fast, and concurrent systems programming without garbage collection.',
  level: 'advanced',
  duration: '6 weeks',
  totalTasks: 42,
  estimatedHours: 60,
  color: 'danger',
  learningOutcomes: ['Rust syntax', 'Ownership system', 'Concurrency', 'Systems programming'],
  weeks: [
    { week: 1, title: 'Basics', topics: [{ title: 'Variables & Types', description: 'Rust fundamentals' }], estimatedHours: 10 },
    { week: 2, title: 'Ownership', topics: [{ title: 'Borrowing & References', description: 'Memory safety' }], estimatedHours: 10 },
    { week: 3, title: 'Functions & Traits', topics: [{ title: 'Generic Programming', description: 'Abstraction' }], estimatedHours: 10 },
    { week: 4, title: 'Error Handling', topics: [{ title: 'Result & Option', description: 'Error handling' }], estimatedHours: 10 },
    { week: 5, title: 'Concurrency', topics: [{ title: 'Threads & Async', description: 'Concurrent Rust' }], estimatedHours: 10 },
    { week: 6, title: 'Projects', topics: [{ title: 'CLI & Systems', description: 'Real-world applications' }], estimatedHours: 10 },
  ],
};

// ============ AI & MACHINE LEARNING ROADMAPS ============

export const pythonForAiRoadmap: ExpandedRoadmap = {
  id: 'python-for-ai',
  title: 'Python for AI & Machine Learning',
  category: 'ai-ml',
  icon: '🤖',
  description: 'Master Python libraries and frameworks for AI and ML: NumPy, Pandas, Scikit-learn, TensorFlow.',
  level: 'intermediate',
  duration: '6 months',
  totalTasks: 180,
  estimatedHours: 240,
  color: 'primary',
  learningOutcomes: ['Python for AI', 'ML libraries', 'Model training', 'Deep learning'],
  months: [
    { month: 1, title: 'Python & Math Foundations', topics: [{ title: 'Python Basics', description: 'AI-focused Python' }], estimatedHours: 40 },
    { month: 2, title: 'NumPy & Pandas', topics: [{ title: 'Data Manipulation', description: 'Numerical computing' }], estimatedHours: 40 },
    { month: 3, title: 'ML Fundamentals', topics: [{ title: 'Scikit-learn', description: 'Machine learning basics' }], estimatedHours: 40 },
    { month: 4, title: 'Deep Learning Intro', topics: [{ title: 'Neural Networks', description: 'DL basics' }], estimatedHours: 40 },
    { month: 5, title: 'Advanced DL', topics: [{ title: 'CNNs & RNNs', description: 'Advanced architectures' }], estimatedHours: 40 },
    { month: 6, title: 'Projects & Deployment', topics: [{ title: 'Real ML Projects', description: 'Production ML' }], estimatedHours: 40 },
  ],
};

export const deepLearningRoadmap: ExpandedRoadmap = {
  id: 'deep-learning-mastery',
  title: 'Deep Learning Mastery',
  category: 'ai-ml',
  icon: '🧠',
  description: 'Master deep learning with TensorFlow and PyTorch for computer vision and NLP.',
  level: 'advanced',
  duration: '8 weeks',
  totalTasks: 56,
  estimatedHours: 80,
  color: 'accent',
  learningOutcomes: ['Neural networks', 'CNNs', 'RNNs', 'Transfer learning'],
  weeks: [
    { week: 1, title: 'DL Fundamentals', topics: [{ title: 'Neural Networks Basics', description: 'DL concepts' }], estimatedHours: 10 },
    { week: 2, title: 'TensorFlow & PyTorch', topics: [{ title: 'Frameworks Setup', description: 'Deep learning frameworks' }], estimatedHours: 10 },
    { week: 3, title: 'CNNs', topics: [{ title: 'Convolutional Networks', description: 'Computer vision' }], estimatedHours: 10 },
    { week: 4, title: 'RNNs & LSTMs', topics: [{ title: 'Sequence Models', description: 'Time series' }], estimatedHours: 10 },
    { week: 5, title: 'Transfer Learning', topics: [{ title: 'Pre-trained Models', description: 'Fine-tuning' }], estimatedHours: 10 },
    { week: 6, title: 'NLP Basics', topics: [{ title: 'Text Processing', description: 'Natural language' }], estimatedHours: 10 },
    { week: 7, title: 'Transformers', topics: [{ title: 'BERT & GPT', description: 'Modern NLP' }], estimatedHours: 10 },
    { week: 8, title: 'Projects', topics: [{ title: 'Real DL Applications', description: 'End-to-end projects' }], estimatedHours: 10 },
  ],
};

export const nlpRoadmap: ExpandedRoadmap = {
  id: 'nlp-specialization',
  title: 'NLP Specialization',
  category: 'ai-ml',
  icon: '💬',
  description: 'Master Natural Language Processing with modern transformers and LLMs.',
  level: 'advanced',
  duration: '5 weeks',
  totalTasks: 35,
  estimatedHours: 50,
  color: 'secondary',
  learningOutcomes: ['Text processing', 'Transformers', 'LLMs', 'Prompt engineering'],
  weeks: [
    { week: 1, title: 'NLP Fundamentals', topics: [{ title: 'Tokenization & Embeddings', description: 'NLP basics' }], estimatedHours: 10 },
    { week: 2, title: 'RNNs for NLP', topics: [{ title: 'LSTMs & GRUs', description: 'Sequence models' }], estimatedHours: 10 },
    { week: 3, title: 'Transformers', topics: [{ title: 'Attention Mechanism', description: 'Transformer architecture' }], estimatedHours: 10 },
    { week: 4, title: 'LLMs & Prompt Engineering', topics: [{ title: 'ChatGPT, LangChain', description: 'Working with LLMs' }], estimatedHours: 10 },
    { week: 5, title: 'Projects', topics: [{ title: 'NLP Applications', description: 'Real-world projects' }], estimatedHours: 10 },
  ],
};

export const computerVisionRoadmap: ExpandedRoadmap = {
  id: 'computer-vision',
  title: 'Computer Vision Specialization',
  category: 'ai-ml',
  icon: '👁️',
  description: 'Master computer vision techniques for image processing, object detection, and segmentation.',
  level: 'advanced',
  duration: '6 weeks',
  totalTasks: 42,
  estimatedHours: 60,
  color: 'primary',
  learningOutcomes: ['Image processing', 'CNNs', 'Object detection', 'Segmentation'],
  weeks: [
    { week: 1, title: 'Image Basics', topics: [{ title: 'Image Processing', description: 'OpenCV, PIL' }], estimatedHours: 10 },
    { week: 2, title: 'Feature Detection', topics: [{ title: 'Feature Extraction', description: 'SIFT, ORB' }], estimatedHours: 10 },
    { week: 3, title: 'CNNs', topics: [{ title: 'Convolutional Networks', description: 'Deep learning for images' }], estimatedHours: 10 },
    { week: 4, title: 'Object Detection', topics: [{ title: 'YOLO, R-CNN', description: 'Detection models' }], estimatedHours: 10 },
    { week: 5, title: 'Segmentation', topics: [{ title: 'Image Segmentation', description: 'U-Net, Mask R-CNN' }], estimatedHours: 10 },
    { week: 6, title: 'Projects', topics: [{ title: 'CV Applications', description: 'Real-world projects' }], estimatedHours: 10 },
  ],
};

// ============ DEVOPS ROADMAPS ============

export const dockerKubernetesRoadmap: ExpandedRoadmap = {
  id: 'docker-kubernetes',
  title: 'Docker & Kubernetes Mastery',
  category: 'devops',
  icon: '🐳',
  description: 'Master containerization and orchestration for scalable microservices deployment.',
  level: 'advanced',
  duration: '6 weeks',
  totalTasks: 42,
  estimatedHours: 60,
  color: 'primary',
  learningOutcomes: ['Docker containers', 'Kubernetes orchestration', 'Helm charts', 'Service mesh'],
  weeks: [
    { week: 1, title: 'Docker Basics', topics: [{ title: 'Images & Containers', description: 'Containerization' }], estimatedHours: 10 },
    { week: 2, title: 'Docker Advanced', topics: [{ title: 'Compose & Networks', description: 'Multi-container setup' }], estimatedHours: 10 },
    { week: 3, title: 'Kubernetes Basics', topics: [{ title: 'Pods & Services', description: 'K8s fundamentals' }], estimatedHours: 10 },
    { week: 4, title: 'Deployments', topic: [{ title: 'Deployments & StatefulSets', description: 'Workload management' }], estimatedHours: 10 },
    { week: 5, title: 'Advanced K8s', topics: [{ title: 'Ingress, StorageClass', description: 'Production K8s' }], estimatedHours: 10 },
    { week: 6, title: 'Projects', topics: [{ title: 'Deploy Microservices', description: 'K8s projects' }], estimatedHours: 10 },
  ],
};

export const awsCloudRoadmap: ExpandedRoadmap = {
  id: 'aws-cloud',
  title: 'AWS Cloud Architecture',
  category: 'cloud',
  icon: '☁️',
  description: 'Master AWS for building scalable, reliable, and secure cloud applications.',
  level: 'intermediate',
  duration: '8 weeks',
  totalTasks: 56,
  estimatedHours: 80,
  color: 'accent',
  learningOutcomes: ['AWS services', 'Cloud architecture', 'Scalability', 'Security'],
  weeks: [
    { week: 1, title: 'AWS Basics', topics: [{ title: 'EC2, S3, VPC', description: 'Core AWS services' }], estimatedHours: 10 },
    { week: 2, title: 'Compute Services', topics: [{ title: 'Lambda, ECS', description: 'Serverless & containers' }], estimatedHours: 10 },
    { week: 3, title: 'Databases', topics: [{ title: 'RDS, DynamoDB', description: 'Data services' }], estimatedHours: 10 },
    { week: 4, title: 'Networking', topics: [{ title: 'VPC, CloudFront', description: 'Network architecture' }], estimatedHours: 10 },
    { week: 5, title: 'Monitoring & Security', topics: [{ title: 'CloudWatch, IAM', description: 'Observability & security' }], estimatedHours: 10 },
    { week: 6, title: 'DevOps on AWS', topics: [{ title: 'CodePipeline, CodeDeploy', description: 'CI/CD' }], estimatedHours: 10 },
    { week: 7, title: 'Cost Optimization', topics: [{ title: 'Reserved Instances', description: 'Cost management' }], estimatedHours: 10 },
    { week: 8, title: 'Projects', topics: [{ title: 'Build AWS Applications', description: 'End-to-end projects' }], estimatedHours: 10 },
  ],
};

export const linuxSystemsRoadmap: ExpandedRoadmap = {
  id: 'linux-systems',
  title: 'Linux System Administration',
  category: 'devops',
  icon: '🐧',
  description: 'Master Linux for server administration, shell scripting, and DevOps.',
  level: 'intermediate',
  duration: '6 weeks',
  totalTasks: 42,
  estimatedHours: 60,
  color: 'success',
  learningOutcomes: ['Linux commands', 'Shell scripting', 'User management', 'Networking'],
  weeks: [
    { week: 1, title: 'Linux Basics', topics: [{ title: 'File System & Commands', description: 'Linux fundamentals' }], estimatedHours: 10 },
    { week: 2, title: 'Users & Permissions', topics: [{ title: 'User Management', description: 'Access control' }], estimatedHours: 10 },
    { week: 3, title: 'Shell Scripting', topics: [{ title: 'Bash Scripts', description: 'Automation' }], estimatedHours: 10 },
    { week: 4, title: 'Services & Processes', topics: [{ title: 'Systemd, Networking', description: 'System services' }], estimatedHours: 10 },
    { week: 5, title: 'Monitoring & Logging', topics: [{ title: 'System Monitoring', description: 'Logs & metrics' }], estimatedHours: 10 },
    { week: 6, title: 'Projects', topics: [{ title: 'Admin Tasks', description: 'Real-world scenarios' }], estimatedHours: 10 },
  ],
};

// ============ CYBER SECURITY ROADMAPS ============

export const ethicalHackingRoadmap: ExpandedRoadmap = {
  id: 'ethical-hacking',
  title: 'Ethical Hacking & Penetration Testing',
  category: 'cyber-security',
  icon: '🛡️',
  description: 'Master ethical hacking and penetration testing for identifying and fixing security vulnerabilities.',
  level: 'advanced',
  duration: '8 weeks',
  totalTasks: 56,
  estimatedHours: 80,
  color: 'danger',
  learningOutcomes: ['Penetration testing', 'Vulnerability assessment', 'Exploitation', 'Security analysis'],
  weeks: [
    { week: 1, title: 'Foundations', topics: [{ title: 'Networking Basics', description: 'TCP/IP, DNS' }], estimatedHours: 10 },
    { week: 2, title: 'Linux & CLI', topics: [{ title: 'Linux for Hackers', description: 'Command line mastery' }], estimatedHours: 10 },
    { week: 3, title: 'Reconnaissance', topics: [{ title: 'Information Gathering', description: 'Footprinting' }], estimatedHours: 10 },
    { week: 4, title: 'Scanning', topics: [{ title: 'Port Scanning, Nmap', description: 'Vulnerability detection' }], estimatedHours: 10 },
    { week: 5, title: 'Enumeration', topics: [{ title: 'Service Enumeration', description: 'Banner grabbing' }], estimatedHours: 10 },
    { week: 6, title: 'Exploitation', topics: [{ title: 'Exploit Tools', description: 'Metasploit, Burp Suite' }], estimatedHours: 10 },
    { week: 7, title: 'Web Security', topics: [{ title: 'OWASP Top 10', description: 'Web vulnerabilities' }], estimatedHours: 10 },
    { week: 8, title: 'Projects', topics: [{ title: 'Penetration Tests', description: 'Real assessments' }], estimatedHours: 10 },
  ],
};

export const webSecurityRoadmap: ExpandedRoadmap = {
  id: 'web-security',
  title: 'Web Security & OWASP',
  category: 'cyber-security',
  icon: '🔒',
  description: 'Master web application security, OWASP Top 10, and secure coding practices.',
  level: 'advanced',
  duration: '5 weeks',
  totalTasks: 35,
  estimatedHours: 50,
  color: 'warning',
  learningOutcomes: ['OWASP Top 10', 'SQL injection', 'XSS', 'CSRF', 'Secure coding'],
  weeks: [
    { week: 1, title: 'Web Security Basics', topics: [{ title: 'HTTP/HTTPS', description: 'Web protocols' }], estimatedHours: 10 },
    { week: 2, title: 'OWASP Top 10', topics: [{ title: 'Injection, XSS', description: 'Common vulnerabilities' }], estimatedHours: 10 },
    { week: 3, title: 'Authentication & Authorization', topics: [{ title: 'Session Management', description: 'Access control' }], estimatedHours: 10 },
    { week: 4, title: 'Data Protection', topics: [{ title: 'Encryption, Hashing', description: 'Security practices' }], estimatedHours: 10 },
    { week: 5, title: 'Testing & Tools', topics: [{ title: 'Burp Suite, OWASP', description: 'Security testing' }], estimatedHours: 10 },
  ],
};

// ============ DESIGN ROADMAPS ============

export const figmaUxDesignRoadmap: ExpandedRoadmap = {
  id: 'figma-ux-design',
  title: 'Figma & UX Design',
  category: 'design',
  icon: '🎨',
  description: 'Master Figma for UI/UX design, prototyping, and design systems.',
  level: 'intermediate',
  duration: '4 weeks',
  totalTasks: 28,
  estimatedHours: 40,
  color: 'primary',
  learningOutcomes: ['Figma interface', 'UI design', 'Prototyping', 'Design systems'],
  weeks: [
    { week: 1, title: 'Figma Basics', topics: [{ title: 'Interface & Tools', description: 'Figma fundamentals' }], estimatedHours: 10 },
    { week: 2, title: 'UI Design', topics: [{ title: 'Components & Styles', description: 'Design systems' }], estimatedHours: 10 },
    { week: 3, title: 'Prototyping', topics: [{ title: 'Interactive Designs', description: 'User flows' }], estimatedHours: 10 },
    { week: 4, title: 'Projects', topics: [{ title: 'Design Projects', description: 'Real designs' }], estimatedHours: 10 },
  ],
};

// ============ ROADMAP CATEGORIES ============

export const roadmapCategories: RoadmapCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    description: 'Web UI & user interfaces',
    icon: '🎨',
    color: '#3B82F6',
    count: 8,
  },
  {
    id: 'backend',
    name: 'Backend Development',
    description: 'Servers & APIs',
    icon: '⚙️',
    color: '#10B981',
    count: 6,
  },
  {
    id: 'fullstack',
    name: 'Full Stack Development',
    description: 'Complete applications',
    icon: '🔗',
    color: '#8B5CF6',
    count: 3,
  },
  {
    id: 'programming',
    name: 'Programming Languages',
    description: 'Core languages',
    icon: '💻',
    color: '#F59E0B',
    count: 7,
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    description: 'Artificial intelligence',
    icon: '🤖',
    color: '#EF4444',
    count: 5,
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Data analysis & insights',
    icon: '📊',
    color: '#14B8A6',
    count: 4,
  },
  {
    id: 'devops',
    name: 'DevOps',
    description: 'Infrastructure & deployment',
    icon: '🚀',
    color: '#06B6D4',
    count: 4,
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security',
    description: 'Security & hacking',
    icon: '🛡️',
    color: '#DC2626',
    count: 3,
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    description: 'Cloud platforms',
    icon: '☁️',
    color: '#7C3AED',
    count: 3,
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    description: 'iOS & Android',
    icon: '📱',
    color: '#06B6D4',
    count: 3,
  },
  {
    id: 'system-programming',
    name: 'System Programming',
    description: 'Low-level programming',
    icon: '⚡',
    color: '#F97316',
    count: 2,
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    description: 'Crypto & Web3',
    icon: '⛓️',
    color: '#D946EF',
    count: 2,
  },
  {
    id: 'design',
    name: 'UI/UX Design',
    description: 'Design & prototyping',
    icon: '🎭',
    color: '#EC4899',
    count: 3,
  },
];

// ============ ALL ROADMAPS COLLECTION ============

export const allExpandedRoadmaps: ExpandedRoadmap[] = [
  htmlCssRoadmapExpanded,
  javascriptFundamentalsExpanded,
  typeScriptRoadmap,
  reactAdvancedRoadmap,
  nextJsRoadmap,
  reduxRoadmap,
  tailwindCssRoadmap,
  nodeJsAdvancedRoadmap,
  restApisRoadmap,
  authenticationRoadmap,
  mongodbRoadmap,
  sqlPostgresRoadmap,
  pythonRoadmap,
  cppRoadmap,
  javaRoadmap,
  goRoadmap,
  rustRoadmap,
  pythonForAiRoadmap,
  deepLearningRoadmap,
  nlpRoadmap,
  computerVisionRoadmap,
  dockerKubernetesRoadmap,
  awsCloudRoadmap,
  linuxSystemsRoadmap,
  ethicalHackingRoadmap,
  webSecurityRoadmap,
  figmaUxDesignRoadmap,
];

// ============ UTILITY FUNCTIONS ============

export function getRoadmapsByCategory(category: string): ExpandedRoadmap[] {
  return allExpandedRoadmaps.filter((r) => r.category === category);
}

export function searchRoadmaps(query: string): ExpandedRoadmap[] {
  const lowercaseQuery = query.toLowerCase();
  return allExpandedRoadmaps.filter(
    (r) =>
      r.title.toLowerCase().includes(lowercaseQuery) ||
      r.description.toLowerCase().includes(lowercaseQuery) ||
      r.learningOutcomes.some((outcome) => outcome.toLowerCase().includes(lowercaseQuery))
  );
}

export function getRoadmapById(id: string): ExpandedRoadmap | undefined {
  return allExpandedRoadmaps.find((r) => r.id === id);
}

export function getAllRoadmaps(): ExpandedRoadmap[] {
  return allExpandedRoadmaps;
}

export function getCategoryColor(category: string): string {
  const cat = roadmapCategories.find((c) => c.id === category);
  return cat?.color || '#6B7280';
}

export function getCategoryName(category: string): string {
  const cat = roadmapCategories.find((c) => c.id === category);
  return cat?.name || 'Unknown';
}
