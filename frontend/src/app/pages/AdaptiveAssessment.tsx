import { useState, useEffect } from 'react';
import { GlassButton } from '../components/GlassButton';
import { GlassCard } from '../components/GlassCard';
import { AnimatedProgress } from '../components/AnimatedProgress';
import { Icons } from '../components/Icons';
import { saveAssessment, getDynamicAssessmentQuestions } from '../../services/assessment';
import { toast } from 'sonner';

interface AdaptiveAssessmentProps {
  onComplete: (answers: Record<string, any>) => void;
  onBack: () => void;
}

interface Question {
  id: string;
  type: 'mcq' | 'scenario' | 'interest';
  question: string;
  options: string[];
  category: string;
  dataSourced?: boolean;
}

const baseQuestions: Question[] = [
  {
    id: 'q1',
    type: 'interest',
    question: 'What excites you the most?',
    options: ['Solving complex problems', 'Creating visual designs', 'Helping people', 'Analyzing data'],
    category: 'Interest'
  },
  {
    id: 'q2',
    type: 'mcq',
    question: 'Which environment do you thrive in?',
    options: ['Structured and organized', 'Creative and flexible', 'Fast-paced and dynamic', 'Collaborative teams'],
    category: 'Work Style'
  },
  {
    id: 'q3',
    type: 'scenario',
    question: 'Your team faces a critical deadline. What do you do?',
    options: [
      'Create a detailed plan and execute',
      'Brainstorm creative solutions',
      'Rally the team and delegate',
      'Analyze bottlenecks and optimize'
    ],
    category: 'Decision'
  },
  {
    id: 'q4',
    type: 'mcq',
    question: 'What is your highest level of education or target?',
    options: ['High School', 'Diploma/Bachelor\'s', 'Master\'s Degree', 'PhD/Advanced'],
    category: 'Education'
  },
  {
    id: 'q5',
    type: 'interest',
    question: 'What best describes your current work experience?',
    options: ['Fresher - No experience', 'Junior - 1-2 years', 'Mid-level - 3-5 years', 'Senior - 5+ years'],
    category: 'Experience'
  }
];

const techQuestions: Question[] = [
  {
    id: 'tech1',
    type: 'interest',
    question: 'Which tech domain interests you most?',
    options: ['Artificial Intelligence', 'Web Development', 'Cybersecurity', 'Data Science'],
    category: 'Tech Interest'
  },
  {
    id: 'tech2',
    type: 'mcq',
    question: 'How comfortable are you with coding?',
    options: ['Expert - I build complex systems', 'Intermediate - I can build apps', 'Beginner - I know basics', 'New - I want to learn'],
    category: 'Skill Level'
  },
  {
    id: 'tech3',
    type: 'scenario',
    question: 'You discover a critical bug in production. What do you do?',
    options: [
      'Debug systematically using logs',
      'Roll back to stable version immediately',
      'Collaborate with team for quick fix',
      'Implement monitoring to prevent future issues'
    ],
    category: 'Problem Solving'
  },
  {
    id: 'tech4',
    type: 'interest',
    question: 'Which languages/frameworks excite you most?',
    options: ['Python & ML frameworks', 'JavaScript/React', 'Java/Kotlin', 'C++/Rust'],
    category: 'Tech Stack'
  },
  {
    id: 'tech5',
    type: 'mcq',
    question: 'What aspect of development do you enjoy most?',
    options: ['Architecture & Design', 'User Interface', 'Performance & Optimization', 'Testing & Quality'],
    category: 'Development Focus'
  },
  {
    id: 'tech6',
    type: 'scenario',
    question: 'Your system is getting slow. How do you approach it?',
    options: [
      'Profile code and optimize bottlenecks',
      'Redesign architecture for efficiency',
      'Add more servers/resources',
      'Research latest optimization techniques'
    ],
    category: 'Optimization'
  },
  {
    id: 'tech7',
    type: 'mcq',
    question: 'Do you prefer working on frontend or backend?',
    options: ['Frontend - User interfaces', 'Backend - Databases & APIs', 'Full-stack equally', 'Infrastructure & DevOps'],
    category: 'Specialization'
  }
];

