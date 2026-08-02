// logic: donations ledger read + donor field normalization.
import { db, isConfigured } from '../../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS, DEFAULT_DONATIONS } from '../constants/storageKeys';

export const fetchDonations = async () => {
  if (isConfigured) {
    try {
      const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.DONATIONS));
      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          donor: data.donor || data.name || data.userEmail?.split('@')[0] || 'Anonymous',
          email: data.email || data.userEmail || 'guest@example.com',
          amount: data.amount || 0,
          frequency: data.frequency || 'one-time',
          method: data.paymentMethod || data.method || 'UPI',
          date: data.timestamp?.toDate
            ? data.timestamp.toDate().toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        };
      });
      if (list.length > 0) return list;
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  }
  return [...DEFAULT_DONATIONS];
};
