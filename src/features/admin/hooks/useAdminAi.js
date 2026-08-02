import { useState, useCallback } from 'react';
import {
  generateSocialPost,
  generateDonationAppeal,
  generateEventReport,
  generateVolunteerThankYou,
  generateCertificateCitation,
} from '../../../services/gemini';

/**
 * 【logic 层｜hooks】Gemini AI 助手域 Hook。
 * 刻意不挂在 useAdminDashboard 编排层：本 Hook 由 AiAssistantTab 内部调用，
 * 使 AI 表单的高频输入 state 下沉到 Tab 内，避免拖累整个薄壳重渲染。
 *
 * @param {{
 *   volunteers: Array,
 *   addCertificate: (certData: object) => Promise<object>,
 *   sigImage: string,
 *   stampImage: string
 * }} deps 由展示组件从编排 Hook 转发注入
 * @returns {{
 *   tool: string, selectTool: (id: string) => void,
 *   loading: boolean, error: string, output: string, copied: boolean,
 *   socialInputs: object, setSocialInputs: Function,
 *   appealInputs: object, setAppealInputs: Function,
 *   reportInputs: object, setReportInputs: Function,
 *   appreciationInputs: object, setAppreciationInputs: Function,
 *   certInputs: object, setCertInputs: Function,
 *   certUploading: boolean, certUploaded: boolean,
 *   sendingEmail: boolean, emailSent: boolean,
 *   generate: (e: {preventDefault: () => void}) => Promise<void>,
 *   copyToClipboard: () => void,
 *   selectVolunteerForCert: (email: string) => void,
 *   selectVolunteerForAppreciation: (email: string) => void,
 *   uploadCertificate: () => Promise<void>,
 *   sendAppreciationEmail: () => Promise<void>
 * }}
 */
export function useAdminAi({ volunteers, addCertificate, sigImage, stampImage }) {
  const [tool, setTool] = useState('social');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const [socialInputs, setSocialInputs] = useState({ title: '', platform: 'Twitter', tone: 'inspiring', achievements: '' });
  const [appealInputs, setAppealInputs] = useState({ cause: '', targetAmount: '', targetAudience: '' });
  const [reportInputs, setReportInputs] = useState({ eventName: '', reachCount: '', hoursContributed: '', summaries: '' });
  const [appreciationInputs, setAppreciationInputs] = useState({ volunteerEmail: '', volunteerName: '', contributions: '', program: 'Project Shiksha' });
  const [certInputs, setCertInputs] = useState({
    volunteerEmail: '',
    volunteerName: '',
    eventTitle: 'Noida Winter Clothes & Blanket Drive',
    contributions: '',
    hours: '6',
    date: new Date().toISOString().split('T')[0],
  });

  const [certUploading, setCertUploading] = useState(false);
  const [certUploaded, setCertUploaded] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const selectTool = useCallback((id) => {
    setTool(id);
    setError('');
    setOutput('');
    setCertUploaded(false);
  }, []);

  const generate = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput('');
    setCopied(false);
    setCertUploaded(false);
    setEmailSent(false);

    try {
      let result = '';
      if (tool === 'social') {
        if (!socialInputs.title || !socialInputs.achievements) throw new Error('Please enter campaign title and key achievements.');
        result = await generateSocialPost(socialInputs.title, socialInputs.platform, socialInputs.tone, socialInputs.achievements);
      } else if (tool === 'appeal') {
        if (!appealInputs.cause || !appealInputs.targetAmount) throw new Error('Please specify fundraising cause and target amount.');
        result = await generateDonationAppeal(appealInputs.cause, appealInputs.targetAmount, appealInputs.targetAudience || 'General Donors');
      } else if (tool === 'report') {
        if (!reportInputs.eventName || !reportInputs.reachCount) throw new Error('Please fill out event name and reach counts.');
        result = await generateEventReport(reportInputs.eventName, reportInputs.reachCount, reportInputs.hoursContributed || '0', reportInputs.summaries);
      } else if (tool === 'appreciation') {
        if (!appreciationInputs.volunteerName || !appreciationInputs.contributions) throw new Error('Please specify volunteer name and contributions.');
        result = await generateVolunteerThankYou(appreciationInputs.volunteerName, appreciationInputs.contributions, appreciationInputs.program);
      } else if (tool === 'certificate') {
        if (!certInputs.volunteerName || !certInputs.volunteerEmail || !certInputs.eventTitle) {
          throw new Error('Please enter volunteer name, email and event title.');
        }
        result = await generateCertificateCitation(certInputs.volunteerName, certInputs.eventTitle, certInputs.contributions || 'their dedicated service');
      }
      setOutput(result);
    } catch (err) {
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setLoading(false);
    }
  }, [tool, socialInputs, appealInputs, reportInputs, appreciationInputs, certInputs]);

  const copyToClipboard = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const selectVolunteerForCert = useCallback((email) => {
    const vol = volunteers.find(v => v.email === email);
    setCertInputs(prev => ({
      ...prev,
      volunteerEmail: email,
      volunteerName: vol ? vol.name : '',
    }));
  }, [volunteers]);

  const selectVolunteerForAppreciation = useCallback((email) => {
    const vol = volunteers.find(v => v.email === email);
    setAppreciationInputs(prev => ({
      ...prev,
      volunteerEmail: email,
      ...(vol ? { volunteerName: vol.name } : {}),
    }));
  }, [volunteers]);

  const uploadCertificate = useCallback(async () => {
    if (!certInputs.volunteerName || !certInputs.volunteerEmail || !output) return;
    setCertUploading(true);
    setCertUploaded(false);

    const certId = 'CERT-AI-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const formattedDate = new Date(certInputs.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    await addCertificate({
      certificateId: certId,
      userId: 'guest',
      name: certInputs.volunteerName,
      email: certInputs.volunteerEmail,
      eventId: 'evt-' + Date.now(),
      eventTitle: certInputs.eventTitle,
      date: formattedDate,
      hours: parseInt(certInputs.hours) || 6,
      citation: output,
      signatureUrl: sigImage || '',
      stampUrl: stampImage || '',
    });

    setCertUploading(false);
    setCertUploaded(true);
    alert(`Success! Certificate ${certId} created and uploaded to ${certInputs.volunteerName}'s profile.`);
  }, [certInputs, output, addCertificate, sigImage, stampImage]);

  const sendAppreciationEmail = useCallback(async () => {
    if (!appreciationInputs.volunteerEmail || !output) return;
    setSendingEmail(true);
    setEmailSent(false);

    try {
      const subject = encodeURIComponent('Thank You for Your Support - NayePankh Foundation');
      const body = encodeURIComponent(output);
      window.location.href = `mailto:${appreciationInputs.volunteerEmail}?subject=${subject}&body=${body}`;

      await new Promise(resolve => setTimeout(resolve, 1000));
      setSendingEmail(false);
      setEmailSent(true);
      alert(`Success! Opened your email client with a pre-filled appreciation draft for ${appreciationInputs.volunteerName} (${appreciationInputs.volunteerEmail}).`);
    } catch (err) {
      console.error('Error launching mail client:', err);
      setSendingEmail(false);
    }
  }, [appreciationInputs, output]);

  return {
    tool,
    selectTool,
    loading,
    error,
    output,
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
    sendingEmail,
    emailSent,
    generate,
    copyToClipboard,
    selectVolunteerForCert,
    selectVolunteerForAppreciation,
    uploadCertificate,
    sendAppreciationEmail,
  };
}
