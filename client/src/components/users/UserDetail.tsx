import React from 'react';
import { User } from '../../types/user';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Mail, Phone, Calendar, Shield, Activity, User as UserIcon } from 'lucide-react';

export interface UserDetailProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onEdit?: (user: User) => void;
}

export const UserDetail: React.FC<UserDetailProps> = ({
  isOpen,
  onClose,
  user,
  onEdit,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'User Details' : 'User Not Found'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {user && onEdit && (
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onEdit(user);
              }}
            >
              Edit User
            </Button>
          )}
        </>
      }
    >
      {!user ? (
        <div className="py-6 text-center text-text-muted">
          <p className="text-sm font-medium">Unable to find user information.</p>
          <p className="text-xs mt-1">The requested user record may have been deleted or does not exist.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header avatar / name */}
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-xl uppercase">
              {user.name.substring(0, 2)}
            </div>
            <div>
              <h4 className="text-lg font-bold text-text">{user.name}</h4>
              <p className="text-xs text-text-muted font-mono">ID: {user.id || user._id}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted">Email Address</p>
                <p className="font-medium text-text select-all">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted">Phone Number</p>
                <p className="font-medium text-text">{user.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted">Role</p>
                <div className="mt-0.5">
                  <Badge variant="role" role={user.role}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Activity className="w-4 h-4 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted">Status</p>
                <div className="mt-0.5">
                  <Badge variant="status" status={user.status}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted">Registered On</p>
                <p className="font-medium text-text">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <UserIcon className="w-4 h-4 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted">Last Updated</p>
                <p className="font-medium text-text">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
