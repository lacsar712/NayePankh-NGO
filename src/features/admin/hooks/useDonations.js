import { useState, useEffect } from 'react';
import { donationsService } from '../services/donationsService';
import { DEFAULT_DONATIONS } from '../constants/seedData';

export function useDonations(enabled = true) {
  const [donations, setDonations] = useState(DEFAULT_DONATIONS);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoading(true);
    donationsService
      .fetchDonations()
      .then((list) => {
        if (active) {
          setDonations(list);
          setLoading(false);
        }
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [enabled]);

  return { donations, loading };
}
