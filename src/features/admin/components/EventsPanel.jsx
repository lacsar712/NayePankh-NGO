import { Plus, Trash2 } from 'lucide-react';

export default function EventsPanel({
  events,
  newEvent,
  onNewEventChange,
  onAddEvent,
  onDeleteEvent,
}) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 font-display">
          Campaign & Event Manager
        </h2>
        <span className="text-xs text-slate-400 font-bold uppercase">
          {events.length} Active Items
        </span>
      </div>

      <form
        onSubmit={onAddEvent}
        className="bg-slate-50 border border-slate-100 p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
      >
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Event Title
          </label>
          <input
            type="text"
            required
            value={newEvent.title}
            onChange={(e) => onNewEventChange({ ...newEvent, title: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
            placeholder="e.g. Slum Health drive"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Date
          </label>
          <input
            type="date"
            required
            value={newEvent.date}
            onChange={(e) => onNewEventChange({ ...newEvent, date: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Location
          </label>
          <input
            type="text"
            required
            value={newEvent.location}
            onChange={(e) => onNewEventChange({ ...newEvent, location: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
            placeholder="e.g. Sector 5, Noida"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Event Description
          </label>
          <input
            type="text"
            required
            value={newEvent.desc}
            onChange={(e) => onNewEventChange({ ...newEvent, desc: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
            placeholder="Short description showcasing the event's goals..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Event Type
          </label>
          <select
            value={newEvent.rawType}
            onChange={(e) => {
              const val = e.target.value;
              const typeMap = {
                drive: 'Drive Campaign',
                medical: 'Medical Camp',
                skill: 'Skill Development',
              };
              onNewEventChange({ ...newEvent, rawType: val, type: typeMap[val] });
            }}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
          >
            <option value="drive">Drive Campaign</option>
            <option value="medical">Medical Camp</option>
            <option value="skill">Skill Development</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Showcase Image (Required)
          </label>
          <input
            type="file"
            accept="image/*"
            required={!newEvent.image}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  onNewEventChange({ ...newEvent, image: reader.result });
                };
                reader.readAsDataURL(file);
              }
            }}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-1.5 text-xs focus:outline-none focus:border-primary-500 transition-colors file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 cursor-pointer"
          />
        </div>

        {newEvent.image && (
          <div className="sm:col-span-4 flex items-center space-x-3 bg-white border border-slate-200 p-2.5 rounded-xl">
            <img
              src={newEvent.image}
              className="h-14 w-20 object-cover rounded-lg border border-slate-200 shadow-sm"
              alt="Preview"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-emerald-600">✓ Image Loaded Successfully</p>
              <button
                type="button"
                onClick={() => onNewEventChange({ ...newEvent, image: '' })}
                className="text-[10px] text-red-500 font-bold hover:underline"
              >
                Remove Image
              </button>
            </div>
          </div>
        )}

        <div className="sm:col-span-4 flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-brand-navy hover:bg-brand-plum text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold">
              <th className="pb-3 pr-4">Event Campaign</th>
              <th className="pb-3 pr-4">Scheduled Date</th>
              <th className="pb-3 pr-4">Location</th>
              <th className="pb-3 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/50">
                <td className="py-4 font-bold text-slate-800 flex items-center space-x-3">
                  {e.image && (
                    <img
                      src={e.image}
                      alt={e.title}
                      className="h-8 w-11 object-cover rounded-lg border border-slate-200 shadow-sm shrink-0"
                    />
                  )}
                  <span>{e.title}</span>
                </td>
                <td className="py-4 text-slate-500">{e.date}</td>
                <td className="py-4 text-slate-500 font-semibold">{e.location}</td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => onDeleteEvent(e.id)}
                    className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 rounded-lg transition-colors inline-flex"
                  >
                    <Trash2 className="h-4 w-4" />
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
