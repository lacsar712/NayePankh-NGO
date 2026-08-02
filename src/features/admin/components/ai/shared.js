export const aiInputClass =
  'w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors';

export function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
      {children}
    </label>
  );
}
