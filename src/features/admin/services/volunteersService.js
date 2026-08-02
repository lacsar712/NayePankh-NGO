// Admin logic layer — Volunteers service
// Merges Firestore + localStorage mirror; persists status changes to both.
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import { ADMIN_COLLECTIONS, ADMIN_STORAGE_KEYS, DEFAULT_VOLUNTEERS } from '../constants/storageKeys';
import { readJson, writeJson } from './localStore';

async function fetchFirestoreVolunteers() {
  if (!isConfigured) return [];
  try {
    const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.VOLUNTEERS));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching Firestore volunteers:', err);
    return [];
  }
}

/**
 * Load the merged volunteer list: Firestore rows, overlaid with localStorage
 * status edits, backfilled with the default seed list. Mirrors the original
 * monolith merge semantics exactly.
 */
export async function loadVolunteers() {
  const firestoreList = await fetchFirestoreVolunteers();
  const combined = [...firestoreList];

  const saved = readJson(ADMIN_STORAGE_KEYS.VOLUNTEERS, []);
  saved.forEach((sv) => {
    const idx = combined.findIndex((v) => v.id === sv.id || v.email === sv.email);
    if (idx !== -1) combined[idx] = { ...combined[idx], ...sv };
    else combined.push(sv);
  });

  DEFAULT_VOLUNTEERS.forEach((dv) => {
    const exists = combined.some((v) => v.id === dv.id || v.email === dv.email);
    if (!exists) combined.push(dv);
  });

  return combined;
}

/**
 * Persist a volunteer status change. Writes the full updated list to the local
 * mirror and (for real Firestore docs) fires a non-blocking Firestore update.
 * Returns nothing; the hook owns the optimistic in-memory state.
 */
export function setVolunteerStatus(updatedVolunteers, id, status) {
  writeJson(ADMIN_STORAGE_KEYS.VOLUNTEERS, updatedVolunteers);

  if (isConfigured && !id.startsWith('vol-') && !id.startsWith('local-')) {
    updateDoc(doc(db, ADMIN_COLLECTIONS.VOLUNTEERS, id), { status })
      .catch((err) => console.error(`Error setting volunteer status (${status}) in Firestore:`, err));
  }
}

export { DEFAULT_VOLUNTEERS };
