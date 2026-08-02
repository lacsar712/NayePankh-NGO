// Admin logic layer — Donations hook
import { useCollectionLoader } from './useCollectionLoader';
import { fetchDonations, DEFAULT_DONATIONS } from '../services/donationsService';

export function useAdminDonations() {
  const { data: donations, loading } = useCollectionLoader(fetchDonations, {
    initialData: DEFAULT_DONATIONS,
    keepInitialWhenEmpty: true,
  });

  return { donations, loading };
}
