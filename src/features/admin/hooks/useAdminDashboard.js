// logic: orchestrates all admin dashboard state, data fetching and actions.
// No JSX here; returns state + handlers consumed by AdminDashboard.jsx.
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  generateSocialPost,
  generateDonationAppeal,
  generateEventReport,
  generateVolunteerThankYou,
  generateCertificateCitation,
} from '../../../services/gemini';
import {
  fetchUsers,
  toggleUserRole,
} from '../services/usersService';
import {
  fetchVolunteers,
  approveVolunteer,
  rejectVolunteer,
} from '../services/volunteersService';
import { fetchDonations } from '../services/donationsService';
import {
  fetchEvents,
  addEvent,
  deleteEvent,
} from '../services/eventsService';
import {
  fetchRegistrations,
  deleteRegistration,
  markRegistrationAttended,
  saveCertificateDoc,
} from '../services/registrationsService';
import {
  fetchCertificates,
  createCertificate,
} from '../services/certificatesService';
import {
  fetchNotifications,
  clearNotifications as clearNotificationsStorage,
} from '../services/notificationsService';
import {
  readSignature,
  readStamp,
  writeSignature,
  writeStamp,
  resetBrandingAssets,
  readFileAsDataURL,
} from '../services/brandingService';
import {
  DEFAULT_DONATIONS,
  DEFAULT_USERS,
  DEFAULT_VOLUNTEERS,
  DEFAULT_EVENTS,
  NEW_EVENT_INITIAL,
  CERT_INITIAL,
  ADMIN_STORAGE_KEYS,
} from '../constants/storageKeys';
import {
  computeDashboardStats,
  SIMULATOR_STEPS,
} from '../utils/analytics';

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [users, setUsers] = useState([...DEFAULT_USERS]);
  const [volunteers, setVolunteers] = useState([...DEFAULT_VOLUNTEERS]);
  const [donations, setDonations] = useState([...DEFAULT_DONATIONS]);
  const [events, setEvents] = useState([...DEFAULT_EVENTS]);
  const [registrations, setRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [newEvent, setNewEvent] = useState({ ...NEW_EVENT_INITIAL });
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);

  const [mealsServedOffset, setMealsServedOffset] = useState(0);
  const [treesPlantedOffset, setTreesPlantedOffset] = useState(0);
  const [beneficiariesOffset, setBeneficiariesOffset] = useState(0);
  const [simulatedDonationsOffset, setSimulatedDonationsOffset] = useState(0);

  const [aiTool, setAiTool] = useState('social');
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

  const [certInputs, setCertInputs] = useState({ ...CERT_INITIAL });
  const [certUploading, setCertUploading] = useState(false);
  const [certUploaded, setCertUploaded] = useState(false);

  const [sendingAppreciationEmail, setSendingAppreciationEmail] = useState(false);
  const [appreciationEmailSent, setAppreciationEmailSent] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);

  const [sigImage, setSigImage] = useState(() => readSignature());
  const [stampImage, setStampImage] = useState(() => readStamp());

  const reloadNotifications = useCallback(() => {
    const logs = fetchNotifications();
    setNotifications(logs);
    setNotificationsLoaded(true);
    setSelectedNotification((prev) => prev || logs[0] || null);
    return logs;
  }, []);

  // Lazily read notification logs only when the notifications tab is first opened,
  // instead of re-parsing localStorage on every tab switch.
  useEffect(() => {
    if (activeTab === 'notifications' && !notificationsLoaded) {
      reloadNotifications();
    }
  }, [activeTab, notificationsLoaded, reloadNotifications]);

  // Keep notifications fresh if they change in another tab.
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === ADMIN_STORAGE_KEYS.ADMIN_NOTIFICATIONS) {
        reloadNotifications();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [reloadNotifications]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [u, v, d, e, r, c] = await Promise.all([
        fetchUsers(),
        fetchVolunteers(),
        fetchDonations(),
        fetchEvents(),
        fetchRegistrations(),
        fetchCertificates(),
      ]);
      if (cancelled) return;
      setUsers(u);
      setVolunteers(v);
      setDonations(d);
      setEvents(e);
      setRegistrations(r);
      setCertificates(c);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleClearNotifications = useCallback(() => {
    clearNotificationsStorage();
    setNotifications([]);
    setNotificationsLoaded(false);
    setSelectedNotification(null);
    alert('Notifications logs cleared successfully!');
  }, []);

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

  const handleUploadSignature = useCallback(async (e) => {
    const file = e.target.files[0];
    if (file) {
      const dataUrl = await readFileAsDataURL(file);
      setSigImage(dataUrl);
      writeSignature(dataUrl);
    }
  }, []);

  const handleUploadStamp = useCallback(async (e) => {
    const file = e.target.files[0];
    if (file) {
      const dataUrl = await readFileAsDataURL(file);
      setStampImage(dataUrl);
      writeStamp(dataUrl);
    }
  }, []);

  const handleResetAssets = useCallback(() => {
    setSigImage('');
    setStampImage('');
    resetBrandingAssets();
  }, []);

  const handleToggleRole = useCallback(
    async (id) => {
      const updated = await toggleUserRole(users, id);
      setUsers(updated);
    },
    [users]
  );

  const handleApproveVolunteer = useCallback(
    async (id) => {
      const updated = await approveVolunteer(volunteers, id);
      setVolunteers(updated);
    },
    [volunteers]
  );

  const handleRejectVolunteer = useCallback(
    async (id) => {
      const updated = await rejectVolunteer(volunteers, id);
      setVolunteers(updated);
    },
    [volunteers]
  );

  const handleAddEvent = useCallback(
    (e) => {
      e.preventDefault();
      if (!newEvent.image) {
        alert('Please upload a showcase picture for this event.');
        return;
      }
      if (newEvent.title && newEvent.date && newEvent.location) {
        const eventToSave = {
          title: newEvent.title,
          date: newEvent.date,
          location: newEvent.location,
          desc: newEvent.desc || 'Join our campaign to support the community.',
          type: newEvent.type || 'Drive Campaign',
          rawType: newEvent.rawType || 'drive',
          image: newEvent.image,
          status: newEvent.status || 'upcoming',
        };

        addEvent(events, eventToSave).then((updated) => {
          setEvents(updated);
        });
        setNewEvent({ ...NEW_EVENT_INITIAL });
      }
    },
    [events, newEvent]
  );

  const handleDeleteEvent = useCallback(
    (id) => {
      deleteEvent(events, id).then((updated) => {
        setEvents(updated);
      });
    },
    [events]
  );

  const handleDeleteRegistration = useCallback(
    async (id) => {
      const updated = await deleteRegistration(registrations, id);
      setRegistrations(updated);
    },
    [registrations]
  );

  const handleMarkAttended = useCallback(
    async (reg) => {
      const { updatedRegs, certId, formattedDate } =
        await markRegistrationAttended(registrations, reg);
      setRegistrations(updatedRegs);

      const certData = {
        certificateId: certId,
        userId: reg.userId || 'guest',
        name: reg.name,
        email: reg.email,
        eventId: reg.eventId,
        eventTitle: reg.eventTitle || 'NayePankh Campaign Drive',
        date: formattedDate,
        hours: 6,
        signatureUrl: sigImage || '',
        stampUrl: stampImage || '',
      };

      await saveCertificateDoc(certData);
      setCertificates((prev) => [...prev, certData]);

      alert(
        `Success! ${reg.name} has been marked as attended. Certificate ${certId} generated.`
      );
    },
    [registrations, sigImage, stampImage]
  );

  const handleViewCertificate = useCallback(
    (reg) => {
      const cert = certificates.find(
        (c) => c.email === reg.email && c.eventId === reg.eventId
      );
      if (cert) {
        setSelectedCertificate(cert);
        setShowCertModal(true);
      } else {
        const tempCert = {
          certificateId:
            'CERT-TMP-' +
            Math.random().toString(36).substring(2, 10).toUpperCase(),
          userId: reg.userId || 'guest',
          name: reg.name,
          email: reg.email,
          eventId: reg.eventId,
          eventTitle: reg.eventTitle || 'NayePankh Campaign Drive',
          date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          hours: 6,
        };
        setSelectedCertificate(tempCert);
        setShowCertModal(true);
      }
    },
    [certificates]
  );

  const handleSelectVolunteerForCert = useCallback(
    (email) => {
      const vol = volunteers.find((v) => v.email === email);
      if (vol) {
        setCertInputs((prev) => ({
          ...prev,
          volunteerEmail: vol.email,
          volunteerName: vol.name,
        }));
      } else {
        setCertInputs((prev) => ({
          ...prev,
          volunteerEmail: email,
          volunteerName: '',
        }));
      }
    },
    [volunteers]
  );

  const handleUploadCertFromAi = useCallback(async () => {
    if (!certInputs.volunteerName || !certInputs.volunteerEmail || !aiOutput)
      return;
    setCertUploading(true);
    setCertUploaded(false);

    const certId =
      'CERT-AI-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const formattedDate = new Date(certInputs.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

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

    await createCertificate(certData);
    setCertificates((prev) => [...prev, certData]);

    setCertUploading(false);
    setCertUploaded(true);
    alert(
      `Success! Certificate ${certId} created and uploaded to ${certInputs.volunteerName}'s profile.`
    );
  }, [certInputs, aiOutput, sigImage, stampImage]);

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
        if (aiTool === 'social') {
          if (!socialInputs.title || !socialInputs.achievements)
            throw new Error('Please enter campaign title and key achievements.');
          result = await generateSocialPost(
            socialInputs.title,
            socialInputs.platform,
            socialInputs.tone,
            socialInputs.achievements
          );
        } else if (aiTool === 'appeal') {
          if (!appealInputs.cause || !appealInputs.targetAmount)
            throw new Error('Please specify fundraising cause and target amount.');
          result = await generateDonationAppeal(
            appealInputs.cause,
            appealInputs.targetAmount,
            appealInputs.targetAudience || 'General Donors'
          );
        } else if (aiTool === 'report') {
          if (!reportInputs.eventName || !reportInputs.reachCount)
            throw new Error('Please fill out event name and reach counts.');
          result = await generateEventReport(
            reportInputs.eventName,
            reportInputs.reachCount,
            reportInputs.hoursContributed || '0',
            reportInputs.summaries
          );
        } else if (aiTool === 'appreciation') {
          if (!appreciationInputs.volunteerName || !appreciationInputs.contributions)
            throw new Error('Please specify volunteer name and contributions.');
          result = await generateVolunteerThankYou(
            appreciationInputs.volunteerName,
            appreciationInputs.contributions,
            appreciationInputs.program
          );
        } else if (aiTool === 'certificate') {
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

  const handleSelectAiTool = useCallback((toolId) => {
    setAiTool(toolId);
    setAiError('');
    setAiOutput('');
    setCertUploaded(false);
  }, []);

  const closeCertModal = useCallback(() => {
    setShowCertModal(false);
    setSelectedCertificate(null);
  }, []);

  const openCertificateModal = useCallback((cert) => {
    setSelectedCertificate(cert);
    setShowCertModal(true);
  }, []);

  const stats = useMemo(
    () =>
      computeDashboardStats({
        donations,
        volunteers,
        events,
        users,
        offsets: {
          mealsServedOffset,
          treesPlantedOffset,
          beneficiariesOffset,
          simulatedDonationsOffset,
        },
      }),
    [
      donations,
      volunteers,
      events,
      users,
      mealsServedOffset,
      treesPlantedOffset,
      beneficiariesOffset,
      simulatedDonationsOffset,
    ]
  );

  const simulatorActions = useMemo(
    () => ({
      triggerFoodDrive: () => {
        setMealsServedOffset((prev) => prev + SIMULATOR_STEPS.FOOD_DRIVE_MEALS);
        setBeneficiariesOffset(
          (prev) => prev + SIMULATOR_STEPS.FOOD_DRIVE_BENEFICIARIES
        );
        alert(
          `Simulated Ground Food Drive: +${SIMULATOR_STEPS.FOOD_DRIVE_MEALS} Meals Served, +${SIMULATOR_STEPS.FOOD_DRIVE_BENEFICIARIES} Beneficiaries Helped!`
        );
      },
      triggerTreePlanting: () => {
        setTreesPlantedOffset(
          (prev) => prev + SIMULATOR_STEPS.TREE_PLANTING_TREES
        );
        setBeneficiariesOffset(
          (prev) => prev + SIMULATOR_STEPS.TREE_PLANTING_BENEFICIARIES
        );
        alert(
          `Simulated Tree Plantation Drive: +${SIMULATOR_STEPS.TREE_PLANTING_TREES} Trees Planted, +${SIMULATOR_STEPS.TREE_PLANTING_BENEFICIARIES} Beneficiaries Helped!`
        );
      },
      triggerHealthCamp: () => {
        setBeneficiariesOffset(
          (prev) => prev + SIMULATOR_STEPS.HEALTH_CAMP_BENEFICIARIES
        );
        alert(
          `Simulated Health Camp Drive: +${SIMULATOR_STEPS.HEALTH_CAMP_BENEFICIARIES} Beneficiaries Helped!`
        );
      },
      triggerCorporateGrant: () => {
        setSimulatedDonationsOffset(
          (prev) => prev + SIMULATOR_STEPS.CORPORATE_GRANT_AMOUNT
        );
        alert(
          `Simulated Corporate Grant Received: +₹${SIMULATOR_STEPS.CORPORATE_GRANT_AMOUNT.toLocaleString(
            'en-IN'
          )} Total Donations!`
        );
      },
    }),
    []
  );

  return {
    activeTab,
    setActiveTab,

    users,
    volunteers,
    donations,
    events,
    registrations,
    certificates,

    newEvent,
    setNewEvent,
    selectedCertificate,
    showCertModal,
    closeCertModal,
    openCertificateModal,

    stats,
    simulatorActions,

    sigImage,
    stampImage,
    handleUploadSignature,
    handleUploadStamp,
    handleResetAssets,

    handleToggleRole,
    handleApproveVolunteer,
    handleRejectVolunteer,
    handleAddEvent,
    handleDeleteEvent,
    handleDeleteRegistration,
    handleMarkAttended,
    handleViewCertificate,

    notifications,
    selectedNotification,
    setSelectedNotification,
    handleClearNotifications,

    aiTool,
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
    handleSelectAiTool,
    handleGenerateContent,
    handleCopyToClipboard,
    handleSendAppreciationEmail,
    handleSelectVolunteerForCert,
    handleUploadCertFromAi,
  };
}
