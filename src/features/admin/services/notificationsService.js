// Logic service: admin notification log read/clear (localStorage only).
import { ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readJSON, removeKey } from './storage';

export const notificationsService = {
  fetchNotifications() {
    return readJSON(ADMIN_STORAGE_KEYS.ADMIN_NOTIFICATIONS, []);
  },

  clearNotifications() {
    removeKey(ADMIN_STORAGE_KEYS.ADMIN_NOTIFICATIONS);
  },
};
