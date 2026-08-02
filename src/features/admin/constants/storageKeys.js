// Logic: single source of truth for localStorage keys and Firestore collection names.
// Key string values must never change (existing user data depends on them).
export const ADMIN_STORAGE_KEYS = {
  USER: 'naye_pankh_user',
  ADMIN_NOTIFICATIONS: 'naye_pankh_admin_notifications',
  EVENT_REGISTRATIONS: 'naye_pankh_event_registrations',
  CERTIFICATES: 'naye_pankh_certificates',
  EVENTS: 'naye_pankh_events',
  VOLUNTEERS: 'naye_pankh_volunteers',
  DONATIONS: 'naye_pankh_donations',
  SIGNATURE: 'naye_pankh_signature',
  STAMP: 'naye_pankh_stamp',
  DEMO_HOURS: 'naye_pankh_demo_hours',
  DEMO_STATUS: 'naye_pankh_demo_status',
  DEMO_DONATED: 'naye_pankh_demo_donated',
};

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  DONATIONS: 'donations',
  VOLUNTEERS: 'volunteers',
  EVENTS: 'events',
  EVENT_REGISTRATIONS: 'eventRegistrations',
  CERTIFICATES: 'certificates',
  MAIL: 'mail',
  INTERNSHIPS: 'internships',
  PARTNERSHIPS: 'partnerships',
  CAREERS: 'careers',
};

export const LOCAL_EVENTS_UPDATE_EVENT = 'naye_pankh_local_events_update';
