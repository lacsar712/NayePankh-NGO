// Admin logic layer — Certificates service
// Loads merged certificates (Firestore + local mirror), persists new
// certificates to both stores, and manages branding assets (signature / stamp).
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import { ADMIN_COLLECTIONS, ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readJson, writeJson, readString, writeString, removeKey } from './localStore';

async function fetchFirestoreCertificates() {
  if (!isConfigured) return [];
  try {
    const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.CERTIFICATES));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching Firestore certificates:', err);
    return [];
  }
}

/** Load merged certificates (Firestore + local mirror, deduped by certificateId). */
export async function loadCertificates() {
  const firestoreList = await fetchFirestoreCertificates();
  const combined = [...firestoreList];

  const saved = readJson(ADMIN_STORAGE_KEYS.CERTIFICATES, []);
  saved.forEach((sc) => {
    if (!combined.some((c) => c.certificateId === sc.certificateId)) combined.push(sc);
  });

  return combined;
}

/**
 * Persist a freshly minted certificate: non-blocking Firestore create (when
 * configured) plus append to the local mirror. Returns the certData unchanged
 * for convenience so the caller can push it into state.
 */
export async function saveCertificate(certData) {
  if (isConfigured) {
    try {
      await addDoc(collection(db, ADMIN_COLLECTIONS.CERTIFICATES), {
        ...certData,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error saving certificate in Firestore:', err);
    }
  }
  const saved = readJson(ADMIN_STORAGE_KEYS.CERTIFICATES, []);
  saved.push(certData);
  writeJson(ADMIN_STORAGE_KEYS.CERTIFICATES, saved);
  return certData;
}

// ---- Branding assets (founder signature + foundation stamp) ----

export function loadBrandingAssets() {
  return {
    sigImage: readString(ADMIN_STORAGE_KEYS.SIGNATURE),
    stampImage: readString(ADMIN_STORAGE_KEYS.STAMP),
  };
}

export function saveSignature(dataUrl) {
  writeString(ADMIN_STORAGE_KEYS.SIGNATURE, dataUrl);
}

export function saveStamp(dataUrl) {
  writeString(ADMIN_STORAGE_KEYS.STAMP, dataUrl);
}

export function resetBrandingAssets() {
  removeKey(ADMIN_STORAGE_KEYS.SIGNATURE);
  removeKey(ADMIN_STORAGE_KEYS.STAMP);
}
