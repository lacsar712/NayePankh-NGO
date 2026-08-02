// Admin UI layer — tab navigation bar
import { memo } from 'react';
import { Sparkles, Mail } from 'lucide-react';
import { ADMIN_TABS } from '../constants/storageKeys';

const TAB_LABELS = {
  'ai-assistant': 'Gemini AI Hub',
  registrations: 'Event Registrations',
  certificates: 'Event Certificates',
  analytics: 'Live Analytics',
  notifications: 'Admin Notifications',
};

function TabNav({ activeTab, onSelect }) {
  return (
    <div className="flex space-x-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
      {ADMIN_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`px-5 py-3 text-sm font-bold capitalize transition-all duration-200 shrink-0 border-b-2 rounded-t-lg -mb-px flex items-center space-x-1.5 ${
            activeTab === tab
              ? 'border-primary-600 text-primary-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {tab === 'ai-assistant' && <Sparkles className="h-4 w-4 text-accent-500 shrink-0" />}
          {tab === 'notifications' && <Mail className="h-4 w-4 text-primary-500 shrink-0" />}
          <span>{TAB_LABELS[tab] || tab}</span>
        </button>
      ))}
    </div>
  );
}

export default memo(TabNav);
