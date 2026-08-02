// Admin logic layer — Donations service
// Read-only fetch of the `donations` ledger from Firestore with field mapping.
import { collection, getDocs } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import { ADMIN_COLLECTIONS, DEFAULT_DONATIONS } from '../constants/storageKeys';

function mapDonation(id, data) {
  return {
    id,
    donor: data.donor || data.name || data.userEmail?.split('@')[0] || 'Anonymous',
    email: data.email || data.userEmail || 'guest@example.com',
    amount: data.amount || 0,
    frequency: data.frequency || 'one-time',
    method: data.paymentMethod || data.method || 'UPI',
    date: data.timestamp?.toDate
      ? data.timestamp.toDate().toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  };
}

/** Fetch mapped donations from Firestore; returns [] when not configured/empty. */
export async function fetchDonations() {
  if (!isConfigured) return [];
  try {
    const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.DONATIONS));
    return snap.docs.map((d) => mapDonation(d.id, d.data()));
  } catch (err) {
    console.error('Error fetching donations:', err);
    return [];
  }
}

export { DEFAULT_DONATIONS };
