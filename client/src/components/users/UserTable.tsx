import React from 'react';
import { User } from '../../types/user';
import { Badge } from '../ui/Badge';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-indigo-500',
];

function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(dateString?: string): { date: string; time: string } {
  if (!dateString) return { date: 'N/A', time: '' };
  try {
    const d = new Date(dateString);
    const date = d.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    const time = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { date, time };
  } catch {
    return { date: dateString, time: '' };
  }
}

export interface UserTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onView, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[700px]">
          {/* Header */}
          <thead>
            <tr className="border-b border-border bg-border/15">
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted w-8">
                <input type="checkbox" className="rounded border-border" aria-label="Select all" />
              </th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                User ↕
              </th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Role ↕
              </th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Phone ↕
              </th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Status ↕
              </th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Added On ↕
              </th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-border/60">
            {users.map((user) => {
              const avatarColor = getAvatarColor(user.name);
              const initials = getInitials(user.name);
              const { date, time } = formatDate(user.createdAt);

              return (
                <tr
                  key={user.id || user._id}
                  className="hover:bg-border/8 transition-colors group"
                >
                  {/* Checkbox */}
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-border"
                      aria-label={`Select ${user.name}`}
                    />
                  </td>

                  {/* User Name + Email with Avatar */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${avatarColor} text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-text truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <Badge variant="role" role={user.role}>
                      {user.role}
                    </Badge>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-4 text-sm text-text-muted">
                    {user.phone || (
                      <span className="italic text-xs opacity-50">Not set</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          user.status === 'active' ? 'bg-emerald-500' : 'bg-danger'
                        }`}
                      />
                      <Badge variant="status" status={user.status}>
                        {user.status}
                      </Badge>
                    </div>
                  </td>

                  {/* Added On */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-text">{date}</p>
                    <p className="text-xs text-text-muted">{time}</p>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => onView(user)}
                        aria-label={`View ${user.name}`}
                        title="View Details"
                        className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(user)}
                        aria-label={`Edit ${user.name}`}
                        title="Edit User"
                        className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-border/40 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        aria-label={`Delete ${user.name}`}
                        title="Delete User"
                        className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
