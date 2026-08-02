// Admin logic layer — top orchestration hook
// Composes the shared/global domain hooks and derives analytics stats.
//
// NOTE (round 2): `useAdminAi` and `useAdminNotifications` are intentionally NOT
// composed here. Their state is local to a single tab, so they are instantiated
// inside AiAssistantTab / NotificationsTab respectively. This keeps AI-form
// keystrokes and notification reads from re-rendering the whole dashboard shell.
import { useState, useMemo } from 'react';
import { useAdminUsers } from './useAdminUsers';
import { useAdminVolunteers } from './useAdminVolunteers';
import { useAdminDonations } from './useAdminDonations';
import { useAdminEvents } from './useAdminEvents';
import { useAdminCertificates } from './useAdminCertificates';
import { useAdminRegistrations } from './useAdminRegistrations';
import { useAdminImpactOffsets } from './useAdminImpactOffsets';
import { computeAdminStats } from '../utils/analytics';

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const usersApi = useAdminUsers();
  const volunteersApi = useAdminVolunteers();
  const donationsApi = useAdminDonations();
  const eventsApi = useAdminEvents();
  const certificatesApi = useAdminCertificates();
  const impactApi = useAdminImpactOffsets();

  const registrationsApi = useAdminRegistrations({
    addCertificate: certificatesApi.addCertificate,
    certificates: certificatesApi.certificates,
    openCertificate: certificatesApi.openCertificate,
    sigImage: certificatesApi.sigImage,
    stampImage: certificatesApi.stampImage,
  });

  const stats = useMemo(
    () =>
      computeAdminStats({
        donations: donationsApi.donations,
        volunteers: volunteersApi.volunteers,
        events: eventsApi.events,
        users: usersApi.users,
        offsets: impactApi.offsets,
      }),
    [donationsApi.donations, volunteersApi.volunteers, eventsApi.events, usersApi.users, impactApi.offsets]
  );

  return {
    activeTab,
    setActiveTab,
    stats,
    users: usersApi,
    volunteers: volunteersApi,
    donations: donationsApi,
    events: eventsApi,
    certificates: certificatesApi,
    registrations: registrationsApi,
    impact: impactApi,
  };
}
