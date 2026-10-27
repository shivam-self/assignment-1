import React, { useState, useEffect } from 'react';
import { User, UserInput, UserRole, UserStatus } from '../../types/user';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ApiError } from '../../api/http';

export interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserInput) => Promise<void>;
  initialUser?: User | null;
  mode?: 'create' | 'edit';
}

const DEFAULT_FORM_VALUES: UserInput = {
  name: '',
  email: '',
  role: 'viewer',
  phone: '',
  status: 'active',
};

const roleOptions = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialUser,
  mode = 'create',
}) => {
  const [formData, setFormData] = useState<UserInput>(DEFAULT_FORM_VALUES);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialUser && mode === 'edit') {
      setFormData({
        name: initialUser.name || '',
        email: initialUser.email || '',
        role: initialUser.role || 'viewer',
        phone: initialUser.phone || '',
        status: initialUser.status || 'active',
      });
    } else {
      setFormData(DEFAULT_FORM_VALUES);
    }
    setFieldErrors({});
    setGeneralError(null);
  }, [initialUser, mode, isOpen]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      errors.name = 'Name is required';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (trimmedName.length > 80) {
      errors.name = 'Name cannot exceed 80 characters';
    }

    // Email validation
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional)
    if (formData.phone && formData.phone.trim() !== '') {
      const digits = formData.phone.replace(/\D/g, '');
      const validPhoneChars = /^[0-9+\s\-()]+$/;
      if (!validPhoneChars.test(formData.phone) || digits.length < 7 || digits.length > 15) {
        errors.phone = 'Phone number must contain between 7 and 15 digits';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (field: keyof UserInput) => {
    if (field === 'name') {
      const trimmed = formData.name.trim();
      if (!trimmed) {
        setFieldErrors((prev) => ({ ...prev, name: 'Name is required' }));
      } else if (trimmed.length < 2) {
        setFieldErrors((prev) => ({ ...prev, name: 'Name must be at least 2 characters long' }));
      } else {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.name;
          return next;
        });
      }
    } else if (field === 'email') {
      const trimmed = formData.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmed) {
        setFieldErrors((prev) => ({ ...prev, email: 'Email is required' }));
      } else if (!emailRegex.test(trimmed)) {
        setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.email;
          return next;
        });
      }
    }
  };

  const handleChange = (field: keyof UserInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field once user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        phone: formData.phone?.trim() || undefined,
        status: formData.status,
      });
      onClose();
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.fields) {
          // Map backend errors (e.g. 409 duplicate email) directly to matching fields
          setFieldErrors(err.fields);
        } else {
          setGeneralError(err.message);
        }
      } else {
        setGeneralError('An unexpected error occurred while saving the user.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add New User' : 'Edit User Profile'}
      description={
        mode === 'create'
          ? 'Enter the details below to register a new user account.'
          : `Editing profile information for ${initialUser?.name || 'user'}.`
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {mode === 'create' ? 'Create User' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {generalError && (
          <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs">
            {generalError}
          </div>
        )}

        <Input
          label="Full Name"
          required
          placeholder="e.g. Sarah Connor"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          error={fieldErrors.name}
          disabled={isSubmitting}
        />

        <Input
          label="Email Address"
          type="email"
          required
          placeholder="name@company.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          error={fieldErrors.email}
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Role"
            value={formData.role}
            options={roleOptions}
            onChange={(e) => handleChange('role', e.target.value as UserRole)}
            disabled={isSubmitting}
          />

          <Select
            label="Account Status"
            value={formData.status}
            options={statusOptions}
            onChange={(e) => handleChange('status', e.target.value as UserStatus)}
            disabled={isSubmitting}
          />
        </div>

        <Input
          label="Phone Number (Optional)"
          type="tel"
          placeholder="+1 555-0199"
          value={formData.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={fieldErrors.phone}
          helperText="Include country code if applicable"
          disabled={isSubmitting}
        />
      </form>
    </Modal>
  );
};
