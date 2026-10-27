import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/api/user-api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

function getInitials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'
  )
}

export function RecentSales() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['recent-users-dashboard'],
    queryFn: async () => {
      try {
        return await userApi.getUsers()
      } catch {
        return []
      }
    },
  })

  const recentUsers = users.slice(0, 5)

  if (isLoading) {
    return (
      <div className='space-y-6'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='flex items-center gap-4 animate-pulse'>
            <div className='h-9 w-9 rounded-full bg-muted' />
            <div className='flex-1 space-y-1.5'>
              <div className='h-3.5 w-28 bg-muted rounded' />
              <div className='h-3 w-40 bg-muted/60 rounded' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (recentUsers.length === 0) {
    return (
      <div className='py-6 text-center text-sm text-muted-foreground'>
        No users registered yet.
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {recentUsers.map((user) => (
        <div key={user._id || user.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback className='text-xs font-semibold'>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between gap-2 min-w-0'>
            <div className='space-y-1 min-w-0'>
              <p className='text-sm leading-none font-medium truncate'>
                {user.name}
              </p>
              <p className='text-xs text-muted-foreground truncate'>
                {user.email}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='text-xs capitalize font-medium'>
                {user.role}
              </Badge>
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  user.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'
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
