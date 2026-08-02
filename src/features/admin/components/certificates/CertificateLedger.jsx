import { Download } from 'lucide-react';

export default function CertificateLedger({ certificates, onView }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 font-display">
          Event Certificates Ledger
        </h2>
        <span className="text-xs text-slate-400 font-bold uppercase">
          {certificates.length} Total Issued
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold">
              <th className="pb-3 pr-4">Certificate ID</th>
              <th className="pb-3 pr-4">Volunteer Info</th>
              <th className="pb-3 pr-4">Event Campaign</th>
              <th className="pb-3 pr-4">Hours / Date</th>
              <th className="pb-3 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400 text-sm">
                  No event certificates issued yet. Mark event registrations as attended
                  to generate.
                </td>
              </tr>
            ) : (
              [...certificates].reverse().map((cert, idx) => (
                <tr key={cert.certificateId || idx} className="hover:bg-slate-50/50">
                  <td className="py-4 font-mono font-bold text-xs text-slate-600 uppercase">
                    {cert.certificateId}
                  </td>
                  <td className="py-4 font-bold text-slate-800">
                    <p>{cert.name}</p>
                    <p className="text-slate-400 text-xs font-normal">{cert.email}</p>
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                      {cert.eventTitle}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-slate-500 space-y-0.5">
                    <p className="font-bold text-slate-700">{cert.hours} Hours Logged</p>
                    <p>{cert.date}</p>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => onView(cert)}
                      className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </button>
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
