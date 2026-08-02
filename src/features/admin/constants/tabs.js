/** 【logic 层｜constants】Admin 后台 Tab 枚举（顺序即导航顺序，后续轮次不得改名） */
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

/** Tab 展示名映射；未列出的 id 由 UI 直接 capitalize */
export const ADMIN_TAB_LABELS = {
  analytics: 'Live Analytics',
  registrations: 'Event Registrations',
  certificates: 'Event Certificates',
  'ai-assistant': 'Gemini AI Hub',
  notifications: 'Admin Notifications',
};
