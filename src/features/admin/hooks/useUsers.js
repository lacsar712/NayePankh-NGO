import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../services/usersService';
import { DEFAULT_USERS } from '../constants/seedData';

export function useUsers(enabled = true) {
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoading(true);
    usersService
      .fetchUsers()
      .then((list) => {
        if (active) {
          setUsers(list);
          setLoading(false);
        }
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [enabled]);

  const handleToggleRole = useCallback(
    async (id) => {
      const userToUpdate = users.find((u) => u.id === id);
      if (!userToUpdate) return;
      try {
        const nextRole = await usersService.cycleRole(id, userToUpdate.role);
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, role: nextRole } : u))
        );
      } catch (err) {
        console.error('Error cycling role:', err);
      }
    },
    [users]
  );

  return { users, loading, handleToggleRole };
}
