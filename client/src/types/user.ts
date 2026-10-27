export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status: UserStatus;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  last7Days: number;
}
