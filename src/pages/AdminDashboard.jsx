// ui: thin shell. Owns no data logic — only layout, tab routing and wiring
// the useAdminDashboard hook into presentational components.
import { useAdminDashboard } from '../features/admin/hooks/useAdminDashboard';
import DashboardHeader from '../features/admin/components/DashboardHeader';
import KpiCards from '../features/admin/components/KpiCards';
import TabNav from '../features/admin/components/TabNav';
import DashboardPanels from '../features/admin/components/DashboardPanels';
import CertificateModal from '../features/admin/components/CertificateModal';

export default function AdminDashboard() {
  const dashboard = useAdminDashboard();
  const {
    activeTab,
    setActiveTab,
    stats,
    selectedCertificate,
    showCertModal,
    closeCertModal,
    sigImage,
    stampImage,
  } = dashboard;

  return (
    <div className="min-h-screen bg-slate-50 pt-36 md:pt-44 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader />

        {activeTab === 'overview' && <KpiCards stats={stats} />}

        <TabNav activeTab={activeTab} onSelectTab={setActiveTab} />

        <DashboardPanels activeTab={activeTab} dashboard={dashboard} />
      </div>

      {showCertModal && selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          sigImage={sigImage}
          stampImage={stampImage}
          onClose={closeCertModal}
        />
      )}
    </div>
  );
}
