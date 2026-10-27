'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userApi } from '@/api/user-api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()
  const userName = `${currentRow.firstName} ${currentRow.lastName}`.trim() || currentRow.username

  const handleDelete = async () => {
    if (value.trim().toLowerCase() !== userName.toLowerCase()) return

    setIsDeleting(true)
    try {
      await userApi.deleteUser(currentRow.id)
      toast.success(`User "${userName}" deleted successfully.`)
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      await queryClient.invalidateQueries({ queryKey: ['user-stats'] })
      onOpenChange(false)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Failed to delete user.'
      toast.error(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  const isMatched = value.trim().toLowerCase() === userName.toLowerCase()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='users-delete-form'
      disabled={!isMatched || isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete User
        </span>
      }
      desc={
        <form
          id='users-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{userName}</span> ({currentRow.email})?
            <br />
            This action will permanently remove this user account.
          </p>

          <Label className='my-2'>
            Type user name <span className='font-bold'>{userName}</span> to confirm:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter "${userName}"`}
              className='mt-1.5'
              autoFocus
            />
          </Label>
        </form>
      }
      confirmText={
        isDeleting ? (
          <span className='flex items-center gap-1.5'>
            <Loader2 className='h-4 w-4 animate-spin' /> Deleting...
          </span>
        ) : (
          'Delete User'
        )
      }
      destructive
    />
  )
}