const creativeQuestions: Question[] = [
  {
    id: 'creative1',
    type: 'interest',
    question: 'Which creative field appeals to you?',
    options: ['UI/UX Design', 'Content Creation', 'Brand Strategy', 'Product Design'],
    category: 'Creative Path'
  },
  {
    id: 'creative2',
    type: 'mcq',
    question: 'What drives your creative process?',
    options: ['User needs and feedback', 'Artistic expression', 'Business goals', 'Innovation and trends'],
    category: 'Motivation'
  },
  {
    id: 'creative3',
    type: 'scenario',
    question: 'How do you approach design feedback?',
    options: [
      'Analyze metrics & iterate quickly',
      'Defend artistic vision respectfully',
      'Collaborate & find common ground',
      'Test multiple variations'
    ],
    category: 'Design Process'
  },
  {
    id: 'creative4',
    type: 'mcq',
    question: 'What\'s your design philosophy?',
    options: ['Function first, beauty follows', 'Beauty & delight matter equally', 'Minimal & elegant', 'Bold & expressive'],
    category: 'Philosophy'
  },
  {
    id: 'creative5',
    type: 'interest',
    question: 'Which design tools are you most comfortable with?',
    options: ['Figma/Sketch', 'Adobe Creative Suite', 'Code & HTML/CSS', 'Multiple equally'],
    category: 'Tools'
  }
];

const businessQuestions: Question[] = [
  {
    id: 'business1',
    type: 'interest',
    question: 'Which business aspect interests you?',
    options: ['Strategy & Planning', 'Sales & Marketing', 'Operations & Logistics', 'Finance & Analytics'],
    category: 'Business Domain'
  },
  {
    id: 'business2',
    type: 'scenario',
    question: 'Your product is losing market share. What do you do?',
    options: [
      'Conduct market research and pivot',
      'Aggressive marketing campaign',
      'Improve product quality',
      'Reduce costs and optimize'
    ],
    category: 'Strategy'
  },
  {
    id: 'business3',
    type: 'mcq',
    question: 'How do you measure success?',
    options: ['Revenue & profit growth', 'Market share & brand', 'Customer satisfaction', 'Team growth & efficiency'],
    category: 'Metrics'
  },
  {
    id: 'business4',
    type: 'scenario',
    question: 'How do you handle difficult negotiations?',
    options: [
      'Data-driven approach with clear ROI',
      'Build relationships and find win-win',
      'Focus on long-term partnership',
      'Find creative solutions'
    ],
    category: 'Communication'
  },
  {
    id: 'business5',
    type: 'interest',
    question: 'What size company appeals to you?',
    options: ['Startup - Fast & risky', 'Scale-up - Growth phase', 'Established - Stable', 'No preference'],
    category: 'Company Stage'
  }
];

const softSkillsQuestions: Question[] = [
  {
    id: 'skills1',
    type: 'mcq',
    question: 'How would you describe your communication style?',
    options: ['Clear & structured', 'Engaging & persuasive', 'Collaborative & inclusive', 'Direct & concise'],
    category: 'Communication'
  },
  {
    id: 'skills2',
    type: 'scenario',
    question: 'A team member is struggling. What do you do?',
    options: [
      'Offer guidance and mentoring',
      'Let them figure it out',
      'Assign them different work',
      'Have a performance conversation'
    ],
    category: 'Empathy'
  },
  {
    id: 'skills3',
    type: 'mcq',
    question: 'How do you handle stress and pressure?',
    options: ['Stay calm & analytical', 'Rise to the challenge', 'Seek support from team', 'Take breaks & recharge'],
    category: 'Resilience'
  },
  {
    id: 'skills4',
    type: 'interest',
    question: 'What\'s your preferred leadership style?',
    options: ['Directive & decisive', 'Supportive & coaching', 'Collaborative & democratic', 'Results-focused'],
    category: 'Leadership'
  }
];

const learningQuestions: Question[] = [
  {
    id: 'learn1',
    type: 'mcq',
    question: 'How do you prefer to learn new skills?',
    options: ['Online courses & tutorials', 'Hands-on projects', 'Mentoring & guidance', 'Self-study & documentation'],
    category: 'Learning Style'
  },
  {
    id: 'learn2',
    type: 'interest',
    question: 'What\'s your learning pace preference?',
    options: ['Quick deep dives', 'Steady & consistent', 'Intensive immersion', 'Self-paced exploration'],
    category: 'Pace'
  },
  {
    id: 'learn3',
    type: 'scenario',
    question: 'You encounter a new technology. What\'s your first step?',
    options: [
      'Read official documentation',
      'Watch video tutorials',
      'Build a small project',
      'Ask experienced colleagues'
    ],
    category: 'Approach'
  },
  {
    id: 'learn4',
    type: 'mcq',
    question: 'What motivates your professional growth?',
    options: ['Career advancement', 'Mastery & expertise', 'Helping others', 'Financial rewards'],
    category: 'Motivation'
  }
];

