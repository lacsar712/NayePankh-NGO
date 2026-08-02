import { Mail, Trash2 } from 'lucide-react';

export default function NotificationsPanel({
  notifications,
  selectedNotification,
  onSelect,
  onClear,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 font-display flex items-center space-x-2">
            <Mail className="h-5.5 w-5.5 text-primary-500" />
            <span>Admin Notifications Log</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Simulating emails routed to{' '}
            <strong className="text-slate-800 font-semibold">
              admintestsprojects@gmail.com
            </strong>
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-50 text-red-650 hover:bg-red-100 border border-red-150 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Inbox Logs</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <div className="p-4 bg-primary-50 rounded-full mb-4">
            <Mail className="h-10 w-10 text-primary-550 opacity-60" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Inbox is empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
            Whenever a volunteer registration, internship application, career inquiry, or
            donation succeeds, notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[600px] bg-slate-50">
            <div className="p-3.5 bg-white border-b border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Messages ({notifications.length})
              </span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-600">
                Local Cache
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-150">
              {notifications.map((notif) => {
                const isSelected = selectedNotification?.id === notif.id;
                let badgeColor = '';
                if (notif.type === 'volunteer')
                  badgeColor = 'bg-sky-50 text-sky-600 border border-sky-100';
                else if (notif.type === 'internship')
                  badgeColor = 'bg-indigo-50 text-indigo-600 border border-indigo-100';
                else if (notif.type === 'work')
                  badgeColor = 'bg-amber-50 text-amber-600 border border-amber-100';
                else if (notif.type === 'donation')
                  badgeColor = 'bg-emerald-50 text-emerald-600 border border-emerald-100';

                return (
                  <div
                    key={notif.id}
                    onClick={() => onSelect(notif)}
                    className={`p-4 transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-white border-l-4 border-l-primary-500 shadow-sm'
                        : 'hover:bg-slate-100/70 bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span
                        className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md ${badgeColor}`}
                      >
                        {notif.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(notif.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {notif.subject}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      To: {notif.recipient}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[600px] bg-white">
            {selectedNotification ? (
              <div className="flex flex-col h-full">
                <div className="p-4 bg-slate-50 border-b border-slate-150 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {selectedNotification.subject}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-400">To:</span>{' '}
                        {selectedNotification.recipient}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {new Date(selectedNotification.timestamp).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-slate-100/50 flex justify-center">
                  <div
                    className="w-full max-w-full bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200"
                    dangerouslySetInnerHTML={{ __html: selectedNotification.html }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-12 space-y-3">
                <div className="p-3 bg-slate-50 rounded-full border border-slate-100">
                  <Mail className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-700">No message selected</p>
                <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                  Select an email notification from the left list pane to view the
                  formatted HTML content.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
