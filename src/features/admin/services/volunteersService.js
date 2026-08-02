// logic: volunteers merge/read and approve/reject with localStorage persistence.
import { db, isConfigured } from '../../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import {
  FIRESTORE_COLLECTIONS,
  ADMIN_STORAGE_KEYS,
  DEFAULT_VOLUNTEERS,
} from '../constants/storageKeys';
import { readJSON, writeJSON } from './storage';

const isFirebaseVolunteerId = (id) =>
  id && !String(id).startsWith('vol-') && !String(id).startsWith('local-');

export const fetchVolunteers = async () => {
  let volList = [];

  if (isConfigured) {
    try {
      const snap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.VOLUNTEERS));
      volList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('Error fetching Firestore volunteers:', err);
    }
  }

  const savedVolunteers = readJSON(ADMIN_STORAGE_KEYS.VOLUNTEERS, []);
  const combined = [...volList];

  savedVolunteers.forEach((sv) => {
    const idx = combined.findIndex(
      (v) => v.id === sv.id || v.email === sv.email
    );
    if (idx !== -1) {
      combined[idx] = { ...combined[idx], ...sv };
    } else {
      combined.push(sv);
    }
  });

  DEFAULT_VOLUNTEERS.forEach((dv) => {
    const idx = combined.findIndex(
      (v) => v.id === dv.id || v.email === dv.email
    );
    if (idx === -1) {
      combined.push(dv);
    }
  });

  return combined.length > 0 ? combined : [...DEFAULT_VOLUNTEERS];
};

const persistVolunteers = (volunteers) => {
  writeJSON(ADMIN_STORAGE_KEYS.VOLUNTEERS, volunteers);
};

export const approveVolunteer = async (volunteers, id) => {
  const updated = volunteers.map((v) =>
    v.id === id ? { ...v, status: 'approved' } : v
  );
  persistVolunteers(updated);

  if (isConfigured && isFirebaseVolunteerId(id)) {
    updateDoc(doc(db, FIRESTORE_COLLECTIONS.VOLUNTEERS, id), { status: 'approved' })
      .then(() => console.log('Volunteer approved in Firestore'))
      .catch((err) => console.error('Error approving volunteer in Firestore:', err));
  }

  return updated;
};

export const rejectVolunteer = async (volunteers, id) => {
  const updated = volunteers.map((v) =>
    v.id === id ? { ...v, status: 'rejected' } : v
  );
  persistVolunteers(updated);

  if (isConfigured && isFirebaseVolunteerId(id)) {
    updateDoc(doc(db, FIRESTORE_COLLECTIONS.VOLUNTEERS, id), { status: 'rejected' })
      .then(() => console.log('Volunteer rejected in Firestore'))
      .catch((err) => console.error('Error rejecting volunteer in Firestore:', err));
  }

  return updated;
};
