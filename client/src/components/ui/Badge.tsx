import React from 'react';
import { UserRole, UserStatus } from '../../types/user';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'role' | 'status';
  role?: UserRole;
  status?: UserStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  role,
  status,
  className = '',
}) => {
  let badgeStyle = 'bg-surface border border-border text-text';

  if (variant === 'role' && role) {
    if (role === 'admin') {
      badgeStyle = 'bg-accent/15 border-accent/30 text-accent font-semibold';
    } else if (role === 'editor') {
      badgeStyle = 'bg-border/60 text-text font-medium';
    } else {
      badgeStyle = 'bg-surface border border-border text-text-muted';
    }
  } else if (variant === 'status' && status) {
    if (status === 'active') {
      badgeStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium';
    } else {
      badgeStyle = 'bg-danger/10 border-danger/30 text-danger font-medium';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border uppercase tracking-wider ${badgeStyle} ${className}`}
    >
      {children}
    </span>
  );
};
