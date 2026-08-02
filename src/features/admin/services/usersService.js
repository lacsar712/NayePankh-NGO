// logic: users collection read + role cycling (Firestore / default fallback).
import { db, isConfigured } from '../../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { DEFAULT_USERS, FIRESTORE_COLLECTIONS } from '../constants/storageKeys';

const isFirebaseId = (id) => id && !String(id).startsWith('usr-') && !String(id).startsWith('local-');

export const fetchUsers = async () => {
  if (isConfigured) {
    try {
      const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.USERS));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (list.length > 0) return list;
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }
  return [...DEFAULT_USERS];
};

export const toggleUserRole = async (users, id) => {
  const userToUpdate = users.find((u) => u.id === id);
  if (!userToUpdate) return users;

  const nextRole =
    userToUpdate.role === 'admin'
      ? 'user'
      : userToUpdate.role === 'user'
      ? 'volunteer'
      : 'admin';

  if (isConfigured) {
    try {
      await updateDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, id), { role: nextRole });
    } catch (err) {
      console.error('Error updating role in Firestore:', err);
    }
  }

  return users.map((u) => (u.id === id ? { ...u, role: nextRole } : u));
};
