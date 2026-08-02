import { useState, useEffect, useCallback } from 'react';
import { registrationsService } from '../services/registrationsService';

export function useRegistrations(sigImage, stampImage, addCertificate, enabled = true) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoading(true);
    registrationsService
      .fetchRegistrations()
      .then((list) => {
        if (active) {
          setRegistrations(list);
          setLoading(false);
        }
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [enabled]);

  const handleDeleteRegistration = useCallback(
    async (id) => {
      const updated = await registrationsService.deleteRegistration(
        registrations,
        id
      );
      setRegistrations(updated);
    },
    [registrations]
  );

  const handleMarkAttended = useCallback(
    async (reg) => {
      const { updatedRegs, certData } =
        await registrationsService.markAttended(
          registrations,
          reg,
          sigImage,
          stampImage
        );
      setRegistrations(updatedRegs);
      await addCertificate(certData);
      alert(
        `Success! ${reg.name} has been marked as attended. Certificate ${certData.certificateId} generated.`
      );
    },
    [registrations, sigImage, stampImage, addCertificate]
  );

  return {
    registrations,
    loading,
    handleDeleteRegistration,
    handleMarkAttended,
  };
}
