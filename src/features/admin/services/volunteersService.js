// Logic service: volunteers three-way merge (Firestore/localStorage/defaults) + status writes.
import { db, isConfigured } from '../../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS, ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { DEFAULT_VOLUNTEERS } from '../constants/seedData';
import { readJSON, writeJSON } from './storage';

const isLocalOnlyId = (id) =>
  !id || String(id).startsWith('vol-') || String(id).startsWith('local-');

export const volunteersService = {
  async fetchVolunteers() {
    let volList = [];

    if (isConfigured) {
      try {
        const volSnap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.VOLUNTEERS));
        volList = volSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error('Error fetching Firestore volunteers:', err);
      }
    }

    const savedVolunteers = readJSON(ADMIN_STORAGE_KEYS.VOLUNTEERS, []);
    const combinedVolunteers = [...volList];

    savedVolunteers.forEach((sv) => {
      const idx = combinedVolunteers.findIndex(
        (v) => v.id === sv.id || v.email === sv.email
      );
      if (idx !== -1) {
        combinedVolunteers[idx] = { ...combinedVolunteers[idx], ...sv };
      } else {
        combinedVolunteers.push(sv);
      }
    });

    DEFAULT_VOLUNTEERS.forEach((dv) => {
      const idx = combinedVolunteers.findIndex(
        (v) => v.id === dv.id || v.email === dv.email
      );
      if (idx === -1) {
        combinedVolunteers.push(dv);
      }
    });

    return combinedVolunteers.length > 0 ? combinedVolunteers : DEFAULT_VOLUNTEERS;
  },

  setStatus(volunteers, id, status) {
    const updatedVolunteers = volunteers.map((v) =>
      v.id === id ? { ...v, status } : v
    );
    writeJSON(ADMIN_STORAGE_KEYS.VOLUNTEERS, updatedVolunteers);

    if (isConfigured && !isLocalOnlyId(id)) {
      updateDoc(doc(db, FIRESTORE_COLLECTIONS.VOLUNTEERS, id), { status })
        .then(() => console.log(`Volunteer ${status} in Firestore`))
        .catch((err) =>
          console.error(`Error setting volunteer ${status} in Firestore:`, err)
        );
    }

    return updatedVolunteers;
  },
};
