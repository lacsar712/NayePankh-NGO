// Admin UI layer — Gemini AI content engine tab (container)
// Round 2: instantiates useAdminAi LOCALLY (was previously composed in the
// orchestrator), so AI-form keystrokes re-render only this subtree — never the
// dashboard shell or sibling tabs. The form and output panel are split + memoized
// so typing in the form does not re-render the heavy certificate preview.
import { Sparkles } from 'lucide-react';
import { useAdminAi } from '../../hooks/useAdminAi';
import AiToolForm from './ai/AiToolForm';
import AiOutputPanel from './ai/AiOutputPanel';

export default function AiAssistantTab({ addCertificate, sigImage, stampImage, volunteers }) {
  const ai = useAdminAi({ addCertificate, sigImage, stampImage });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-950 font-display flex items-center space-x-2">
          <Sparkles className="h-5.5 w-5.5 text-accent-500 animate-pulse" />
          <span>Gemini AI Content Engine</span>
        </h2>
        <span className="text-xs font-bold text-slate-400 uppercase">Powered by Gemini 1.5 Flash</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <AiToolForm ai={ai} volunteers={volunteers} />
        <AiOutputPanel
          aiTool={ai.aiTool}
          aiError={ai.aiError}
          aiOutput={ai.aiOutput}
          copied={ai.copied}
          certInputs={ai.certInputs}
          sigImage={sigImage}
          stampImage={stampImage}
          certUploading={ai.certUploading}
          certUploaded={ai.certUploaded}
          sendingAppreciationEmail={ai.sendingAppreciationEmail}
          appreciationEmailSent={ai.appreciationEmailSent}
          onCopy={ai.copyToClipboard}
          onUploadCert={ai.uploadCertFromAi}
          onSendEmail={ai.sendAppreciationEmail}
        />
      </div>
    </div>
  );
}
