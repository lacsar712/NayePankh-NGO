import { memo } from 'react';
import { Award, Check, Trash2 } from 'lucide-react';

/**
 * 【ui 层】活动报名管理 Tab（纯展示组件）
 * @param {{
 *   registrations: Array,
 *   onMarkAttended: (reg: object) => void,
 *   onDeleteRegistration: (id: string|number) => void,
 *   onViewCertificate: (reg: object) => void
 * }} props
 */
function RegistrationsTab({ registrations, onMarkAttended, onDeleteRegistration, onViewCertificate }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 font-display">Event Registrations</h2>
        <span className="text-xs text-slate-400 font-bold uppercase">{registrations.length} Total Registrations</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold">
              <th className="pb-3 pr-4">Registrant Info</th>
              <th className="pb-3 pr-4">Contact Details</th>
              <th className="pb-3 pr-4">Event Campaign</th>
              <th className="pb-3 pr-4">Special Notes</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {registrations.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400 text-sm">
                  No event registrations found.
                </td>
              </tr>
            ) : (
              registrations.map((reg, idx) => (
                <tr key={reg.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-4 font-bold text-slate-800">{reg.name}</td>
                  <td className="py-4 text-xs text-slate-500 space-y-0.5">
                    <p>{reg.email}</p>
                    <p>{reg.phone}</p>
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-primary-50 text-primary-600 border border-primary-100">
                      {reg.eventTitle || reg.eventId}
                    </span>
                  </td>
                  <td className="py-4 text-slate-650 text-xs max-w-xs truncate" title={reg.notes}>
                    {reg.notes || <span className="text-slate-350 italic">None</span>}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end items-center space-x-2">
                      {reg.status === 'attended' ? (
                        <>
                          <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-1 rounded-lg">
                            <Award className="h-3 w-3 shrink-0" />
                            <span>Attended</span>
                          </span>
                          <button
                            onClick={() => onViewCertificate(reg)}
                            title="View/Download Certificate"
                            className="p-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Award className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onMarkAttended(reg)}
                          title="Mark Attended & Generate Cert"
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Mark Attended</span>
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteRegistration(reg.id || idx)}
                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 rounded-lg transition-colors inline-flex cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(RegistrationsTab);
