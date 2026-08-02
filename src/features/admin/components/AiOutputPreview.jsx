import { memo } from 'react';
import {
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Mail,
  Upload,
  Loader2,
} from 'lucide-react';

function AiOutputPreview({
  aiTool,
  aiOutput,
  aiError,
  copied,
  certInputs,
  certUploading,
  certUploaded,
  sendingAppreciationEmail,
  appreciationEmailSent,
  sigImage,
  stampImage,
  onCopy,
  onSendEmail,
  onUploadCertFromAi,
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
            {aiTool === 'certificate'
              ? 'Certificate Document Preview'
              : 'Gemini AI Draft Output'}
          </span>

          {aiOutput && aiTool !== 'certificate' && (
            <button
              onClick={onCopy}
              className="flex items-center space-x-1.5 text-slate-700 hover:text-primary-650 hover:bg-primary-50/20 text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer shadow-sm"
            >
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
              <div className="space-y-6">
                <div
                  className="bg-amber-50/15 border-4 border-double border-amber-600 p-6 text-center rounded-2xl relative font-serif shadow-inner mx-auto max-w-md"
                  style={{ backgroundColor: '#fffdfb' }}
                >
                  <div className="absolute top-2 left-2 text-amber-600/40 text-xs">
                    ✥
                  </div>
                  <div className="absolute top-2 right-2 text-amber-600/40 text-xs">
                    ✥
                  </div>
                  <div className="absolute bottom-2 left-2 text-amber-600/40 text-xs">
                    ✥
                  </div>
                  <div className="absolute bottom-2 right-2 text-amber-600/40 text-xs">
                    ✥
                  </div>

                  <div className="space-y-4">
                    <img
                      src="/logo.png"
                      className="h-10 w-10 mx-auto object-contain bg-white p-1 rounded-xl border border-amber-100 shadow-sm"
                      alt="NayePankh Logo"
                    />
                    <h2 className="text-sm font-extrabold text-[#132a13] uppercase tracking-widest font-display">
                      Certificate of Participation
                    </h2>
                    <p className="text-slate-400 text-[8px] uppercase tracking-widest font-sans font-bold">
                      This is proudly presented to
                    </p>
                    <h3 className="text-lg font-extrabold text-slate-900 font-display italic my-1">
                      {certInputs.volunteerName}
                    </h3>
                    <p className="text-slate-650 text-[11px] leading-relaxed font-sans px-2">
                      {aiOutput}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-amber-200/40 max-w-xs mx-auto font-sans text-[9px]">
                      <div>
                        <p className="font-semibold text-slate-400 uppercase tracking-widest text-[7px]">
                          Date
                        </p>
                        <p className="font-bold text-slate-800">
                          {new Date(certInputs.date).toLocaleDateString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-400 uppercase tracking-widest text-[7px]">
                          Hours Logged
                        </p>
                        <p className="font-bold text-slate-850">
                          {certInputs.hours} Hours
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2.5 max-w-xs mx-auto font-sans text-[9px] relative border-t border-amber-100/50">
                      {stampImage && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <img
                            src={stampImage}
                            className="w-10 h-10 object-contain mix-blend-multiply opacity-85 rotate-[-8deg] -translate-y-1.5"
                            alt="Foundation Stamp"
                          />
                        </div>
                      )}

                      <div className="text-center flex flex-col items-center relative min-h-[36px] justify-end">
                        {sigImage ? (
                          <img
                            src={sigImage}
                            className="absolute bottom-3.5 h-6 object-contain max-w-[80px] mix-blend-multiply"
                            alt="Founder Signature"
                          />
                        ) : (
                          <span className="font-serif italic text-[8px] text-slate-500 absolute bottom-3.5">
                            Prashant Shukla
                          </span>
                        )}
                        <div className="w-10 h-px bg-slate-300 my-0.5"></div>
                        <p className="text-[6px] text-slate-400 font-sans uppercase font-bold">
                          Founder President
                        </p>
                      </div>

                      <div className="text-center flex flex-col items-center relative min-h-[36px] justify-end">
                        <span className="font-serif italic text-[8px] text-slate-500 absolute bottom-3.5">
                          Anjali Gupta
                        </span>
                        <div className="w-10 h-px bg-slate-300 my-0.5"></div>
                        <p className="text-[6px] text-slate-400 font-sans uppercase font-bold">
                          National Coordinator
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={onUploadCertFromAi}
                    disabled={certUploading || certUploaded}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${
                      certUploaded
                        ? 'bg-emerald-500 text-white cursor-default'
                        : 'bg-slate-950 hover:bg-slate-850 text-white'
                    }`}
                  >
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
            ) : (
              <div className="space-y-6">
                <div className="text-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[300px] p-4 bg-white rounded-xl border border-slate-200 w-full text-left">
                  {aiOutput}
                </div>
                {aiTool === 'appreciation' && (
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={onSendEmail}
                      disabled={
                        sendingAppreciationEmail || appreciationEmailSent
                      }
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${
                        appreciationEmailSent
                          ? 'bg-emerald-500 text-white cursor-default'
                          : 'bg-slate-950 hover:bg-slate-850 text-white'
                      }`}
                    >
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
                <p className="text-xs font-bold text-slate-700">
                  No content generated yet
                </p>
                <p className="text-[11px] text-slate-450 max-w-xs leading-relaxed">
                  Adjust parameters on the left and click "Generate with Gemini"
                  to output custom campaigns and documents.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200/60 pt-3.5 mt-4 text-[10px] text-slate-500 flex items-center justify-between">
          <span>
            Please review generated text for correctness before publishing.
          </span>
          <span className="font-semibold text-slate-400">
            NayePankh AI Assistant
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(AiOutputPreview);
