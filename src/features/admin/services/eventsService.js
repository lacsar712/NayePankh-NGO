// logic: events CRUD with local event broadcast + non-blocking Firestore writes.
import { db, isConfigured } from '../../../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  FIRESTORE_COLLECTIONS,
  ADMIN_STORAGE_KEYS,
  DEFAULT_EVENTS,
} from '../constants/storageKeys';
import { readJSON, writeJSON, dispatchLocalEventsUpdate } from './storage';

const PROTECTED_EVENT_IDS = ['cloth-drive', 'health-camp', 'career-fair'];

const isFirebaseEventId = (id) =>
  id &&
  !String(id).startsWith('evt-') &&
  !String(id).startsWith('local-') &&
  !PROTECTED_EVENT_IDS.includes(id);

export const fetchEvents = async () => {
  let eventList = [];

  if (isConfigured) {
    try {
      const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.EVENTS));
      eventList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('Error fetching Firestore events:', err);
    }
  }

  const savedEvents = readJSON(ADMIN_STORAGE_KEYS.EVENTS, []);
  const combined = [...eventList];

  savedEvents.forEach((se) => {
    if (!combined.some((e) => e.id === se.id)) {
      combined.push(se);
    }
  });

  DEFAULT_EVENTS.forEach((de) => {
    if (!combined.some((e) => e.id === de.id || e.title === de.title)) {
      combined.push(de);
    }
  });

  return combined.length > 0 ? combined : [...DEFAULT_EVENTS];
};

export const addEvent = async (events, eventData) => {
  const docId = `evt-${Date.now()}`;
  const eventToSave = { ...eventData, id: docId };

  const updated = [...events, eventToSave];
  writeJSON(ADMIN_STORAGE_KEYS.EVENTS, updated);
  dispatchLocalEventsUpdate();

  if (isConfigured) {
    const { id, ...firestoreData } = eventToSave;
    addDoc(collection(db, FIRESTORE_COLLECTIONS.EVENTS), {
      ...firestoreData,
      timestamp: serverTimestamp(),
    })
      .then((docRef) =>
        console.log('Event created in Firestore with ID:', docRef.id)
      )
      .catch((err) => console.error('Error creating event in Firestore:', err));
  }

  return updated;
};

export const deleteEvent = async (events, id) => {
  const updated = events.filter((e) => e.id !== id);
  writeJSON(ADMIN_STORAGE_KEYS.EVENTS, updated);
  dispatchLocalEventsUpdate();

  if (isConfigured && isFirebaseEventId(id)) {
    deleteDoc(doc(db, FIRESTORE_COLLECTIONS.EVENTS, id))
      .then(() => console.log('Event deleted from Firestore'))
      .catch((err) => console.error('Error deleting event in Firestore:', err));
  }

  return updated;
};
