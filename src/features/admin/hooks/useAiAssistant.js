import { useState, useCallback } from 'react';
import {
  generateSocialPost,
  generateDonationAppeal,
  generateEventReport,
  generateVolunteerThankYou,
  generateCertificateCitation,
} from '../../../services/gemini';
import { certificatesService } from '../services/certificatesService';
import { AI_TOOLS } from '../constants/tabs';

const todayStr = () => new Date().toISOString().split('T')[0];

export function useAiAssistant(volunteers, sigImage, stampImage, addCertificate) {
  const [aiTool, setAiTool] = useState(AI_TOOLS.SOCIAL);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const [socialInputs, setSocialInputs] = useState({
    title: '',
    platform: 'Twitter',
    tone: 'inspiring',
    achievements: '',
  });
  const [appealInputs, setAppealInputs] = useState({
    cause: '',
    targetAmount: '',
    targetAudience: '',
  });
  const [reportInputs, setReportInputs] = useState({
    eventName: '',
    reachCount: '',
    hoursContributed: '',
    summaries: '',
  });
  const [appreciationInputs, setAppreciationInputs] = useState({
    volunteerEmail: '',
    volunteerName: '',
    contributions: '',
    program: 'Project Shiksha',
  });
  const [certInputs, setCertInputs] = useState({
    volunteerEmail: '',
    volunteerName: '',
    eventTitle: 'Noida Winter Clothes & Blanket Drive',
    contributions: '',
    hours: '6',
    date: todayStr(),
  });

  const [certUploading, setCertUploading] = useState(false);
  const [certUploaded, setCertUploaded] = useState(false);

  const [sendingAppreciationEmail, setSendingAppreciationEmail] = useState(false);
  const [appreciationEmailSent, setAppreciationEmailSent] = useState(false);

  const resetOutputState = useCallback(() => {
    setAiError('');
    setAiOutput('');
    setCertUploaded(false);
  }, []);

  const handleSelectTool = useCallback(
    (toolId) => {
      setAiTool(toolId);
      resetOutputState();
    },
    [resetOutputState]
  );

  const handleSelectVolunteerForCert = useCallback((email) => {
    const vol = volunteers.find((v) => v.email === email);
    if (vol) {
      setCertInputs((prev) => ({
        ...prev,
        volunteerEmail: vol.email,
        volunteerName: vol.name,
      }));
    } else {
      setCertInputs((prev) => ({ ...prev, volunteerEmail: email, volunteerName: '' }));
    }
  }, [volunteers]);

  const handleGenerateContent = useCallback(
    async (e) => {
      e.preventDefault();
      setAiLoading(true);
      setAiError('');
      setAiOutput('');
      setCopied(false);
      setCertUploaded(false);
      setAppreciationEmailSent(false);

      try {
        let result = '';
        if (aiTool === AI_TOOLS.SOCIAL) {
          if (!socialInputs.title || !socialInputs.achievements) {
            throw new Error('Please enter campaign title and key achievements.');
          }
          result = await generateSocialPost(
            socialInputs.title,
            socialInputs.platform,
            socialInputs.tone,
            socialInputs.achievements
          );
        } else if (aiTool === AI_TOOLS.APPEAL) {
          if (!appealInputs.cause || !appealInputs.targetAmount) {
            throw new Error('Please specify fundraising cause and target amount.');
          }
          result = await generateDonationAppeal(
            appealInputs.cause,
            appealInputs.targetAmount,
            appealInputs.targetAudience || 'General Donors'
          );
        } else if (aiTool === AI_TOOLS.REPORT) {
          if (!reportInputs.eventName || !reportInputs.reachCount) {
            throw new Error('Please fill out event name and reach counts.');
          }
          result = await generateEventReport(
            reportInputs.eventName,
            reportInputs.reachCount,
            reportInputs.hoursContributed || '0',
            reportInputs.summaries
          );
        } else if (aiTool === AI_TOOLS.APPRECIATION) {
          if (!appreciationInputs.volunteerName || !appreciationInputs.contributions) {
            throw new Error('Please specify volunteer name and contributions.');
          }
          result = await generateVolunteerThankYou(
            appreciationInputs.volunteerName,
            appreciationInputs.contributions,
            appreciationInputs.program
          );
        } else if (aiTool === AI_TOOLS.CERTIFICATE) {
          if (
            !certInputs.volunteerName ||
            !certInputs.volunteerEmail ||
            !certInputs.eventTitle
          ) {
            throw new Error('Please enter volunteer name, email and event title.');
          }
          result = await generateCertificateCitation(
            certInputs.volunteerName,
            certInputs.eventTitle,
            certInputs.contributions || 'their dedicated service'
          );
        }
        setAiOutput(result);
      } catch (err) {
        setAiError(err.message || 'An error occurred during generation.');
      } finally {
        setAiLoading(false);
      }
    },
    [
      aiTool,
      socialInputs,
      appealInputs,
      reportInputs,
      appreciationInputs,
      certInputs,
    ]
  );

  const handleCopyToClipboard = useCallback(() => {
    if (aiOutput) {
      navigator.clipboard.writeText(aiOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [aiOutput]);

  const handleSendAppreciationEmail = useCallback(async () => {
    if (!appreciationInputs.volunteerEmail || !aiOutput) return;
    setSendingAppreciationEmail(true);
    setAppreciationEmailSent(false);

    try {
      const subject = encodeURIComponent(
        'Thank You for Your Support - NayePankh Foundation'
      );
      const body = encodeURIComponent(aiOutput);
      const mailtoUrl = `mailto:${appreciationInputs.volunteerEmail}?subject=${subject}&body=${body}`;

      window.location.href = mailtoUrl;

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSendingAppreciationEmail(false);
      setAppreciationEmailSent(true);
      alert(
        `Success! Opened your email client with a pre-filled appreciation draft for ${appreciationInputs.volunteerName} (${appreciationInputs.volunteerEmail}).`
      );
    } catch (err) {
      console.error('Error launching mail client:', err);
      setSendingAppreciationEmail(false);
    }
  }, [appreciationInputs, aiOutput]);

  const handleUploadCertFromAi = useCallback(async () => {
    if (!certInputs.volunteerName || !certInputs.volunteerEmail || !aiOutput) return;
    setCertUploading(true);
    setCertUploaded(false);

    const certData = certificatesService.buildAiCertificate(
      certInputs,
      aiOutput,
      sigImage,
      stampImage
    );

    await addCertificate(certData);

    setCertUploading(false);
    setCertUploaded(true);
    alert(
      `Success! Certificate ${certData.certificateId} created and uploaded to ${certInputs.volunteerName}'s profile.`
    );
  }, [certInputs, aiOutput, sigImage, stampImage, addCertificate]);

  return {
    aiTool,
    setAiTool: handleSelectTool,
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
    handleGenerateContent,
    handleCopyToClipboard,
    handleSendAppreciationEmail,
    handleSelectVolunteerForCert,
    handleUploadCertFromAi,
  };
}
