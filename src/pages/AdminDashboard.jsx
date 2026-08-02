import { Sparkles, Mail } from 'lucide-react';
import { useAdminDashboard } from '../features/admin/hooks/useAdminDashboard';
import { ADMIN_TABS, ADMIN_TAB_LABELS } from '../features/admin/constants/tabs';
import OverviewKpiRow from '../features/admin/components/OverviewKpiRow';
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

/**
 * Admin 后台薄壳编排页：
 * 只负责布局、Tab 切换，以及把 useAdminDashboard 的返回值注入各展示组件。
 * 数据读写逻辑见 src/features/admin/{services,hooks}，展示实现见 src/features/admin/components。
 */
export default function AdminDashboard() {
  const admin = useAdminDashboard();
  const { activeTab, setActiveTab, users, volunteers, donations, events, registrations, certificates, notifications, stats } = admin;

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

        {/* Analytics KPIs Row */}
        {activeTab === 'overview' && <OverviewKpiRow totals={stats.totals} />}

        {/* Dashboard Tabs Nav */}
        <div className="flex space-x-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-bold capitalize transition-all duration-200 shrink-0 border-b-2 rounded-t-lg -mb-px flex items-center space-x-1.5 ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'ai-assistant' && <Sparkles className="h-4 w-4 text-accent-500 shrink-0" />}
              {tab === 'notifications' && <Mail className="h-4 w-4 text-primary-500 shrink-0" />}
              <span>{ADMIN_TAB_LABELS[tab] || tab}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Panels */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">

          {activeTab === 'overview' && (
            <OverviewTab donations={donations.list} volunteers={volunteers.list} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab totals={stats.totals} simulate={stats.simulate} />
          )}

          {activeTab === 'users' && (
            <UsersTab users={users.list} onToggleRole={users.toggleRole} />
          )}

          {activeTab === 'volunteers' && (
            <VolunteersTab volunteers={volunteers.list} onApprove={volunteers.approve} onReject={volunteers.reject} />
          )}

          {activeTab === 'donations' && (
            <DonationsTab donations={donations.list} />
          )}

          {activeTab === 'events' && (
            <EventsTab
              events={events.list}
              newEvent={events.newEvent}
              onNewEventChange={events.setNewEvent}
              onAddEvent={events.addEvent}
              onDeleteEvent={events.remove}
            />
          )}

          {activeTab === 'registrations' && (
            <RegistrationsTab
              registrations={registrations.list}
              onMarkAttended={registrations.markAttended}
              onDeleteRegistration={registrations.remove}
              onViewCertificate={certificates.viewForRegistration}
            />
          )}

          {activeTab === 'certificates' && (
            <CertificatesTab
              certificates={certificates.list}
              sigImage={certificates.sigImage}
              stampImage={certificates.stampImage}
              onUploadSignature={certificates.uploadSignature}
              onUploadStamp={certificates.uploadStamp}
              onResetAssets={certificates.resetAssets}
              onViewCertificate={certificates.view}
            />
          )}

          {activeTab === 'ai-assistant' && (
            <AiAssistantTab
              volunteers={volunteers.list}
              addCertificate={certificates.addCertificate}
              sigImage={certificates.sigImage}
              stampImage={certificates.stampImage}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications.list}
              selected={notifications.selected}
              onSelect={notifications.select}
              onClear={notifications.clear}
            />
          )}

        </div>

      </div>

      {certificates.isModalOpen && certificates.selected && (
        <CertificateModal
          certificate={certificates.selected}
          sigImage={certificates.sigImage}
          stampImage={certificates.stampImage}
          onClose={certificates.closeModal}
        />
      )}
    </div>
  );
}
