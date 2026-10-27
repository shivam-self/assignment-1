import React, { useState, useMemo } from 'react';
import { useUsers } from '../hooks/useUsers';
import { User, UserInput } from '../types/user';
import { userApi } from '../api/userApi';
import { useUserStats } from '../hooks/useUserStats';
import { UserTable } from '../components/users/UserTable';
import { UserForm } from '../components/users/UserForm';
import { UserDetail } from '../components/users/UserDetail';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import {
  Plus,
  Search,
  RefreshCw,
  X,
  Users,
  UserCheck,
  UserX,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PAGE_SIZE = 7;

// ─── Mini Stat Strip ─────────────────────────────────────────────────────────
interface MiniStatProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number | string;
  trend: string;
  trendUp: boolean;
  loading?: boolean;
}
const MiniStat: React.FC<MiniStatProps> = ({
  icon,
  iconBg,
  label,
  value,
  trend,
  trendUp,
  loading,
}) => (
  <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-text-muted font-medium">{label}</p>
      {loading ? (
        <div className="w-10 h-5 bg-border/40 rounded animate-pulse mt-0.5" />
      ) : (
        <p className="text-xl font-bold text-text leading-tight">{value}</p>
      )}
    </div>
    <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-emerald-500' : 'text-danger'}`}>
      {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
      {trend}
    </div>
  </div>
);

// ─── Main Users Page ──────────────────────────────────────────────────────────
export const UsersPage: React.FC = () => {
  const { users, loading, error, search, setSearch, refetch, createUser, updateUser, deleteUser } =
    useUsers();
  const { stats, loading: statsLoading } = useUserStats();

  const [currentPage, setCurrentPage] = useState(1);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const pagedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  }, [users, currentPage]);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Modal state
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    user: User | null;
  }>({ isOpen: false, mode: 'create', user: null });

  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    user: User | null;
    isDeleting: boolean;
  }>({ isOpen: false, user: null, isDeleting: false });

  // Handlers
  const openCreate = () => setFormModal({ isOpen: true, mode: 'create', user: null });
  const openEdit = (u: User) => setFormModal({ isOpen: true, mode: 'edit', user: u });

  const openView = async (u: User) => {
    const id = u.id || u._id;
    if (!id) return;
    try {
      const fresh = await userApi.getUserById(id);
      setDetailModal({ isOpen: true, user: fresh });
    } catch {
      setDetailModal({ isOpen: true, user: null });
    }
  };

  const openDelete = (u: User) =>
    setDeleteModal({ isOpen: true, user: u, isDeleting: false });

  const handleConfirmDelete = async () => {
    if (!deleteModal.user) return;
    const id = deleteModal.user.id || deleteModal.user._id;
    if (!id) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      await deleteUser(id);
      setDeleteModal({ isOpen: false, user: null, isDeleting: false });
    } catch {
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleFormSubmit = async (data: UserInput) => {
    if (formModal.mode === 'create') {
      await createUser(data);
    } else if (formModal.user) {
      const id = formModal.user.id || formModal.user._id;
      if (id) await updateUser(id, data);
    }
  };

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">User Management</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Maintain user records, assign roles, and track active statuses.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add New User
        </Button>
      </div>

      {/* ─── Mini Stats ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat
          icon={<Users className="w-5 h-5 text-accent" />}
          iconBg="bg-accent/10"
          label="Total Users"
          value={stats?.total ?? '—'}
          trend="+12%"
          trendUp
          loading={statsLoading}
        />
        <MiniStat
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-500/10"
          label="Active Users"
          value={stats?.active ?? '—'}
          trend="+5%"
          trendUp
          loading={statsLoading}
        />
        <MiniStat
          icon={<UserX className="w-5 h-5 text-danger" />}
          iconBg="bg-danger/10"
          label="Inactive Users"
          value={stats?.inactive ?? '—'}
          trend="+10%"
          trendUp={false}
          loading={statsLoading}
        />
        <MiniStat
          icon={<Clock className="w-5 h-5 text-accent" />}
          iconBg="bg-accent/10"
          label="Added Last 7 Days"
          value={stats?.last7Days ?? '—'}
          trend="+100%"
          trendUp
          loading={statsLoading}
        />
      </div>

      {/* ─── Search & Filter Bar ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-surface border border-border rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Spacer + count + refresh */}
        <div className="flex items-center gap-3 sm:ml-auto">
          <span className="text-sm text-text-muted">
            Showing{' '}
            <span className="font-semibold text-text">
              {Math.min((currentPage - 1) * PAGE_SIZE + 1, users.length)}–
              {Math.min(currentPage * PAGE_SIZE, users.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-text">{users.length}</span> users
          </span>
          <button
            onClick={() => refetch()}
            disabled={loading}
            title="Refresh"
            className="p-2 rounded-xl border border-border text-text-muted hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ─── Error ─── */}
      {error && (
        <EmptyState
          type="error"
          title="Failed to load users"
          description={error}
          actionText="Retry"
          onAction={() => refetch()}
        />
      )}

      {/* ─── Loading Skeleton ─── */}
      {loading && users.length === 0 && (
        <div className="bg-surface border border-border rounded-2xl p-8 space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-border/40 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-border/40 rounded w-32" />
                <div className="h-3 bg-border/30 rounded w-48" />
              </div>
              <div className="h-6 w-16 bg-border/30 rounded-full" />
              <div className="h-6 w-16 bg-border/30 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* ─── Empty States ─── */}
      {!loading && !error && users.length === 0 && (
        <>
          {search ? (
            <EmptyState
              type="no-search-results"
              title="No users match your search"
              description={`No users found matching "${search}". Try adjusting your query.`}
              actionText="Clear Search"
              onAction={() => setSearch('')}
            />
          ) : (
            <EmptyState
              type="no-users"
              title="No users yet"
              description="Add your first user to get started."
              actionText="Add New User"
              onAction={openCreate}
            />
          )}
        </>
      )}

      {/* ─── Table ─── */}
      {!error && users.length > 0 && (
        <>
          <UserTable
            users={pagedUsers}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          {/* ─── Pagination ─── */}
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-text-muted">
              Showing{' '}
              <span className="font-semibold text-text">
                {Math.min((currentPage - 1) * PAGE_SIZE + 1, users.length)} to{' '}
                {Math.min(currentPage * PAGE_SIZE, users.length)}
              </span>{' '}
              of <span className="font-semibold text-text">{users.length}</span> users
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border text-text-muted hover:text-text hover:bg-border/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-accent text-white shadow-sm'
                      : 'border border-border text-text-muted hover:text-text hover:bg-border/30'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border text-text-muted hover:text-text hover:bg-border/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Modals ─── */}
      <UserForm
        isOpen={formModal.isOpen}
        onClose={() => setFormModal((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleFormSubmit}
        initialUser={formModal.user}
        mode={formModal.mode}
      />
      <UserDetail
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, user: null })}
        user={detailModal.user}
        onEdit={(u) => {
          setDetailModal({ isOpen: false, user: null });
          openEdit(u);
        }}
      />
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null, isDeleting: false })}
        onConfirm={handleConfirmDelete}
        userName={deleteModal.user?.name}
        isLoading={deleteModal.isDeleting}
      />
    </div>
  );
};
