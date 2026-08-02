// Admin logic layer — Registrations service
// Merges Firestore `eventRegistrations` with the localStorage mirror; supports
// delete and mark-attended (the latter also mints a certificate downstream).
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import { ADMIN_COLLECTIONS, ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readJson, writeJson } from './localStore';

async function fetchFirestoreRegistrations() {
  if (!isConfigured) return [];
  try {
    const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.EVENT_REGISTRATIONS));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching Firestore registrations:', err);
    return [];
  }
}

/** Load merged registrations (Firestore + local mirror, deduped). */
export async function loadRegistrations() {
  const firestoreList = await fetchFirestoreRegistrations();
  const combined = [...firestoreList];

  const saved = readJson(ADMIN_STORAGE_KEYS.EVENT_REGISTRATIONS, []);
  saved.forEach((s) => {
    const dup = combined.some(
      (c) => c.id === s.id || (c.eventId === s.eventId && c.email === s.email)
    );
    if (!dup) combined.push(s);
  });

  return combined;
}

/**
 * Delete a registration. In Firestore mode removes the doc; otherwise persists
 * the filtered list to the local mirror. Returns the filtered array so the hook
 * can update state consistently in the localStorage branch.
 */
export async function deleteRegistration(registrations, id) {
  if (isConfigured) {
    try {
      await deleteDoc(doc(db, ADMIN_COLLECTIONS.EVENT_REGISTRATIONS, id));
    } catch (err) {
      console.error('Error deleting registration in Firestore:', err);
      return null;
    }
    return registrations.filter((r) => r.id !== id);
  }
  const filtered = registrations.filter((r, idx) => r.id !== id && idx !== id);
  writeJson(ADMIN_STORAGE_KEYS.EVENT_REGISTRATIONS, filtered);
  return filtered;
}

/** Mark a registration attended: Firestore update (real docs) + local mirror write. */
export async function markRegistrationAttended(updatedRegs, reg) {
  if (isConfigured && reg.id && !String(reg.id).startsWith('local-')) {
    try {
      await updateDoc(doc(db, ADMIN_COLLECTIONS.EVENT_REGISTRATIONS, reg.id), { status: 'attended' });
    } catch (err) {
      console.error('Error marking attended in Firestore:', err);
    }
  }
  writeJson(ADMIN_STORAGE_KEYS.EVENT_REGISTRATIONS, updatedRegs);
}
