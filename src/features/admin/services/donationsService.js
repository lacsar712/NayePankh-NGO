// Logic service: donations read with field normalization (Firestore only; local mode uses defaults).
import { db, isConfigured } from '../../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../constants/storageKeys';
import { DEFAULT_DONATIONS } from '../constants/seedData';

const mapDonation = (d) => {
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
};

export const donationsService = {
  async fetchDonations() {
    if (!isConfigured) return DEFAULT_DONATIONS;
    try {
      const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.DONATIONS));
      const list = snap.docs.map(mapDonation);
      return list.length > 0 ? list : DEFAULT_DONATIONS;
    } catch (err) {
      console.error('Error fetching donations:', err);
      return DEFAULT_DONATIONS;
    }
  },
};
