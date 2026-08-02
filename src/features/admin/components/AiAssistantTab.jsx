import { memo } from 'react';
import {
  Heart,
  Calendar,
  UserCheck,
  Check,
  Award,
  Sparkles,
  Copy,
  AlertCircle,
  Loader2,
  Upload,
  Mail,
} from 'lucide-react';
import { useAdminAi } from '../hooks/useAdminAi';

const AI_TOOLS = [
  { id: 'social', name: 'Social Post', icon: Sparkles },
  { id: 'appeal', name: 'Donation Appeal', icon: Heart },
  { id: 'report', name: 'Event Report', icon: Calendar },
  { id: 'appreciation', name: 'Appreciation', icon: UserCheck },
  { id: 'certificate', name: 'AI Certificate', icon: Award },
];

/**
 * 【ui 层】Gemini AI 助手 Tab。
 * AI 表单 state 通过 useAdminAi 下沉到本组件内部：
 * 高频输入只重渲染本 Tab，不拖累 AdminDashboard 薄壳与其它 Tab。
 * @param {{
 *   volunteers: Array,
 *   addCertificate: (certData: object) => Promise<object>,
 *   sigImage: string,
 *   stampImage: string
 * }} props
 */
function AiAssistantTab({ volunteers, addCertificate, sigImage, stampImage }) {
  const ai = useAdminAi({ volunteers, addCertificate, sigImage, stampImage });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-950 font-display flex items-center space-x-2">
          <Sparkles className="h-5.5 w-5.5 text-accent-500 animate-pulse" />
          <span>Gemini AI Content Engine</span>
        </h2>
        <span className="text-xs font-bold text-slate-400 uppercase">Powered by Gemini 1.5 Flash</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Form & Tools Selector */}
        <div className="lg:col-span-5 space-y-6">

          {/* Tool Selection Tabs */}
          <div className="bg-slate-50 border border-slate-200/80 p-2 rounded-2xl flex flex-wrap gap-1.5 justify-center">
            {AI_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isSelected = ai.tool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => ai.selectTool(tool.id)}
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

          {/* Input Form */}
          <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <form onSubmit={ai.generate} className="space-y-5">

              {ai.tool === 'social' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Campaign / Event Title</label>
                    <input
                      type="text"
                      required
                      value={ai.socialInputs.title}
                      onChange={(e) => ai.setSocialInputs({ ...ai.socialInputs, title: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="e.g. Noida Slum Food Drive"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Platform</label>
                      <select
                        value={ai.socialInputs.platform}
                        onChange={(e) => ai.setSocialInputs({ ...ai.socialInputs, platform: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                      >
                        <option>Twitter</option>
                        <option>Instagram</option>
                        <option>LinkedIn</option>
                        <option>Facebook</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Tone</label>
                      <select
                        value={ai.socialInputs.tone}
                        onChange={(e) => ai.setSocialInputs({ ...ai.socialInputs, tone: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                      >
                        <option>inspiring</option>
                        <option>professional</option>
                        <option>urgent</option>
                        <option>informative</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Achievements to Highlight</label>
                    <textarea
                      required
                      rows="4"
                      value={ai.socialInputs.achievements}
                      onChange={(e) => ai.setSocialInputs({ ...ai.socialInputs, achievements: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                      placeholder="e.g. Fed over 350 street children and distributed healthy snacks."
                    />
                  </div>
                </div>
              )}

              {ai.tool === 'appeal' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Cause / Category</label>
                    <input
                      type="text"
                      required
                      value={ai.appealInputs.cause}
                      onChange={(e) => ai.setAppealInputs({ ...ai.appealInputs, cause: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="e.g. Project Shiksha (Education)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Target Amount (INR)</label>
                      <input
                        type="number"
                        required
                        value={ai.appealInputs.targetAmount}
                        onChange={(e) => ai.setAppealInputs({ ...ai.appealInputs, targetAmount: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="e.g. 50000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Target Audience</label>
                      <input
                        type="text"
                        value={ai.appealInputs.targetAudience}
                        onChange={(e) => ai.setAppealInputs({ ...ai.appealInputs, targetAudience: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="e.g. Corporate CSR"
                      />
                    </div>
                  </div>
                </div>
              )}

              {ai.tool === 'report' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Event Name</label>
                    <input
                      type="text"
                      required
                      value={ai.reportInputs.eventName}
                      onChange={(e) => ai.setReportInputs({ ...ai.reportInputs, eventName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="e.g. Noida Health Camp"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Reach Count</label>
                      <input
                        type="text"
                        required
                        value={ai.reportInputs.reachCount}
                        onChange={(e) => ai.setReportInputs({ ...ai.reportInputs, reachCount: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="e.g. 150 families"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Volunteer Hours</label>
                      <input
                        type="number"
                        value={ai.reportInputs.hoursContributed}
                        onChange={(e) => ai.setReportInputs({ ...ai.reportInputs, hoursContributed: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="e.g. 30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Event Summaries / Notes</label>
                    <textarea
                      rows="3"
                      value={ai.reportInputs.summaries}
                      onChange={(e) => ai.setReportInputs({ ...ai.reportInputs, summaries: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                      placeholder="Key activities and outcomes..."
                    />
                  </div>
                </div>
              )}

              {ai.tool === 'appreciation' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Select Volunteer Account</label>
                    <select
                      value={ai.appreciationInputs.volunteerEmail || ''}
                      onChange={(e) => ai.selectVolunteerForAppreciation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                    >
                      <option value="">-- Manual / Select Volunteer --</option>
                      {volunteers.map(v => (
                        <option key={v.id} value={v.email}>{v.name} ({v.email})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Volunteer Name</label>
                      <input
                        type="text"
                        required
                        value={ai.appreciationInputs.volunteerName}
                        onChange={(e) => ai.setAppreciationInputs({ ...ai.appreciationInputs, volunteerName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="Ramesh Singh"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Volunteer Email</label>
                      <input
                        type="email"
                        required
                        value={ai.appreciationInputs.volunteerEmail || ''}
                        onChange={(e) => ai.setAppreciationInputs({ ...ai.appreciationInputs, volunteerEmail: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="ramesh@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Program / Wing</label>
                    <input
                      type="text"
                      required
                      value={ai.appreciationInputs.program}
                      onChange={(e) => ai.setAppreciationInputs({ ...ai.appreciationInputs, program: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="e.g. Project Shiksha (Education)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Key Contributions</label>
                    <textarea
                      required
                      rows="3"
                      value={ai.appreciationInputs.contributions}
                      onChange={(e) => ai.setAppreciationInputs({ ...ai.appreciationInputs, contributions: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                      placeholder="Specific work done..."
                    />
                  </div>
                </div>
              )}

              {ai.tool === 'certificate' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Select Volunteer Account</label>
                    <select
                      value={ai.certInputs.volunteerEmail}
                      onChange={(e) => ai.selectVolunteerForCert(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                    >
                      <option value="">-- Manual / Select Volunteer --</option>
                      {volunteers.map(v => (
                        <option key={v.id} value={v.email}>{v.name} ({v.email})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Volunteer Name</label>
                      <input
                        type="text"
                        required
                        value={ai.certInputs.volunteerName}
                        onChange={(e) => ai.setCertInputs({ ...ai.certInputs, volunteerName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="Ramesh Singh"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Volunteer Email</label>
                      <input
                        type="email"
                        required
                        value={ai.certInputs.volunteerEmail}
                        onChange={(e) => ai.setCertInputs({ ...ai.certInputs, volunteerEmail: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="ramesh@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Campaign / Event Title</label>
                    <input
                      type="text"
                      required
                      value={ai.certInputs.eventTitle}
                      onChange={(e) => ai.setCertInputs({ ...ai.certInputs, eventTitle: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="Noida Winter Clothes & Blanket Drive"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Logged Hours</label>
                      <input
                        type="number"
                        required
                        value={ai.certInputs.hours}
                        onChange={(e) => ai.setCertInputs({ ...ai.certInputs, hours: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Date</label>
                      <input
                        type="date"
                        required
                        value={ai.certInputs.date}
                        onChange={(e) => ai.setCertInputs({ ...ai.certInputs, date: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Key Contributions (for Gemini citation)</label>
                    <textarea
                      rows="3"
                      value={ai.certInputs.contributions}
                      onChange={(e) => ai.setCertInputs({ ...ai.certInputs, contributions: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                      placeholder="e.g. coordinating distribution logistics and managing volunteer registrations"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={ai.loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-xs shadow transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer"
              >
                {ai.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating content...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 fill-white text-white" />
                    <span>Generate with Gemini</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

        {/* Right Column: AI Output / Preview Frame */}
        <div className="lg:col-span-7 space-y-6">

          {ai.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5 text-red-600 text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{ai.error}</span>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[460px] flex flex-col justify-between text-slate-900 shadow-sm relative">

            <div className="flex justify-between items-center border-b border-slate-200/60 pb-3.5 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
                {ai.tool === 'certificate' ? 'Certificate Document Preview' : 'Gemini AI Draft Output'}
              </span>

              {ai.output && ai.tool !== 'certificate' && (
                <button
                  onClick={ai.copyToClipboard}
                  className="flex items-center space-x-1.5 text-slate-700 hover:text-primary-650 hover:bg-primary-50/20 text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer shadow-sm"
                >
                  {ai.copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 animate-bounce" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Output display or certificate rendering */}
            <div className="flex-grow flex flex-col justify-center">
              {ai.output ? (
                ai.tool === 'certificate' ? (
                  <div className="space-y-6">

                    {/* Certificate Template Card */}
                    <div className="bg-amber-50/15 border-4 border-double border-amber-600 p-6 text-center rounded-2xl relative font-serif shadow-inner mx-auto max-w-md" style={{ backgroundColor: '#fffdfb' }}>
                      <div className="absolute top-2 left-2 text-amber-600/40 text-xs">✥</div>
                      <div className="absolute top-2 right-2 text-amber-600/40 text-xs">✥</div>
                      <div className="absolute bottom-2 left-2 text-amber-600/40 text-xs">✥</div>
                      <div className="absolute bottom-2 right-2 text-amber-600/40 text-xs">✥</div>

                      <div className="space-y-4">
                        <img src="/logo.png" className="h-10 w-10 mx-auto object-contain bg-white p-1 rounded-xl border border-amber-100 shadow-sm" alt="NayePankh Logo" />
                        <h2 className="text-sm font-extrabold text-[#132a13] uppercase tracking-widest font-display">Certificate of Participation</h2>
                        <p className="text-slate-400 text-[8px] uppercase tracking-widest font-sans font-bold">This is proudly presented to</p>
                        <h3 className="text-lg font-extrabold text-slate-900 font-display italic my-1">{ai.certInputs.volunteerName}</h3>
                        <p className="text-slate-650 text-[11px] leading-relaxed font-sans px-2">
                          {ai.output}
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-amber-200/40 max-w-xs mx-auto font-sans text-[9px]">
                          <div>
                            <p className="font-semibold text-slate-400 uppercase tracking-widest text-[7px]">Date</p>
                            <p className="font-bold text-slate-800">{new Date(ai.certInputs.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-400 uppercase tracking-widest text-[7px]">Hours Logged</p>
                            <p className="font-bold text-slate-850">{ai.certInputs.hours} Hours</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2.5 max-w-xs mx-auto font-sans text-[9px] relative border-t border-amber-100/50">
                          {/* Foundation Stamp (absolute center overlay) */}
                          {stampImage && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                              <img
                                src={stampImage}
                                className="w-10 h-10 object-contain mix-blend-multiply opacity-85 rotate-[-8deg] -translate-y-1.5"
                                alt="Foundation Stamp"
                              />
                            </div>
                          )}

                          <div className="text-center flex flex-col items-center relative min-h-[36px] justify-end">
                            {sigImage ? (
                              <img
                                src={sigImage}
                                className="absolute bottom-3.5 h-6 object-contain max-w-[80px] mix-blend-multiply"
                                alt="Founder Signature"
                              />
                            ) : (
                              <span className="font-serif italic text-[8px] text-slate-500 absolute bottom-3.5">Prashant Shukla</span>
                            )}
                            <div className="w-10 h-px bg-slate-300 my-0.5"></div>
                            <p className="text-[6px] text-slate-400 font-sans uppercase font-bold">Founder President</p>
                          </div>

                          <div className="text-center flex flex-col items-center relative min-h-[36px] justify-end">
                            <span className="font-serif italic text-[8px] text-slate-500 absolute bottom-3.5">Anjali Gupta</span>
                            <div className="w-10 h-px bg-slate-300 my-0.5"></div>
                            <p className="text-[6px] text-slate-400 font-sans uppercase font-bold">National Coordinator</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Upload to Profile */}
                    <div className="flex justify-center pt-2">
                      <button
                        type="button"
                        onClick={ai.uploadCertificate}
                        disabled={ai.certUploading || ai.certUploaded}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${
                          ai.certUploaded
                            ? 'bg-emerald-500 text-white cursor-default'
                            : 'bg-slate-950 hover:bg-slate-850 text-white'
                        }`}
                      >
                        {ai.certUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading Certificate...</span>
                          </>
                        ) : ai.certUploaded ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Uploaded to Volunteer Profile!</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            <span>Upload to Volunteer Profile</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[300px] p-4 bg-white rounded-xl border border-slate-200 w-full text-left">
                      {ai.output}
                    </div>
                    {ai.tool === 'appreciation' && (
                      <div className="flex justify-center pt-2">
                        <button
                          type="button"
                          onClick={ai.sendAppreciationEmail}
                          disabled={ai.sendingEmail || ai.emailSent}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${
                            ai.emailSent
                              ? 'bg-emerald-500 text-white cursor-default'
                              : 'bg-slate-950 hover:bg-slate-850 text-white'
                          }`}
                        >
                          {ai.sendingEmail ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Sending Email...</span>
                            </>
                          ) : ai.emailSent ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span>Email Sent!</span>
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4" />
                              <span>Send Email to Volunteer</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-slate-400 py-12 space-y-4">
                  <div className="p-3.5 bg-slate-100 rounded-full">
                    <Sparkles className="h-8 w-8 text-slate-350 opacity-40" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700">No content generated yet</p>
                    <p className="text-[11px] text-slate-450 max-w-xs leading-relaxed">Adjust parameters on the left and click "Generate with Gemini" to output custom campaigns and documents.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200/60 pt-3.5 mt-4 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Please review generated text for correctness before publishing.</span>
              <span className="font-semibold text-slate-400">NayePankh AI Assistant</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default memo(AiAssistantTab);
