import { useState, useEffect, useCallback } from 'react';
import { isConfigured } from '../../../firebase/config';
import { fetchUsers, updateUserRole } from '../services/usersService';
import { DEFAULT_USERS } from '../constants/defaults';

/**
 * 【logic 层｜hooks】用户域 Hook。
 * @returns {{ list: Array, toggleRole: (id: string) => Promise<void> }}
 */
export function useAdminUsers() {
  const [users, setUsers] = useState(DEFAULT_USERS);

  useEffect(() => {
    let cancelled = false;
    fetchUsers().then(list => {
      if (!cancelled && list.length > 0) setUsers(list);
    });
    return () => { cancelled = true; };
  }, []);

  const toggleRole = useCallback(async (id) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    const nextRole = target.role === 'admin' ? 'user' : target.role === 'user' ? 'volunteer' : 'admin';

    // 行为保持：配置 Firebase 时先写远端，失败则不更新本地 state；未配置时仅更新本地 state
    if (isConfigured) {
      const ok = await updateUserRole(id, nextRole);
      if (!ok) return;
    }
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, role: nextRole } : u)));
  }, [users]);

  return { list: users, toggleRole };
}
