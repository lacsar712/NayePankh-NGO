// logic: event registrations read/delete, mark-attended and certificate write.
import { db, isConfigured } from '../../../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  FIRESTORE_COLLECTIONS,
  ADMIN_STORAGE_KEYS,
} from '../constants/storageKeys';
import { readJSON, writeJSON } from './storage';

export const fetchRegistrations = async () => {
  let regList = [];

  if (isConfigured) {
    try {
      const snap = await getDocs(
        collection(db, FIRESTORE_COLLECTIONS.EVENT_REGISTRATIONS)
      );
      regList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('Error fetching Firestore registrations:', err);
    }
  }

  const savedRegs = readJSON(ADMIN_STORAGE_KEYS.EVENT_REGISTRATIONS, []);
  const combined = [...regList];

  savedRegs.forEach((s) => {
    if (
      !combined.some(
        (c) => c.id === s.id || (c.eventId === s.eventId && c.email === s.email)
      )
    ) {
      combined.push(s);
    }
  });

  return combined;
};

export const deleteRegistration = async (registrations, id) => {
  if (isConfigured) {
    try {
      await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.EVENT_REGISTRATIONS, id));
      return registrations.filter((r) => r.id !== id);
    } catch (err) {
      console.error('Error deleting registration in Firestore:', err);
    }
  }

  const filtered = registrations.filter((r, idx) => r.id !== id && idx !== id);
  writeJSON(ADMIN_STORAGE_KEYS.EVENT_REGISTRATIONS, filtered);
  return filtered;
};

export const markRegistrationAttended = async (registrations, reg) => {
  const certId =
    'CERT-EVT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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

  return { updatedRegs, certId, formattedDate };
};

export const saveCertificateDoc = async (certData) => {
  if (isConfigured) {
    try {
      await addDoc(collection(db, FIRESTORE_COLLECTIONS.CERTIFICATES), {
        ...certData,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error creating certificate in Firestore:', err);
    }
  }

  const savedCerts = readJSON(ADMIN_STORAGE_KEYS.CERTIFICATES, []);
  savedCerts.push(certData);
  writeJSON(ADMIN_STORAGE_KEYS.CERTIFICATES, savedCerts);
};
