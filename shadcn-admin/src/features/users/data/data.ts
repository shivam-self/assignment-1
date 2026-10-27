import { Shield, UserCheck, Users, CreditCard } from 'lucide-react'
import { type UserStatus } from './schema'

export const callTypes = new Map<UserStatus, string>([
  ['active', 'bg-emerald-100/40 text-emerald-900 dark:text-emerald-300 border-emerald-300'],
  ['inactive', 'bg-neutral-200/50 text-neutral-800 dark:text-neutral-300 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const roles = [
  {
    label: 'Admin',
    value: 'admin',
    icon: Shield,
  },
  {
    label: 'Editor',
    value: 'editor',
    icon: UserCheck,
  },
  {
    label: 'Viewer',
    value: 'viewer',
    icon: Users,
  },
  {
    label: 'Superadmin',
    value: 'superadmin',
    icon: Shield,
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: Users,
  },
  {
    label: 'Cashier',
    value: 'cashier',
    icon: CreditCard,
  },
] as const
