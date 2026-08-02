import { memo } from 'react';
import { Award, Download, X } from 'lucide-react';

/**
 * 【ui 层】证书预览/打印弹窗（纯展示组件，含打印样式）
 * @param {{
 *   certificate: object,
 *   sigImage: string,
 *   stampImage: string,
 *   onClose: () => void
 * }} props
 */
function CertificateModal({ certificate, sigImage, stampImage, onClose }) {
  return (
    <div id="printable-certificate-container" className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative border border-slate-200">
        {/* Modal actions - hidden when printing */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h4 className="text-lg font-bold text-slate-950 font-display flex items-center space-x-2">
            <Award className="h-5 w-5 text-amber-500" />
            <span>Volunteer Event Certificate</span>
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-650 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Certificate Template */}
        <div className="bg-amber-50/20 border-8 border-double border-amber-600 p-8 sm:p-12 text-center rounded-2xl relative font-serif" style={{ backgroundColor: '#fffdf9' }}>
          <div className="absolute top-4 left-4 text-amber-600/60 text-xl">✥</div>
          <div className="absolute top-4 right-4 text-amber-600/60 text-xl">✥</div>
          <div className="absolute bottom-4 left-4 text-amber-600/60 text-xl">✥</div>
          <div className="absolute bottom-4 right-4 text-amber-600/60 text-xl">✥</div>

          <div className="space-y-6">
            <img src="/logo.png" className="h-16 w-16 mx-auto object-contain bg-white p-1.5 rounded-2xl border border-amber-100 shadow-sm" alt="NayePankh Logo" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#132a13] uppercase tracking-widest font-display">Certificate of Participation</h2>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-sans font-bold">This is proudly presented to</p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-wide font-display italic my-2">{certificate.name}</h3>
            <p className="text-slate-650 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-sans">
              for outstanding volunteer contributions and active participation in the event <strong className="text-slate-950">"{certificate.eventTitle}"</strong> on <strong className="text-slate-950">{certificate.date}</strong>, logging <strong className="text-slate-950">{certificate.hours} hours</strong> of community service.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-amber-250/60 max-w-sm mx-auto font-sans">
              <div className="text-center">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest font-sans">Issued Date</p>
                <p className="text-xs font-bold text-slate-800 mt-1">{certificate.date}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest font-sans">Certificate ID</p>
                <p className="text-xs font-bold text-slate-850 mt-1 font-mono uppercase">{certificate.certificateId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 max-w-sm mx-auto font-sans relative">
              {/* Foundation Stamp (absolute center overlay) */}
              {(certificate.stampUrl || stampImage) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <img
                    src={certificate.stampUrl || stampImage}
                    className="w-16 h-16 object-contain mix-blend-multiply opacity-85 rotate-[-8deg] -translate-y-2"
                    alt="Foundation Stamp"
                  />
                </div>
              )}

              <div className="text-center flex flex-col items-center relative min-h-[48px] justify-end">
                {certificate.signatureUrl || sigImage ? (
                  <img
                    src={certificate.signatureUrl || sigImage}
                    className="absolute bottom-5 h-10 object-contain max-w-[120px] mix-blend-multiply"
                    alt="Founder Signature"
                  />
                ) : (
                  <span className="font-serif italic text-xs text-slate-750 font-bold absolute bottom-5">Prashant Shukla</span>
                )}
                <div className="w-16 h-px bg-slate-300 my-1"></div>
                <p className="text-[8px] text-slate-400 font-sans uppercase font-bold">Founder President</p>
              </div>

              <div className="text-center flex flex-col items-center relative min-h-[48px] justify-end">
                <span className="font-serif italic text-xs text-slate-750 font-bold absolute bottom-5">Anjali Gupta</span>
                <div className="w-16 h-px bg-slate-300 my-1"></div>
                <p className="text-[8px] text-slate-400 font-sans uppercase font-bold">National Coordinator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded styles for print layout */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden !important;
            }
            #printable-certificate-container, #printable-certificate-container * {
              visibility: visible !important;
            }
            #printable-certificate-container {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              z-index: 99999 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}} />
      </div>
    </div>
  );
}

export default memo(CertificateModal);
