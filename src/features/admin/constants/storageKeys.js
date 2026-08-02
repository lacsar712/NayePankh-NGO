// Admin logic layer — constants
// Single source of truth for localStorage keys, Firestore collection names,
// Tab enumeration and default seed data shared across the Admin dashboard.
// NOTE: The string VALUES of ADMIN_STORAGE_KEYS must never change silently —
// they map to data that may already exist in users' browsers.

export const ADMIN_STORAGE_KEYS = {
  VOLUNTEERS: 'naye_pankh_volunteers',
  EVENTS: 'naye_pankh_events',
  EVENT_REGISTRATIONS: 'naye_pankh_event_registrations',
  CERTIFICATES: 'naye_pankh_certificates',
  NOTIFICATIONS: 'naye_pankh_admin_notifications',
  SIGNATURE: 'naye_pankh_signature',
  STAMP: 'naye_pankh_stamp',
};

// Firestore collection names touched by the Admin dashboard.
export const ADMIN_COLLECTIONS = {
  USERS: 'users',
  VOLUNTEERS: 'volunteers',
  DONATIONS: 'donations',
  EVENTS: 'events',
  EVENT_REGISTRATIONS: 'eventRegistrations',
  CERTIFICATES: 'certificates',
};

// Custom window event dispatched when Admin mutates local events, so that the
// public Events page (which listens for it) can re-read the local mirror.
export const LOCAL_EVENTS_UPDATE_EVENT = 'naye_pankh_local_events_update';

// Ordered list of dashboard tabs (drives the tab navigation).
export const ADMIN_TABS = [
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
];

// ---- Default seed data (used as fallback when Firestore is not configured
// or returns no rows). Values copied verbatim from the original monolith. ----

export const DEFAULT_USERS = [
  { id: 'usr-1', name: 'Amit Kumar', email: 'amit@gmail.com', role: 'user' },
  { id: 'usr-2', name: 'Priya Sharma', email: 'priya@nayepankh.org', role: 'admin' },
  { id: 'usr-3', name: 'Rahul Varma', email: 'rahul@gmail.com', role: 'volunteer' },
  { id: 'usr-4', name: 'Sneha Patel', email: 'sneha@nayepankh.org', role: 'admin' },
];

export const DEFAULT_VOLUNTEERS = [
  { id: 'vol-1', name: 'Ramesh Singh', email: 'ramesh@gmail.com', phone: '9876543210', city: 'Noida', program: 'Education', status: 'pending' },
  { id: 'vol-2', name: 'Anjali Gupta', email: 'anjali@gmail.com', phone: '9123456789', city: 'Delhi', program: 'Healthcare', status: 'approved' },
  { id: 'vol-3', name: 'Vikram Rao', email: 'vikram@gmail.com', phone: '8877665544', city: 'Mumbai', program: 'Livelihood', status: 'pending' },
];

export const DEFAULT_DONATIONS = [
  { id: 'don-1', donor: 'Suresh Raina', email: 'suresh@gmail.com', amount: 1500, frequency: 'one-time', method: 'UPI', date: '2026-06-12' },
  { id: 'don-2', donor: 'Meera Das', email: 'meera@gmail.com', amount: 3000, frequency: 'monthly', method: 'Card', date: '2026-06-11' },
  { id: 'don-3', donor: 'Karan Johar', email: 'karan@gmail.com', amount: 500, frequency: 'one-time', method: 'Netbanking', date: '2026-06-10' },
  { id: 'don-4', donor: 'Rohit Sharma', email: 'rohit@gmail.com', amount: 6000, frequency: 'one-time', method: 'UPI', date: '2026-06-09' },
];

export const DEFAULT_EVENTS = [
  { id: 'cloth-drive', title: 'Noida Winter Clothes & Blanket Drive', date: '2026-12-20', location: 'Sector 62 Community Center, Noida', image: '/winter-camp.jpg', status: 'upcoming' },
  { id: 'health-camp', title: 'Project Swasthya Free Medical Health Camp', date: '2027-01-10', location: 'Government High School, Chhalera, UP', image: '/medical-camp.jpg', status: 'upcoming' },
  { id: 'career-fair', title: 'Swabalamban Youth Skill & Career Fair', date: '2027-02-15', location: 'Youth Center, Sector 15, Noida', image: '/career-fair.jpg', status: 'upcoming' },
];
