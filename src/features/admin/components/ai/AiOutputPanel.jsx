// Admin UI layer — AI content-engine output panel (right column)
// Renders the draft output, the certificate preview (for the certificate tool),
// and the appreciation-email action. Memoized and driven only by output-related
// props so typing in the left-hand form does not re-render this panel.
import { memo } from 'react';
import { Sparkles, AlertCircle, Copy, Check, Loader2, Mail } from 'lucide-react';
import AiCertificatePreview from './AiCertificatePreview';

function AiOutputPanel({
  aiTool, aiError, aiOutput, copied,
  certInputs, sigImage, stampImage,
  certUploading, certUploaded, sendingAppreciationEmail, appreciationEmailSent,
  onCopy, onUploadCert, onSendEmail,
}) {
  return (
    <div className="lg:col-span-7 space-y-6">
      {aiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5 text-red-600 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{aiError}</span>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[460px] flex flex-col justify-between text-slate-900 shadow-sm relative">
        <div className="flex justify-between items-center border-b border-slate-200/60 pb-3.5 mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
            {aiTool === 'certificate' ? 'Certificate Document Preview' : 'Gemini AI Draft Output'}
          </span>
          {aiOutput && aiTool !== 'certificate' && (
            <button onClick={onCopy} className="flex items-center space-x-1.5 text-slate-700 hover:text-primary-650 hover:bg-primary-50/20 text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer shadow-sm">
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 animate-bounce" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Draft</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex-grow flex flex-col justify-center">
          {aiOutput ? (
            aiTool === 'certificate' ? (
              <AiCertificatePreview
                certInputs={certInputs}
                aiOutput={aiOutput}
                sigImage={sigImage}
                stampImage={stampImage}
                certUploading={certUploading}
                certUploaded={certUploaded}
                onUpload={onUploadCert}
              />
            ) : (
              <div className="space-y-6">
                <div className="text-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[300px] p-4 bg-white rounded-xl border border-slate-200 w-full text-left">
                  {aiOutput}
                </div>
                {aiTool === 'appreciation' && (
                  <div className="flex justify-center pt-2">
                    <button type="button" onClick={onSendEmail} disabled={sendingAppreciationEmail || appreciationEmailSent} className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${appreciationEmailSent ? 'bg-emerald-500 text-white cursor-default' : 'bg-slate-950 hover:bg-slate-850 text-white'}`}>
                      {sendingAppreciationEmail ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Sending Email...</span>
                        </>
                      ) : appreciationEmailSent ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Email Sent!</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          <span>Send Email to Volunteer</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-slate-400 py-12 space-y-4">
              <div className="p-3.5 bg-slate-100 rounded-full">
                <Sparkles className="h-8 w-8 text-slate-350 opacity-40" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700">No content generated yet</p>
                <p className="text-[11px] text-slate-450 max-w-xs leading-relaxed">Adjust parameters on the left and click "Generate with Gemini" to output custom campaigns and documents.</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200/60 pt-3.5 mt-4 text-[10px] text-slate-500 flex items-center justify-between">
          <span>Please review generated text for correctness before publishing.</span>
          <span className="font-semibold text-slate-400">NayePankh AI Assistant</span>
        </div>
      </div>
    </div>
  );
}

export default memo(AiOutputPanel);
