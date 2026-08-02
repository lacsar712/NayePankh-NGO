// Admin logic layer — Certificates hook
// Owns the certificate ledger + branding assets (signature / stamp) + the
// download modal state, and exposes helpers to mint certificates from other
// domains (registrations, AI tool).
import { useState, useCallback } from 'react';
import { useCollectionLoader } from './useCollectionLoader';
import {
  loadCertificates,
  saveCertificate,
  loadBrandingAssets,
  saveSignature,
  saveStamp,
  resetBrandingAssets,
} from '../services/certificatesService';

function readFileAsDataUrl(file, onDone) {
  const reader = new FileReader();
  reader.onloadend = () => onDone(reader.result);
  reader.readAsDataURL(file);
}

export function useAdminCertificates() {
  const { data: certificates, setData: setCertificates, loading } = useCollectionLoader(loadCertificates);

  // Read the persisted branding assets ONCE (was previously read twice).
  const [assets, setAssets] = useState(loadBrandingAssets);
  const { sigImage, stampImage } = assets;

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);

  // Persist + append a certificate to the ledger. Returns the certData.
  const addCertificate = useCallback(async (certData) => {
    await saveCertificate(certData);
    setCertificates((prev) => [...prev, certData]);
    return certData;
  }, [setCertificates]);

  const uploadSignature = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    readFileAsDataUrl(file, (result) => {
      setAssets((prev) => ({ ...prev, sigImage: result }));
      saveSignature(result);
    });
  }, []);

  const uploadStamp = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    readFileAsDataUrl(file, (result) => {
      setAssets((prev) => ({ ...prev, stampImage: result }));
      saveStamp(result);
    });
  }, []);

  const resetAssets = useCallback(() => {
    setAssets({ sigImage: '', stampImage: '' });
    resetBrandingAssets();
  }, []);

  const openCertificate = useCallback((cert) => {
    setSelectedCertificate(cert);
    setShowCertModal(true);
  }, []);

  const closeCertificate = useCallback(() => {
    setShowCertModal(false);
    setSelectedCertificate(null);
  }, []);

  return {
    certificates,
    loading,
    sigImage,
    stampImage,
    selectedCertificate,
    showCertModal,
    addCertificate,
    uploadSignature,
    uploadStamp,
    resetAssets,
    openCertificate,
    closeCertificate,
  };
}
