import { useState, useEffect } from 'react';
import { fetchDonations } from '../services/donationsService';
import { DEFAULT_DONATIONS } from '../constants/defaults';

/**
 * 【logic 层｜hooks】捐赠域 Hook（只读台账）。
 * @returns {{ list: Array }}
 */
export function useAdminDonations() {
  const [donations, setDonations] = useState(DEFAULT_DONATIONS);

  useEffect(() => {
    let cancelled = false;
    fetchDonations().then(list => {
      if (!cancelled && list.length > 0) setDonations(list);
    });
    return () => { cancelled = true; };
  }, []);

  return { list: donations };
}