const workEnvironmentQuestions: Question[] = [
  {
    id: 'env1',
    type: 'interest',
    question: 'What\'s your ideal work setup?',
    options: ['Office - In-person collaboration', 'Remote - Focused & independent', 'Hybrid - Best of both', 'No strong preference'],
    category: 'Work Location'
  },
  {
    id: 'env2',
    type: 'mcq',
    question: 'What kind of work schedule suits you best?',
    options: ['9-5 structured', 'Flexible hours', 'Results-oriented (no hours)', 'Mix of both'],
    category: 'Schedule'
  },
  {
    id: 'env3',
    type: 'scenario',
    question: 'You have multiple urgent tasks. What do you do?',
    options: [
      'Prioritize by impact & deadline',
      'Ask for help & delegate',
      'Work systematically through each',
      'Focus on most interesting first'
    ],
    category: 'Prioritization'
  },
  {
    id: 'env4',
    type: 'mcq',
    question: 'What\'s most important in a workplace?',
    options: ['Growth opportunities', 'Team culture & values', 'Compensation & benefits', 'Impact & meaningful work'],
    category: 'Workplace Values'
  }
];

const getOptionIcon = (option: string, index: number): string => {
  const text = option.toLowerCase();
  // Tech & Problem Solving
  if (text.includes('debug') || text.includes('profile')) return '🧩';
  if (text.includes('architect') || text.includes('design')) return '🏗️';
  if (text.includes('monitor') || text.includes('prevent')) return '🛡️';
  if (text.includes('optimize') || text.includes('bottleneck')) return '⚡';
  if (text.includes('performance')) return '🚀';
  
  // Creative & Visual
  if (text.includes('ui/ux') || text.includes('interface')) return '🎨';
  if (text.includes('brand') || text.includes('visual')) return '✨';
  if (text.includes('content')) return '📝';
  if (text.includes('elegant') || text.includes('minimal')) return '🎭';
  
  // Business & Strategy
  if (text.includes('strategy') || text.includes('planning')) return '🎯';
  if (text.includes('research') || text.includes('pivot')) return '🔍';
  if (text.includes('marketing')) return '📢';
  if (text.includes('revenue') || text.includes('profit')) return '💰';
  if (text.includes('operation') || text.includes('efficiency')) return '⚙️';
  if (text.includes('customer')) return '👥';
  
  // Leadership & Soft Skills
  if (text.includes('mentor') || text.includes('guidance')) return '🧑‍🏫';
  if (text.includes('collaborative') || text.includes('democratic')) return '🤝';
  if (text.includes('directive') || text.includes('decisive')) return '💪';
  if (text.includes('support') || text.includes('coaching')) return '🎓';
  if (text.includes('resilience') || text.includes('stress')) return '🧘';
  if (text.includes('communication')) return '💬';
  
  // Learning
  if (text.includes('course') || text.includes('tutorial')) return '📚';
  if (text.includes('hands-on') || text.includes('project')) return '💻';
  if (text.includes('documentation')) return '📖';
  if (text.includes('video')) return '🎥';
  if (text.includes('colleague') || text.includes('mentoring')) return '👨‍💻';
  
  // Experience & Location
  if (text.includes('fresher') || text.includes('junior')) return '🌱';
  if (text.includes('senior') || text.includes('expert')) return '⭐';
  if (text.includes('intermediate')) return '🔷';
  if (text.includes('beginner')) return '🌟';
  
  // Work Environment
  if (text.includes('office') || text.includes('person')) return '🏢';
  if (text.includes('remote')) return '💻';
  if (text.includes('hybrid')) return '🌐';
  if (text.includes('startup')) return '🚀';
  if (text.includes('scale')) return '📈';
  if (text.includes('establish')) return '🏛️';
  
  // Education
  if (text.includes('high school')) return '🎓';
  if (text.includes('diploma') || text.includes('bachelor')) return '📜';
  if (text.includes('master')) return '🎖️';
  if (text.includes('phd')) return '🏆';
  
  // Tech Stacks
  if (text.includes('python') || text.includes('ml')) return '🐍';
  if (text.includes('javascript') || text.includes('react')) return '⚛️';
  if (text.includes('java') || text.includes('kotlin')) return '☕';
  if (text.includes('c++') || text.includes('rust')) return '🦀';
  if (text.includes('frontend') || text.includes('ui')) return '🎨';
  if (text.includes('backend') || text.includes('api')) return '⚙️';
  if (text.includes('full-stack')) return '🔄';
  if (text.includes('devops') || text.includes('infrastructure')) return '🛠️';
  
  // Other common
  if (text.includes('ai') || text.includes('artificial')) return '🤖';
  if (text.includes('security') || text.includes('cyber')) return '🔒';
  if (text.includes('data') || text.includes('analyz')) return '📊';
  if (text.includes('web')) return '🌐';
  if (text.includes('roll')) return '↩️';
  if (text.includes('culture') || text.includes('value')) return '💎';
  if (text.includes('impact')) return '💫';
  
  // Fallback based on index
  return ['🚀', '💡', '🎓', '🏆'][index % 4];
};

