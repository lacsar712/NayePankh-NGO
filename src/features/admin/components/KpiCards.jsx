import { memo } from 'react';
import { Users, Heart, Calendar, UserCheck } from 'lucide-react';

function KpiCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
          <Heart className="h-6 w-6" />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Total Donations
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            ₹{stats.totalDonationSum.toLocaleString('en-IN')}
          </h3>
          <p className="text-[10px] text-emerald-500 font-bold mt-0.5">
            +12.4% from last month
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-secondary-50 text-secondary-600 rounded-xl">
          <UserCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Volunteers
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {stats.totalVolunteersCount.toLocaleString()}
          </h3>
          <p className="text-[10px] text-emerald-500 font-bold mt-0.5">
            +48 registered this week
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-accent-50 text-accent-600 rounded-xl">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Registered Users
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {stats.usersCount}
          </h3>
          <p className="text-[10px] text-emerald-500 font-bold mt-0.5">
            +120 since system launch
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Active Campaigns
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {stats.totalEventsCount}
          </h3>
          <p className="text-[10px] text-slate-500 font-bold mt-0.5">
            3 items scheduled soon
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(KpiCards);
