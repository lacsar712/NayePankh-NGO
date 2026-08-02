import { memo, useMemo } from 'react';
import { Users, Heart, Calendar, TrendingUp, Leaf, Utensils, Sparkles } from 'lucide-react';
import { buildDonationTrend } from '../utils/analytics';

/**
 * 【ui 层】Live Analytics 面板（计数器 + 趋势图 + 目标进度 + 模拟器，纯展示组件）。
 * 趋势图几何数据由 utils/analytics.buildDonationTrend 纯函数派生并 useMemo。
 * @param {{
 *   totals: {
 *     donationsSum: number, volunteersCount: number, eventsCount: number,
 *     beneficiariesCount: number, treesCount: number, mealsCount: number
 *   },
 *   simulate: { foodDrive: () => void, treeDrive: () => void, healthCamp: () => void, corporateGrant: () => void }
 * }} props
 */
function AnalyticsTab({ totals, simulate }) {
  const trend = useMemo(() => buildDonationTrend(totals.donationsSum), [totals.donationsSum]);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Live Impact Analytics</h2>
          <p className="text-xs text-slate-500 mt-1">Real-time indicators, target progressions, and ground activity statistics.</p>
        </div>
      </div>

      {/* Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Donations</span>
            <TrendingUp className="h-4.5 w-4.5 text-primary-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-slate-900 leading-tight">₹{totals.donationsSum.toLocaleString('en-IN')}</h3>
            <p className="text-[9px] text-emerald-500 font-bold mt-1">Live from payment ledger</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Volunteers</span>
            <Users className="h-4.5 w-4.5 text-secondary-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-slate-900 leading-tight">{totals.volunteersCount.toLocaleString()}</h3>
            <p className="text-[9px] text-emerald-500 font-bold mt-1">Active crew base</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Campaign Drives</span>
            <Calendar className="h-4.5 w-4.5 text-accent-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-slate-900 leading-tight">{totals.eventsCount}</h3>
            <p className="text-[9px] text-slate-500 font-bold mt-1">Completed / Scheduled</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Beneficiaries</span>
            <Heart className="h-4.5 w-4.5 text-rose-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-slate-900 leading-tight">{totals.beneficiariesCount.toLocaleString()}</h3>
            <p className="text-[9px] text-primary-500 font-bold mt-1">Direct support reach</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Trees Planted</span>
            <Leaf className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-slate-900 leading-tight">{totals.treesCount.toLocaleString()}</h3>
            <p className="text-[9px] text-emerald-500 font-bold mt-1">Project Green wing</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Meals Served</span>
            <Utensils className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-slate-900 leading-tight">{totals.mealsCount.toLocaleString()}</h3>
            <p className="text-[9px] text-amber-500 font-bold mt-1">Nutrition distribution</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Donation Growth Trend Area Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">Donation Revenue Growth Trend</h3>
            <p className="text-[11px] text-slate-450 mt-0.5">Cumulative monthly fundraising ledger comparison (Jan - Jun 2026).</p>
          </div>
          <div className="h-[220px] w-full pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0.00"/>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="50" y1="40" x2="450" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="100" x2="450" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="160" x2="450" y2="160" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="180" x2="450" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="50" y1="40" x2="50" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Y-Axis labels */}
              <text x="12" y="44" className="text-[9px] fill-slate-400 font-bold">1.5M</text>
              <text x="12" y="104" className="text-[9px] fill-slate-400 font-bold">1.0M</text>
              <text x="12" y="164" className="text-[9px] fill-slate-400 font-bold">0.5M</text>

              {/* Area Path */}
              <path d={trend.areaPath} fill="url(#donationGradient)" />

              {/* Line Path */}
              <path
                d={trend.linePath}
                fill="none"
                stroke="rgb(236, 72, 153)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Dots */}
              {trend.points.map(p => (
                <circle key={p.x} cx={p.x} cy={p.y} r="4.5" fill="white" stroke="rgb(236, 72, 153)" strokeWidth="2.5" />
              ))}

              {/* X-Axis Labels */}
              <text x="50" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Jan</text>
              <text x="130" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Feb</text>
              <text x="210" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Mar</text>
              <text x="290" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Apr</text>
              <text x="370" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">May</text>
              <text x="450" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Jun</text>
            </svg>
          </div>
        </div>

        {/* Target Progress Bar Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">Social Impact Targets</h3>
            <p className="text-[11px] text-slate-455 mt-0.5">Progression of active drives towards annual target milestones.</p>
          </div>

          <div className="space-y-5">
            {/* Beneficiaries Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800">Beneficiaries Helped</span>
                <span className="text-slate-500 font-bold">{totals.beneficiariesCount.toLocaleString()} / 20,000</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.beneficiariesCount / 20000) * 100)}%` }}
                />
              </div>
            </div>

            {/* Trees Planted Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800">Trees Planted</span>
                <span className="text-slate-500 font-bold">{totals.treesCount.toLocaleString()} / 5,000</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.treesCount / 5000) * 100)}%` }}
                />
              </div>
            </div>

            {/* Meals Served Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800">Meals Served</span>
                <span className="text-slate-500 font-bold">{totals.mealsCount.toLocaleString()} / 10,000</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.mealsCount / 10000) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-primary-500/5 border border-primary-500/10 p-4 rounded-xl text-xs text-primary-750 font-semibold space-y-1">
            <p className="font-bold text-slate-850">🎯 Milestone Target Progress Overview</p>
            <p className="text-slate-500 font-medium text-[11px] leading-relaxed">
              Projected timelines estimate hitting all 3 target milestones by November 2026 based on the current volunteer support indices.
            </p>
          </div>
        </div>

      </div>

      {/* Real-time stats simulator control panel */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="flex items-center space-x-2.5">
          <Sparkles className="h-5.5 w-5.5 text-accent-400 shrink-0 animate-pulse" />
          <div>
            <h3 className="text-base font-bold font-display">Real-Time Stats Simulator</h3>
            <p className="text-xs text-slate-400 font-medium">Trigger simulated volunteer activities to watch live counters and SVG charts increment instantly.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <button
            onClick={simulate.foodDrive}
            className="p-4 bg-slate-800 border border-slate-700/60 hover:bg-slate-750 rounded-2xl text-center text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm flex flex-col items-center justify-center space-y-2 text-white"
          >
            <Utensils className="h-5 w-5 text-amber-400" />
            <span>Food Drive (+500 Meals)</span>
          </button>

          <button
            onClick={simulate.treeDrive}
            className="p-4 bg-slate-800 border border-slate-700/60 hover:bg-slate-750 rounded-2xl text-center text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm flex flex-col items-center justify-center space-y-2 text-white"
          >
            <Leaf className="h-5 w-5 text-emerald-400" />
            <span>Tree Planting (+100 Trees)</span>
          </button>

          <button
            onClick={simulate.healthCamp}
            className="p-4 bg-slate-800 border border-slate-700/60 hover:bg-slate-750 rounded-2xl text-center text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm flex flex-col items-center justify-center space-y-2 text-white"
          >
            <Heart className="h-5 w-5 text-rose-400" />
            <span>Health Camp (+250 People)</span>
          </button>

          <button
            onClick={simulate.corporateGrant}
            className="p-4 bg-slate-800 border border-slate-700/60 hover:bg-slate-750 rounded-2xl text-center text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm flex flex-col items-center justify-center space-y-2 text-white"
          >
            <TrendingUp className="h-5 w-5 text-primary-400" />
            <span>Corporate Grant (+₹25K)</span>
          </button>
        </div>
      </div>

    </div>
  );
}

export default memo(AnalyticsTab);
