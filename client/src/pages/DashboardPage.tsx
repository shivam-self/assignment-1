import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStats } from '../hooks/useUserStats';
import { useUsers } from '../hooks/useUsers';
import { UserInput, User } from '../types/user';
import { userApi } from '../api/userApi';
import { UserForm } from '../components/users/UserForm';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Plus,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
} from 'lucide-react';

// ─── Static sparkline data (decorative – backend has no time-series) ─────────
const SPARKLINES: Record<string, { path: string; color: string }> = {
  total: {
    path: 'M0,30 L10,25 L20,28 L30,20 L40,22 L50,15 L60,10 L70,8',
    color: '#7C3AED',
  },
  active: {
    path: 'M0,30 L10,22 L20,25 L30,15 L40,18 L50,10 L60,8 L70,5',
    color: '#10b981',
  },
  inactive: {
    path: 'M0,15 L10,18 L20,12 L30,20 L40,16 L50,22 L60,18 L70,25',
    color: '#ef4444',
  },
  recent: {
    path: 'M0,28 L10,20 L20,15 L30,8 L40,5 L50,10 L60,5 L70,2',
    color: '#7C3AED',
  },
};

// ─── Static registration trend data ──────────────────────────────────────────
const TREND_DATA = [
  { label: 'Oct 20', value: 1 },
  { label: 'Oct 21', value: 3 },
  { label: 'Oct 22', value: 6 },
  { label: 'Oct 23', value: 2 },
  { label: 'Oct 24', value: 4 },
  { label: 'Oct 25', value: 7 },
  { label: 'Oct 26', value: 8 },
];

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
const Sparkline: React.FC<{ path: string; color: string }> = ({ path, color }) => (
  <svg viewBox="0 0 70 35" className="w-20 h-10" fill="none">
    <defs>
      <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d={`${path} L70,35 L0,35 Z`}
      fill={`url(#sg-${color.replace('#', '')})`}
    />
    <polyline
      points={path.replace(/[ML]/g, '').trim().split(' ').join(',')}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Donut chart (uses real active/inactive from API) ─────────────────────────
const DonutChart: React.FC<{ active: number; inactive: number; total: number }> = ({
  active,
  inactive,
  total,
}) => {
  const r = 52;
  const cx = 70;
  const cy = 70;
  const circ = 2 * Math.PI * r;
  const activePct = total > 0 ? active / total : 0;
  const activeDash = activePct * circ;

  return (
    <svg viewBox="0 0 140 140" className="w-36 h-36">
      {/* Background ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="18"
        className="text-border"
      />
      {/* Active segment */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#10b981"
        strokeWidth="18"
        strokeDasharray={`${activeDash} ${circ - activeDash}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="butt"
      />
      {/* Inactive segment */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#ef4444"
        strokeWidth="18"
        strokeDasharray={`${circ - activeDash} ${activeDash}`}
        strokeDashoffset={circ * 0.25 - activeDash}
        strokeLinecap="butt"
      />
      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-text" fontSize="18" fontWeight="700">
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="fill-text-muted" fontSize="10">
        Total Users
      </text>
    </svg>
  );
};

// ─── Registration Trend Chart (static SVG) ───────────────────────────────────
const TrendChart: React.FC = () => {
  const max = Math.max(...TREND_DATA.map((d) => d.value));
  const w = 100;
  const h = 80;
  const pad = 8;
  const pts = TREND_DATA.map((d, i) => {
    const x = pad + (i / (TREND_DATA.length - 1)) * (w - pad * 2);
    const y = h - pad - (d.value / max) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const area = `M${pts.join(' L')} L${(w - pad).toFixed(1)},${h} L${pad},${h} Z`;
  const line = `M${pts.join(' L')}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#trend-grad)" />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="#7C3AED"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {TREND_DATA.map((d, i) => {
        const [x, y] = pts[i].split(',').map(Number);
        return (
          <circle key={i} cx={x} cy={y} r="2.5" fill="white" stroke="#7C3AED" strokeWidth="1.5" />
        );
      })}
    </svg>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  subtext: string;
  trend: string;
  trendUp: boolean;
  sparkKey: keyof typeof SPARKLINES;
  iconBg: string;
  icon: React.ReactNode;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  trend,
  trendUp,
  sparkKey,
  iconBg,
  icon,
  loading,
}) => {
  const { path, color } = SPARKLINES[sparkKey];
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:border-accent/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
        <div className="flex items-center gap-1 text-xs font-semibold">
          {trendUp ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-danger" />
          )}
          <span className={trendUp ? 'text-emerald-500' : 'text-danger'}>{trend}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          {loading ? (
            <div className="w-12 h-8 bg-border/40 rounded animate-pulse mb-1" />
          ) : (
            <p className="text-3xl font-extrabold text-text leading-none">{value}</p>
          )}
          <p className="text-xs text-text-muted mt-1.5">{subtext}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
          <Sparkline path={path} color={color} />
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
export const DashboardPage: React.FC = () => {
  const { stats, loading: statsLoading, error: statsError, refetch } = useUserStats();
  const { users, loading: usersLoading } = useUsers();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const recentUsers: User[] = users.slice(0, 5);
  const total = stats?.total ?? 0;
  const active = stats?.active ?? 0;
  const inactive = stats?.inactive ?? 0;
  const last7Days = stats?.last7Days ?? 0;

  const handleCreateUser = async (data: UserInput) => {
    await userApi.createUser(data);
    await refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Real-time user statistics powered by MongoDB aggregate.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={statsLoading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New User
          </Button>
        </div>
      </div>

      {/* Error */}
      {statsError && (
        <EmptyState
          type="error"
          title="Failed to load statistics"
          description={statsError}
          actionText="Retry"
          onAction={refetch}
        />
      )}

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={statsLoading ? '—' : total}
          subtext="Total registered accounts"
          trend="+12%"
          trendUp
          sparkKey="total"
          iconBg="bg-accent/10"
          icon={<Users className="w-5 h-5 text-accent" />}
          loading={statsLoading}
        />
        <StatCard
          label="Active Users"
          value={statsLoading ? '—' : active}
          subtext={total > 0 ? `${Math.round((active / total) * 100)}% of total users` : '—'}
          trend="+5%"
          trendUp
          sparkKey="active"
          iconBg="bg-emerald-500/10"
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          loading={statsLoading}
        />
        <StatCard
          label="Inactive Users"
          value={statsLoading ? '—' : inactive}
          subtext={total > 0 ? `${Math.round((inactive / total) * 100)}% inactive status` : '—'}
          trend="+10%"
          trendUp={false}
          sparkKey="inactive"
          iconBg="bg-danger/10"
          icon={<UserX className="w-5 h-5 text-danger" />}
          loading={statsLoading}
        />
        <StatCard
          label="Added Last 7 Days"
          value={statsLoading ? '—' : last7Days}
          subtext="New registrations"
          trend="+100%"
          trendUp
          sparkKey="recent"
          iconBg="bg-accent/10"
          icon={<Clock className="w-5 h-5 text-accent" />}
          loading={statsLoading}
        />
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Registration Trend (static) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-text">User Registrations</h3>
              <p className="text-xs text-text-muted">New user registrations in the last 7 days</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-border/40 text-text-muted">
              Last 7 Days
            </span>
          </div>
          {/* Chart */}
          <div className="h-40 w-full">
            <TrendChart />
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 px-2">
            {TREND_DATA.map((d) => (
              <span key={d.label} className="text-[10px] text-text-muted">
                {d.label}
              </span>
            ))}
          </div>
        </div>

        {/* Status Donut (real data) */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-text">User Status</h3>
              <p className="text-xs text-text-muted">Active vs inactive accounts</p>
            </div>
          </div>
          {statsLoading ? (
            <div className="flex items-center justify-center h-36">
              <div className="w-28 h-28 rounded-full border-8 border-border animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <DonutChart active={active} inactive={inactive} total={total} />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Active Users</p>
                    <p className="text-sm font-bold text-text">{active}</p>
                    <p className="text-[10px] text-emerald-600">
                      {total > 0 ? Math.round((active / total) * 100) : 0}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-danger shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Inactive Users</p>
                    <p className="text-sm font-bold text-text">{inactive}</p>
                    <p className="text-[10px] text-danger">
                      {total > 0 ? Math.round((inactive / total) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Bottom Row: Recent Users + Quick Actions ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Users (real data) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-text">Recent Users</h3>
              <p className="text-xs text-text-muted">Latest {recentUsers.length} registered users</p>
            </div>
            <button
              onClick={() => navigate('/users')}
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {usersLoading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-border/40" />
                  <div className="flex-1 space-y-1.5">
                    <div className="w-32 h-3 bg-border/40 rounded" />
                    <div className="w-48 h-2.5 bg-border/30 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">No users found.</div>
          ) : (
            <div>
              <div className="grid grid-cols-4 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted bg-border/10 border-b border-border">
                <span className="col-span-2">User</span>
                <span>Role</span>
                <span>Status</span>
              </div>
              {recentUsers.map((user) => {
                const initials = user.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();
                const colors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
                const avatarColor = colors[user.name.charCodeAt(0) % colors.length];
                return (
                  <div
                    key={user.id || user._id}
                    className="grid grid-cols-4 px-5 py-3 border-b border-border/50 last:border-0 hover:bg-border/10 transition-colors items-center"
                  >
                    <div className="col-span-2 flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full ${avatarColor} text-white text-xs font-bold flex items-center justify-center shrink-0`}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <Badge variant="role" role={user.role}>
                        {user.role}
                      </Badge>
                    </div>
                    <div>
                      <Badge variant="status" status={user.status}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <h3 className="text-base font-semibold text-text">Quick Actions</h3>
            </div>
            <p className="text-xs text-text-muted mt-0.5">Common tasks and shortcuts</p>
          </div>
          <div className="p-4 space-y-2">
            {/* Add New User — FUNCTIONAL */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-accent/40 hover:bg-accent/5 transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Add New User</p>
                  <p className="text-xs text-text-muted">Create a new user account</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </button>

            {/* View All Users — FUNCTIONAL */}
            <button
              onClick={() => navigate('/users')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-accent/40 hover:bg-accent/5 transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Manage Users</p>
                  <p className="text-xs text-text-muted">View and manage all users</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </button>

            {/* Settings — FUNCTIONAL */}
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-accent/40 hover:bg-accent/5 transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Theme Settings</p>
                  <p className="text-xs text-text-muted">Customise appearance</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <UserForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateUser}
        mode="create"
      />
    </div>
  );
};
