import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ChevronRight,
  Zap,
  X,
  ChevronLeft,
  ChevronDown,
  TrendingUp,
  Filter,
  Tag,
} from 'lucide-react';
import { MegaRoadmap } from '../types/roadmapExpanded';
import {
  megaEcosystemRoadmaps,
  megaRoadmapCategories,
  searchMegaRoadmaps,
  getMegaRoadmapsByCategory,
  getMegaRoadmapsByLevel,
  getTrendingRoadmaps,
  getPopularRoadmaps,
  getAllUniqueTags,
  getTotalRoadmapCount,
  getCategoryStats,
} from '../data/roadmapDataMegaEcosystem';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';

interface MegaCatalogProps {
  onRoadmapSelect: (roadmap: MegaRoadmap) => void;
}

const ITEMS_PER_PAGE = 20;

export function MegaCatalog({ onRoadmapSelect }: MegaCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'all' | 'trending' | 'popular'>('all');
  const [expandedFilters, setExpandedFilters] = useState(false);

  // Get unique tags
  const allTags = useMemo(() => getAllUniqueTags(), []);

  // Filter and search logic
  const filteredRoadmaps = useMemo(() => {
    let results = megaEcosystemRoadmaps;

    // Apply view mode
    if (viewMode === 'trending') {
      results = getTrendingRoadmaps();
    } else if (viewMode === 'popular') {
      results = getPopularRoadmaps();
    }

    // Filter by search query
    if (searchQuery.trim()) {
      results = searchMegaRoadmaps(searchQuery).filter((r) => results.includes(r));
    }

    // Filter by category
    if (selectedCategory) {
      results = results.filter((r) => r.category === selectedCategory);
    }

    // Filter by level
    if (selectedLevel) {
      results = results.filter((r) => r.level === selectedLevel);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      results = results.filter((r) => selectedTags.some((tag) => r.tags.includes(tag)));
    }

    return results;
  }, [searchQuery, selectedCategory, selectedLevel, selectedTags, viewMode]);

  // Pagination
  const totalPages = Math.ceil(filteredRoadmaps.length / ITEMS_PER_PAGE);
  const paginatedRoadmaps = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRoadmaps.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredRoadmaps, currentPage]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    setCurrentPage(1);
  };

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

  const categoryStats = useMemo(() => getCategoryStats(), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Skill Ecosystem
              </h1>
              <p className="text-slate-400 text-lg">
                {getTotalRoadmapCount()}+ learning paths | 14 categories | Master any skill
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search & View Modes */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search 140+ roadmaps... (React, Python, DevOps, Blockchain...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5">
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            )}
          </div>

          {/* View Modes */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'trending', 'popular'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  viewMode === mode
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {mode === 'trending' && <TrendingUp className="w-4 h-4" />}
                {mode === 'all' && 'All Roadmaps'}
                {mode === 'trending' && 'Trending'}
                {mode === 'popular' && 'Popular'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filters - Collapsible */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 bg-slate-800/50 rounded-lg p-4 border border-slate-700/50"
        >
          <button
            onClick={() => setExpandedFilters(!expandedFilters)}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4 font-semibold"
          >
            <Filter className="w-5 h-5" />
            Advanced Filters {expandedFilters ? '▼' : '▶'}
          </button>

          <AnimatePresence>
            {expandedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 pt-4 border-t border-slate-700"
              >
                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <span>📁 Categories</span>
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                      {megaRoadmapCategories.length}
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === null
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      All Categories
                    </button>
                    {megaRoadmapCategories.map((category) => {
                      const count = categoryStats.find((s) => s.categoryId === category.id)?.count || 0;
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setCurrentPage(1);
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                          <span className="text-xs">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">📊 Difficulty Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setSelectedLevel(selectedLevel === level ? null : level);
                          setCurrentPage(1);
                        }}
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

                {/* Tag Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags ({selectedTags.length} selected)
                  </h3>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {allTags.slice(0, 40).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 ${
                          selectedTags.includes(tag)
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Info & Clear Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="text-slate-300">
            Showing <span className="font-bold text-white">{paginatedRoadmaps.length}</span> of{' '}
            <span className="font-bold text-white">{filteredRoadmaps.length}</span> roadmap
            {filteredRoadmaps.length !== 1 ? 's' : ''}
          </div>
          {(searchQuery || selectedCategory || selectedLevel || selectedTags.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSelectedLevel(null);
                setSelectedTags([]);
                setViewMode('all');
                setCurrentPage(1);
              }}
              className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-all"
            >
              Clear Filters
            </button>
          )}
        </motion.div>

        {/* Roadmaps Grid */}
        {paginatedRoadmaps.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              <AnimatePresence>
                {paginatedRoadmaps.map((roadmap, idx) => (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => onRoadmapSelect(roadmap)}
                    className="cursor-pointer group h-full"
                  >
                    <GlassCard className="p-4 h-full hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{roadmap.icon}</span>
                        <div className="text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                          {getLevelLabel(roadmap.level)}
                        </div>
                      </div>

                      {/* Title & Category */}
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-1">
                        {roadmap.title}
                      </h3>
                      <p className="text-xs text-slate-400 capitalize mb-3">{roadmap.subcategory || roadmap.category}</p>

                      {/* Description */}
                      <p className="text-xs text-slate-300 mb-3 line-clamp-2 flex-1">{roadmap.description}</p>

                      {/* Difficulty Bar */}
                      <div className="mb-3 flex items-center gap-2">
                        <div className={`h-0.5 flex-1 rounded-full bg-gradient-to-r ${getLevelColor(roadmap.level)}`} />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
                        <div>
                          <div className="text-slate-400">Duration</div>
                          <div className="font-bold text-white">{roadmap.duration}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">Tasks</div>
                          <div className="font-bold text-white">{roadmap.totalTasks}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">Hours</div>
                          <div className="font-bold text-white">{roadmap.estimatedHours}</div>
                        </div>
                      </div>

                      {/* Tags */}
                      {roadmap.tags.slice(0, 2).length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {roadmap.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {roadmap.tags.length > 2 && (
                            <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded">
                              +{roadmap.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* XP Reward */}
                      {roadmap.xpReward && (
                        <div className="text-xs text-amber-400 font-semibold mb-3 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {roadmap.xpReward} XP
                        </div>
                      )}

                      {/* Button */}
                      <button className="w-full mt-auto bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold py-2 rounded transition-all">
                        Start Learning →
                      </button>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg font-semibold transition-all ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-slate-400 mb-2">No roadmaps found</p>
            <p className="text-slate-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSelectedLevel(null);
                setSelectedTags([]);
                setViewMode('all');
                setCurrentPage(1);
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
