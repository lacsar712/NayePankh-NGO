// Logic hook: single orchestrator that composes all domain hooks, applies
// per-tab lazy loading, and memoizes derived stats via utils/analytics.
import { useState, useMemo } from 'react';
import { useUsers } from './useUsers';
import { useVolunteers } from './useVolunteers';
import { useDonations } from './useDonations';
import { useEvents } from './useEvents';
import { useCertificates } from './useCertificates';
import { useRegistrations } from './useRegistrations';
import { useNotifications } from './useNotifications';
import { useCertificateAssets } from './useCertificateAssets';
import { useAiAssistant } from './useAiAssistant';
import { useImpactOffsets } from './useImpactOffsets';
import { useEverTrue } from './useEverTrue';
import { TAB_DATA_REQUIREMENTS, computeDashboardStats } from '../utils/analytics';
import { TAB_IDS } from '../constants/tabs';

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState(TAB_IDS.OVERVIEW);

  const requirements = TAB_DATA_REQUIREMENTS[activeTab] || {};

  const usersEnabled = useEverTrue(!!requirements.users);
  const volunteersEnabled = useEverTrue(!!requirements.volunteers);
  const donationsEnabled = useEverTrue(!!requirements.donations);
  const eventsEnabled = useEverTrue(!!requirements.events);
  const registrationsEnabled = useEverTrue(!!requirements.registrations);
  const certificatesEnabled = useEverTrue(!!requirements.certificates);

  const usersDomain = useUsers(usersEnabled);
  const volunteersDomain = useVolunteers(volunteersEnabled);
  const donationsDomain = useDonations(donationsEnabled);
  const eventsDomain = useEvents(eventsEnabled);
  const assetsDomain = useCertificateAssets();
  const certificatesDomain = useCertificates(certificatesEnabled);
  const registrationsDomain = useRegistrations(
    assetsDomain.sigImage,
    assetsDomain.stampImage,
    certificatesDomain.addCertificate,
    registrationsEnabled
  );
  const notificationsDomain = useNotifications(activeTab);
  const aiDomain = useAiAssistant(
    volunteersDomain.volunteers,
    assetsDomain.sigImage,
    assetsDomain.stampImage,
    certificatesDomain.addCertificate
  );
  const impactDomain = useImpactOffsets();

  const stats = useMemo(
    () =>
      computeDashboardStats({
        donations: donationsDomain.donations,
        volunteers: volunteersDomain.volunteers,
        events: eventsDomain.events,
        usersCount: usersDomain.users.length,
        offsets: {
          simulatedDonationsOffset: impactDomain.simulatedDonationsOffset,
          beneficiariesOffset: impactDomain.beneficiariesOffset,
          treesPlantedOffset: impactDomain.treesPlantedOffset,
          mealsServedOffset: impactDomain.mealsServedOffset,
        },
      }),
    [
      donationsDomain.donations,
      volunteersDomain.volunteers,
      eventsDomain.events,
      usersDomain.users.length,
      impactDomain.simulatedDonationsOffset,
      impactDomain.beneficiariesOffset,
      impactDomain.treesPlantedOffset,
      impactDomain.mealsServedOffset,
    ]
  );

  const loading = {
    users: usersDomain.loading,
    volunteers: volunteersDomain.loading,
    donations: donationsDomain.loading,
    events: eventsDomain.loading,
    registrations: registrationsDomain.loading,
    certificates: certificatesDomain.loading,
    notifications: notificationsDomain.notificationsLoading,
  };

  return {
    activeTab,
    setActiveTab,
    stats,
    loading,
    ...usersDomain,
    ...volunteersDomain,
    ...donationsDomain,
    ...eventsDomain,
    ...assetsDomain,
    ...certificatesDomain,
    ...registrationsDomain,
    ...notificationsDomain,
    ...aiDomain,
    ...impactDomain,
  };
}
