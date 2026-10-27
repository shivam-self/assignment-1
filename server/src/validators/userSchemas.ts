import { z } from 'zod';

const phoneRegex = /^[0-9+\s\-()]+$/;

export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(80, 'Name cannot exceed 80 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Enter a valid email address'),
  role: z
    .enum(['admin', 'editor', 'viewer'], {
      errorMap: () => ({ message: 'Role must be admin, editor, or viewer' }),
    })
    .default('viewer'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const digits = val.replace(/\D/g, '');
        return phoneRegex.test(val) && digits.length >= 7 && digits.length <= 15;
      },
      { message: 'Phone number must contain between 7 and 15 digits' }
    ),
  status: z
    .enum(['active', 'inactive'], {
      errorMap: () => ({ message: 'Status must be active or inactive' }),
    })
    .default('active'),
});

export const updateUserSchema = createUserSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
