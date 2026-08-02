import { memo } from 'react';

function DashboardHeader() {
  return (
    <div className="bg-white text-slate-900 border border-slate-200/80 rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-80 h-80 bg-primary-100/30 rounded-full blur-3xl" />
      <div className="flex items-center space-x-3 mb-4 relative z-10">
        <img
          src="/logo.png"
          className="h-12 w-12 object-contain bg-white rounded-2xl p-0.5 shadow-sm border border-slate-200"
          alt="NayePankh Logo"
        />
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900">
            Admin Hub
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            80G & 12A Certified Foundation
          </p>
        </div>
      </div>
      <p className="text-slate-600 text-sm mt-2 relative z-10">
        Monitor donations, manage roles, audit volunteer signups, and utilize
        Gemini AI writing engines.
      </p>
    </div>
  );
}

export default memo(DashboardHeader);
