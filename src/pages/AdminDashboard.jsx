// UI shell (thin orchestration page): layout chrome, tab navigation, and Hook wiring.
// All data access lives in features/admin/hooks; all panel JSX lives in features/admin/components.
import { useMemo } from 'react';
import { Sparkles, Mail } from 'lucide-react';
import { useAdminDashboard } from '../features/admin/hooks/useAdminDashboard';
import { TAB_LIST, TAB_IDS } from '../features/admin/constants/tabs';
import OverviewPanel from '../features/admin/components/OverviewPanel';
import AnalyticsPanel from '../features/admin/components/AnalyticsPanel';
import UsersPanel from '../features/admin/components/UsersPanel';
import VolunteersPanel from '../features/admin/components/VolunteersPanel';
import DonationsPanel from '../features/admin/components/DonationsPanel';
import EventsPanel from '../features/admin/components/EventsPanel';
import RegistrationsPanel from '../features/admin/components/RegistrationsPanel';
import CertificatesPanel from '../features/admin/components/CertificatesPanel';
import AiAssistantPanel from '../features/admin/components/AiAssistantPanel';
import NotificationsPanel from '../features/admin/components/NotificationsPanel';
import CertificateModal from '../features/admin/components/CertificateModal';
import DashboardKpiBar from '../features/admin/components/DashboardKpiBar';

