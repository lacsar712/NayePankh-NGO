// Admin dashboard — thin orchestration shell.
// Layout + tab switching only. All state/business logic lives in the
// useAdminDashboard orchestration hook (src/features/admin/hooks), and every
// tab renders through a presentational component (src/features/admin/components).
// See src/features/admin/ for the logic/UI split established in this refactor.
import { useAdminDashboard } from '../features/admin/hooks/useAdminDashboard';
import TabNav from '../features/admin/components/TabNav';
import KpiRow from '../features/admin/components/KpiRow';
import OverviewTab from '../features/admin/components/OverviewTab';
import AnalyticsTab from '../features/admin/components/AnalyticsTab';
import UsersTab from '../features/admin/components/UsersTab';
import VolunteersTab from '../features/admin/components/VolunteersTab';
import DonationsTab from '../features/admin/components/DonationsTab';
import EventsTab from '../features/admin/components/EventsTab';
import RegistrationsTab from '../features/admin/components/RegistrationsTab';
import CertificatesTab from '../features/admin/components/CertificatesTab';
import AiAssistantTab from '../features/admin/components/AiAssistantTab';
import NotificationsTab from '../features/admin/components/NotificationsTab';
import CertificateModal from '../features/admin/components/CertificateModal';

export default function AdminDashboard() {
  const admin = useAdminDashboard();
  const { activeTab, setActiveTab, stats } = admin;

  return (
    <div className="min-h-screen bg-slate-50 pt-36 md:pt-44 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Dashboard Title Banner */}
        <div className="bg-white text-slate-900 border border-slate-200/80 rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-80 h-80 bg-primary-100/30 rounded-full blur-3xl" />
          <div className="flex items-center space-x-3 mb-4 relative z-10">
            <img src="/logo.png" className="h-12 w-12 object-contain bg-white rounded-2xl p-0.5 shadow-sm border border-slate-200" alt="NayePankh Logo" />
            <div>
              <h1 className="text-3xl font-black font-display text-slate-900">Admin Hub</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">80G & 12A Certified Foundation</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-2 relative z-10">Monitor donations, manage roles, audit volunteer signups, and utilize Gemini AI writing engines.</p>
        </div>

        {activeTab === 'overview' && <KpiRow stats={stats} />}

        <TabNav activeTab={activeTab} onSelect={setActiveTab} />

        {/* Dashboard Panels */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          {activeTab === 'overview' && (
            <OverviewTab donations={admin.donations.donations} volunteers={admin.volunteers.volunteers} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab
              stats={stats}
              onFoodDrive={admin.impact.simulateFoodDrive}
              onTreePlanting={admin.impact.simulateTreePlanting}
              onHealthCamp={admin.impact.simulateHealthCamp}
              onCorporateGrant={admin.impact.simulateCorporateGrant}
            />
          )}

          {activeTab === 'users' && (
            <UsersTab users={admin.users.users} onToggleRole={admin.users.toggleRole} />
          )}

          {activeTab === 'volunteers' && (
            <VolunteersTab
              volunteers={admin.volunteers.volunteers}
              onApprove={admin.volunteers.approveVolunteer}
              onReject={admin.volunteers.rejectVolunteer}
            />
          )}

          {activeTab === 'donations' && <DonationsTab donations={admin.donations.donations} />}

          {activeTab === 'events' && (
            <EventsTab
              events={admin.events.events}
              onAddEvent={admin.events.addEvent}
              onDeleteEvent={admin.events.removeEvent}
            />
          )}

          {activeTab === 'registrations' && (
            <RegistrationsTab
              registrations={admin.registrations.registrations}
              onMarkAttended={admin.registrations.markAttended}
              onViewCertificate={admin.registrations.viewCertificate}
              onDelete={admin.registrations.removeRegistration}
            />
          )}

          {activeTab === 'certificates' && (
            <CertificatesTab
              certificates={admin.certificates.certificates}
              sigImage={admin.certificates.sigImage}
              stampImage={admin.certificates.stampImage}
              onUploadSignature={admin.certificates.uploadSignature}
              onUploadStamp={admin.certificates.uploadStamp}
              onResetAssets={admin.certificates.resetAssets}
              onDownload={admin.certificates.openCertificate}
            />
          )}

          {activeTab === 'ai-assistant' && (
            <AiAssistantTab
              addCertificate={admin.certificates.addCertificate}
              sigImage={admin.certificates.sigImage}
              stampImage={admin.certificates.stampImage}
              volunteers={admin.volunteers.volunteers}
            />
          )}

          {activeTab === 'notifications' && <NotificationsTab />}
        </div>
      </div>

      {admin.certificates.showCertModal && admin.certificates.selectedCertificate && (
        <CertificateModal
          certificate={admin.certificates.selectedCertificate}
          sigImage={admin.certificates.sigImage}
          stampImage={admin.certificates.stampImage}
          onClose={admin.certificates.closeCertificate}
        />
      )}
    </div>
  );
}
