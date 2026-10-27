'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { userApi, type CreateUserInput, type UpdateUserInput } from '@/api/user-api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { type User } from '../data/schema'

const roleItems = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
]

const statusItems = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long.')
    .max(80, 'Name cannot exceed 80 characters.')
    .trim(),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Please provide a valid email address.'),
  role: z.enum(['admin', 'editor', 'viewer']),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => {
      if (!v) return true
      const digits = v.replace(/\D/g, '')
      return digits.length >= 7 && digits.length <= 15
    }, 'Phone number must contain between 7 and 15 digits.'),
  status: z.enum(['active', 'inactive']),
})

type UserFormValues = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'viewer',
      phone: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (open) {
      setServerError(null)
      if (currentRow) {
        const fullName = `${currentRow.firstName} ${currentRow.lastName}`.trim() || currentRow.username
        form.reset({
          name: fullName,
          email: currentRow.email || '',
          role: (currentRow.role as 'admin' | 'editor' | 'viewer') || 'viewer',
          phone: currentRow.phoneNumber || '',
          status: (currentRow.status as 'active' | 'inactive') || 'active',
        })
      } else {
        form.reset({
          name: '',
          email: '',
          role: 'viewer',
          phone: '',
          status: 'active',
        })
      }
    }
  }, [open, currentRow, form])

  const onSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      if (isEdit && currentRow) {
        const updateData: UpdateUserInput = {
          name: values.name,
          email: values.email,
          role: values.role,
          phone: values.phone || undefined,
          status: values.status,
        }
        await userApi.updateUser(currentRow.id, updateData)
        toast.success(`User "${values.name}" updated successfully.`)
      } else {
        const createData: CreateUserInput = {
          name: values.name,
          email: values.email,
          role: values.role,
          phone: values.phone || undefined,
          status: values.status,
        }
        await userApi.createUser(createData)
        toast.success(`User "${values.name}" created successfully.`)
      }

      await queryClient.invalidateQueries({ queryKey: ['users'] })
      await queryClient.invalidateQueries({ queryKey: ['user-stats'] })
      onOpenChange(false)
    } catch (err: any) {
      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        'An error occurred while saving the user.'
      setServerError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update user record and account status here. Click save when you are done.'
              : 'Enter user details below to register a new user account. Click save when you are done.'}
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <div className='p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium'>
            {serverError}
          </div>
        )}

        <Form {...form}>
          <form
            id='user-action-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 py-2'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. Liam O Connor'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='name@example.com'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select role'
                      items={roleItems}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Status *</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select status'
                      items={statusItems}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. +1 555-0123'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            form='user-action-form'
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className='me-2 h-4 w-4 animate-spin' />}
            {isEdit ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
