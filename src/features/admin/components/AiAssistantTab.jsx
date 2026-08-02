import {
  Sparkles,
  Heart,
  Calendar,
  UserCheck,
  Award,
  Loader2,
} from 'lucide-react';
import AiOutputPreview from './AiOutputPreview';

const AI_TOOL_DEFS = [
  { id: 'social', name: 'Social Post', icon: Sparkles },
  { id: 'appeal', name: 'Donation Appeal', icon: Heart },
  { id: 'report', name: 'Event Report', icon: Calendar },
  { id: 'appreciation', name: 'Appreciation', icon: UserCheck },
  { id: 'certificate', name: 'AI Certificate', icon: Award },
];

export default function AiAssistantTab({
  aiTool,
  aiLoading,
  aiError,
  aiOutput,
  copied,
  socialInputs,
  setSocialInputs,
  appealInputs,
  setAppealInputs,
  reportInputs,
  setReportInputs,
  appreciationInputs,
  setAppreciationInputs,
  certInputs,
  setCertInputs,
  certUploading,
  certUploaded,
  sendingAppreciationEmail,
  appreciationEmailSent,
  volunteers,
  sigImage,
  stampImage,
  onSelectTool,
  onGenerate,
  onCopy,
  onSendEmail,
  onSelectVolunteerForCert,
  onUploadCertFromAi,
}) {
  const handleAppreciationVolunteerChange = (e) => {
    const email = e.target.value;
    const vol = volunteers.find((v) => v.email === email);
    if (vol) {
      setAppreciationInputs({
        ...appreciationInputs,
        volunteerEmail: vol.email,
        volunteerName: vol.name,
      });
    } else {
      setAppreciationInputs({
        ...appreciationInputs,
        volunteerEmail: email,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-950 font-display flex items-center space-x-2">
          <Sparkles className="h-5.5 w-5.5 text-accent-500 animate-pulse" />
          <span>Gemini AI Content Engine</span>
        </h2>
        <span className="text-xs font-bold text-slate-400 uppercase">
          Powered by Gemini 1.5 Flash
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-200/80 p-2 rounded-2xl flex flex-wrap gap-1.5 justify-center">
            {AI_TOOL_DEFS.map((tool) => {
              const Icon = tool.icon;
              const isSelected = aiTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onSelectTool(tool.id)}
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

          <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <form onSubmit={onGenerate} className="space-y-5">
              {aiTool === 'social' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Campaign / Event Title
                    </label>
                    <input
                      type="text"
                      required
                      value={socialInputs.title}
                      onChange={(e) =>
                        setSocialInputs({
                          ...socialInputs,
                          title: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="e.g. Noida Slum Food Drive"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Platform
                      </label>
                      <select
                        value={socialInputs.platform}
                        onChange={(e) =>
                          setSocialInputs({
                            ...socialInputs,
                            platform: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                      >
                        <option>Twitter</option>
                        <option>Instagram</option>
                        <option>LinkedIn</option>
                        <option>Facebook</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Tone
                      </label>
                      <select
                        value={socialInputs.tone}
                        onChange={(e) =>
                          setSocialInputs({
                            ...socialInputs,
                            tone: e.target.value,
                          })
                        }
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Achievements to Highlight
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={socialInputs.achievements}
                      onChange={(e) =>
                        setSocialInputs({
                          ...socialInputs,
                          achievements: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                      placeholder="e.g. Fed over 350 street children and distributed healthy snacks."
                    />
                  </div>
                </div>
              )}

              {aiTool === 'appeal' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Cause / Category
                    </label>
                    <input
                      type="text"
                      required
                      value={appealInputs.cause}
                      onChange={(e) =>
                        setAppealInputs({
                          ...appealInputs,
                          cause: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="e.g. Project Shiksha (Education)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Target Amount (INR)
                      </label>
                      <input
                        type="number"
                        required
                        value={appealInputs.targetAmount}
                        onChange={(e) =>
                          setAppealInputs({
                            ...appealInputs,
                            targetAmount: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="e.g. 50000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Target Audience
                      </label>
                      <input
                        type="text"
                        value={appealInputs.targetAudience}
                        onChange={(e) =>
                          setAppealInputs({
                            ...appealInputs,
                            targetAudience: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="e.g. Corporate CSR"
                      />
                    </div>
                  </div>
                </div>
              )}

              {aiTool === 'report' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Event Name
                    </label>
                    <input
                      type="text"
                      required
                      value={reportInputs.eventName}
                      onChange={(e) =>
                        setReportInputs({
                          ...reportInputs,
                          eventName: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="e.g. Noida Health Camp"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Reach Count
                      </label>
                      <input
                        type="text"
                        required
                        value={reportInputs.reachCount}
                        onChange={(e) =>
                          setReportInputs({
                            ...reportInputs,
                            reachCount: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="e.g. 150 families"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Volunteer Hours
                      </label>
                      <input
                        type="number"
                        value={reportInputs.hoursContributed}
                        onChange={(e) =>
                          setReportInputs({
                            ...reportInputs,
                            hoursContributed: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="e.g. 30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Event Summaries / Notes
                    </label>
                    <textarea
                      rows="3"
                      value={reportInputs.summaries}
                      onChange={(e) =>
                        setReportInputs({
                          ...reportInputs,
                          summaries: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                      placeholder="Key activities and outcomes..."
                    />
                  </div>
                </div>
              )}

              {aiTool === 'appreciation' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Select Volunteer Account
                    </label>
                    <select
                      value={appreciationInputs.volunteerEmail || ''}
                      onChange={handleAppreciationVolunteerChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-500"
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Volunteer Name
                      </label>
                      <input
                        type="text"
                        required
                        value={appreciationInputs.volunteerName}
                        onChange={(e) =>
                          setAppreciationInputs({
                            ...appreciationInputs,
                            volunteerName: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="Ramesh Singh"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Volunteer Email
                      </label>
                      <input
                        type="email"
                        required
                        value={appreciationInputs.volunteerEmail || ''}
                        onChange={(e) =>
                          setAppreciationInputs({
                            ...appreciationInputs,
                            volunteerEmail: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="ramesh@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Program / Wing
                    </label>
                    <input
                      type="text"
                      required
                      value={appreciationInputs.program}
                      onChange={(e) =>
                        setAppreciationInputs({
                          ...appreciationInputs,
                          program: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="e.g. Project Shiksha (Education)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Key Contributions
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={appreciationInputs.contributions}
                      onChange={(e) =>
                        setAppreciationInputs({
                          ...appreciationInputs,
                          contributions: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                      placeholder="Specific work done..."
                    />
                  </div>
                </div>
              )}

              {aiTool === 'certificate' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Select Volunteer Account
                    </label>
                    <select
                      value={certInputs.volunteerEmail}
                      onChange={(e) =>
                        onSelectVolunteerForCert(e.target.value)
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-500"
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Volunteer Name
                      </label>
                      <input
                        type="text"
                        required
                        value={certInputs.volunteerName}
                        onChange={(e) =>
                          setCertInputs({
                            ...certInputs,
                            volunteerName: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="Ramesh Singh"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Volunteer Email
                      </label>
                      <input
                        type="email"
                        required
                        value={certInputs.volunteerEmail}
                        onChange={(e) =>
                          setCertInputs({
                            ...certInputs,
                            volunteerEmail: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="ramesh@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Campaign / Event Title
                    </label>
                    <input
                      type="text"
                      required
                      value={certInputs.eventTitle}
                      onChange={(e) =>
                        setCertInputs({
                          ...certInputs,
                          eventTitle: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="Noida Winter Clothes & Blanket Drive"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Logged Hours
                      </label>
                      <input
                        type="number"
                        required
                        value={certInputs.hours}
                        onChange={(e) =>
                          setCertInputs({
                            ...certInputs,
                            hours: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={certInputs.date}
                        onChange={(e) =>
                          setCertInputs({
                            ...certInputs,
                            date: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Key Contributions (for Gemini citation)
                    </label>
                    <textarea
                      rows="3"
                      value={certInputs.contributions}
                      onChange={(e) =>
                        setCertInputs({
                          ...certInputs,
                          contributions: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                      placeholder="e.g. coordinating distribution logistics and managing volunteer registrations"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={aiLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-xs shadow transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer"
              >
                {aiLoading ? (
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

        <AiOutputPreview
          aiTool={aiTool}
          aiOutput={aiOutput}
          aiError={aiError}
          copied={copied}
          certInputs={certInputs}
          certUploading={certUploading}
          certUploaded={certUploaded}
          sendingAppreciationEmail={sendingAppreciationEmail}
          appreciationEmailSent={appreciationEmailSent}
          sigImage={sigImage}
          stampImage={stampImage}
          onCopy={onCopy}
          onSendEmail={onSendEmail}
          onUploadCertFromAi={onUploadCertFromAi}
        />
      </div>
    </div>
  );
}
