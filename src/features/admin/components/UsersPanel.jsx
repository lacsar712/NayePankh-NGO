export default function UsersPanel({ users, onToggleRole }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 font-display">User Role Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold">
              <th className="pb-3 pr-4">User Details</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Current Role</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="py-4 font-bold text-slate-800">{u.name}</td>
                <td className="py-4 text-slate-500">{u.email}</td>
                <td className="py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      u.role === 'admin'
                        ? 'bg-primary-50 text-primary-600 border border-primary-100'
                        : u.role === 'volunteer'
                        ? 'bg-secondary-50 text-secondary-600 border border-secondary-100'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => onToggleRole(u.id)}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Cycle Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
