import { memo } from 'react';
import { Sparkles, Mail } from 'lucide-react';
import { ADMIN_TABS, TAB_LABELS } from '../constants/storageKeys';

const TAB_ICONS = {
  'ai-assistant': Sparkles,
  notifications: Mail,
};

function TabNav({ activeTab, onSelectTab }) {
  return (
    <div className="flex space-x-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
      {ADMIN_TABS.map((tab) => {
        const Icon = TAB_ICONS[tab];
        return (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`px-5 py-3 text-sm font-bold capitalize transition-all duration-200 shrink-0 border-b-2 rounded-t-lg -mb-px flex items-center space-x-1.5 ${
              activeTab === tab
                ? 'border-primary-600 text-primary-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span>{TAB_LABELS[tab] || tab}</span>
          </button>
        );
      })}
    </div>
  );
}

export default memo(TabNav);
