import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Search, Bookmark, BookmarkCheck, ArrowRight, Briefcase, MapPin, DollarSign, CircleCheckBig } from "lucide-react";
import { NeuralBackground } from "../components/NeuralBackground";
import { GlassCard } from "../components/GlassCard";
import { GlowButton } from "../components/GlowButton";
import { SectionHeader } from "../components/SectionHeader";
import { GradientIconWrapper } from "../components/GradientIconWrapper";
import { jobsService } from "../../services/jobsService";
import type { JobFeedItem } from "../../types/api";

export function Jobs() {
  const [jobs, setJobs] = useState<JobFeedItem[]>([]);
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadJobs() {
      try {
        setLoading(true);
        const feed = await jobsService.getJobs();
        if (mounted) {
          setJobs(feed.recommendedJobs || feed.recentJobs || []);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load jobs");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadJobs();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return jobs;
    }

    return jobs.filter((job) => {
      const haystack = [job.title, job.company, job.location, job.description, ...job.skills].join(" ").toLowerCase();
      return haystack.includes(term);
    });
  }, [jobs, query]);

  const toggleBookmark = (jobId: string) => {
    setBookmarks((current) => ({ ...current, [jobId]: !current[jobId] }));
  };

  const applyToJob = async (jobId: string) => {
    try {
      await jobsService.applyToJob(jobId);
      setJobs((current) => current.map((job) => (job.id === jobId ? { ...job, applied: true } : job)));
    } catch {
      // keep optimistic UI limited to local state
    }
  };

  if (loading && !jobs.length) {
    return (
      <div className="min-h-screen relative pb-20 pt-20">
        <NeuralBackground />
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <GlassCard glow glowColor="primary" className="py-16 text-center">
            <Briefcase className="w-10 h-10 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading job matches...</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (error && !jobs.length) {
    return (
      <div className="min-h-screen relative pb-20 pt-20">
        <NeuralBackground />
        <div className="max-w-3xl mx-auto px-6 py-24 relative z-10">
          <GlassCard glow glowColor="primary" className="text-center space-y-4">
            <h1 className="text-2xl font-semibold">Jobs unavailable</h1>
            <p className="text-muted-foreground">{error}</p>
            <GlowButton variant="primary" onClick={() => window.location.reload()}>
              Retry loading
            </GlowButton>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20 pt-20">
      <NeuralBackground />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SectionHeader title="Job Intelligence" subtitle="Dynamic job recommendations aligned with your assessment and roadmap" className="mb-6" />

          <GlassCard glow glowColor="primary" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <GradientIconWrapper size="sm" gradient="purple" glow>
                    <Search className="w-4 h-4 text-white" />
                  </GradientIconWrapper>
                  <span className="text-sm font-medium">Search and filter your feed</span>
                </div>
                <p className="text-muted-foreground max-w-2xl">Bookmark opportunities now and keep apply flows ready for the future.</p>
              </div>
              <div className="relative w-full md:w-[360px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search title, company, or skill"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-background/60 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job, index) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <GlassCard hover glow glowColor={job.matchScore >= 80 ? "secondary" : "primary"} className="h-full">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{job.source}</div>
                      <h3 className="text-xl font-semibold mt-2">{job.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{job.matchScore}%</div>
                      <div className="text-xs text-muted-foreground">Match</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salary || "Salary not disclosed"}</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">{skill}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border gap-2">
                    <button type="button" onClick={() => toggleBookmark(job.id)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                      {bookmarks[job.id] ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
                      {bookmarks[job.id] ? "Bookmarked" : "Bookmark"}
                    </button>

                    <button type="button" onClick={() => void applyToJob(job.id)} className={`inline-flex items-center gap-2 text-sm font-medium ${job.applied ? "text-secondary" : "text-primary hover:text-primary/80"}`}>
                      {job.applied ? <CircleCheckBig className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      {job.applied ? "Applied" : "Apply"}
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}