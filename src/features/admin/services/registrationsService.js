// Logic service: event registrations merge + delete + mark-attended (creates certificate).
import { db, isConfigured } from '../../../firebase/config';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS, ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readJSON, writeJSON } from './storage';
import { certificatesService } from './certificatesService';

export const registrationsService = {
  async fetchRegistrations() {
    let regList = [];

    if (isConfigured) {
      try {
        const regSnap = await getDocs(
          collection(db, FIRESTORE_COLLECTIONS.EVENT_REGISTRATIONS)
        );
        regList = regSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error('Error fetching Firestore registrations:', err);
      }
    }

    const savedRegs = readJSON(ADMIN_STORAGE_KEYS.EVENT_REGISTRATIONS, []);
    const combinedRegs = [...regList];
    savedRegs.forEach((s) => {
      if (
        !combinedRegs.some(
          (c) => c.id === s.id || (c.eventId === s.eventId && c.email === s.email)
        )
      ) {
        combinedRegs.push(s);
      }
    });

    return combinedRegs;
  },

  deleteRegistration(registrations, id) {
    if (isConfigured) {
      return (async () => {
        try {
          await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.EVENT_REGISTRATIONS, id));
          return registrations.filter((r) => r.id !== id);
        } catch (err) {
          console.error('Error deleting registration in Firestore:', err);
          return registrations;
        }
      })();
    }

    const filtered = registrations.filter((r, idx) => r.id !== id && idx !== id);
    writeJSON(ADMIN_STORAGE_KEYS.EVENT_REGISTRATIONS, filtered);
    return filtered;
  },

  async markAttended(registrations, reg, sigImage, stampImage) {
    if (isConfigured && reg.id && !String(reg.id).startsWith('local-')) {
      try {
        await updateDoc(
          doc(db, FIRESTORE_COLLECTIONS.EVENT_REGISTRATIONS, reg.id),
          { status: 'attended' }
        );
      } catch (err) {
        console.error('Error marking attended in Firestore:', err);
      }
    }

    const updatedRegs = registrations.map((r) =>
      r.id === reg.id || (r.eventId === reg.eventId && r.email === reg.email)
        ? { ...r, status: 'attended' }
        : r
    );
    writeJSON(ADMIN_STORAGE_KEYS.EVENT_REGISTRATIONS, updatedRegs);

    const certData = certificatesService.buildAttendedCertificate(
      reg,
      sigImage,
      stampImage
    );

    return { updatedRegs, certData };
  },
};
