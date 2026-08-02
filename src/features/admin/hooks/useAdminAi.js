// Admin logic layer — AI assistant hook
// Owns all Gemini content-tool form state, generation dispatch, clipboard,
// appreciation email launch, and "upload certificate from AI citation".
import { useState, useCallback } from 'react';
import {
  generateSocialPost,
  generateDonationAppeal,
  generateEventReport,
  generateVolunteerThankYou,
  generateCertificateCitation,
} from '../../../services/gemini';

const INITIAL_CERT_INPUTS = () => ({
  volunteerEmail: '',
  volunteerName: '',
  eventTitle: 'Noida Winter Clothes & Blanket Drive',
  contributions: '',
  hours: '6',
  date: new Date().toISOString().split('T')[0],
});

/**
 * @param {object} deps
 * @param {(certData: object) => Promise<object>} deps.addCertificate
 * @param {string} deps.sigImage
 * @param {string} deps.stampImage
 */
export function useAdminAi({ addCertificate, sigImage, stampImage }) {
  const [aiTool, setAiTool] = useState('social');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const [socialInputs, setSocialInputs] = useState({ title: '', platform: 'Twitter', tone: 'inspiring', achievements: '' });
  const [appealInputs, setAppealInputs] = useState({ cause: '', targetAmount: '', targetAudience: '' });
  const [reportInputs, setReportInputs] = useState({ eventName: '', reachCount: '', hoursContributed: '', summaries: '' });
  const [appreciationInputs, setAppreciationInputs] = useState({ volunteerEmail: '', volunteerName: '', contributions: '', program: 'Project Shiksha' });
  const [certInputs, setCertInputs] = useState(INITIAL_CERT_INPUTS);

  const [certUploading, setCertUploading] = useState(false);
  const [certUploaded, setCertUploaded] = useState(false);
  const [sendingAppreciationEmail, setSendingAppreciationEmail] = useState(false);
  const [appreciationEmailSent, setAppreciationEmailSent] = useState(false);

  const selectTool = useCallback((toolId) => {
    setAiTool(toolId);
    setAiError('');
    setAiOutput('');
    setCertUploaded(false);
  }, []);

  const generate = useCallback(async (e) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError('');
    setAiOutput('');
    setCopied(false);
    setCertUploaded(false);
    setAppreciationEmailSent(false);

    try {
      let result = '';
      if (aiTool === 'social') {
        if (!socialInputs.title || !socialInputs.achievements) throw new Error('Please enter campaign title and key achievements.');
        result = await generateSocialPost(socialInputs.title, socialInputs.platform, socialInputs.tone, socialInputs.achievements);
      } else if (aiTool === 'appeal') {
        if (!appealInputs.cause || !appealInputs.targetAmount) throw new Error('Please specify fundraising cause and target amount.');
        result = await generateDonationAppeal(appealInputs.cause, appealInputs.targetAmount, appealInputs.targetAudience || 'General Donors');
      } else if (aiTool === 'report') {
        if (!reportInputs.eventName || !reportInputs.reachCount) throw new Error('Please fill out event name and reach counts.');
        result = await generateEventReport(reportInputs.eventName, reportInputs.reachCount, reportInputs.hoursContributed || '0', reportInputs.summaries);
      } else if (aiTool === 'appreciation') {
        if (!appreciationInputs.volunteerName || !appreciationInputs.contributions) throw new Error('Please specify volunteer name and contributions.');
        result = await generateVolunteerThankYou(appreciationInputs.volunteerName, appreciationInputs.contributions, appreciationInputs.program);
      } else if (aiTool === 'certificate') {
        if (!certInputs.volunteerName || !certInputs.volunteerEmail || !certInputs.eventTitle) {
          throw new Error('Please enter volunteer name, email and event title.');
        }
        result = await generateCertificateCitation(certInputs.volunteerName, certInputs.eventTitle, certInputs.contributions || 'their dedicated service');
      }
      setAiOutput(result);
    } catch (err) {
      setAiError(err.message || 'An error occurred during generation.');
    } finally {
      setAiLoading(false);
    }
  }, [aiTool, socialInputs, appealInputs, reportInputs, appreciationInputs, certInputs]);

  const copyToClipboard = useCallback(() => {
    if (!aiOutput) return;
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [aiOutput]);

  const selectVolunteerForCert = useCallback((email, volunteers) => {
    const vol = volunteers.find((v) => v.email === email);
    setCertInputs((prev) => ({
      ...prev,
      volunteerEmail: vol ? vol.email : email,
      volunteerName: vol ? vol.name : '',
    }));
  }, []);

  const selectVolunteerForAppreciation = useCallback((email, volunteers) => {
    const vol = volunteers.find((v) => v.email === email);
    setAppreciationInputs((prev) =>
      vol
        ? { ...prev, volunteerEmail: vol.email, volunteerName: vol.name }
        : { ...prev, volunteerEmail: email }
    );
  }, []);

  const uploadCertFromAi = useCallback(async () => {
    if (!certInputs.volunteerName || !certInputs.volunteerEmail || !aiOutput) return;
    setCertUploading(true);
    setCertUploaded(false);

    const certId = 'CERT-AI-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const formattedDate = new Date(certInputs.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const certData = {
      certificateId: certId,
      userId: 'guest',
      name: certInputs.volunteerName,
      email: certInputs.volunteerEmail,
      eventId: 'evt-' + Date.now(),
      eventTitle: certInputs.eventTitle,
      date: formattedDate,
      hours: parseInt(certInputs.hours) || 6,
      citation: aiOutput,
      signatureUrl: sigImage || '',
      stampUrl: stampImage || '',
    };

    await addCertificate(certData);

    setCertUploading(false);
    setCertUploaded(true);
    alert(`Success! Certificate ${certId} created and uploaded to ${certInputs.volunteerName}'s profile.`);
  }, [certInputs, aiOutput, sigImage, stampImage, addCertificate]);

  const sendAppreciationEmail = useCallback(async () => {
    if (!appreciationInputs.volunteerEmail || !aiOutput) return;
    setSendingAppreciationEmail(true);
    setAppreciationEmailSent(false);
    try {
      const subject = encodeURIComponent('Thank You for Your Support - NayePankh Foundation');
      const body = encodeURIComponent(aiOutput);
      window.location.href = `mailto:${appreciationInputs.volunteerEmail}?subject=${subject}&body=${body}`;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSendingAppreciationEmail(false);
      setAppreciationEmailSent(true);
      alert(`Success! Opened your email client with a pre-filled appreciation draft for ${appreciationInputs.volunteerName} (${appreciationInputs.volunteerEmail}).`);
    } catch (err) {
      console.error('Error launching mail client:', err);
      setSendingAppreciationEmail(false);
    }
  }, [appreciationInputs, aiOutput]);

  return {
    // state
    aiTool, aiLoading, aiError, aiOutput, copied,
    socialInputs, appealInputs, reportInputs, appreciationInputs, certInputs,
    certUploading, certUploaded, sendingAppreciationEmail, appreciationEmailSent,
    // setters (form binding)
    setSocialInputs, setAppealInputs, setReportInputs, setAppreciationInputs, setCertInputs,
    // actions
    selectTool, generate, copyToClipboard,
    selectVolunteerForCert, selectVolunteerForAppreciation,
    uploadCertFromAi, sendAppreciationEmail,
  };
}
