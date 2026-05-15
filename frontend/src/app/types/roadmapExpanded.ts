// ============ EXPANDED ROADMAP TYPES ============

export interface RoadmapTopic {
  title: string;
  description: string;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  topics: RoadmapTopic[];
  estimatedHours: number;
}

export interface RoadmapMonth {
  month: number;
  title: string;
  topics: RoadmapTopic[];
  estimatedHours: number;
}

export interface ExpandedRoadmap {
  id: string;
  title: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'programming' | 'ai-ml' | 'data-science' | 'devops' | 'cyber-security' | 'cloud' | 'mobile' | 'system-programming' | 'blockchain' | 'design';
  icon: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: string;
  totalTasks: number;
  estimatedHours: number;
  weeks?: RoadmapWeek[];
  months?: RoadmapMonth[];
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  prerequisites?: string[];
  relatedSkills?: string[];
  learningOutcomes: string[];
}

// ============ MEGA ECOSYSTEM TYPES ============

export interface MegaRoadmap extends ExpandedRoadmap {
  tags: string[];
  subcategory?: string;
  careerPaths?: string[];
  xpReward?: number;
  popularity?: number;
  trending?: boolean;
}

export interface MegaRoadmapCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
  subcategories?: string[];
  roadmapCount?: number;
}

export interface RoadmapCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}

export interface SearchResult {
  roadmaps: ExpandedRoadmap[];
  query: string;
  resultCount: number;
}
