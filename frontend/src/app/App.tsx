import React, { useEffect, useState } from "react";
import { NewLanding } from "./pages/NewLanding";
import { NewAuth } from "./pages/NewAuth";
import { LanguageSelector } from "./pages/LanguageSelector";
import { AdaptiveAssessment } from "./pages/AdaptiveAssessment";
import { AIAnalysis } from "./pages/AIAnalysis";
import Dashboard from "./pages/Dashboard";
import { CareerMatches } from "./pages/CareerMatches";
import { CareerDashboard } from "./pages/CareerDashboard";
import { SmartProfile } from "./pages/SmartProfile";
import { SkillsRoadmapPage } from "./pages/SkillsRoadmapPage";
import { SkillDetailPage } from "./pages/SkillDetailPage";
import { DailyRoadmapView } from "./pages/DailyRoadmapView";
import { RoadmapCatalog } from "./pages/RoadmapCatalog";
// Mega catalog removed per request
import { ResourceDetailPage } from "./pages/ResourceDetailPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import type { Resource, SkillRoadmap } from "./types/roadmap";
import type { ExpandedRoadmap } from "./types/roadmapExpanded";
import { apiFetch } from "../services/api";
import { toast } from "sonner";

type Page =
  | 'landing'
  | 'login'
  | 'register'
  | 'language'
  | 'assessment'
  | 'analysis'
  | 'dashboard'
  | 'admin'
  | 'matches'
  | 'career-detail'
  | 'profile'
  | 'skills-roadmap'
  | 'skill-detail'
  | 'daily-learning'
  | 'roadmap-catalog'
  | 'roadmap-detail'
  | 'resource-detail';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [pageHistory, setPageHistory] = useState<Page[]>([]);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('USER');
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, any>>({});
  const [selectedCareerId, setSelectedCareerId] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<SkillRoadmap | null>(null);
  const [selectedExpandedRoadmap, setSelectedExpandedRoadmap] = useState<ExpandedRoadmap | null>(null);
  
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [resourceTaskTitle, setResourceTaskTitle] = useState('');
  const [previousPage, setPreviousPage] = useState<Page>('skill-detail');

  const protectedPages: Page[] = [
    'dashboard',
    'admin',
    'matches',
    'career-detail',
    'profile',
    'skills-roadmap',
    'skill-detail',
    'daily-learning',
    'roadmap-catalog',
    'roadmap-detail',
    'resource-detail',
  ];

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      return;
    }

    const loadSession = async () => {
      try {
        const data = await apiFetch<any>('/api/auth/me', undefined, { auth: true });
        const profile = data.data;

        if (profile?.fullName) {
          setUserName(profile.fullName);
        } else if (profile?.email) {
          setUserName(profile.email.split('@')[0]);
        }

        if (profile?.role) {
          setUserRole(profile.role);
          localStorage.setItem('userRole', profile.role);
        }

        if (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register') {
          navigateTo('dashboard');
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    };

    loadSession();
  }, []);

  const navigateTo = (page: Page) => {
    setPageHistory((h) => [...h, currentPage]);
    setCurrentPage(page);
  };

  const goBack = () => {
    setPageHistory((h) => {
      if (h.length === 0) {
        // fallback to landing
        setCurrentPage('landing');
        return [];
      }
      const last = h[h.length - 1];
      const newHistory = h.slice(0, -1);
      setCurrentPage(last);
      return newHistory;
    });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken && protectedPages.includes(currentPage)) {
      navigateTo('login');
    }
  }, [currentPage]);

  // Logout when user leaves/closes the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        // Use sendBeacon for reliable logout on page close
        const logoutData = JSON.stringify({ refreshToken });
        navigator.sendBeacon('/api/auth/logout', logoutData);
      }
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('rememberedEmail');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const normalizeSkillColor = (color: ExpandedRoadmap['color']): SkillRoadmap['color'] => {
    if (color === 'warning' || color === 'danger') {
      return 'accent';
    }

    return color;
  };

  const handleSelectResource = (resource: Resource, taskTitle: string) => {
    setSelectedResource(resource);
    setResourceTaskTitle(taskTitle);
    setPreviousPage(currentPage);
    navigateTo('resource-detail');
  };

  const handleBackFromResource = () => {
    navigateTo(previousPage);
    setSelectedResource(null);
    setResourceTaskTitle('');
  };

  const handleLogin = (displayName: string) => {
    setUserName(displayName);
    const role = localStorage.getItem('userRole') || 'USER';
    setUserRole(role);
    navigateTo(role === 'ADMIN' ? 'admin' : 'dashboard');
  };

  const handleRegister = (name: string, _email: string) => {
    setUserName(name);
    navigateTo('language');
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      apiFetch('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }, { auth: true }).catch(() => {});
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setUserName('');
    setUserRole('USER');
    setAssessmentAnswers({});
    navigateTo('landing');
    toast.success('Logged out successfully');
  };

  const handleAssessmentComplete = (answers: Record<string, any>) => {
    setAssessmentAnswers(answers);
    navigateTo('analysis');
  };

  const handleAnalysisComplete = () => {
    navigateTo('dashboard');
  };

  const handleSelectCareer = (careerId: string) => {
    setSelectedCareerId(careerId);
    navigateTo('career-detail');
  };

  const handleSelectSkill = (skill: SkillRoadmap) => {
    setSelectedSkill(skill);
    // ensure selectedSkill state is applied before navigating
    setTimeout(() => navigateTo('skill-detail'), 0);
  };

  const handleStartLearning = (skill: SkillRoadmap) => {
    setSelectedSkill(skill);
    navigateTo('daily-learning');
  };

  const handleSelectExpandedRoadmap = (roadmap: ExpandedRoadmap) => {
    setSelectedExpandedRoadmap(roadmap);
    navigateTo('roadmap-detail');
  };

  return (
    <div className="size-full">
      <header className="glass-strong border-b border-white/10 px-4 py-2 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button
            onClick={goBack}
            disabled={pageHistory.length === 0}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${pageHistory.length === 0 ? 'opacity-40 cursor-default' : 'hover:bg-white/5'}`}
          >
            ← Back
          </button>
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">Pr</div>
              <span className="text-sm font-semibold text-white">Pragyan</span>
            </div>
            <div className="text-xs text-gray-300">{currentPage.replace('-', ' ')}</div>
          </div>
        </div>
      </header>
      {currentPage === 'landing' && (
        <NewLanding
          onGetStarted={() => navigateTo('register')}
          onLogin={() => navigateTo('login')}
        />
      )}

      {currentPage === 'login' && (
        <NewAuth
          mode="login"
          onLogin={handleLogin}
          onRegister={handleRegister}
          onToggleMode={() => navigateTo('register')}
          onBack={() => navigateTo('landing')}
          onLogoClick={() => navigateTo('landing')}
        />
      )}

      {currentPage === 'register' && (
        <NewAuth
          mode="register"
          onLogin={handleLogin}
          onRegister={handleRegister}
          onToggleMode={() => navigateTo('login')}
          onBack={() => navigateTo('landing')}
          onLogoClick={() => navigateTo('landing')}
        />
      )}

      {currentPage === 'language' && (
        <LanguageSelector onContinue={() => navigateTo('assessment')} />
      )}

      {currentPage === 'assessment' && (
        <AdaptiveAssessment
          onComplete={handleAssessmentComplete}
          onBack={() => navigateTo('language')}
        />
      )}

      {currentPage === 'analysis' && (
        <AIAnalysis onComplete={handleAnalysisComplete} />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          userName={userName || 'User'}
          assessmentAnswers={assessmentAnswers}
          onOpenAdmin={userRole === 'ADMIN' ? () => navigateTo('admin') : undefined}
          onViewMatches={() => navigateTo('matches')}
          onViewProfile={() => navigateTo('profile')}
          onRetakeAssessment={() => navigateTo('language')}
          onViewRoadmaps={() => navigateTo('skills-roadmap')}
          onViewCatalog={() => navigateTo('roadmap-catalog')}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'admin' && (
        <AdminDashboard onBack={() => navigateTo('dashboard')} />
      )}

      {currentPage === 'matches' && (
        <CareerMatches
          onSelectCareer={handleSelectCareer}
          onBack={() => navigateTo('dashboard')}
          onProfile={() => navigateTo('profile')}
        />
      )}

      {currentPage === 'career-detail' && (
        <CareerDashboard
          careerId={selectedCareerId}
          onBack={() => navigateTo('matches')}
        />
      )}

      {currentPage === 'profile' && (
        <SmartProfile
          userName={userName || 'User'}
          onBack={() => navigateTo('dashboard')}
        />
      )}

      {currentPage === 'skills-roadmap' && (
        <SkillsRoadmapPage
          onSkillSelect={handleSelectSkill}
          selectedView="list"
        />
      )}

      {currentPage === 'skill-detail' && (
        selectedSkill ? (
          <SkillDetailPage
            skill={selectedSkill}
            onBack={() => navigateTo('skills-roadmap')}
            onStartLearning={handleStartLearning}
            onSelectResource={handleSelectResource}
          />
        ) : (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300">Loading skill details…</p>
            </div>
          </div>
        )
      )}

      {currentPage === 'daily-learning' && selectedSkill && (
        <DailyRoadmapView
          skill={selectedSkill}
          onBack={() => navigateTo('skill-detail')}
          onComplete={() => {
            navigateTo('skill-detail');
          }}
        />
      )}

      {currentPage === 'roadmap-catalog' && (
        <RoadmapCatalog
          onRoadmapSelect={handleSelectExpandedRoadmap}
        />
      )}

      {currentPage === 'roadmap-detail' && selectedExpandedRoadmap && (
        <SkillDetailPage
          skill={{
            id: selectedExpandedRoadmap.id,
            skillName: selectedExpandedRoadmap.title,
            skillCategory: selectedExpandedRoadmap.category as 'frontend' | 'backend' | 'fullstack' | 'tools' | 'concepts',
            difficulty: selectedExpandedRoadmap.level as any,
            description: selectedExpandedRoadmap.description,
            totalDuration: selectedExpandedRoadmap.duration,
            estimatedHours: selectedExpandedRoadmap.estimatedHours,
            progress: 0,
            currentDay: 1,
            totalDays: selectedExpandedRoadmap.totalTasks,
            weeklyModules: (selectedExpandedRoadmap.weeks || []).map((w) => ({
              week: w.week,
              title: w.title,
              topics: w.topics.map((t) => t.title),
              estimatedHours: w.estimatedHours,
            })),
            dailyTasks: Array.from({ length: selectedExpandedRoadmap.totalTasks }, (_, dayIdx) => {
              const dayNum = dayIdx + 1;
              return {
                id: selectedExpandedRoadmap.id + '-task-' + dayNum,
                taskNumber: dayNum,
                title: 'Day ' + dayNum + ' Content',
                description: 'Learn about core concepts',
                completed: false,
                estimatedTime: '60 mins',
                subtasks: ['Understand the fundamentals', 'Practice with examples'],
                resources: [],
              };
            }),
            icon: selectedExpandedRoadmap.icon,
            color: normalizeSkillColor(selectedExpandedRoadmap.color),
            prerequisites: selectedExpandedRoadmap.prerequisites,
            relatedSkills: selectedExpandedRoadmap.relatedSkills,
          }}
          onBack={() => navigateTo('roadmap-catalog')}
          onStartLearning={() => {}}
          onSelectResource={handleSelectResource}
        />
      )}

      

      {currentPage === 'resource-detail' && selectedResource && (
        <ResourceDetailPage
          resource={selectedResource}
          taskTitle={resourceTaskTitle}
          onBack={handleBackFromResource}
        />
      )}
    </div>
  );
}
