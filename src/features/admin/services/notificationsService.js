// logic: admin notification log read/clear/append (localStorage backed).
import { ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readJSON, writeJSON, removeKey } from './storage';

export const fetchNotifications = () => {
  return readJSON(ADMIN_STORAGE_KEYS.ADMIN_NOTIFICATIONS, []);
};

export const clearNotifications = () => {
  removeKey(ADMIN_STORAGE_KEYS.ADMIN_NOTIFICATIONS);
};

export const addNotification = (notification) => {
  const logs = readJSON(ADMIN_STORAGE_KEYS.ADMIN_NOTIFICATIONS, []);
  logs.unshift(notification);
  writeJSON(ADMIN_STORAGE_KEYS.ADMIN_NOTIFICATIONS, logs);
  return logs;
};
