import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAdminDashboard, getAdminUsers, updateUserRole, getAssessmentAnalytics } from '../../services/admin';
import type { AdminStats, AdminUser } from '../../services/admin';
import { CardSkeleton, TableRowSkeleton } from '../components/Skeleton';

interface AdminDashboardProps {
  onBack: () => void;
}

type AdminTab = 'overview' | 'users' | 'assessments';

const STAT_CARDS = [
  { key: 'totalUsers', label: 'Total Users', color: 'text-indigo-300', icon: '👥', bg: 'from-indigo-500/10 to-indigo-500/5' },
  { key: 'activeUsers', label: 'Active (7d)', color: 'text-green-300', icon: '🟢', bg: 'from-green-500/10 to-green-500/5' },
  { key: 'roadmapCount', label: 'Roadmaps', color: 'text-cyan-300', icon: '🗺️', bg: 'from-cyan-500/10 to-cyan-500/5' },
  { key: 'skillCount', label: 'Skills', color: 'text-purple-300', icon: '⚡', bg: 'from-purple-500/10 to-purple-500/5' },
  { key: 'assessmentCount', label: 'Assessments', color: 'text-amber-300', icon: '📝', bg: 'from-amber-500/10 to-amber-500/5' },
  { key: 'resourceCount', label: 'Resources', color: 'text-pink-300', icon: '📚', bg: 'from-pink-500/10 to-pink-500/5' },
] as const;

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminDashboard();
        setStats(data);
      } catch (err) {
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      setUsersLoading(true);
      getAdminUsers()
        .then(setUsers)
        .catch(() => toast.error('Failed to load users'))
        .finally(() => setUsersLoading(false));
    }
    if (activeTab === 'assessments' && assessments.length === 0) {
      setAssessmentsLoading(true);
      getAssessmentAnalytics()
        .then(setAssessments)
        .catch(() => toast.error('Failed to load assessment analytics'))
        .finally(() => setAssessmentsLoading(false));
    }
  }, [activeTab]);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    setRoleUpdating(userId);
    try {
      const updated = await updateUserRole(userId, newRole as 'USER' | 'ADMIN');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: updated.role } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    } finally {
      setRoleUpdating(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TABS: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'assessments', label: 'Assessments', icon: '📝' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0f1629]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl">
              🛡️
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-400">Pragyan Management Console</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl w-fit border border-white/10">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Platform Analytics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                  : STAT_CARDS.map(card => (
                    <div
                      key={card.key}
                      className={`rounded-2xl bg-gradient-to-br ${card.bg} border border-white/10 p-6 transition-all hover:border-white/20`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-400">{card.label}</p>
                        <span className="text-2xl">{card.icon}</span>
                      </div>
                      <h3 className={`text-4xl font-bold ${card.color}`}>
                        {stats?.[card.key] ?? 0}
                      </h3>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    👥
                  </div>
                  <div>
                    <div className="font-semibold text-white">Manage Users</div>
                    <div className="text-xs text-gray-400">View and update roles</div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('assessments')}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📝
                  </div>
                  <div>
                    <div className="font-semibold text-white">Assessments</div>
                    <div className="text-xs text-gray-400">View completion data</div>
                  </div>
                </button>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-left">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">
                    📈
                  </div>
                  <div>
                    <div className="font-semibold text-white">Activity Rate</div>
                    <div className="text-xs text-gray-400">
                      {stats ? `${Math.round((stats.activeUsers / Math.max(1, stats.totalUsers)) * 100)}% of users active` : 'Loading...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="space-y-4">
                  {[
                    { label: 'API Server', status: 'Operational', color: 'text-green-400' },
                    { label: 'MongoDB Database', status: 'Connected', color: 'text-green-400' },
                    { label: 'JWT Auth', status: 'Active', color: 'text-green-400' },
                    { label: 'Assessment Engine', status: `${stats?.assessmentCount ?? 0} sessions recorded`, color: 'text-indigo-400' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-gray-300 text-sm">{item.label}</span>
                      <span className={`text-sm font-medium ${item.color} flex items-center gap-2`}>
                        <span className="w-2 h-2 rounded-full bg-current inline-block animate-pulse" />
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-lg font-semibold text-white">
                All Users {!usersLoading && <span className="text-gray-400 text-sm ml-2">({filteredUsers.length})</span>}
              </h2>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/60 w-72"
              />
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    {['Name', 'Email', 'Role', 'XP', 'Streak', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersLoading
                    ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                    : filteredUsers.map(user => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-white">{user.fullName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-cyan-400 font-semibold">{Math.round(user.xp)}</td>
                        <td className="px-4 py-3 text-sm text-yellow-400">🔥 {user.streak}d</td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleRoleToggle(user.id, user.role)}
                            disabled={roleUpdating === user.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {roleUpdating === user.id ? '...' : user.role === 'ADMIN' ? 'Demote' : 'Promote'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  {!usersLoading && filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-gray-500 text-sm">
                        No users found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ASSESSMENTS TAB */}
        {activeTab === 'assessments' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">
              Assessment Analytics{' '}
              {!assessmentsLoading && <span className="text-gray-400 text-sm ml-2">({assessments.length} sessions)</span>}
            </h2>

            {assessmentsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      {['Session ID', 'User ID', 'Options Selected', 'Completed At'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map(a => (
                      <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{a.id.slice(-8)}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{a.userId?.slice(-8)}</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {a.selectedOptions?.length ?? 0} options
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {new Date(a.completedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {assessments.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-gray-500 text-sm">
                          No assessment sessions recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary Cards */}
            {!assessmentsLoading && assessments.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <p className="text-sm text-gray-400 mb-1">Total Sessions</p>
                  <p className="text-3xl font-bold text-indigo-300">{assessments.length}</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <p className="text-sm text-gray-400 mb-1">Avg. Options/Session</p>
                  <p className="text-3xl font-bold text-amber-300">
                    {Math.round(assessments.reduce((acc, a) => acc + (a.selectedOptions?.length ?? 0), 0) / assessments.length)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <p className="text-sm text-gray-400 mb-1">Last 7 Days</p>
                  <p className="text-3xl font-bold text-green-300">
                    {assessments.filter(a => {
                      const d = new Date(a.completedAt);
                      const week = new Date();
                      week.setDate(week.getDate() - 7);
                      return d >= week;
                    }).length}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
