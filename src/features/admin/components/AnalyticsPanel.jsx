// UI component: analytics tab — KPI grid, SVG trend chart, target bars, simulator.
// Memoized; trend/target math delegated to utils/analytics pure functions.
import { memo, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  Heart,
  Leaf,
  Utensils,
  Sparkles,
} from 'lucide-react';
import {
  computeDonationTrend,
  computeTargetProgress,
} from '../utils/analytics';

const KPI_CARDS = [
  { key: 'totalDonationSum', label: 'Total Donations', icon: TrendingUp, iconClass: 'text-primary-500', sub: 'Live from payment ledger' },
  { key: 'totalVolunteersCount', label: 'Volunteers', icon: Users, iconClass: 'text-secondary-500', sub: 'Active crew base' },
  { key: 'totalEventsCount', label: 'Campaign Drives', icon: Calendar, iconClass: 'text-accent-500', sub: 'Completed / Scheduled' },
  { key: 'totalBeneficiariesCount', label: 'Beneficiaries', icon: Heart, iconClass: 'text-rose-500', sub: 'Direct support reach' },
  { key: 'totalTreesCount', label: 'Trees Planted', icon: Leaf, iconClass: 'text-emerald-500', sub: 'Project Green wing' },
  { key: 'totalMealsCount', label: 'Meals Served', icon: Utensils, iconClass: 'text-amber-500', sub: 'Nutrition distribution' },
];

const SIMULATOR_BUTTONS = [
  { key: 'triggerFoodDrive', icon: Utensils, iconColor: 'text-amber-400', label: 'Food Drive (+500 Meals)' },
  { key: 'triggerTreePlanting', icon: Leaf, iconColor: 'text-emerald-400', label: 'Tree Planting (+100 Trees)' },
  { key: 'triggerHealthCamp', icon: Heart, iconColor: 'text-rose-400', label: 'Health Camp (+250 People)' },
  { key: 'triggerCorporateGrant', icon: TrendingUp, iconColor: 'text-primary-400', label: 'Corporate Grant (+₹25K)' },
];

function AnalyticsPanelBase({ stats, impact }) {
  const trend = useMemo(
    () => computeDonationTrend(stats.totalDonationSum),
    [stats.totalDonationSum]
  );
  const targets = useMemo(
    () => computeTargetProgress(stats),
    [stats]
  );

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Live Impact Analytics</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time indicators, target progressions, and ground activity statistics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {card.label}
                </span>
                <Icon className={`h-4.5 w-4.5 ${card.iconClass}`} />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {card.key === 'totalDonationSum'
                    ? `₹${stats[card.key].toLocaleString('en-IN')}`
                    : stats[card.key].toLocaleString()}
                </h3>
                <p className="text-[9px] text-emerald-500 font-bold mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">
              Donation Revenue Growth Trend
            </h3>
            <p className="text-[11px] text-slate-450 mt-0.5">
              Cumulative monthly fundraising ledger comparison (Jan - Jun 2026).
            </p>
          </div>
          <div className="h-[220px] w-full pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              <line x1="50" y1="40" x2="450" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="100" x2="450" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="160" x2="450" y2="160" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="180" x2="450" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="50" y1="40" x2="50" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

              <text x="12" y="44" className="text-[9px] fill-slate-400 font-bold">1.5M</text>
              <text x="12" y="104" className="text-[9px] fill-slate-400 font-bold">1.0M</text>
              <text x="12" y="164" className="text-[9px] fill-slate-400 font-bold">0.5M</text>

              <path d={trend.areaPath} fill="url(#donationGradient)" />
              <path
                d={trend.linePath}
                fill="none"
                stroke="rgb(236, 72, 153)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {trend.dots.map((dot, i) => (
                <circle
                  key={i}
                  cx={dot.cx}
                  cy={dot.cy}
                  r="4.5"
                  fill="white"
                  stroke="rgb(236, 72, 153)"
                  strokeWidth="2.5"
                />
              ))}

              <text x="50" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Jan</text>
              <text x="130" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Feb</text>
              <text x="210" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Mar</text>
              <text x="290" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Apr</text>
              <text x="370" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">May</text>
              <text x="450" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Jun</text>
            </svg>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">
              Social Impact Targets
            </h3>
            <p className="text-[11px] text-slate-455 mt-0.5">
              Progression of active drives towards annual target milestones.
            </p>
          </div>

          <div className="space-y-5">
            {targets.map((t) => (
              <div key={t.key} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800">{t.label}</span>
                  <span className="text-slate-500 font-bold">
                    {t.current.toLocaleString()} / {t.target.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full ${t.color} rounded-full transition-all duration-500`}
                    style={{ width: `${t.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary-500/5 border border-primary-500/10 p-4 rounded-xl text-xs text-primary-750 font-semibold space-y-1">
            <p className="font-bold text-slate-850">🎯 Milestone Target Progress Overview</p>
            <p className="text-slate-500 font-medium text-[11px] leading-relaxed">
              Projected timelines estimate hitting all 3 target milestones by November 2026
              based on the current volunteer support indices.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="flex items-center space-x-2.5">
          <Sparkles className="h-5.5 w-5.5 text-accent-400 shrink-0 animate-pulse" />
          <div>
            <h3 className="text-base font-bold font-display">Real-Time Stats Simulator</h3>
            <p className="text-xs text-slate-400 font-medium">
              Trigger simulated volunteer activities to watch live counters and SVG charts
              increment instantly.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {SIMULATOR_BUTTONS.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.key}
                onClick={impact[btn.key]}
                className="p-4 bg-slate-800 border border-slate-700/60 hover:bg-slate-750 rounded-2xl text-center text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm flex flex-col items-center justify-center space-y-2 text-white"
              >
                <Icon className={`h-5 w-5 ${btn.iconColor}`} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const AnalyticsPanel = memo(AnalyticsPanelBase);
export default AnalyticsPanel;
