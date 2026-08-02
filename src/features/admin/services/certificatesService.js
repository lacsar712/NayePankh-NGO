// Logic service: certificates merge + persistence + certificate object builders.
import { db, isConfigured } from '../../../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS, ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readJSON, writeJSON } from './storage';

export const generateCertificateId = (prefix = 'CERT-EVT') =>
  `${prefix}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

export const certificatesService = {
  async fetchCertificates() {
    let certList = [];

    if (isConfigured) {
      try {
        const certSnap = await getDocs(
          collection(db, FIRESTORE_COLLECTIONS.CERTIFICATES)
        );
        certList = certSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error('Error fetching Firestore certificates:', err);
      }
    }

    const savedCerts = readJSON(ADMIN_STORAGE_KEYS.CERTIFICATES, []);
    const combinedCerts = [...certList];
    savedCerts.forEach((sc) => {
      if (!combinedCerts.some((c) => c.certificateId === sc.certificateId)) {
        combinedCerts.push(sc);
      }
    });

    return combinedCerts;
  },

  async createCertificate(certData) {
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
  },

  findByRegistration(certificates, reg) {
    return certificates.find(
      (c) => c.email === reg.email && c.eventId === reg.eventId
    );
  },

  buildTempCertificate(reg) {
    return {
      certificateId: generateCertificateId('CERT-TMP'),
      userId: reg.userId || 'guest',
      name: reg.name,
      email: reg.email,
      eventId: reg.eventId,
      eventTitle: reg.eventTitle || 'NayePankh Campaign Drive',
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      hours: 6,
    };
  },

  buildAttendedCertificate(reg, sigImage, stampImage) {
    return {
      certificateId: generateCertificateId('CERT-EVT'),
      userId: reg.userId || 'guest',
      name: reg.name,
      email: reg.email,
      eventId: reg.eventId,
      eventTitle: reg.eventTitle || 'NayePankh Campaign Drive',
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      hours: 6,
      signatureUrl: sigImage || '',
      stampUrl: stampImage || '',
    };
  },

  buildAiCertificate(certInputs, citation, sigImage, stampImage) {
    return {
      certificateId: generateCertificateId('CERT-AI'),
      userId: 'guest',
      name: certInputs.volunteerName,
      email: certInputs.volunteerEmail,
      eventId: 'evt-' + Date.now(),
      eventTitle: certInputs.eventTitle,
      date: new Date(certInputs.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      hours: parseInt(certInputs.hours) || 6,
      citation,
      signatureUrl: sigImage || '',
      stampUrl: stampImage || '',
    };
  },
};
