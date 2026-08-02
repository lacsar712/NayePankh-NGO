import { useState, useEffect, useCallback } from 'react';
import { fetchVolunteers, persistVolunteers, setVolunteerStatusRemote } from '../services/volunteersService';
import { DEFAULT_VOLUNTEERS } from '../constants/defaults';

/**
 * 【logic 层｜hooks】志愿者域 Hook（乐观本地更新 + 非阻塞远端同步）。
 * @returns {{ list: Array, approve: (id: string) => void, reject: (id: string) => void }}
 */
export function useAdminVolunteers() {
  const [volunteers, setVolunteers] = useState(DEFAULT_VOLUNTEERS);

  useEffect(() => {
    let cancelled = false;
    fetchVolunteers().then(list => {
      if (!cancelled && list.length > 0) setVolunteers(list);
    });
    return () => { cancelled = true; };
  }, []);

  const setStatus = useCallback((id, status) => {
    const updated = volunteers.map(v => (v.id === id ? { ...v, status } : v));
    setVolunteers(updated);
    persistVolunteers(updated);
    setVolunteerStatusRemote(id, status);
  }, [volunteers]);

  const approve = useCallback((id) => setStatus(id, 'approved'), [setStatus]);
  const reject = useCallback((id) => setStatus(id, 'rejected'), [setStatus]);

  return { list: volunteers, approve, reject };
}
