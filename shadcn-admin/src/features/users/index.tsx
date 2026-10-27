import { getRouteApi } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/api/user-api'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { type User } from './data/schema'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await userApi.getUsers()
      return data.map((u) => {
        const nameParts = (u.name || '').trim().split(' ')
        const firstName = nameParts[0] || u.name || 'User'
        const lastName = nameParts.slice(1).join(' ') || ''
        const username = u.email
          ? u.email.split('@')[0]
          : (u.name || '').toLowerCase().replace(/\s+/g, '')

        return {
          id: u._id || u.id || '',
          username,
          firstName,
          lastName,
          email: u.email,
          phoneNumber: u.phone || '',
          status: u.status,
          role: u.role,
          createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
          updatedAt: u.updatedAt ? new Date(u.updatedAt) : new Date(),
        }
      })
    },
  })

  return (
    <UsersProvider>
      <Header fixed>
        <Search className='me-auto' />
        <div className='flex items-center space-x-4'>
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-sm text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>

        {error ? (
          <div className='rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive'>
            Failed to load users from server. Please ensure the backend is running.
          </div>
        ) : isLoading ? (
          <div className='space-y-4'>
            <div className='h-10 w-48 bg-muted rounded animate-pulse' />
            <div className='h-64 rounded-md border bg-muted/20 animate-pulse' />
          </div>
        ) : (
          <UsersTable data={users} search={search} navigate={navigate} />
        )}
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
