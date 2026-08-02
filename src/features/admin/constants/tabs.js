// Logic: tab ids, display labels, and shared status/tool enums.
export const TAB_IDS = {
  OVERVIEW: 'overview',
  ANALYTICS: 'analytics',
  USERS: 'users',
  VOLUNTEERS: 'volunteers',
  DONATIONS: 'donations',
  EVENTS: 'events',
  REGISTRATIONS: 'registrations',
  CERTIFICATES: 'certificates',
  AI_ASSISTANT: 'ai-assistant',
  NOTIFICATIONS: 'notifications',
};

export const TAB_LIST = [
  { id: TAB_IDS.OVERVIEW, label: 'overview' },
  { id: TAB_IDS.ANALYTICS, label: 'Live Analytics' },
  { id: TAB_IDS.USERS, label: 'users' },
  { id: TAB_IDS.VOLUNTEERS, label: 'volunteers' },
  { id: TAB_IDS.DONATIONS, label: 'donations' },
  { id: TAB_IDS.EVENTS, label: 'events' },
  { id: TAB_IDS.REGISTRATIONS, label: 'Event Registrations' },
  { id: TAB_IDS.CERTIFICATES, label: 'Event Certificates' },
  { id: TAB_IDS.AI_ASSISTANT, label: 'Gemini AI Hub' },
  { id: TAB_IDS.NOTIFICATIONS, label: 'Admin Notifications' },
];

export const VOLUNTEER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const REGISTRATION_STATUS = {
  ATTENDED: 'attended',
};

export const AI_TOOLS = {
  SOCIAL: 'social',
  APPEAL: 'appeal',
  REPORT: 'report',
  APPRECIATION: 'appreciation',
  CERTIFICATE: 'certificate',
};

export const EVENT_RAW_TYPES = {
  DRIVE: 'drive',
  MEDICAL: 'medical',
  SKILL: 'skill',
};

export const EVENT_TYPE_MAP = {
  [EVENT_RAW_TYPES.DRIVE]: 'Drive Campaign',
  [EVENT_RAW_TYPES.MEDICAL]: 'Medical Camp',
  [EVENT_RAW_TYPES.SKILL]: 'Skill Development',
};
