// logic: single source of truth for localStorage keys, Firestore collection
// names, tab enums and default seed data. Actual key strings MUST NOT change.
export const ADMIN_STORAGE_KEYS = Object.freeze({
  ADMIN_NOTIFICATIONS: 'naye_pankh_admin_notifications',
  EVENT_REGISTRATIONS: 'naye_pankh_event_registrations',
  CERTIFICATES: 'naye_pankh_certificates',
  EVENTS: 'naye_pankh_events',
  VOLUNTEERS: 'naye_pankh_volunteers',
  DONATIONS: 'naye_pankh_donations',
  SIGNATURE: 'naye_pankh_signature',
  STAMP: 'naye_pankh_stamp',
  USER: 'naye_pankh_user',
  DEMO_HOURS: 'naye_pankh_demo_hours',
  DEMO_STATUS: 'naye_pankh_demo_status',
  DEMO_DONATED: 'naye_pankh_demo_donated',
});

export const LOCAL_EVENTS_UPDATE_EVENT = 'naye_pankh_local_events_update';

export const FIRESTORE_COLLECTIONS = Object.freeze({
  USERS: 'users',
  DONATIONS: 'donations',
  EVENTS: 'events',
  VOLUNTEERS: 'volunteers',
  EVENT_REGISTRATIONS: 'eventRegistrations',
  CERTIFICATES: 'certificates',
  MAIL: 'mail',
  INTERNSHIPS: 'internships',
  PARTNERSHIPS: 'partnerships',
  CAREERS: 'careers',
});

export const ADMIN_TABS = Object.freeze([
  'overview',
  'analytics',
  'users',
  'volunteers',
  'donations',
  'events',
  'registrations',
  'certificates',
  'ai-assistant',
  'notifications',
]);

export const TAB_LABELS = Object.freeze({
  overview: 'overview',
  analytics: 'Live Analytics',
  users: 'users',
  volunteers: 'volunteers',
  donations: 'donations',
  events: 'events',
  registrations: 'Event Registrations',
  certificates: 'Event Certificates',
  'ai-assistant': 'Gemini AI Hub',
  notifications: 'Admin Notifications',
});

export const VOLUNTEER_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

export const REGISTRATION_STATUS = Object.freeze({
  ATTENDED: 'attended',
});

export const AI_TOOLS = Object.freeze([
  { id: 'social', name: 'Social Post' },
  { id: 'appeal', name: 'Donation Appeal' },
  { id: 'report', name: 'Event Report' },
  { id: 'appreciation', name: 'Appreciation' },
  { id: 'certificate', name: 'AI Certificate' },
]);

export const DEFAULT_USERS = Object.freeze([
  { id: 'usr-1', name: 'Amit Kumar', email: 'amit@gmail.com', role: 'user' },
  { id: 'usr-2', name: 'Priya Sharma', email: 'priya@nayepankh.org', role: 'admin' },
  { id: 'usr-3', name: 'Rahul Varma', email: 'rahul@gmail.com', role: 'volunteer' },
  { id: 'usr-4', name: 'Sneha Patel', email: 'sneha@nayepankh.org', role: 'admin' },
]);

export const DEFAULT_VOLUNTEERS = Object.freeze([
  { id: 'vol-1', name: 'Ramesh Singh', email: 'ramesh@gmail.com', phone: '9876543210', city: 'Noida', program: 'Education', status: 'pending' },
  { id: 'vol-2', name: 'Anjali Gupta', email: 'anjali@gmail.com', phone: '9123456789', city: 'Delhi', program: 'Healthcare', status: 'approved' },
  { id: 'vol-3', name: 'Vikram Rao', email: 'vikram@gmail.com', phone: '8877665544', city: 'Mumbai', program: 'Livelihood', status: 'pending' },
]);

export const DEFAULT_EVENTS = Object.freeze([
  { id: 'cloth-drive', title: 'Noida Winter Clothes & Blanket Drive', date: '2026-12-20', location: 'Sector 62 Community Center, Noida', image: '/winter-camp.jpg', status: 'upcoming' },
  { id: 'health-camp', title: 'Project Swasthya Free Medical Health Camp', date: '2027-01-10', location: 'Government High School, Chhalera, UP', image: '/medical-camp.jpg', status: 'upcoming' },
  { id: 'career-fair', title: 'Swabalamban Youth Skill & Career Fair', date: '2027-02-15', location: 'Youth Center, Sector 15, Noida', image: '/career-fair.jpg', status: 'upcoming' },
]);

export const DEFAULT_DONATIONS = Object.freeze([
  { id: 'don-1', donor: 'Suresh Raina', email: 'suresh@gmail.com', amount: 1500, frequency: 'one-time', method: 'UPI', date: '2026-06-12' },
  { id: 'don-2', donor: 'Meera Das', email: 'meera@gmail.com', amount: 3000, frequency: 'monthly', method: 'Card', date: '2026-06-11' },
  { id: 'don-3', donor: 'Karan Johar', email: 'karan@gmail.com', amount: 500, frequency: 'one-time', method: 'Netbanking', date: '2026-06-10' },
  { id: 'don-4', donor: 'Rohit Sharma', email: 'rohit@gmail.com', amount: 6000, frequency: 'one-time', method: 'UPI', date: '2026-06-09' },
]);

export const EVENT_RAW_TYPE_MAP = Object.freeze({
  drive: 'Drive Campaign',
  medical: 'Medical Camp',
  skill: 'Skill Development',
});

export const NEW_EVENT_INITIAL = Object.freeze({
  title: '',
  date: '',
  location: '',
  desc: '',
  type: 'Drive Campaign',
  rawType: 'drive',
  image: '',
  status: 'upcoming',
});

export const CERT_INITIAL = Object.freeze({
  volunteerEmail: '',
  volunteerName: '',
  eventTitle: 'Noida Winter Clothes & Blanket Drive',
  contributions: '',
  hours: '6',
  date: new Date().toISOString().split('T')[0],
});
