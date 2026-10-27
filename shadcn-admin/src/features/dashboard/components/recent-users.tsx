import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { type AppUser } from '@/api/user-api'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'
}

type RecentUsersProps = {
  users: AppUser[]
  isLoading?: boolean
}

export function RecentUsers({ users, isLoading }: RecentUsersProps) {
  if (isLoading) {
    return (
      <div className='space-y-6'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='flex items-center gap-4 animate-pulse'>
            <div className='h-9 w-9 rounded-full bg-muted' />
            <div className='space-y-1.5 flex-1'>
              <div className='h-3.5 w-24 bg-muted rounded' />
              <div className='h-3 w-36 bg-muted rounded' />
            </div>
            <div className='h-5 w-14 bg-muted rounded' />
          </div>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className='text-sm text-muted-foreground py-8 text-center'>
        No users found.
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {users.map((user) => (
        <div key={user._id || user.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback className='bg-primary/10 text-primary font-medium text-xs'>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between gap-2'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>{user.name}</p>
              <p className='text-xs text-muted-foreground'>{user.email}</p>
            </div>
            <div className='flex items-center gap-2'>
              <Badge
                variant='outline'
                className='text-[10px] capitalize font-medium py-0 px-2'
              >
                {user.role}
              </Badge>
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  user.status === 'active' ? 'bg-emerald-500' : 'bg-destructive'
                }`}
                title={user.status}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
