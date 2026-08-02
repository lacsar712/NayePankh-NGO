// ui: routes activeTab to the matching tab panel, injecting hook props.
import OverviewTab from './OverviewTab';
import AnalyticsTab from './AnalyticsTab';
import UsersTab from './UsersTab';
import VolunteersTab from './VolunteersTab';
import DonationsTab from './DonationsTab';
import EventsTab from './EventsTab';
import RegistrationsTab from './RegistrationsTab';
import CertificatesTab from './CertificatesTab';
import AiAssistantTab from './AiAssistantTab';
import NotificationsTab from './NotificationsTab';

function DashboardPanels({ activeTab, dashboard }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
      {activeTab === 'overview' && (
        <OverviewTab
          donations={dashboard.donations}
          volunteers={dashboard.volunteers}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab
          stats={dashboard.stats}
          simulatorActions={dashboard.simulatorActions}
        />
      )}

      {activeTab === 'users' && (
        <UsersTab
          users={dashboard.users}
          onToggleRole={dashboard.handleToggleRole}
        />
      )}

      {activeTab === 'volunteers' && (
        <VolunteersTab
          volunteers={dashboard.volunteers}
          onApprove={dashboard.handleApproveVolunteer}
          onReject={dashboard.handleRejectVolunteer}
        />
      )}

      {activeTab === 'donations' && (
        <DonationsTab donations={dashboard.donations} />
      )}

      {activeTab === 'events' && (
        <EventsTab
          events={dashboard.events}
          newEvent={dashboard.newEvent}
          setNewEvent={dashboard.setNewEvent}
          onAddEvent={dashboard.handleAddEvent}
          onDeleteEvent={dashboard.handleDeleteEvent}
        />
      )}

      {activeTab === 'registrations' && (
        <RegistrationsTab
          registrations={dashboard.registrations}
          onMarkAttended={dashboard.handleMarkAttended}
          onViewCertificate={dashboard.handleViewCertificate}
          onDeleteRegistration={dashboard.handleDeleteRegistration}
        />
      )}

      {activeTab === 'certificates' && (
        <CertificatesTab
          certificates={dashboard.certificates}
          sigImage={dashboard.sigImage}
          stampImage={dashboard.stampImage}
          onUploadSignature={dashboard.handleUploadSignature}
          onUploadStamp={dashboard.handleUploadStamp}
          onResetAssets={dashboard.handleResetAssets}
          onViewCertificate={dashboard.openCertificateModal}
        />
      )}

      {activeTab === 'ai-assistant' && (
        <AiAssistantTab
          aiTool={dashboard.aiTool}
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
          volunteers={dashboard.volunteers}
          sigImage={dashboard.sigImage}
          stampImage={dashboard.stampImage}
          onSelectTool={dashboard.handleSelectAiTool}
          onGenerate={dashboard.handleGenerateContent}
          onCopy={dashboard.handleCopyToClipboard}
          onSendEmail={dashboard.handleSendAppreciationEmail}
          onSelectVolunteerForCert={dashboard.handleSelectVolunteerForCert}
          onUploadCertFromAi={dashboard.handleUploadCertFromAi}
        />
      )}

      {activeTab === 'notifications' && (
        <NotificationsTab
          notifications={dashboard.notifications}
          selectedNotification={dashboard.selectedNotification}
          onSelectNotification={dashboard.setSelectedNotification}
          onClearNotifications={dashboard.handleClearNotifications}
        />
      )}
    </div>
  );
}

export default DashboardPanels;
