import React from 'react';
import { Users, SearchX, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  type?: 'no-users' | 'no-search-results' | 'error' | 'custom';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-users',
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  const configs = {
    'no-users': {
      icon: Users,
      defaultTitle: 'No users registered yet',
      defaultDesc: 'Get started by creating your very first user record.',
      defaultAction: 'Add User',
    },
    'no-search-results': {
      icon: SearchX,
      defaultTitle: 'No matching users found',
      defaultDesc: 'Try adjusting your search criteria or clearing filters.',
      defaultAction: 'Clear Search',
    },
    error: {
      icon: AlertCircle,
      defaultTitle: 'Something went wrong',
      defaultDesc: 'We encountered an error loading the data.',
      defaultAction: 'Try Again',
    },
    custom: {
      icon: Users,
      defaultTitle: 'Nothing here',
      defaultDesc: 'No content to display.',
      defaultAction: undefined,
    },
  }[type];

  const IconComponent = configs.icon;
  const displayTitle = title || configs.defaultTitle;
  const displayDesc = description || configs.defaultDesc;
  const displayAction = actionText || configs.defaultAction;

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl bg-surface border border-border border-dashed my-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-border/40 flex items-center justify-center text-text-muted mb-3.5">
        <IconComponent className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-text mb-1">{displayTitle}</h4>
      <p className="text-sm text-text-muted max-w-sm mb-5">{displayDesc}</p>
      {displayAction && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {displayAction}
        </Button>
      )}
    </div>
  );
};
