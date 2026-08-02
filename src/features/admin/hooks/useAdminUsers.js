// Admin logic layer — Users hook
import { useCallback } from 'react';
import { useCollectionLoader } from './useCollectionLoader';
import { fetchUsers, updateUserRole, nextRole, DEFAULT_USERS } from '../services/usersService';

export function useAdminUsers() {
  const { data: users, setData: setUsers, loading } = useCollectionLoader(fetchUsers, {
    initialData: DEFAULT_USERS,
    keepInitialWhenEmpty: true,
  });

  const toggleRole = useCallback((id) => {
    setUsers((prev) => {
      const target = prev.find((u) => u.id === id);
      if (!target) return prev;
      const role = nextRole(target.role);
      updateUserRole(id, role); // fire-and-forget Firestore write
      return prev.map((u) => (u.id === id ? { ...u, role } : u));
    });
  }, [setUsers]);

  return { users, loading, toggleRole };
}
