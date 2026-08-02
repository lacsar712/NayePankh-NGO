// Admin logic layer — Users service
// Wraps Firestore reads/writes for the `users` collection.
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import { ADMIN_COLLECTIONS, DEFAULT_USERS } from '../constants/storageKeys';

const ROLE_CYCLE = { admin: 'user', user: 'volunteer', volunteer: 'admin' };

export function nextRole(role) {
  return ROLE_CYCLE[role] || 'admin';
}

/** Fetch users from Firestore; returns [] when not configured or empty. */
export async function fetchUsers() {
  if (!isConfigured) return [];
  try {
    const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.USERS));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
}

/** Persist a role change to Firestore when configured. UI state is owned by the hook. */
export async function updateUserRole(id, role) {
  if (!isConfigured) return;
  try {
    await updateDoc(doc(db, ADMIN_COLLECTIONS.USERS, id), { role });
  } catch (err) {
    console.error('Error updating role in Firestore:', err);
  }
}

export { DEFAULT_USERS };
