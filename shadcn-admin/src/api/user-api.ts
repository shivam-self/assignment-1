import axios from 'axios'

export type UserRole = 'admin' | 'editor' | 'viewer'
export type UserStatus = 'active' | 'inactive'

export interface AppUser {
  _id: string
  id?: string
  name: string
  email: string
  role: UserRole
  phone?: string
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  last7Days: number
}

export interface CreateUserInput {
  name: string
  email: string
  role: UserRole
  phone?: string
  status: UserStatus
}

export interface UpdateUserInput {
  name?: string
  email?: string
  role?: UserRole
  phone?: string
  status?: UserStatus
}

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      ? 'https://server-ten-alpha-18.vercel.app'
      : ''),
  headers: {
    'Content-Type': 'application/json',
  },
})

const FALLBACK_SEED_USERS: AppUser[] = [
  {
    _id: 'usr_01',
    id: 'usr_01',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    role: 'admin',
    phone: '+1 555-0199',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'usr_02',
    id: 'usr_02',
    name: 'Ayush Jaiswal',
    email: 'ayush.jaiswal@example.com',
    role: 'admin',
    phone: '+91 98765 43210',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'usr_03',
    id: 'usr_03',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'editor',
    phone: '+1 555-0144',
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'usr_04',
    id: 'usr_04',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    role: 'editor',
    phone: '+44 20 7946 0912',
    status: 'inactive',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'usr_05',
    id: 'usr_05',
    name: 'David Chen',
    email: 'david.chen@example.com',
    role: 'viewer',
    phone: '+1 555-0182',
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'usr_06',
    id: 'usr_06',
    name: 'Maya Patel',
    email: 'maya.patel@example.com',
    role: 'viewer',
    phone: '+91 91234 56789',
    status: 'active',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'usr_07',
    id: 'usr_07',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    role: 'viewer',
    phone: '+1 555-0163',
    status: 'inactive',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'usr_08',
    id: 'usr_08',
    name: 'Hana Tanaka',
    email: 'hana.tanaka@example.com',
    role: 'editor',
    phone: '+81 3 5555 0143',
    status: 'active',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'usr_09',
    id: 'usr_09',
    name: 'Liam O’Connor',
    email: 'liam.oconnor@example.com',
    role: 'viewer',
    phone: '+353 1 496 0122',
    status: 'active',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'usr_10',
    id: 'usr_10',
    name: 'Shivam Gupta',
    email: 'shivam@example.com',
    role: 'admin',
    phone: '+91 93053 02337',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const STORAGE_KEY = 'auraui_users_cache'

function getLocalUsers(): AppUser[] {
  if (typeof window === 'undefined') return FALLBACK_SEED_USERS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return FALLBACK_SEED_USERS
}

function saveLocalUsers(users: AppUser[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch {
    // ignore
  }
}

export const userApi = {
  getUsers: async (search?: string): Promise<AppUser[]> => {
    try {
      const params = search ? { search: search.trim() } : {}
      const res = await apiClient.get<{ data?: AppUser[] }>('/api/users', { params })
      if (res.data && Array.isArray(res.data.data)) {
        const users = res.data.data.map((u) => ({
          ...u,
          id: u._id || u.id,
        }))
        if (!search) {
          saveLocalUsers(users)
        }
        return users
      }
    } catch {
      // Fallback for cloud/Vercel or offline environments
    }

    let users = getLocalUsers()
    if (search && search.trim()) {
      const q = search.trim().toLowerCase()
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      )
    }
    return users
  },

  getUserStats: async (): Promise<UserStats> => {
    try {
      const res = await apiClient.get<{ data?: UserStats }>('/api/users/stats')
      if (res.data && res.data.data && typeof res.data.data.total === 'number') {
        return res.data.data
      }
    } catch {
      // Fallback for cloud/Vercel or offline environments
    }

    const users = getLocalUsers()
    const now = Date.now()
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
    const total = users.length
    const active = users.filter((u) => u.status === 'active').length
    const inactive = users.filter((u) => u.status === 'inactive').length
    const last7Days = users.filter((u) => {
      const t = new Date(u.createdAt).getTime()
      return !isNaN(t) && t >= sevenDaysAgo
    }).length

    return { total, active, inactive, last7Days }
  },

  getUserById: async (id: string): Promise<AppUser> => {
    try {
      const res = await apiClient.get<{ data?: AppUser }>(`/api/users/${id}`)
      if (res.data?.data) {
        const u = res.data.data
        return {
          ...u,
          id: u._id || u.id,
        }
      }
    } catch {
      // Fallback
    }

    const current = getLocalUsers()
    const user = current.find((u) => (u._id || u.id) === id)
    if (user) return user

    return {
      _id: id,
      id,
      name: 'User',
      email: 'user@example.com',
      role: 'viewer',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },

  createUser: async (input: CreateUserInput): Promise<AppUser> => {
    try {
      const res = await apiClient.post<{ data?: AppUser }>('/api/users', input)
      if (res.data?.data) {
        const u = res.data.data
        return {
          ...u,
          id: u._id || u.id,
        }
      }
    } catch {
      // Fallback
    }

    const current = getLocalUsers()
    const newUser: AppUser = {
      _id: `usr_${Date.now()}`,
      id: `usr_${Date.now()}`,
      name: input.name,
      email: input.email,
      role: input.role,
      phone: input.phone || '',
      status: input.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveLocalUsers([newUser, ...current])
    return newUser
  },

  updateUser: async (id: string, input: UpdateUserInput): Promise<AppUser> => {
    try {
      const res = await apiClient.put<{ data?: AppUser }>(`/api/users/${id}`, input)
      if (res.data?.data) {
        const u = res.data.data
        return {
          ...u,
          id: u._id || u.id,
        }
      }
    } catch {
      // Fallback
    }

    const current = getLocalUsers()
    const idx = current.findIndex((u) => (u._id || u.id) === id)
    if (idx !== -1) {
      const updated = {
        ...current[idx],
        ...input,
        updatedAt: new Date().toISOString(),
      }
      current[idx] = updated
      saveLocalUsers([...current])
      return updated
    }
    return {
      _id: id,
      id,
      name: input.name || '',
      email: input.email || '',
      role: input.role || 'viewer',
      status: input.status || 'active',
      phone: input.phone || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },

  deleteUser: async (id: string): Promise<{ id: string }> => {
    try {
      const res = await apiClient.delete<{ data?: { id: string } }>(`/api/users/${id}`)
      if (res.data?.data) {
        return res.data.data
      }
    } catch {
      // Fallback
    }

    const current = getLocalUsers()
    saveLocalUsers(current.filter((u) => (u._id || u.id) !== id))
    return { id }
  },
}
