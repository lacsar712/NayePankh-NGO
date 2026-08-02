import { aiInputClass, FieldLabel } from './shared';

export function SocialForm({ inputs, setInputs }) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Campaign / Event Title</FieldLabel>
        <input
          type="text"
          required
          value={inputs.title}
          onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
          className={aiInputClass}
          placeholder="e.g. Noida Slum Food Drive"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Platform</FieldLabel>
          <select
            value={inputs.platform}
            onChange={(e) => setInputs({ ...inputs, platform: e.target.value })}
            className={aiInputClass}
          >
            <option>Twitter</option>
            <option>Instagram</option>
            <option>LinkedIn</option>
            <option>Facebook</option>
          </select>
        </div>
        <div>
          <FieldLabel>Tone</FieldLabel>
          <select
            value={inputs.tone}
            onChange={(e) => setInputs({ ...inputs, tone: e.target.value })}
            className={aiInputClass}
          >
            <option>inspiring</option>
            <option>professional</option>
            <option>urgent</option>
            <option>informative</option>
          </select>
        </div>
      </div>
      <div>
        <FieldLabel>Achievements to Highlight</FieldLabel>
        <textarea
          required
          rows="4"
          value={inputs.achievements}
          onChange={(e) => setInputs({ ...inputs, achievements: e.target.value })}
          className={`${aiInputClass} resize-none`}
          placeholder="e.g. Fed over 350 street children and distributed healthy snacks."
        />
      </div>
    </div>
  );
}

export function AppealForm({ inputs, setInputs }) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Cause / Category</FieldLabel>
        <input
          type="text"
          required
          value={inputs.cause}
          onChange={(e) => setInputs({ ...inputs, cause: e.target.value })}
          className={aiInputClass}
          placeholder="e.g. Project Shiksha (Education)"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Target Amount (INR)</FieldLabel>
          <input
            type="number"
            required
            value={inputs.targetAmount}
            onChange={(e) => setInputs({ ...inputs, targetAmount: e.target.value })}
            className={aiInputClass}
            placeholder="e.g. 50000"
          />
        </div>
        <div>
          <FieldLabel>Target Audience</FieldLabel>
          <input
            type="text"
            value={inputs.targetAudience}
            onChange={(e) => setInputs({ ...inputs, targetAudience: e.target.value })}
            className={aiInputClass}
            placeholder="e.g. Corporate CSR"
          />
        </div>
      </div>
    </div>
  );
}

export function ReportForm({ inputs, setInputs }) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Event Name</FieldLabel>
        <input
          type="text"
          required
          value={inputs.eventName}
          onChange={(e) => setInputs({ ...inputs, eventName: e.target.value })}
          className={aiInputClass}
          placeholder="e.g. Noida Health Camp"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Reach Count</FieldLabel>
          <input
            type="text"
            required
            value={inputs.reachCount}
            onChange={(e) => setInputs({ ...inputs, reachCount: e.target.value })}
            className={aiInputClass}
            placeholder="e.g. 150 families"
          />
        </div>
        <div>
          <FieldLabel>Volunteer Hours</FieldLabel>
          <input
            type="number"
            value={inputs.hoursContributed}
            onChange={(e) => setInputs({ ...inputs, hoursContributed: e.target.value })}
            className={aiInputClass}
            placeholder="e.g. 30"
          />
        </div>
      </div>
      <div>
        <FieldLabel>Event Summaries / Notes</FieldLabel>
        <textarea
          rows="3"
          value={inputs.summaries}
          onChange={(e) => setInputs({ ...inputs, summaries: e.target.value })}
          className={`${aiInputClass} resize-none`}
          placeholder="Key activities and outcomes..."
        />
      </div>
    </div>
  );
}

