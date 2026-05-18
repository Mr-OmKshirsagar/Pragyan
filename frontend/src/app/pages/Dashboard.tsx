import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from '../../services/api';
import SkillUpModal from '../components/SkillUpModal';
import { applyForJob, fetchJobs, type JobFeedItem } from '../../services/jobservices';
import {
  generateRecommendations,
  type SkillRecommendation,
} from '../../services/recommendations';

interface Job extends JobFeedItem {
}

interface TopCareer {
  name: string;
  score: number;
  subtitle: string;
  tag: string;
}

interface UserInsights {
  xp: number;
  streak: number;
}

interface DashboardProps {
  userName?: string;
  assessmentAnswers?: Record<string, any>;
  onOpenAdmin?: () => void;
  onViewMatches?: () => void;
  onViewProfile?: () => void;
  onRetakeAssessment?: () => void;
  onViewRoadmaps?: () => void;
  onViewCatalog?: () => void;
  onLogout?: () => void;
}

export default function Dashboard({
  userName = 'Learner',
  onOpenAdmin,
  onViewMatches,
  onViewProfile,
  onRetakeAssessment,
  onViewRoadmaps,
  onViewCatalog,
  onLogout,
}: DashboardProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [topCareer, setTopCareer] = useState<TopCareer | null>(null);
  const [topCareerId, setTopCareerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [userInsights, setUserInsights] = useState<UserInsights>({ xp: 0, streak: 0 });
  const [skillRecs, setSkillRecs] = useState<SkillRecommendation[]>([]);
  const [xpAnimated, setXpAnimated] = useState(0);

  const fetchRecommendations = async () => {
    setRecommendationsLoading(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setTopCareer(null);
        setSkillRecs([]);
        setJobs([]);
        return;
      }

      const bundle = await generateRecommendations();

      if (bundle?.topCareer) {
        setTopCareer({
          name: bundle.topCareer.career,
          score: bundle.topCareer.match,
          subtitle: bundle.topCareer.category || 'Matched from your assessment profile',
          tag: `${String(bundle.topCareer.confidenceLevel || 'medium').toUpperCase()} CONFIDENCE`,
        });
        setTopCareerId(bundle.topCareer.careerId || null);
      } else {
        setTopCareer(null);
      }

      setSkillRecs((bundle?.skillRecommendations || []).slice(0, 6));
    } catch {
      setTopCareer(null);
      setSkillRecs([]);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const fetchHiringFeed = async () => {
    try {
      const feed = await fetchJobs();
      const recentJobs = feed?.recentJobs || [];
      setJobs(recentJobs);
    } catch {
      setJobs([]);
    }
  };

  const fetchUserInsights = async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      const data = await apiFetch<any>('/api/progress/user/dashboard', undefined, { auth: true });

      const xp = Math.round(data?.data?.stats?.totalXp ?? 0);
      const streak = data?.data?.stats?.currentStreak ?? 0;
      setUserInsights({ xp, streak });

      let current = 0;
      const step = Math.ceil(xp / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, xp);
        setXpAnimated(current);
        if (current >= xp) {
          clearInterval(timer);
        }
      }, 40);
    } catch {
      // ignore for guests
    }
  };

  const [careerExplanation, setCareerExplanation] = useState<string | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [showSkillUp, setShowSkillUp] = useState(false);

  const fetchCareerExplanation = async () => {
    if (!topCareerId) return;
    setShowExplanationModal(true);
    setExplanationLoading(true);
    setCareerExplanation(null);
    try {
      const resp = await apiFetch<any>(`/api/recommendations/explain/${topCareerId}`, undefined, { auth: true });
      const payload = resp?.data;
      if (payload?.parsed) {
        // render structured
        const p = payload.parsed;
        const parts: string[] = [];
        if (p.summary) parts.push(p.summary);
        if (Array.isArray(p.skillGaps) && p.skillGaps.length) parts.push('\nTop skill gaps:\n' + p.skillGaps.map((s: string) => `- ${s}`).join('\n'));
        if (Array.isArray(p.nextActions) && p.nextActions.length) parts.push('\nNext actions:\n' + p.nextActions.map((a: string) => `- ${a}`).join('\n'));
        if (Array.isArray(p.roadmap) && p.roadmap.length) {
          parts.push('\n6-week roadmap:');
          p.roadmap.forEach((w: any) => {
            parts.push(`Week ${w.week}: ${Array.isArray(w.items) ? w.items.join(', ') : w.items}`);
          });
        }
        if (p.targetLevel) parts.push(`\nTarget level: ${p.targetLevel}`);

        setCareerExplanation(parts.join('\n\n'));
      } else {
        setCareerExplanation(payload?.explanation || 'No explanation available');
      }
    } catch (err) {
      setCareerExplanation('Could not load explanation');
    } finally {
      setExplanationLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUserInsights();

      await Promise.all([
        fetchRecommendations(),
        fetchHiringFeed(),
      ]);

      setLoading(false);
    };

    loadData();

  }, []);

  // Check AI status (public)
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const resp = await apiFetch<{ data: { enabled: boolean } }>(`/api/ai/status`, undefined, { auth: false });
        setAiEnabled(resp?.data?.enabled ?? false);
      } catch {
        setAiEnabled(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full mx-auto mb-4"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-300 font-medium"
          >
            Loading your AI dashboard...
          </motion.p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Career Matches', onClick: onViewMatches, icon: '🎯' },
    { label: 'Roadmaps', onClick: onViewRoadmaps, icon: '🗺️' },
    { label: 'Catalog', onClick: onViewCatalog, icon: '📚' },
    { label: 'Profile', onClick: onViewProfile, icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      {/* PREMIUM NAV */}
      <nav className="sticky top-0 z-20 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/50">
                P
              </div>
              <span className="font-bold text-lg hidden sm:block text-white">Pragyan</span>
            </motion.div>

            {/* Nav Items */}
            <div className="flex items-center gap-1">
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.onClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="hidden md:block font-medium">{item.label}</span>
                </motion.button>
              ))}

              {onOpenAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={onOpenAdmin}
                  className="px-3 py-2 rounded-lg text-sm text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 ml-2 transition-all font-medium"
                >
                  🛡️ Admin
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  if (onLogout) onLogout();
                }}
                className="ml-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all font-medium"
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      {aiEnabled === false && (
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="rounded-md bg-yellow-900/60 border border-yellow-800 text-yellow-100 p-3 text-sm">
            AI features are currently disabled on the server. To enable full AI explanations, set the OPENAI_API_KEY on the backend and restart the server.
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* PREMIUM HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mb-2"
            >
              Welcome back 👋
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-white tracking-tight"
            >
              {userName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 mt-3 text-lg font-medium"
            >
              Your AI learning journey is accelerating ✨
            </motion.p>
          </div>
        </motion.div>

        {/* STATS GRID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {/* XP Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">⚡</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-semibold">ACTIVE</span>
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total XP</p>
              <motion.h3
                key={xpAnimated}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-cyan-400 tabular-nums"
              >
                {xpAnimated}
              </motion.h3>
              <p className="text-xs text-gray-500 mt-2">Earn XP by completing tasks</p>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🔥</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-semibold">{userInsights.streak > 0 ? 'ON FIRE' : 'START NOW'}</span>
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">Learning Streak</p>
              <h3 className="text-4xl font-bold text-amber-400 tabular-nums">{userInsights.streak}d</h3>
              <p className="text-xs text-gray-500 mt-2">Keep learning daily to build momentum</p>
            </div>
          </motion.div>

          {/* Assessment Card */}
          <motion.button
            whileHover={{ y: -5 }}
            onClick={onRetakeAssessment}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 overflow-hidden text-left hover:border-green-500/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">📝</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-green-500/20 text-green-300 font-semibold">RECOMMENDED</span>
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">Quick Access</p>
              <p className="text-sm font-semibold text-green-400 group-hover:text-green-300 transition-colors">Retake Assessment</p>
              <p className="text-xs text-gray-500 mt-2">Get fresh career insights</p>
            </div>
          </motion.button>

          {/* Top Match Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🎯</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-semibold">AI MATCH</span>
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">Top Match</p>
              <p className="text-sm font-semibold text-purple-300 truncate">{topCareer?.name || 'Complete assessment'}</p>
              <p className="text-xs text-gray-500 mt-2">Based on your profile</p>
            </div>
          </motion.div>
        </motion.div>

        {/* CAREER MATCH SECTION */}
        {recommendationsLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 overflow-hidden animate-pulse"
          >
            <div className="h-6 w-48 bg-white/10 rounded mb-4" />
            <div className="h-12 w-96 bg-white/10 rounded mb-6" />
            <div className="h-20 w-40 bg-white/10 rounded" />
          </motion.div>
        ) : topCareer ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 overflow-hidden hover:border-indigo-500/30 transition-all"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />

            <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              {/* Left Content */}
              <div className="flex-1 space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-sm font-semibold text-emerald-400 tracking-widest">BEST CAREER MATCH</p>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl md:text-6xl font-bold text-white leading-tight"
                >
                  {topCareer.name}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-300 text-lg"
                >
                  {topCareer.subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-3 flex-wrap pt-2"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {}}
                      className="px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-sm border border-indigo-500/30 font-semibold"
                    >
                      {topCareer.tag}
                    </button>
                    <button
                      onClick={() => {
                        fetchCareerExplanation();
                        setShowSkillUp(true);
                      }}
                      className="text-xs px-3 py-1 rounded-full bg-white/6 hover:bg-white/10 border border-white/10 text-gray-200 transition-all"
                    >
                      Skill Up
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onViewMatches}
                    className="px-4 py-2 rounded-full bg-white/10 text-white text-sm border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all font-semibold"
                  >
                    View All Matches →
                  </motion.button>
                  {careerExplanation && (
                    <div className="mt-4 bg-white/5 rounded-lg p-4 text-sm text-gray-200 border border-white/10">
                      <strong className="block text-xs text-gray-300 mb-1">AI Explanation</strong>
                      <p>{careerExplanation}</p>
                    </div>
                  )}
                  {/* Explanation Modal */}
                  {showExplanationModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black/60" onClick={() => setShowExplanationModal(false)} />
                      <div className="relative max-w-2xl w-full bg-slate-900 border border-white/10 rounded-lg p-6 z-10">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">Why this career?</h3>
                            <p className="text-sm text-gray-400">AI-generated explanation tailored to your profile</p>
                          </div>
                          <button onClick={() => setShowExplanationModal(false)} className="text-gray-300 hover:text-white">Close</button>
                        </div>
                        <div className="mt-4">
                          {explanationLoading ? (
                            <div className="text-center text-gray-300">Loading explanation…</div>
                          ) : (
                            <div className="text-sm text-gray-200 whitespace-pre-line">{careerExplanation || 'No explanation available.'}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <SkillUpModal careerId={topCareerId} visible={showSkillUp} onClose={() => setShowSkillUp(false)} />
                  <a
                    href="#jobs-section"
                    className="px-4 py-2 rounded-full bg-cyan-500/15 text-cyan-200 text-sm border border-cyan-400/30 hover:bg-cyan-500/25 hover:border-cyan-300/50 transition-all font-semibold"
                  >
                    View Related Jobs →
                  </a>
                </motion.div>
              </div>

              {/* Right - Match Percentage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                className="lg:flex-shrink-0"
              >
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {/* Animated circle background */}
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="95"
                      fill="none"
                      stroke="url(#matchGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "600 600", strokeDashoffset: 600 }}
                      animate={{ strokeDashoffset: 600 - (600 * topCareer.score) / 100 }}
                      transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                      strokeDasharray="600 600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                    >
                      <p className="text-gray-400 text-sm font-medium">Match Score</p>
                      <h3 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                        {topCareer.score}%
                      </h3>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}

        {/* SKILL RECOMMENDATIONS */}
        {recommendationsLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="h-8 w-56 bg-white/10 rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-5 animate-pulse">
                  <div className="h-5 w-24 bg-white/10 rounded mb-3" />
                  <div className="h-3 w-full bg-white/10 rounded mb-3" />
                  <div className="h-3 w-3/4 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </motion.div>
        ) : skillRecs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Recommended Skills</h2>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xs px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-semibold"
              >
                ✨ AI Personalised
              </motion.span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillRecs.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={onViewRoadmaps}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-indigo-500/30 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors">{rec.skill}</span>
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg">{rec.confidence}%</span>
                    </div>

                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${rec.confidence}%` }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full shadow-lg shadow-indigo-500/50"
                      />
                    </div>

                    <p className="text-xs text-gray-400 mt-3 line-clamp-2">{rec.reason}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* CAREER MATCHES */}
        {recommendationsLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="h-8 w-40 bg-white/10 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-6 animate-pulse">
                  <div className="h-6 w-2/3 bg-white/10 rounded mb-3" />
                  <div className="h-4 w-1/2 bg-white/10 rounded mb-3" />
                  <div className="h-3 w-full bg-white/10 rounded mb-4" />
                  <div className="h-10 w-full bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </motion.div>
        ) : jobs.length > 0 ? (
          <div id="jobs-section" className="space-y-8 scroll-mt-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">🔥 Recent Hiring for Your Role</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1">Latest openings from RapidAPI, matched to your skills</p>
                </div>
                <span className="text-sm text-gray-400 font-medium">{jobs.length} openings</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job, idx) => {
                  const score = job.matchScore ?? 0;
                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{job.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">{job.company}</p>
                            <p className="text-gray-500 text-xs mt-2">📍 {job.location}</p>
                            <p className="text-[11px] uppercase tracking-widest text-cyan-300/80 mt-3">{job.source}</p>
                          </div>
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 + idx * 0.05 }}
                            className="text-3xl font-bold text-cyan-400 tabular-nums"
                          >
                            {score}%
                          </motion.span>
                        </div>

                        <div className="mt-5 space-y-3">
                          <div>
                            <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden border border-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ delay: 0.6 + idx * 0.05, duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full shadow-lg shadow-purple-500/50"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5 font-medium">Match score</p>
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-2">
                            <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${job.applied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-gray-300'}`}>
                              {job.applied ? 'Applied' : 'Recent Hiring'}
                            </span>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await applyForJob(job.id);
                                  setJobs((currentJobs) =>
                                    currentJobs.map((currentJob) =>
                                      currentJob.id === job.id
                                        ? { ...currentJob, applied: true, appliedAt: new Date().toISOString() }
                                        : currentJob
                                    )
                                  );
                                  window.open(job.applyLink, '_blank', 'noopener,noreferrer');
                                } catch {
                                  window.open(job.applyLink, '_blank', 'noopener,noreferrer');
                                }
                              }}
                              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all rounded-xl py-2.5 font-semibold text-sm text-center"
                            >
                              {job.applied ? 'Applied' : 'Apply Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {jobs.some((job) => job.applied) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">✅ Jobs You Applied For</h2>
                    <p className="text-sm text-gray-400 font-medium mt-1">Track the roles you already opened</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {jobs
                    .filter((job) => job.applied)
                    .map((job, idx) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + idx * 0.05 }}
                        className="group relative bg-gradient-to-br from-emerald-500/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent opacity-100" />
                        <div className="relative z-10">
                          <h3 className="text-lg font-bold text-white">{job.title}</h3>
                          <p className="text-gray-400 text-sm mt-1">{job.company}</p>
                          <p className="text-gray-500 text-xs mt-2">📍 {job.location}</p>
                          <p className="text-xs text-emerald-300 mt-4 font-semibold">Applied on {job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : 'recently'}</p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : null}

        {/* QUICK ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 pb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white">Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Skills Roadmaps', icon: '⚡', desc: 'Start structured learning', fn: onViewRoadmaps, gradient: 'from-blue-500' },
              { label: 'Career Catalog', icon: '📚', desc: 'Browse all paths', fn: onViewCatalog, gradient: 'from-purple-500' },
              { label: 'My Profile', icon: '👤', desc: 'Update your info', fn: onViewProfile, gradient: 'from-amber-500' },
            ].map((item, idx) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={item.fn}
                className={`group relative bg-gradient-to-br ${item.gradient}/10 to-transparent backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-6 text-left transition-all overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="text-4xl mb-4 origin-left"
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors">{item.label}</h3>
                  <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}