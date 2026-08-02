// UI component: Gemini AI tab — composes tool tabs, forms, and output preview.
import { Sparkles, Loader2 } from 'lucide-react';
import { AI_TOOLS } from '../../constants/tabs';
import AiToolTabs from './ai/AiToolTabs';
import {
  SocialForm,
  AppealForm,
  ReportForm,
  AppreciationForm,
  CertificateForm,
} from './ai/AiToolForms';
import AiOutputPanel from './ai/AiOutputPanel';

export default function AiAssistantPanel({
  volunteers,
  sigImage,
  stampImage,
  aiTool,
  setAiTool,
  aiLoading,
  aiError,
  aiOutput,
  copied,
  socialInputs,
  setSocialInputs,
  appealInputs,
  setAppealInputs,
  reportInputs,
  setReportInputs,
  appreciationInputs,
  setAppreciationInputs,
  certInputs,
  setCertInputs,
  certUploading,
  certUploaded,
  sendingAppreciationEmail,
  appreciationEmailSent,
  onGenerate,
  onCopy,
  onSendAppreciationEmail,
  onSelectVolunteerForCert,
  onUploadCertFromAi,
}) {
  const renderForm = () => {
    switch (aiTool) {
      case AI_TOOLS.SOCIAL:
        return <SocialForm inputs={socialInputs} setInputs={setSocialInputs} />;
      case AI_TOOLS.APPEAL:
        return <AppealForm inputs={appealInputs} setInputs={setAppealInputs} />;
      case AI_TOOLS.REPORT:
        return <ReportForm inputs={reportInputs} setInputs={setReportInputs} />;
      case AI_TOOLS.APPRECIATION:
        return (
          <AppreciationForm
            inputs={appreciationInputs}
            setInputs={setAppreciationInputs}
            volunteers={volunteers}
          />
        );
      case AI_TOOLS.CERTIFICATE:
        return (
          <CertificateForm
            inputs={certInputs}
            setInputs={setCertInputs}
            volunteers={volunteers}
            onSelectVolunteer={onSelectVolunteerForCert}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-950 font-display flex items-center space-x-2">
          <Sparkles className="h-5.5 w-5.5 text-accent-500 animate-pulse" />
          <span>Gemini AI Content Engine</span>
        </h2>
        <span className="text-xs font-bold text-slate-400 uppercase">
          Powered by Gemini 1.5 Flash
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <AiToolTabs aiTool={aiTool} onSelect={setAiTool} />

          <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <form onSubmit={onGenerate} className="space-y-5">
              {renderForm()}

              <button
                type="submit"
                disabled={aiLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-xs shadow transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating content...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 fill-white text-white" />
                    <span>Generate with Gemini</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          <AiOutputPanel
            aiTool={aiTool}
            aiError={aiError}
            aiOutput={aiOutput}
            copied={copied}
            certInputs={certInputs}
            sigImage={sigImage}
            stampImage={stampImage}
            certUploading={certUploading}
            certUploaded={certUploaded}
            sendingAppreciationEmail={sendingAppreciationEmail}
            appreciationEmailSent={appreciationEmailSent}
            aiLoading={aiLoading}
            onCopy={onCopy}
            onSendAppreciationEmail={onSendAppreciationEmail}
            onUploadCertFromAi={onUploadCertFromAi}
          />
        </div>
      </div>
    </div>
  );
}
