// Admin logic layer — Volunteers hook
import { useCallback } from 'react';
import { useCollectionLoader } from './useCollectionLoader';
import { loadVolunteers, setVolunteerStatus, DEFAULT_VOLUNTEERS } from '../services/volunteersService';

export function useAdminVolunteers() {
  const { data: volunteers, setData: setVolunteers, loading } = useCollectionLoader(loadVolunteers, {
    initialData: DEFAULT_VOLUNTEERS,
    keepInitialWhenEmpty: true,
  });

  const changeStatus = useCallback((id, status) => {
    setVolunteers((prev) => {
      const updated = prev.map((v) => (v.id === id ? { ...v, status } : v));
      setVolunteerStatus(updated, id, status);
      return updated;
    });
  }, [setVolunteers]);

  const approveVolunteer = useCallback((id) => changeStatus(id, 'approved'), [changeStatus]);
  const rejectVolunteer = useCallback((id) => changeStatus(id, 'rejected'), [changeStatus]);

  return { volunteers, loading, approveVolunteer, rejectVolunteer };
}
