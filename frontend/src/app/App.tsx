import { useEffect, useState } from "react";
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
import { MegaCatalog } from "./pages/MegaCatalog";
import { ResourceDetailPage } from "./pages/ResourceDetailPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import type { Resource, SkillRoadmap } from "./types/roadmap";
import type { ExpandedRoadmap, MegaRoadmap } from "./types/roadmapExpanded";
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
  | 'mega-catalog'
  | 'mega-roadmap-detail'
  | 'resource-detail';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('USER');
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, any>>({});
  const [selectedCareerId, setSelectedCareerId] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<SkillRoadmap | null>(null);
  const [selectedExpandedRoadmap, setSelectedExpandedRoadmap] = useState<ExpandedRoadmap | null>(null);
  const [selectedMegaRoadmap, setSelectedMegaRoadmap] = useState<MegaRoadmap | null>(null);
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
    'mega-catalog',
    'mega-roadmap-detail',
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
          setCurrentPage('dashboard');
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken && protectedPages.includes(currentPage)) {
      setCurrentPage('login');
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

  const normalizeSkillColor = (color: ExpandedRoadmap['color'] | MegaRoadmap['color']): SkillRoadmap['color'] => {
    if (color === 'warning' || color === 'danger') {
      return 'accent';
    }

    return color;
  };

  const handleSelectResource = (resource: Resource, taskTitle: string) => {
    setSelectedResource(resource);
    setResourceTaskTitle(taskTitle);
    setPreviousPage(currentPage);
    setCurrentPage('resource-detail');
  };

  const handleBackFromResource = () => {
    setCurrentPage(previousPage);
    setSelectedResource(null);
    setResourceTaskTitle('');
  };

  const handleLogin = (displayName: string) => {
    setUserName(displayName);
    const role = localStorage.getItem('userRole') || 'USER';
    setUserRole(role);
    setCurrentPage(role === 'ADMIN' ? 'admin' : 'dashboard');
  };

  const handleRegister = (name: string, _email: string) => {
    setUserName(name);
    setCurrentPage('language');
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
    setCurrentPage('landing');
    toast.success('Logged out successfully');
  };

  const handleAssessmentComplete = (answers: Record<string, any>) => {
    setAssessmentAnswers(answers);
    setCurrentPage('analysis');
  };

  const handleAnalysisComplete = () => {
    setCurrentPage('dashboard');
  };

  const handleSelectCareer = (careerId: string) => {
    setSelectedCareerId(careerId);
    setCurrentPage('career-detail');
  };

  const handleSelectSkill = (skill: SkillRoadmap) => {
    setSelectedSkill(skill);
    setCurrentPage('skill-detail');
  };

  const handleStartLearning = (skill: SkillRoadmap) => {
    setSelectedSkill(skill);
    setCurrentPage('daily-learning');
  };

  const handleSelectExpandedRoadmap = (roadmap: ExpandedRoadmap) => {
    setSelectedExpandedRoadmap(roadmap);
    setCurrentPage('roadmap-detail');
  };

  const handleSelectMegaRoadmap = (roadmap: MegaRoadmap) => {
    setSelectedMegaRoadmap(roadmap);
    setCurrentPage('mega-roadmap-detail');
  };

  return (
    <div className="size-full">
      {currentPage === 'landing' && (
        <NewLanding
          onGetStarted={() => setCurrentPage('register')}
          onLogin={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'login' && (
        <NewAuth
          mode="login"
          onLogin={handleLogin}
          onRegister={handleRegister}
          onToggleMode={() => setCurrentPage('register')}
          onBack={() => setCurrentPage('landing')}
          onLogoClick={() => setCurrentPage('landing')}
        />
      )}

      {currentPage === 'register' && (
        <NewAuth
          mode="register"
          onLogin={handleLogin}
          onRegister={handleRegister}
          onToggleMode={() => setCurrentPage('login')}
          onBack={() => setCurrentPage('landing')}
          onLogoClick={() => setCurrentPage('landing')}
        />
      )}

      {currentPage === 'language' && (
        <LanguageSelector onContinue={() => setCurrentPage('assessment')} />
      )}

      {currentPage === 'assessment' && (
        <AdaptiveAssessment
          onComplete={handleAssessmentComplete}
          onBack={() => setCurrentPage('language')}
        />
      )}

      {currentPage === 'analysis' && (
        <AIAnalysis onComplete={handleAnalysisComplete} />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          userName={userName || 'User'}
          assessmentAnswers={assessmentAnswers}
          onOpenAdmin={userRole === 'ADMIN' ? () => setCurrentPage('admin') : undefined}
          onViewMatches={() => setCurrentPage('matches')}
          onViewProfile={() => setCurrentPage('profile')}
          onRetakeAssessment={() => setCurrentPage('language')}
          onViewRoadmaps={() => setCurrentPage('skills-roadmap')}
          onViewCatalog={() => setCurrentPage('roadmap-catalog')}
          onViewMegaCatalog={() => setCurrentPage('mega-catalog')}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'admin' && (
        <AdminDashboard onBack={() => setCurrentPage('dashboard')} />
      )}

      {currentPage === 'matches' && (
        <CareerMatches
          onSelectCareer={handleSelectCareer}
          onBack={() => setCurrentPage('dashboard')}
          onProfile={() => setCurrentPage('profile')}
        />
      )}

      {currentPage === 'career-detail' && (
        <CareerDashboard
          careerId={selectedCareerId}
          onBack={() => setCurrentPage('matches')}
        />
      )}

      {currentPage === 'profile' && (
        <SmartProfile
          userName={userName || 'User'}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}

      {currentPage === 'skills-roadmap' && (
        <SkillsRoadmapPage
          onSkillSelect={handleSelectSkill}
          selectedView="list"
        />
      )}

      {currentPage === 'skill-detail' && selectedSkill && (
        <SkillDetailPage
          skill={selectedSkill}
          onBack={() => setCurrentPage('skills-roadmap')}
          onStartLearning={handleStartLearning}
          onSelectResource={handleSelectResource}
        />
      )}

      {currentPage === 'daily-learning' && selectedSkill && (
        <DailyRoadmapView
          skill={selectedSkill}
          onBack={() => setCurrentPage('skill-detail')}
          onComplete={() => {
            setCurrentPage('skill-detail');
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
          onBack={() => setCurrentPage('roadmap-catalog')}
          onStartLearning={() => {}}
          onSelectResource={handleSelectResource}
        />
      )}

      {currentPage === 'mega-catalog' && (
        <MegaCatalog
          onRoadmapSelect={handleSelectMegaRoadmap}
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
