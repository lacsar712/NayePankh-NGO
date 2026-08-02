// UI component: certificates tab — composes asset upload + certificate ledger.
import CertificateAssetsUpload from './certificates/CertificateAssetsUpload';
import CertificateLedger from './certificates/CertificateLedger';

export default function CertificatesPanel({
  certificates,
  sigImage,
  stampImage,
  onUploadSignature,
  onUploadStamp,
  onResetAssets,
  onViewCertificate,
}) {
  return (
    <div className="space-y-8">
      <CertificateAssetsUpload
        sigImage={sigImage}
        stampImage={stampImage}
        onUploadSignature={onUploadSignature}
        onUploadStamp={onUploadStamp}
        onReset={onResetAssets}
      />
      <CertificateLedger certificates={certificates} onView={onViewCertificate} />
    </div>
  );
}
