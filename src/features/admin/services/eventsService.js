// Logic service: events three-way merge + create/delete, dispatches local update event.
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
  LOCAL_EVENTS_UPDATE_EVENT,
} from '../constants/storageKeys';
import { DEFAULT_EVENTS } from '../constants/seedData';
import { readJSON, writeJSON } from './storage';

const PROTECTED_EVENT_IDS = ['cloth-drive', 'health-camp', 'career-fair'];

const isLocalOnlyEventId = (id) =>
  !id ||
  String(id).startsWith('evt-') ||
  String(id).startsWith('local-') ||
  PROTECTED_EVENT_IDS.includes(id);

const dispatchLocalUpdate = () => {
  try {
    window.dispatchEvent(new Event(LOCAL_EVENTS_UPDATE_EVENT));
  } catch (err) {
    console.error('Failed to dispatch local events update:', err);
  }
};

export const eventsService = {
  async fetchEvents() {
    let eventList = [];

    if (isConfigured) {
      try {
        const eventSnap = await getDocs(
          collection(db, FIRESTORE_COLLECTIONS.EVENTS)
        );
        eventList = eventSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error('Error fetching Firestore events:', err);
      }
    }

    const savedEvents = readJSON(ADMIN_STORAGE_KEYS.EVENTS, []);
    const combinedEvents = [...eventList];

    savedEvents.forEach((se) => {
      if (!combinedEvents.some((e) => e.id === se.id)) {
        combinedEvents.push(se);
      }
    });

    DEFAULT_EVENTS.forEach((de) => {
      if (
        !combinedEvents.some(
          (e) => e.id === de.id || e.title === de.title
        )
      ) {
        combinedEvents.push(de);
      }
    });

    return combinedEvents.length > 0 ? combinedEvents : DEFAULT_EVENTS;
  },

  createEvent(events, eventToSave) {
    const docId = `evt-${Date.now()}`;
    const updatedEvents = [...events, { ...eventToSave, id: docId }];
    writeJSON(ADMIN_STORAGE_KEYS.EVENTS, updatedEvents);
    dispatchLocalUpdate();

    if (isConfigured) {
      addDoc(collection(db, FIRESTORE_COLLECTIONS.EVENTS), {
        ...eventToSave,
        timestamp: serverTimestamp(),
      })
        .then((docRef) =>
          console.log('Event created in Firestore with ID:', docRef.id)
        )
        .catch((err) =>
          console.error('Error creating event in Firestore:', err)
        );
    }

    return { updatedEvents, docId };
  },

  deleteEvent(events, id) {
    const updatedEvents = events.filter((e) => e.id !== id);
    writeJSON(ADMIN_STORAGE_KEYS.EVENTS, updatedEvents);
    dispatchLocalUpdate();

    if (isConfigured && !isLocalOnlyEventId(id)) {
      deleteDoc(doc(db, FIRESTORE_COLLECTIONS.EVENTS, id))
        .then(() => console.log('Event deleted from Firestore'))
        .catch((err) =>
          console.error('Error deleting event in Firestore:', err)
        );
    }

    return updatedEvents;
  },
};
