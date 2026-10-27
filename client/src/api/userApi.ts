import { http } from './http';
import { User, UserInput, UserStats } from '../types/user';

export const userApi = {
  getUsers: (search?: string): Promise<User[]> => {
    const params = search ? `?search=${encodeURIComponent(search.trim())}` : '';
    return http.get<User[]>(`/api/users${params}`);
  },

  getUserStats: (): Promise<UserStats> => {
    return http.get<UserStats>('/api/users/stats');
  },

  getUserById: (id: string): Promise<User> => {
    return http.get<User>(`/api/users/${id}`);
  },

  createUser: (userData: UserInput): Promise<User> => {
    return http.post<User>('/api/users', userData);
  },

  updateUser: (id: string, userData: Partial<UserInput>): Promise<User> => {
    return http.put<User>(`/api/users/${id}`, userData);
  },

  deleteUser: (id: string): Promise<{ id: string }> => {
    return http.delete<{ id: string }>(`/api/users/${id}`);
  },
};
