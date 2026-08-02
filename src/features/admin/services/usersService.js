// Logic service: users collection read + role cycling (Firestore + localStorage fallback).
import { db, isConfigured } from '../../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../constants/storageKeys';
import { DEFAULT_USERS } from '../constants/seedData';

export const usersService = {
  async fetchUsers() {
    if (!isConfigured) return DEFAULT_USERS;
    try {
      const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.USERS));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return list.length > 0 ? list : DEFAULT_USERS;
    } catch (err) {
      console.error('Error fetching users:', err);
      return DEFAULT_USERS;
    }
  },

  async cycleRole(userId, currentRole) {
    const nextRole =
      currentRole === 'admin' ? 'user' : currentRole === 'user' ? 'volunteer' : 'admin';

    if (isConfigured) {
      try {
        await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, userId), { role: nextRole });
      } catch (err) {
        console.error('Error updating role in Firestore:', err);
        throw err;
      }
    }
    return nextRole;
  },
};
