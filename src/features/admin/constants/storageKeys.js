/**
 * 【logic 层｜constants】Admin 域统一 localStorage key 常量。
 * 硬约定：禁止修改任何 key 的实际字符串取值（避免破坏本地已有数据），
 * 只允许集中引用。后续轮次必须继续通过 ADMIN_STORAGE_KEYS 访问。
 */
export const ADMIN_STORAGE_KEYS = {
  ADMIN_NOTIFICATIONS: 'naye_pankh_admin_notifications',
  SIGNATURE: 'naye_pankh_signature',
  STAMP: 'naye_pankh_stamp',
  EVENTS: 'naye_pankh_events',
  EVENT_REGISTRATIONS: 'naye_pankh_event_registrations',
  CERTIFICATES: 'naye_pankh_certificates',
  VOLUNTEERS: 'naye_pankh_volunteers',
  DONATIONS: 'naye_pankh_donations',
};

/** Admin 写 events 后广播的 window 事件名（Events.jsx 监听同名事件，禁止改名） */
export const ADMIN_EVENTS_UPDATED_EVENT = 'naye_pankh_local_events_update';

/** Admin 域读写的 Firestore collection 名（集中引用，取值不变） */
export const ADMIN_COLLECTIONS = {
  USERS: 'users',
  VOLUNTEERS: 'volunteers',
  DONATIONS: 'donations',
  EVENTS: 'events',
  EVENT_REGISTRATIONS: 'eventRegistrations',
  CERTIFICATES: 'certificates',
  MAIL: 'mail',
};
