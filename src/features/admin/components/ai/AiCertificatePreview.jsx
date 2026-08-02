// Admin UI layer — AI certificate preview card
// The heavy, purely-derived certificate render. Memoized so it only re-renders
// when the citation text / cert fields / branding assets actually change.
import { memo } from 'react';
import { Loader2, Check, Upload } from 'lucide-react';

function AiCertificatePreview({ certInputs, aiOutput, sigImage, stampImage, certUploading, certUploaded, onUpload }) {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50/15 border-4 border-double border-amber-600 p-6 text-center rounded-2xl relative font-serif shadow-inner mx-auto max-w-md" style={{ backgroundColor: '#fffdfb' }}>
        <div className="absolute top-2 left-2 text-amber-600/40 text-xs">✥</div>
        <div className="absolute top-2 right-2 text-amber-600/40 text-xs">✥</div>
        <div className="absolute bottom-2 left-2 text-amber-600/40 text-xs">✥</div>
        <div className="absolute bottom-2 right-2 text-amber-600/40 text-xs">✥</div>
        <div className="space-y-4">
          <img src="/logo.png" className="h-10 w-10 mx-auto object-contain bg-white p-1 rounded-xl border border-amber-100 shadow-sm" alt="NayePankh Logo" />
          <h2 className="text-sm font-extrabold text-[#132a13] uppercase tracking-widest font-display">Certificate of Participation</h2>
          <p className="text-slate-400 text-[8px] uppercase tracking-widest font-sans font-bold">This is proudly presented to</p>
          <h3 className="text-lg font-extrabold text-slate-900 font-display italic my-1">{certInputs.volunteerName}</h3>
          <p className="text-slate-650 text-[11px] leading-relaxed font-sans px-2">{aiOutput}</p>
          <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-amber-200/40 max-w-xs mx-auto font-sans text-[9px]">
            <div>
              <p className="font-semibold text-slate-400 uppercase tracking-widest text-[7px]">Date</p>
              <p className="font-bold text-slate-800">{new Date(certInputs.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-400 uppercase tracking-widest text-[7px]">Hours Logged</p>
              <p className="font-bold text-slate-850">{certInputs.hours} Hours</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2.5 max-w-xs mx-auto font-sans text-[9px] relative border-t border-amber-100/50">
            {stampImage && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <img src={stampImage} className="w-10 h-10 object-contain mix-blend-multiply opacity-85 rotate-[-8deg] -translate-y-1.5" alt="Foundation Stamp" />
              </div>
            )}
            <div className="text-center flex flex-col items-center relative min-h-[36px] justify-end">
              {sigImage ? (
                <img src={sigImage} className="absolute bottom-3.5 h-6 object-contain max-w-[80px] mix-blend-multiply" alt="Founder Signature" />
              ) : (
                <span className="font-serif italic text-[8px] text-slate-500 absolute bottom-3.5">Prashant Shukla</span>
              )}
              <div className="w-10 h-px bg-slate-300 my-0.5"></div>
              <p className="text-[6px] text-slate-400 font-sans uppercase font-bold">Founder President</p>
            </div>
            <div className="text-center flex flex-col items-center relative min-h-[36px] justify-end">
              <span className="font-serif italic text-[8px] text-slate-500 absolute bottom-3.5">Anjali Gupta</span>
              <div className="w-10 h-px bg-slate-300 my-0.5"></div>
              <p className="text-[6px] text-slate-400 font-sans uppercase font-bold">National Coordinator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button type="button" onClick={onUpload} disabled={certUploading || certUploaded} className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${certUploaded ? 'bg-emerald-500 text-white cursor-default' : 'bg-slate-950 hover:bg-slate-850 text-white'}`}>
          {certUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading Certificate...</span>
            </>
          ) : certUploaded ? (
            <>
              <Check className="h-4 w-4" />
              <span>Uploaded to Volunteer Profile!</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload to Volunteer Profile</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default memo(AiCertificatePreview);
