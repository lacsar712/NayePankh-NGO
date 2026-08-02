import { memo } from 'react';

function DonationsTab({ donations }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 font-display">
        Donation Ledger
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold">
              <th className="pb-3 pr-4">Donor Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Amount (INR)</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Method / Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {donations.map((don) => (
              <tr key={don.id} className="hover:bg-slate-50/50">
                <td className="py-4 font-bold text-slate-800">{don.donor}</td>
                <td className="py-4 text-slate-500">{don.email}</td>
                <td className="py-4 font-extrabold text-slate-900">
                  ₹{don.amount.toLocaleString()}
                </td>
                <td className="py-4">
                  <span className="text-xs uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                    {don.frequency}
                  </span>
                </td>
                <td className="py-4 text-xs text-slate-500">
                  <p>{don.method}</p>
                  <p>{don.date}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(DonationsTab);
