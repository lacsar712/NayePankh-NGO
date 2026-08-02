import { memo } from 'react';

/**
 * 【ui 层】Overview 面板（近期捐赠 + 近期志愿者，纯展示组件）
 * @param {{ donations: Array, volunteers: Array }} props
 */
function OverviewTab({ donations, volunteers }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 font-display">System Status Overview</h2>
        <span className="text-xs font-bold text-slate-400 uppercase">Updates live</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-slate-200/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Recent Sponsorship Transactions
          </h3>
          <div className="divide-y divide-slate-100">
            {donations.map(don => (
              <div key={don.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold text-slate-800">{don.donor}</p>
                  <p className="text-slate-400 text-xs">{don.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">₹{don.amount.toLocaleString()}</p>
                  <span className="text-[10px] uppercase font-bold text-primary-500">{don.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-slate-200/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Recent Volunteer Submissions
          </h3>
          <div className="divide-y divide-slate-100">
            {volunteers.map(vol => (
              <div key={vol.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold text-slate-800">{vol.name}</p>
                  <p className="text-slate-400 text-xs">{vol.city} · {vol.program}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                  vol.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                    : vol.status === 'rejected'
                      ? 'bg-red-50 text-red-500 border border-red-100'
                      : 'bg-amber-50 text-amber-500 border border-amber-100'
                }`}>
                  {vol.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(OverviewTab);
