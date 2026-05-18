import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { generateRecommendations, RecommendationBundle } from '../../services/recommendations';
import { Loader2, Sparkles, TrendingUp, Award, BookOpen, Zap } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { MatchScoreCircle } from './MatchScoreCircle';
import { SkillCard } from './SkillCard';
import { RoadmapCard } from './RoadmapCard';
import { SalaryInsightCard } from './SalaryInsightCard';

interface AIResultsPageProps {
  userName: string;
  onNavigate?: (page: string) => void;
  assessmentData?: any;
}

export function AIResultsPage({ userName, onNavigate, assessmentData }: AIResultsPageProps) {
  const [recommendations, setRecommendations] = useState<RecommendationBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'careers' | 'roadmap'>('overview');

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        const data = await generateRecommendations(assessmentData);
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [assessmentData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mb-4 flex justify-center"
          >
            <Loader2 className="w-12 h-12 text-primary" />
          </motion.div>
          <p className="text-muted-foreground">AI is analyzing your profile...</p>
          <div className="mt-4 flex justify-center gap-1">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-foreground mb-4">Failed to load recommendations</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  const topCareer = recommendations.topCareer;
  const careerMatches = recommendations.careerMatches || [];
  const skillRecommendations = recommendations.skillRecommendations || [];
  const roadmapRecommendations = recommendations.roadmapRecommendations || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative pt-12 pb-20 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Career Analysis</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Your Perfect Career Match
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Based on your unique skills, interests, and learning style, here's your personalized career roadmap
            </p>
          </motion.div>

          {/* Top Career Match - Large Card */}
          {topCareer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-16"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent rounded-2xl blur-2xl" />
                <Card className="p-8 md:p-12 relative border-primary/30 backdrop-blur-xl bg-card/50">
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Score Circle */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring' }}
                      className="flex justify-center"
                    >
                      <MatchScoreCircle score={topCareer.match} size="lg" />
                    </motion.div>

                    {/* Career Info */}
                    <div className="md:col-span-2">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Award className="w-6 h-6 text-primary" />
                          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            {topCareer.career}
                          </h2>
                          {topCareer.confidenceLevel === 'high' && (
                            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                              Perfect Fit
                            </span>
                          )}
                        </div>

                        {topCareer.salaryEstimate && (
                          <div className="flex items-center gap-2 mb-4 text-primary">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-lg font-semibold">{topCareer.salaryEstimate}</span>
                          </div>
                        )}

                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {topCareer.reasons?.[0] || 'Based on your assessment, this is your best career match.'}
                        </p>

                        <div className="flex flex-wrap gap-3">
                          <Button
                            variant="default"
                            onClick={() => onNavigate?.('roadmap')}
                            className="gap-2"
                          >
                            <BookOpen className="w-4 h-4" />
                            Start Learning Path
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setActiveTab('careers')}
                          >
                            See All Matches
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex gap-4 border-b border-border">
          {[
            { id: 'overview', label: 'Overview', icon: Sparkles },
            { id: 'careers', label: 'All Careers', icon: Award },
            { id: 'roadmap', label: 'Learning Path', icon: BookOpen },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`pb-4 px-4 font-medium transition-colors flex items-center gap-2 ${
                activeTab === id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Missing Skills */}
            {topCareer?.missingSkills && topCareer.missingSkills.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Skills to Master
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {topCareer.missingSkills.slice(0, 6).map((skill, idx) => (
                    <SkillCard
                      key={idx}
                      skill={skill}
                      status="learning"
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Roadmap Preview */}
            {roadmapRecommendations.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Recommended Learning Path
                </h3>
                <div className="space-y-4">
                  {roadmapRecommendations.slice(0, 3).map((roadmap, idx) => (
                    <RoadmapCard
                      key={idx}
                      roadmap={roadmap}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'careers' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {careerMatches.map((career, idx) => (
              <motion.div
                key={career.careerId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <Card className="p-6 hover:border-primary/50 transition-all group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {career.career}
                      </h3>
                      {career.salaryEstimate && (
                        <p className="text-sm text-muted-foreground mt-1">{career.salaryEstimate}</p>
                      )}
                    </div>
                    <MatchScoreCircle score={career.match} size="md" />
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">
                    {career.reasons?.[0] || 'Great match for your profile'}
                  </p>

                  <div className="space-y-3">
                    {career.requiredSkills && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {career.requiredSkills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {career.requiredSkills.length > 3 && (
                            <span className="px-2 py-1 text-xs text-muted-foreground">
                              +{career.requiredSkills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'roadmap' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {roadmapRecommendations.map((roadmap, idx) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                index={idx}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
