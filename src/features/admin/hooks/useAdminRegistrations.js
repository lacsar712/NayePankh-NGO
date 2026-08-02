// Admin logic layer — Registrations hook
// Depends on the certificates hook: marking a registration attended mints a
// certificate (using the current branding assets) and appends it to the ledger.
import { useCallback } from 'react';
import { useCollectionLoader } from './useCollectionLoader';
import {
  loadRegistrations,
  deleteRegistration,
  markRegistrationAttended,
} from '../services/registrationsService';

function randomCertId(prefix) {
  return `${prefix}-` + Math.random().toString(36).substring(2, 10).toUpperCase();
}

/**
 * @param {object} deps
 * @param {(certData: object) => Promise<object>} deps.addCertificate  mint + persist a certificate
 * @param {Array}  deps.certificates   current ledger (to resolve view lookups)
 * @param {(cert: object) => void} deps.openCertificate  open the download modal
 * @param {string} deps.sigImage   founder signature data url
 * @param {string} deps.stampImage foundation stamp data url
 */
export function useAdminRegistrations({ addCertificate, certificates, openCertificate, sigImage, stampImage }) {
  const { data: registrations, setData: setRegistrations, loading } = useCollectionLoader(loadRegistrations);

  const removeRegistration = useCallback(async (id) => {
    const filtered = await deleteRegistration(registrations, id);
    if (filtered) setRegistrations(filtered);
  }, [registrations, setRegistrations]);

  const markAttended = useCallback(async (reg) => {
    const certId = randomCertId('CERT-EVT');
    const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const updatedRegs = registrations.map((r) =>
      r.id === reg.id || (r.eventId === reg.eventId && r.email === reg.email)
        ? { ...r, status: 'attended' }
        : r
    );
    setRegistrations(updatedRegs);
    await markRegistrationAttended(updatedRegs, reg);

    const certData = {
      certificateId: certId,
      userId: reg.userId || 'guest',
      name: reg.name,
      email: reg.email,
      eventId: reg.eventId,
      eventTitle: reg.eventTitle || 'NayePankh Campaign Drive',
      date: formattedDate,
      hours: 6,
      signatureUrl: sigImage || '',
      stampUrl: stampImage || '',
    };
    await addCertificate(certData);

    alert(`Success! ${reg.name} has been marked as attended. Certificate ${certId} generated.`);
  }, [registrations, setRegistrations, addCertificate, sigImage, stampImage]);

  const viewCertificate = useCallback((reg) => {
    const cert = certificates.find((c) => c.email === reg.email && c.eventId === reg.eventId);
    if (cert) {
      openCertificate(cert);
      return;
    }
    openCertificate({
      certificateId: randomCertId('CERT-TMP'),
      userId: reg.userId || 'guest',
      name: reg.name,
      email: reg.email,
      eventId: reg.eventId,
      eventTitle: reg.eventTitle || 'NayePankh Campaign Drive',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      hours: 6,
    });
  }, [certificates, openCertificate]);

  return { registrations, loading, removeRegistration, markAttended, viewCertificate };
}