export function AppreciationForm({
  inputs,
  setInputs,
  volunteers,
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Select Volunteer Account</FieldLabel>
        <select
          value={inputs.volunteerEmail || ''}
          onChange={(e) => {
            const vol = volunteers.find((v) => v.email === e.target.value);
            if (vol) {
              setInputs({
                ...inputs,
                volunteerEmail: vol.email,
                volunteerName: vol.name,
              });
            } else {
              setInputs({ ...inputs, volunteerEmail: e.target.value });
            }
          }}
          className={aiInputClass}
        >
          <option value="">-- Manual / Select Volunteer --</option>
          {volunteers.map((v) => (
            <option key={v.id} value={v.email}>
              {v.name} ({v.email})
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Volunteer Name</FieldLabel>
          <input
            type="text"
            required
            value={inputs.volunteerName}
            onChange={(e) => setInputs({ ...inputs, volunteerName: e.target.value })}
            className={aiInputClass}
            placeholder="Ramesh Singh"
          />
        </div>
        <div>
          <FieldLabel>Volunteer Email</FieldLabel>
          <input
            type="email"
            required
            value={inputs.volunteerEmail || ''}
            onChange={(e) => setInputs({ ...inputs, volunteerEmail: e.target.value })}
            className={aiInputClass}
            placeholder="ramesh@gmail.com"
          />
        </div>
      </div>
      <div>
        <FieldLabel>Program / Wing</FieldLabel>
        <input
          type="text"
          required
          value={inputs.program}
          onChange={(e) => setInputs({ ...inputs, program: e.target.value })}
          className={aiInputClass}
          placeholder="e.g. Project Shiksha (Education)"
        />
      </div>
      <div>
        <FieldLabel>Key Contributions</FieldLabel>
        <textarea
          required
          rows="3"
          value={inputs.contributions}
          onChange={(e) => setInputs({ ...inputs, contributions: e.target.value })}
          className={`${aiInputClass} resize-none`}
          placeholder="Specific work done..."
        />
      </div>
    </div>
  );
}

export function CertificateForm({
  inputs,
  setInputs,
  volunteers,
  onSelectVolunteer,
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Select Volunteer Account</FieldLabel>
        <select
          value={inputs.volunteerEmail}
          onChange={(e) => onSelectVolunteer(e.target.value)}
          className={aiInputClass}
        >
          <option value="">-- Manual / Select Volunteer --</option>
          {volunteers.map((v) => (
            <option key={v.id} value={v.email}>
              {v.name} ({v.email})
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Volunteer Name</FieldLabel>
          <input
            type="text"
            required
            value={inputs.volunteerName}
            onChange={(e) => setInputs({ ...inputs, volunteerName: e.target.value })}
            className={aiInputClass}
            placeholder="Ramesh Singh"
          />
        </div>
        <div>
          <FieldLabel>Volunteer Email</FieldLabel>
          <input
            type="email"
            required
            value={inputs.volunteerEmail}
            onChange={(e) => setInputs({ ...inputs, volunteerEmail: e.target.value })}
            className={aiInputClass}
            placeholder="ramesh@gmail.com"
          />
        </div>
      </div>
      <div>
        <FieldLabel>Campaign / Event Title</FieldLabel>
        <input
          type="text"
          required
          value={inputs.eventTitle}
          onChange={(e) => setInputs({ ...inputs, eventTitle: e.target.value })}
          className={aiInputClass}
          placeholder="Noida Winter Clothes & Blanket Drive"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Logged Hours</FieldLabel>
          <input
            type="number"
            required
            value={inputs.hours}
            onChange={(e) => setInputs({ ...inputs, hours: e.target.value })}
            className={aiInputClass}
          />
        </div>
        <div>
          <FieldLabel>Date</FieldLabel>
          <input
            type="date"
            required
            value={inputs.date}
            onChange={(e) => setInputs({ ...inputs, date: e.target.value })}
            className={aiInputClass}
          />
        </div>
      </div>
      <div>
        <FieldLabel>Key Contributions (for Gemini citation)</FieldLabel>
        <textarea
          rows="3"
          value={inputs.contributions}
          onChange={(e) => setInputs({ ...inputs, contributions: e.target.value })}
          className={`${aiInputClass} resize-none`}
          placeholder="e.g. coordinating distribution logistics and managing volunteer registrations"
        />
      </div>
    </div>
  );
}
