import React, { useRef, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  userName?: string;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete User',
  userName,
  isLoading = false,
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus lands on Cancel by default when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <>
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-full bg-danger/10 text-danger shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-text">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{userName || 'this user'}</span>?
          </p>
          <p className="text-xs text-text-muted">
            This action cannot be undone. All data associated with this user will be permanently removed.
          </p>
        </div>
      </div>
    </Modal>
  );
};
