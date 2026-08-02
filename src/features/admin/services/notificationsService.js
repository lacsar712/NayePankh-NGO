/** 【logic 层｜services】admin 通知日志读取/清空适配，仅供 hooks 调用 */
import { ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readJSON, removeKey } from './localStore';

/**
 * 读取管理员通知日志（localStorage 模拟收件箱，
 * 写入方为 src/services/notifications.js 的 sendAdminNotification）。
 * @returns {Array}
 */
export function fetchNotifications() {
  return readJSON(ADMIN_STORAGE_KEYS.ADMIN_NOTIFICATIONS, []);
}

/** 清空通知日志 */
export function clearNotifications() {
  removeKey(ADMIN_STORAGE_KEYS.ADMIN_NOTIFICATIONS);
}
