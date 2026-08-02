// logic: certificates read/create across Firestore and localStorage.
import { db, isConfigured } from '../../../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  FIRESTORE_COLLECTIONS,
  ADMIN_STORAGE_KEYS,
} from '../constants/storageKeys';
import { readJSON, writeJSON } from './storage';

export const fetchCertificates = async () => {
  let certList = [];

  if (isConfigured) {
    try {
      const snap = await getDocs(
        collection(db, FIRESTORE_COLLECTIONS.CERTIFICATES)
      );
      certList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('Error fetching Firestore certificates:', err);
    }
  }

  const savedCerts = readJSON(ADMIN_STORAGE_KEYS.CERTIFICATES, []);
  const combined = [...certList];

  savedCerts.forEach((sc) => {
    if (!combined.some((c) => c.certificateId === sc.certificateId)) {
      combined.push(sc);
    }
  });

  return combined;
};

export const createCertificate = async (certData) => {
  if (isConfigured) {
    try {
      await addDoc(collection(db, FIRESTORE_COLLECTIONS.CERTIFICATES), {
        ...certData,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error saving certificate in Firestore:', err);
    }
  }

  const savedCerts = readJSON(ADMIN_STORAGE_KEYS.CERTIFICATES, []);
  savedCerts.push(certData);
  writeJSON(ADMIN_STORAGE_KEYS.CERTIFICATES, savedCerts);

  return certData;
};
