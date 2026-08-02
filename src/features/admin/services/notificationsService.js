// Admin logic layer — Notifications service
// Read/clear the admin notification inbox stored in localStorage.
// (Notifications are WRITTEN by src/services/notifications.js on the public
// side; this service only reads/clears them for the Admin inbox view.)
import { ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readJson, removeKey } from './localStore';

/** Read the notification log (newest-first as written by the engine). */
export function loadNotifications() {
  return readJson(ADMIN_STORAGE_KEYS.NOTIFICATIONS, []);
}

/** Clear all notification logs. */
export function clearNotifications() {
  removeKey(ADMIN_STORAGE_KEYS.NOTIFICATIONS);
}
