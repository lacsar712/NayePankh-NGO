import { Sparkles, Heart, Calendar, UserCheck, Award } from 'lucide-react';
import { AI_TOOLS } from '../../constants/tabs';

const TOOL_TABS = [
  { id: AI_TOOLS.SOCIAL, name: 'Social Post', icon: Sparkles },
  { id: AI_TOOLS.APPEAL, name: 'Donation Appeal', icon: Heart },
  { id: AI_TOOLS.REPORT, name: 'Event Report', icon: Calendar },
  { id: AI_TOOLS.APPRECIATION, name: 'Appreciation', icon: UserCheck },
  { id: AI_TOOLS.CERTIFICATE, name: 'AI Certificate', icon: Award },
];

export default function AiToolTabs({ aiTool, onSelect }) {
  return (
    <div className="bg-slate-50 border border-slate-200/80 p-2 rounded-2xl flex flex-wrap gap-1.5 justify-center">
      {TOOL_TABS.map((tool) => {
        const Icon = tool.icon;
        const isSelected = aiTool === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelect(tool.id)}
            className={`flex-grow sm:flex-grow-0 flex items-center justify-center space-x-1.5 py-2.5 px-3.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isSelected
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{tool.name}</span>
          </button>
        );
      })}
    </div>
  );
}
