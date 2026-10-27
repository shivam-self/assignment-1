import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../api/userApi';
import { User, UserInput } from '../types/user';
import { ApiError } from '../api/http';

export function useUsers(initialSearch = '') {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>(initialSearch);

  const fetchUsers = useCallback(async (searchQuery = search) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getUsers(searchQuery);
      setUsers(data);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load users list.');
      }
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers(search);
  }, [search, fetchUsers]);

  const createUser = async (input: UserInput): Promise<User> => {
    const newUser = await userApi.createUser(input);
    // Refresh list
    await fetchUsers(search);
    return newUser;
  };

  const updateUser = async (id: string, input: Partial<UserInput>): Promise<User> => {
    const updated = await userApi.updateUser(id, input);
    await fetchUsers(search);
    return updated;
  };

  const deleteUser = async (id: string): Promise<void> => {
    await userApi.deleteUser(id);
    await fetchUsers(search);
  };

  return {
    users,
    loading,
    error,
    search,
    setSearch,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
