import { useState, useEffect, useCallback } from 'react';
import { volunteersService } from '../services/volunteersService';
import { VOLUNTEER_STATUS } from '../constants/tabs';
import { DEFAULT_VOLUNTEERS } from '../constants/seedData';

export function useVolunteers(enabled = true) {
  const [volunteers, setVolunteers] = useState(DEFAULT_VOLUNTEERS);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoading(true);
    volunteersService
      .fetchVolunteers()
      .then((list) => {
        if (active) {
          setVolunteers(list);
          setLoading(false);
        }
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [enabled]);

  const handleApproveVolunteer = useCallback((id) => {
    setVolunteers((prev) =>
      volunteersService.setStatus(prev, id, VOLUNTEER_STATUS.APPROVED)
    );
  }, []);

  const handleRejectVolunteer = useCallback((id) => {
    setVolunteers((prev) =>
      volunteersService.setStatus(prev, id, VOLUNTEER_STATUS.REJECTED)
    );
  }, []);

  return {
    volunteers,
    loading,
    handleApproveVolunteer,
    handleRejectVolunteer,
  };
}
