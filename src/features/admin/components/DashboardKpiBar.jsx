// UI component: overview-only KPI summary cards shown above the tab nav.
import { Heart, UserCheck, Users, Calendar } from 'lucide-react';

const CARDS = [
  {
    key: 'totalDonationSum',
    label: 'Total Donations',
    icon: Heart,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
    isCurrency: true,
    delta: '+12.4% from last month',
  },
  {
    key: 'totalVolunteersCount',
    label: 'Volunteers',
    icon: UserCheck,
    iconBg: 'bg-secondary-50',
    iconColor: 'text-secondary-600',
    delta: '+48 registered this week',
  },
  {
    key: 'totalUsersCount',
    label: 'Registered Users',
    icon: Users,
    iconBg: 'bg-accent-50',
    iconColor: 'text-accent-600',
    delta: '+120 since system launch',
  },
  {
    key: 'totalEventsCount',
    label: 'Active Campaigns',
    icon: Calendar,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    delta: '3 items scheduled soon',
    deltaColor: 'text-slate-500',
  },
];

export default function DashboardKpiBar({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];
        return (
          <div
            key={card.key}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4"
          >
            <div className={`p-3 ${card.iconBg} ${card.iconColor} rounded-xl`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {card.label}
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {card.isCurrency
                  ? `₹${value.toLocaleString('en-IN')}`
                  : value.toLocaleString()}
              </h3>
              <p
                className={`text-[10px] font-bold mt-0.5 ${
                  card.deltaColor || 'text-emerald-500'
                }`}
              >
                {card.delta}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
