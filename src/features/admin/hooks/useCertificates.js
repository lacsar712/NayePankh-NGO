import { useState, useEffect, useCallback } from 'react';
import { certificatesService } from '../services/certificatesService';

export function useCertificates(enabled = true) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoading(true);
    certificatesService
      .fetchCertificates()
      .then((list) => {
        if (active) {
          setCertificates(list);
          setLoading(false);
        }
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [enabled]);

  const addCertificate = useCallback(async (certData) => {
    const saved = await certificatesService.createCertificate(certData);
    setCertificates((prev) => [...prev, saved]);
    return saved;
  }, []);

  const openCertificate = useCallback((cert) => {
    setSelectedCertificate(cert);
    setShowCertModal(true);
  }, []);

  const closeCertificate = useCallback(() => {
    setShowCertModal(false);
    setSelectedCertificate(null);
  }, []);

  const viewCertificateForReg = useCallback(
    (reg) => {
      const existing = certificatesService.findByRegistration(certificates, reg);
      if (existing) {
        openCertificate(existing);
      } else {
        openCertificate(certificatesService.buildTempCertificate(reg));
      }
    },
    [certificates, openCertificate]
  );

  return {
    certificates,
    loading,
    selectedCertificate,
    showCertModal,
    addCertificate,
    openCertificate,
    closeCertificate,
    viewCertificateForReg,
  };
}
