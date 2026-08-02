import { useState, useCallback } from 'react';
import { assetsService } from '../services/assetsService';

export function useCertificateAssets() {
  const [sigImage, setSigImage] = useState(() =>
    assetsService.loadSignature()
  );
  const [stampImage, setStampImage] = useState(() =>
    assetsService.loadStamp()
  );

  const handleUploadSignature = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      assetsService.uploadSignature(file).then((dataUrl) => {
        setSigImage(dataUrl);
      });
    }
  }, []);

  const handleUploadStamp = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      assetsService.uploadStamp(file).then((dataUrl) => {
        setStampImage(dataUrl);
      });
    }
  }, []);

  const handleResetAssets = useCallback(() => {
    assetsService.resetAssets();
    setSigImage('');
    setStampImage('');
  }, []);

  return {
    sigImage,
    stampImage,
    handleUploadSignature,
    handleUploadStamp,
    handleResetAssets,
  };
}
