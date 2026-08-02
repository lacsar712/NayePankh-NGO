import { Check, X } from 'lucide-react';

export default function VolunteersPanel({
  volunteers,
  onApprove,
  onReject,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 font-display">
        Volunteer Applications Auditing
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Contact Info</th>
              <th className="pb-3 pr-4">City / Program</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 text-right">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {volunteers.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/50">
                <td className="py-4 font-bold text-slate-800">{v.name}</td>
                <td className="py-4 text-xs text-slate-500 space-y-0.5">
                  <p>{v.email}</p>
                  <p>{v.phone}</p>
                </td>
                <td className="py-4 text-slate-500">
                  {v.city} · <span className="font-semibold text-slate-700">{v.program}</span>
                </td>
                <td className="py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      v.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                        : v.status === 'rejected'
                        ? 'bg-red-50 text-red-500 border border-red-100'
                        : 'bg-amber-50 text-amber-500 border border-amber-100'
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  {v.status === 'pending' ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onApprove(v.id)}
                        className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-150 rounded-lg transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onReject(v.id)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-150 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 uppercase">Audited</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
