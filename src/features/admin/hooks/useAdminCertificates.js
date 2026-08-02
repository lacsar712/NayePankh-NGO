import { useState, useEffect, useCallback } from 'react';
import {
  fetchCertificates,
  issueCertificate,
  getBrandingAssets,
  saveBrandingAsset,
  resetBrandingAssets,
} from '../services/certificatesService';

/**
 * 【logic 层｜hooks】证书域 Hook（台账 + 品牌资产 + 预览弹窗状态）。
 * @returns {{
 *   list: Array,
 *   addCertificate: (certData: object) => Promise<object>,
 *   selected: object|null,
 *   isModalOpen: boolean,
 *   view: (cert: object) => void,
 *   viewForRegistration: (reg: object) => void,
 *   closeModal: () => void,
 *   sigImage: string,
 *   stampImage: string,
 *   uploadSignature: (e: {target: {files: File[]}}) => void,
 *   uploadStamp: (e: {target: {files: File[]}}) => void,
 *   resetAssets: () => void
 * }}
 */
export function useAdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sigImage, setSigImage] = useState(() => getBrandingAssets().signature);
  const [stampImage, setStampImage] = useState(() => getBrandingAssets().stamp);

  useEffect(() => {
    let cancelled = false;
    fetchCertificates().then(list => {
      if (!cancelled) setCertificates(list);
    });
    return () => { cancelled = true; };
  }, []);

  const addCertificate = useCallback(async (certData) => {
    const saved = await issueCertificate(certData);
    setCertificates(prev => [...prev, saved]);
    return saved;
  }, []);

  const view = useCallback((cert) => {
    setSelected(cert);
    setIsModalOpen(true);
  }, []);

  /** 报名记录视角查看证书：找不到则生成临时预览证书（行为保持） */
  const viewForRegistration = useCallback((reg) => {
    const cert = certificates.find(c => c.email === reg.email && c.eventId === reg.eventId);
    if (cert) {
      view(cert);
    } else {
      view({
        certificateId: 'CERT-TMP-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        userId: reg.userId || 'guest',
        name: reg.name,
        email: reg.email,
        eventId: reg.eventId,
        eventTitle: reg.eventTitle || 'NayePankh Campaign Drive',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        hours: 6,
      });
    }
  }, [certificates, view]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelected(null);
  }, []);

  const uploadAsset = useCallback((kind) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (kind === 'signature') setSigImage(reader.result);
      else setStampImage(reader.result);
      saveBrandingAsset(kind, reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const uploadSignature = useCallback(uploadAsset('signature'), [uploadAsset]);
  const uploadStamp = useCallback(uploadAsset('stamp'), [uploadAsset]);

  const resetAssets = useCallback(() => {
    setSigImage('');
    setStampImage('');
    resetBrandingAssets();
  }, []);

  return {
    list: certificates,
    addCertificate,
    selected,
    isModalOpen,
    view,
    viewForRegistration,
    closeModal,
    sigImage,
    stampImage,
    uploadSignature,
    uploadStamp,
    resetAssets,
  };
}
