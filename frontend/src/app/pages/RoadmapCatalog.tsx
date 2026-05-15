import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Lock, CheckCircle2, Clock, Zap, X } from 'lucide-react';
import { ExpandedRoadmap } from '../types/roadmapExpanded';
import {
  allExpandedRoadmaps,
  roadmapCategories,
  searchRoadmaps,
  getRoadmapsByCategory,
  getCategoryColor,
} from '../data/roadmapDataExpanded';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';

interface RoadmapCatalogProps {
  onRoadmapSelect: (roadmap: ExpandedRoadmap) => void;
}

export function RoadmapCatalog({ onRoadmapSelect }: RoadmapCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Filter and search logic
  const filteredRoadmaps = useMemo(() => {
    let results = allExpandedRoadmaps;

    // Filter by search query
    if (searchQuery.trim()) {
      results = searchRoadmaps(searchQuery);
    }

    // Filter by category
    if (selectedCategory) {
      results = results.filter((r) => r.category === selectedCategory);
    }

    // Filter by level
    if (selectedLevel) {
      results = results.filter((r) => r.level === selectedLevel);
    }

    return results;
  }, [searchQuery, selectedCategory, selectedLevel]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'from-green-500 to-emerald-500';
      case 'intermediate':
        return 'from-blue-500 to-cyan-500';
      case 'advanced':
        return 'from-purple-500 to-pink-500';
      case 'expert':
        return 'from-red-500 to-orange-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getLevelLabel = (level: string) => level.charAt(0).toUpperCase() + level.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Learning Roadmaps Catalog</h1>
          <p className="text-slate-400 text-lg">Explore 25+ comprehensive learning paths across all tech domains</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search roadmaps... (e.g., 'React', 'Machine Learning', 'DevOps')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 space-y-4"
        >
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Categories
              </button>
              {roadmapCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedLevel === level
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {getLevelLabel(level)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-slate-300"
        >
          <p>
            Showing <span className="font-bold text-white">{filteredRoadmaps.length}</span> roadmap{filteredRoadmaps.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Roadmaps Grid */}
        {filteredRoadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredRoadmaps.map((roadmap, idx) => (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onRoadmapSelect(roadmap)}
                  className="cursor-pointer group"
                >
                  <GlassCard className="p-6 h-full hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{roadmap.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                            {roadmap.title}
                          </h3>
                          <p className="text-xs text-slate-400 capitalize">{roadmap.category.replace('-', ' ')}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300 mb-4 line-clamp-2">{roadmap.description}</p>

                    {/* Difficulty Badge */}
                    <div className="mb-4 flex items-center gap-2">
                      <div
                        className={`h-1 flex-1 rounded-full bg-gradient-to-r ${getLevelColor(roadmap.level)}`}
                      />
                      <span className="text-xs font-semibold text-slate-300">{getLevelLabel(roadmap.level)}</span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-t border-b border-slate-600/50">
                      <div className="text-center">
                        <div className="text-xs text-slate-400">Duration</div>
                        <div className="text-sm font-bold text-white">{roadmap.duration}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400">Tasks</div>
                        <div className="text-sm font-bold text-white">{roadmap.totalTasks}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400">Hours</div>
                        <div className="text-sm font-bold text-white">{roadmap.estimatedHours}</div>
                      </div>
                    </div>

                    {/* Learning Outcomes */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-400 mb-2">What you'll learn:</p>
                      <ul className="space-y-1">
                        {roadmap.learningOutcomes.slice(0, 3).map((outcome, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button */}
                    <GlassButton className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-center">
                      View Roadmap →
                    </GlassButton>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-slate-400 mb-2">No roadmaps found</p>
            <p className="text-slate-500">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
