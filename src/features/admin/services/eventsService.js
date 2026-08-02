// Admin logic layer — Events service
// Merges Firestore + localStorage mirror; create/delete write to both and
// notify the public Events page via a custom window event.
import { collection, getDocs, doc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import {
  ADMIN_COLLECTIONS,
  ADMIN_STORAGE_KEYS,
  DEFAULT_EVENTS,
  LOCAL_EVENTS_UPDATE_EVENT,
} from '../constants/storageKeys';
import { readJson, writeJson } from './localStore';

const PROTECTED_IDS = ['cloth-drive', 'health-camp', 'career-fair'];

function notifyLocalEventsUpdate() {
  window.dispatchEvent(new Event(LOCAL_EVENTS_UPDATE_EVENT));
}

async function fetchFirestoreEvents() {
  if (!isConfigured) return [];
  try {
    const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.EVENTS));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching Firestore events:', err);
    return [];
  }
}

/** Load merged events (Firestore + local mirror + defaults). */
export async function loadEvents() {
  const firestoreList = await fetchFirestoreEvents();
  const combined = [...firestoreList];

  const saved = readJson(ADMIN_STORAGE_KEYS.EVENTS, []);
  saved.forEach((se) => {
    if (!combined.some((e) => e.id === se.id)) combined.push(se);
  });
  DEFAULT_EVENTS.forEach((de) => {
    if (!combined.some((e) => e.id === de.id || e.title === de.title)) combined.push(de);
  });

  return combined;
}

/**
 * Persist the full updated events list to the local mirror + notify listeners,
 * and fire a non-blocking Firestore create for the new event.
 */
export function createEvent(updatedEvents, eventToSave) {
  writeJson(ADMIN_STORAGE_KEYS.EVENTS, updatedEvents);
  notifyLocalEventsUpdate();

  if (isConfigured) {
    addDoc(collection(db, ADMIN_COLLECTIONS.EVENTS), { ...eventToSave, timestamp: serverTimestamp() })
      .catch((err) => console.error('Error creating event in Firestore:', err));
  }
}

/** Persist the filtered events list + notify, and delete from Firestore when applicable. */
export function deleteEvent(updatedEvents, id) {
  writeJson(ADMIN_STORAGE_KEYS.EVENTS, updatedEvents);
  notifyLocalEventsUpdate();

  const isFirestoreDoc =
    isConfigured && !id.startsWith('evt-') && !id.startsWith('local-') && !PROTECTED_IDS.includes(id);
  if (isFirestoreDoc) {
    deleteDoc(doc(db, ADMIN_COLLECTIONS.EVENTS, id))
      .catch((err) => console.error('Error deleting event in Firestore:', err));
  }
}

export { DEFAULT_EVENTS };