export default function AdminDashboard() {
  const dashboard = useAdminDashboard();
  const {
    activeTab,
    setActiveTab,
    stats,
    users,
    volunteers,
    donations,
    events,
    newEvent,
    setNewEvent,
    registrations,
    certificates,
    selectedCertificate,
    showCertModal,
    notifications,
    selectedNotification,
    sigImage,
    stampImage,
    handleToggleRole,
    handleApproveVolunteer,
    handleRejectVolunteer,
    handleAddEvent,
    handleDeleteEvent,
    handleDeleteRegistration,
    handleMarkAttended,
    viewCertificateForReg,
    openCertificate,
    closeCertificate,
    handleClearNotifications,
    setSelectedNotification,
    handleUploadSignature,
    handleUploadStamp,
    handleResetAssets,
    triggerFoodDrive,
    triggerTreePlanting,
    triggerHealthCamp,
    triggerCorporateGrant,
  } = dashboard;

  // Stable object reference so memo(AnalyticsPanel) is not defeated by a new object each render.
  const impact = useMemo(
    () => ({
      triggerFoodDrive,
      triggerTreePlanting,
      triggerHealthCamp,
      triggerCorporateGrant,
    }),
    [
      triggerFoodDrive,
      triggerTreePlanting,
      triggerHealthCamp,
      triggerCorporateGrant,
    ]
  );

  const renderPanel = () => {
    switch (activeTab) {
      case TAB_IDS.OVERVIEW:
        return <OverviewPanel donations={donations} volunteers={volunteers} />;
      case TAB_IDS.ANALYTICS:
        return <AnalyticsPanel stats={stats} impact={impact} />;
      case TAB_IDS.USERS:
        return <UsersPanel users={users} onToggleRole={handleToggleRole} />;
      case TAB_IDS.VOLUNTEERS:
        return (
          <VolunteersPanel
            volunteers={volunteers}
            onApprove={handleApproveVolunteer}
            onReject={handleRejectVolunteer}
          />
        );
      case TAB_IDS.DONATIONS:
        return <DonationsPanel donations={donations} />;
      case TAB_IDS.EVENTS:
        return (
          <EventsPanel
            events={events}
            newEvent={newEvent}
            onNewEventChange={setNewEvent}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case TAB_IDS.REGISTRATIONS:
        return (
          <RegistrationsPanel
            registrations={registrations}
            onMarkAttended={handleMarkAttended}
            onViewCertificate={viewCertificateForReg}
            onDeleteRegistration={handleDeleteRegistration}
          />
        );
      case TAB_IDS.CERTIFICATES:
        return (
          <CertificatesPanel
            certificates={certificates}
            sigImage={sigImage}
            stampImage={stampImage}
            onUploadSignature={handleUploadSignature}
            onUploadStamp={handleUploadStamp}
            onResetAssets={handleResetAssets}
            onViewCertificate={openCertificate}
          />
        );
      case TAB_IDS.AI_ASSISTANT:
        return (
          <AiAssistantPanel
            volunteers={volunteers}
            sigImage={sigImage}
            stampImage={stampImage}
            aiTool={dashboard.aiTool}
            setAiTool={dashboard.setAiTool}
            aiLoading={dashboard.aiLoading}
            aiError={dashboard.aiError}
            aiOutput={dashboard.aiOutput}
            copied={dashboard.copied}
            socialInputs={dashboard.socialInputs}
            setSocialInputs={dashboard.setSocialInputs}
            appealInputs={dashboard.appealInputs}
            setAppealInputs={dashboard.setAppealInputs}
            reportInputs={dashboard.reportInputs}
            setReportInputs={dashboard.setReportInputs}
            appreciationInputs={dashboard.appreciationInputs}
            setAppreciationInputs={dashboard.setAppreciationInputs}
            certInputs={dashboard.certInputs}
            setCertInputs={dashboard.setCertInputs}
            certUploading={dashboard.certUploading}
            certUploaded={dashboard.certUploaded}
            sendingAppreciationEmail={dashboard.sendingAppreciationEmail}
            appreciationEmailSent={dashboard.appreciationEmailSent}
            onGenerate={dashboard.handleGenerateContent}
            onCopy={dashboard.handleCopyToClipboard}
            onSendAppreciationEmail={dashboard.handleSendAppreciationEmail}
            onSelectVolunteerForCert={dashboard.handleSelectVolunteerForCert}
            onUploadCertFromAi={dashboard.handleUploadCertFromAi}
          />
        );
      case TAB_IDS.NOTIFICATIONS:
        return (
          <NotificationsPanel
            notifications={notifications}
            selectedNotification={selectedNotification}
            onSelect={setSelectedNotification}
            onClear={handleClearNotifications}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-36 md:pt-44 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Title Banner (layout chrome) */}
        <div className="bg-white text-slate-900 border border-slate-200/80 rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-80 h-80 bg-primary-100/30 rounded-full blur-3xl" />
          <div className="flex items-center space-x-3 mb-4 relative z-10">
            <img
              src="/logo.png"
              className="h-12 w-12 object-contain bg-white rounded-2xl p-0.5 shadow-sm border border-slate-200"
              alt="NayePankh Logo"
            />
            <div>
              <h1 className="text-3xl font-black font-display text-slate-900">Admin Hub</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                80G & 12A Certified Foundation
              </p>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-2 relative z-10">
            Monitor donations, manage roles, audit volunteer signups, and utilize Gemini AI
            writing engines.
          </p>
        </div>

        {/* Overview KPI summary (extracted to DashboardKpiBar) */}
        {activeTab === TAB_IDS.OVERVIEW && <DashboardKpiBar stats={stats} />}

        {/* Tab navigation */}
        <div className="flex space-x-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
          {TAB_LIST.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-bold capitalize transition-all duration-200 shrink-0 border-b-2 rounded-t-lg -mb-px flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.id === TAB_IDS.AI_ASSISTANT && (
                <Sparkles className="h-4 w-4 text-accent-500 shrink-0" />
              )}
              {tab.id === TAB_IDS.NOTIFICATIONS && (
                <Mail className="h-4 w-4 text-primary-500 shrink-0" />
              )}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Active panel container */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          {renderPanel()}
        </div>
      </div>

      {showCertModal && (
        <CertificateModal
          certificate={selectedCertificate}
          sigImage={sigImage}
          stampImage={stampImage}
          onClose={closeCertificate}
        />
      )}
    </div>
  );
}