export function AdaptiveAssessment({ onComplete, onBack }: AdaptiveAssessmentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [autoSaved, setAutoSaved] = useState(false);
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  /**
   * Fetch dynamic questions from backend on component mount
   * Questions are generated from actual job roles in dataset
   */
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        const dynamicQuestions = await getDynamicAssessmentQuestions();
        if (dynamicQuestions && dynamicQuestions.length > 0) {
          setQuestions(dynamicQuestions);
          toast.success(`Assessment loaded: ${dynamicQuestions.length} questions from ${dynamicQuestions.filter((q: Question) => q.dataSourced).length} dataset-sourced categories`);
        } else {
          toast.error('Failed to load assessment questions');
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        toast.error('Failed to load assessment questions');
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    // Auto-save effect
    if (selectedOption !== null) {
      setAutoSaved(false);
      const timer = setTimeout(() => setAutoSaved(true), 500);
      return () => clearTimeout(timer);
    }
  }, [answers]);

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    const currentQ = questions[currentIndex];
    const selectedOptionText = currentQ.options[optionIndex];

    const newAnswers = {
      ...answers,
      [currentQ.id]: { question: currentQ.question, answer: selectedOptionText, type: currentQ.type }
    };
    setAnswers(newAnswers);

    // Move to next question or complete
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      }, 600);
    } else {
      setTimeout(() => {
        void finalizeAssessment(newAnswers);
      }, 800);
    }
  };

  const finalizeAssessment = async (finalAnswers: Record<string, any>) => {
    setIsSavingResult(true);
    setSaveError('');

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const payloadAnswers: Record<string, string> = {};
      Object.entries(finalAnswers).forEach(([key, value]) => {
        if (value && typeof value === 'object' && 'answer' in value) {
          payloadAnswers[key] = String((value as { answer: string }).answer);
        }
      });

      try {
        await saveAssessment(payloadAnswers);
        toast.success('Assessment saved to your profile!');
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to save assessment';
        setSaveError(msg);
        toast.warning('Assessment completed locally — cloud save failed.');
      }
    }

    setIsSavingResult(false);
    onComplete(finalAnswers);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const estimatedTimeLeft = Math.ceil((questions.length - currentIndex) * 0.5);
  const currentQuestion = questions[currentIndex];

  // Loading state
  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950"></div>
        </div>
        <nav className="glass-strong border-b border-white/10 px-6 py-3 relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Icons.Brain />
              </div>
              <h1 className="text-lg font-bold text-white">Pragyan</h1>
            </div>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading assessment questions from dataset...</p>
            <p className="text-sm text-gray-500 mt-2">Pulling from 39 job roles and 139+ skills</p>
          </div>
        </div>
      </div>
    );
  }

  // No questions loaded
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950"></div>
        </div>
        <nav className="glass-strong border-b border-white/10 px-6 py-3 relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Icons.Brain />
              </div>
              <h1 className="text-lg font-bold text-white">Pragyan</h1>
            </div>
            <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Back
            </button>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400">Failed to load assessment questions</p>
            <button onClick={onBack} className="mt-4 px-6 py-2 gradient-primary rounded-lg text-white font-medium">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(99,102,241,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_100%_100%,rgba(139,92,246,0.1),rgba(139,92,246,0))]"></div>
        <div className="absolute inset-0 animate-pulse opacity-40 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Header */}
      <nav className="glass-strong border-b border-white/10 px-6 py-3 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Icons.Brain />
            </div>
            <h1 className="text-lg font-bold text-white">Pragyan</h1>
          </div>
          <div className="flex items-center gap-4">
            {autoSaved && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-emerald-200">Auto-saved</span>
              </div>
            )}
            <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Exit
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-6 relative z-10">
        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-3xl mx-auto w-full">
            {/* Progress Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-white">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-xs font-semibold text-indigo-200">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{estimatedTimeLeft}m remaining</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 glass rounded-full">
                    <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></span>
                    <span className="text-xs font-semibold text-cyan-200">AI Adaptive</span>
                  </span>
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full shadow-lg shadow-indigo-500/50"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <GlassCard strong className="p-8 transform transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                {/* Category Badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <span className="text-lg">{currentQuestion.type === 'mcq' ? '📝' : currentQuestion.type === 'scenario' ? '🎯' : '💡'}</span>
                    <span className="text-xs font-semibold text-indigo-200">{currentQuestion.category}</span>
                  </span>
                </div>

                {/* Question */}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                  {currentQuestion.question}
                </h2>

                {isSavingResult && (
                  <div className="mb-4 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200">
                    Saving your assessment result...
                  </div>
                )}

                {saveError && (
                  <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                    {saveError}
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full text-left group transition-all duration-300 ${
                        selectedOption === index ? 'scale-100' : ''
                      }`}
                    >
                      <div
                        className={`relative p-5 rounded-2xl border transition-all duration-300 overflow-hidden ${
                          selectedOption === index
                            ? 'glass-strong border-indigo-500/80 bg-indigo-500/20 shadow-xl shadow-indigo-500/30'
                            : 'glass border-white/10 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20'
                        }`}
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity blur"></div>

                        <div className="relative z-10 flex items-center gap-4">
                          {/* Icon */}
                          <div className="text-2xl flex-shrink-0">
                            {getOptionIcon(option, index)}
                          </div>

                          {/* Radio + Text */}
                          <div className="flex-1">
                            <span className={`text-base font-medium transition-colors ${
                              selectedOption === index
                                ? 'text-white'
                                : 'text-gray-200 group-hover:text-indigo-300'
                            }`}>
                              {option}
                            </span>
                          </div>

                          {/* Radio Circle */}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            selectedOption === index
                              ? 'border-indigo-400 bg-indigo-500 shadow-lg shadow-indigo-500/50'
                              : 'border-white/30 group-hover:border-indigo-500'
                          }`}>
                            {selectedOption === index && (
                              <span className="text-white text-sm">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="mt-10 flex gap-3 justify-between">
                  <GlassButton
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </GlassButton>
                  <GlassButton
                    onClick={() => selectedOption !== null && handleAnswer(selectedOption)}
                    variant="primary"
                    disabled={selectedOption === null}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Side Widget - Live Career Prediction */}
        <div className="hidden lg:block w-80">
          <div className="sticky top-6">
            <GlassCard strong className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">AI Engine Status</h3>
                    <p className="text-sm font-bold text-white">Final role will be computed from full assessment</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Assessment Progress</span>
                      <span className="text-sm font-bold text-indigo-300">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-2">Answers Recorded</div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.keys(answers).map((key) => (
                        <span
                          key={key}
                          className="px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 border border-emerald-500/30 text-emerald-200"
                        >
                          ✓ Q{key.replace(/\D/g, '')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-2">Interests Detected</div>
                    <div className="flex flex-wrap gap-2">
                      {userInterests.size > 0 ? (
                        Array.from(userInterests).map((interest) => (
                          <span key={interest} className="text-sm font-semibold text-cyan-300 capitalize">
                            {interest === 'tech' && '💻 Tech'}
                            {interest === 'creative' && '🎨 Creative'}
                            {interest === 'data' && '📊 Data'}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">Answer questions to detect interests</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="text-xs text-gray-400 mb-3">Tips for Better Matches</div>
                    <ul className="space-y-2 text-[11px] text-gray-300">
                      <li className="flex gap-2">
                        <span>→</span>
                        <span>Be honest with your answers</span>
                      </li>
                      <li className="flex gap-2">
                        <span>→</span>
                        <span>Questions adapt based on your responses</span>
                      </li>
                      <li className="flex gap-2">
                        <span>→</span>
                        <span>This usually takes 2-3 minutes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
